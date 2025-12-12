"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { ResizableImage } from './extensions/ResizableImage';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import Focus from "@tiptap/extension-focus";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';
import { MediaLibraryPanel } from './MediaLibraryPanel';
import { CompactToolbar } from './CompactToolbar';
import { AiSidebar } from './AiSidebar';
import { ImmersiveReader } from './ImmersiveReader';
import { ReadAloud } from './ReadAloud';
import { TranslateAndRead } from './TranslateAndRead';
import { PageBreak } from './extensions/PageBreak';
import ChartExtension from './extensions/ChartExtension';
import ShapeExtension from './extensions/ShapeExtension';
import CustomBulletList from './extensions/CustomBulletList';
import CustomOrderedList from './extensions/CustomOrderedList';
import { ShareDialog } from './ShareDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Custom FontSize extension
const FontSize = TextStyle.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fontSize: {
                default: null,
                parseHTML: (element) => element.style.fontSize,
                renderHTML: (attributes) => {
                    if (!attributes.fontSize) {
                        return {};
                    }
                    return {
                        style: `font-size: ${attributes.fontSize}`,
                    };
                },
            },
        };
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ commands }: { commands: any }) => {
                return commands.setMark('textStyle', { fontSize });
            }
        }
    }
});

interface Page {
    id: string;
    content: string;
}

interface PageEditorProps {
    pageId: string;
    content: string;
    isActive: boolean;
    zoomLevel: number;
    margins: { top: number, right: number, bottom: number, left: number };
    onEditorReady: (id: string, editor: any) => void;
    onFocus: (id: string) => void;
    onUpdate: (id: string, content: string) => void;
}

function PageEditor({ pageId, content, isActive, zoomLevel, margins, onEditorReady, onFocus, onUpdate }: PageEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                orderedList: false,
            }),
            CustomBulletList,
            CustomOrderedList,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Underline,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            Subscript,
            Superscript,
            Highlight.configure({ multicolor: true }),
            Link.configure({ openOnClick: false }),
            Image, // Keep for backward compatibility
            ResizableImage.configure({
              inline: false,
              allowBase64: true,
              defaultWidth: 500,
              defaultHeight: 300,
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({ placeholder: 'Start typing...' }),
            TaskList,
            TaskItem,
            CharacterCount,
            Dropcursor,
            Gapcursor,
            Focus,
            ChartExtension,
            ShapeExtension,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onUpdate(pageId, editor.getHTML());
        },
        onSelectionUpdate: ({ editor }) => {
            // Selection is handled globally by activeEditor but we bubble up if needed
        },
        onFocus: () => {
            onFocus(pageId);
        },
        editorProps: {
            attributes: {
                class: 'min-h-[900px] outline-none',
            }
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor) {
            onEditorReady(pageId, editor);
        }
    }, [editor, pageId, onEditorReady]);

    if (!editor) return null;

    return (
        <div
            className="flex justify-center py-8 transition-transform duration-200"
            style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
            }}
            onClick={() => onFocus(pageId)}
        >
            <div
                className={`word-page glass-panel bg-white text-black print:shadow-none print:m-0 animate-enter-delay ${isActive ? 'ring-2 ring-indigo-500/20' : ''}`}
                style={{
                    paddingTop: `${margins.top}px`,
                    paddingRight: `${margins.right}px`,
                    paddingBottom: `${margins.bottom}px`,
                    paddingLeft: `${margins.left}px`,
                    ['--page-margin-top' as any]: `${margins.top}px`,
                    ['--page-margin-right' as any]: `${margins.right}px`,
                    ['--page-margin-bottom' as any]: `${margins.bottom}px`,
                    ['--page-margin-left' as any]: `${margins.left}px`,
                }}
            >
                <EditorContent editor={editor} />
                {editor && <ReadAloud editor={editor} />}
                {editor && <TranslateAndRead editor={editor} />}
                {/* Page Number Marker (Visual only) */}
                <div className="absolute bottom-4 right-8 text-[10px] text-gray-400 select-none pointer-events-none">
                    {pageId}
                </div>
            </div>
        </div>
    );
}

interface MsWordEditorProps {
    documentId?: string;
}

export default function MsWordEditor({ documentId: propDocumentId }: MsWordEditorProps = {}) {
    const { user } = useAuth();
    const [pages, setPages] = useState<Page[]>([
        { id: '1', content: '<h2>Welcome to your Modern Document</h2><p>This is Page 1. You can add more pages using the "Blank Page" button in the Insert tab.</p>' }
    ]);
    const [activePageId, setActivePageId] = useState<string>('1');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [margins, setMargins] = useState({ top: 96, right: 96, bottom: 96, left: 96 });
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
    const [isImmersiveReaderOpen, setIsImmersiveReaderOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [activeSidebarItem, setActiveSidebarItem] = useState('pages');
    const [selectionContext, setSelectionContext] = useState('');
    const [isTableActive, setIsTableActive] = useState(false);
    const [documentId, setDocumentId] = useState<string>(propDocumentId || 'new');
    const [documentTitle, setDocumentTitle] = useState<string>('Untitled Document');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Store editor instances
    const editorsRef = useRef<{ [key: string]: any }>({});
    const [activeEditor, setActiveEditor] = useState<any>(null);

    // Auto-scale on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 850) {
                const newZoom = Math.min(100, ((window.innerWidth - 32) / 794) * 100);
                setZoomLevel(Math.floor(newZoom));
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleEditorReady = useCallback((id: string, editor: any) => {
        editorsRef.current[id] = editor;
        if (id === activePageId) {
            setActiveEditor(editor);
        }
    }, [activePageId]);

    const handleFocus = useCallback((id: string) => {
        setActivePageId(id);
        setActiveEditor(editorsRef.current[id]);
    }, []);

    const handleUpdate = useCallback((id: string, content: string) => {
        setPages(prev => {
            const updated = prev.map(p => p.id === id ? { ...p, content } : p);
            return updated;
        });
        
        // Auto-save after 2 seconds of inactivity
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            saveDocument();
        }, 2000);
    }, [documentId, user, documentTitle]);

    // Document loading disabled - keeping editor static for now
    // useEffect(() => {
    //     if (propDocumentId && propDocumentId !== 'new' && user) {
    //         loadDocument(propDocumentId);
    //     }
    // }, [propDocumentId, user]);

    const saveDocument = async () => {
        if (!user) {
            console.warn('Cannot save: User not authenticated');
            return;
        }

        if (!supabase) {
            console.error('Cannot save: Supabase not configured');
            toast.error('Database not configured');
            return;
        }

        // Skip connection test - just proceed with save
        // The actual save operation will provide better error messages
        // Connection test can fail due to RLS even if tables exist, which is misleading
        console.log('Preparing to save document...');
        console.log('User ID:', user.id);
        console.log('Document ID:', documentId);
        console.log('Pages to save:', pages.length);

        try {
            setIsSaving(true);

            // Get the latest content from all pages by combining them
            // The pages state should already have the latest content from handleUpdate
            const allContent = pages.map((page, index) => ({
                pageNumber: index + 1,
                content: page.content || ''
            }));

            // Combine all page content into a single HTML string for the document content field
            const combinedContent = pages.map(p => p.content || '').join('\n');

            if (documentId === 'new') {
                // Create new document
                console.log('Creating new document...');
                console.log('Document title:', documentTitle);
                console.log('Pages to save:', pages.length);
                console.log('Combined content length:', combinedContent.length);
                
                const { data: newDoc, error: docError } = await supabase
                    .from('documents')
                    .insert({
                        title: documentTitle || 'Untitled Document',
                        owner_id: user.id,
                        content: {
                            pageCount: pages.length,
                            combinedContent: combinedContent.substring(0, 10000) // Store first 10k chars as preview
                        }
                    })
                    .select()
                    .single();

                if (docError) {
                    // Enhanced error extraction for PostgREST errors
                    console.error('=== Supabase Error Details ===');
                    console.error('Raw error:', docError);
                    console.error('Error type:', typeof docError);
                    console.error('Error constructor:', docError?.constructor?.name);
                    console.error('Error toString:', String(docError));
                    
                    // Try multiple ways to extract error information
                    let errorMessage = 'Failed to create document';
                    let errorCode: string | null = null;
                    let errorDetails: string | null = null;
                    let errorHint: string | null = null;
                    
                    // Method 1: Direct property access
                    if (docError && typeof docError === 'object') {
                        errorCode = (docError as any).code || null;
                        errorMessage = (docError as any).message || errorMessage;
                        errorDetails = (docError as any).details || null;
                        errorHint = (docError as any).hint || null;
                    }
                    
                    // Method 2: Try accessing via bracket notation (for non-enumerable properties)
                    try {
                        const errorObj = docError as any;
                        if (!errorCode) errorCode = errorObj['code'] || null;
                        if (errorMessage === 'Failed to create document') {
                            errorMessage = errorObj['message'] || errorObj['error_description'] || errorMessage;
                        }
                        if (!errorDetails) errorDetails = errorObj['details'] || null;
                        if (!errorHint) errorHint = errorObj['hint'] || null;
                    } catch (e) {
                        console.error('Error accessing error properties:', e);
                    }
                    
                    // Method 3: Try JSON.stringify with error object
                    try {
                        const errorStr = JSON.stringify(docError);
                        console.error('Error as JSON:', errorStr);
                        if (errorStr && errorStr !== '{}') {
                            const parsed = JSON.parse(errorStr);
                            if (parsed.message) errorMessage = parsed.message;
                            if (parsed.code) errorCode = parsed.code;
                            if (parsed.details) errorDetails = parsed.details;
                            if (parsed.hint) errorHint = parsed.hint;
                        }
                    } catch (e) {
                        console.error('Error stringifying error:', e);
                    }
                    
                    // Method 4: Check for PostgREST specific error format
                    if (errorCode) {
                        if (errorCode === '42P01') {
                            errorMessage = 'Database tables not found. Please run the SQL migration in your Supabase dashboard (supabase/migrations/001_initial_schema.sql)';
                        } else if (errorCode === 'PGRST301') {
                            errorMessage = 'Permission denied. You may not have permission to create documents. Check your Row Level Security (RLS) policies.';
                        } else if (errorCode === '23505') {
                            errorMessage = 'Document already exists with this ID.';
                        } else if (errorCode === '23503') {
                            errorMessage = 'Foreign key violation. The owner_id might not exist in auth.users.';
                        } else {
                            errorMessage = `Database error (${errorCode}): ${errorMessage}`;
                        }
                    }
                    
                    // Add details and hint if available
                    if (errorDetails) {
                        errorMessage += ` Details: ${errorDetails}`;
                    }
                    if (errorHint) {
                        errorMessage += ` Hint: ${errorHint}`;
                    }
                    
                    console.error('=== Extracted Error Info ===');
                    console.error('Code:', errorCode);
                    console.error('Message:', errorMessage);
                    console.error('Details:', errorDetails);
                    console.error('Hint:', errorHint);
                    
                    toast.error(errorMessage);
                    throw new Error(errorMessage);
                }

                if (!newDoc || !newDoc.id) {
                    throw new Error('Document created but no ID returned');
                }

                const newDocId = newDoc.id;
                setDocumentId(newDocId);
                console.log('Document created with ID:', newDocId);

                // Save pages
                if (pages.length > 0) {
                    const pagesToInsert = pages.map((page, index) => ({
                        document_id: newDocId,
                        page_number: index + 1,
                        content: page.content || ''
                    }));

                    const { error: pagesError } = await supabase
                        .from('pages')
                        .insert(pagesToInsert);

                    if (pagesError) {
                        console.error('Error saving pages:', pagesError);
                        const errorMessage = pagesError.message || 
                                           pagesError.error_description || 
                                           pagesError.details || 
                                           (typeof pagesError === 'string' ? pagesError : JSON.stringify(pagesError)) ||
                                           'Failed to save pages';
                        console.error('Pages error details:', {
                            message: pagesError.message,
                            code: pagesError.code,
                            details: pagesError.details,
                            hint: pagesError.hint
                        });
                        throw new Error(errorMessage);
                    }
                }

                setLastSaved(new Date());
                toast.success('Document saved');
                console.log('Document saved successfully');
            } else {
                console.log('Updating document:', documentId);
                
                // Get combined content for document metadata
                const combinedContent = pages.map(p => p.content || '').join('\n');
                
                // Update document metadata
                const { error: docError } = await supabase
                    .from('documents')
                    .update({
                        title: documentTitle || 'Untitled Document',
                        content: {
                            pageCount: pages.length,
                            combinedContent: combinedContent.substring(0, 10000) // Store first 10k chars as preview
                        },
                        updated_at: new Date().toISOString(),
                        last_edited_by: user.id
                    })
                    .eq('id', documentId);

                if (docError) {
                    console.error('Error updating document metadata:', docError);
                    const errorMessage = docError.message || 
                                       docError.error_description || 
                                       docError.details || 
                                       (typeof docError === 'string' ? docError : JSON.stringify(docError)) ||
                                       'Failed to update document';
                    console.error('Update error details:', {
                        message: docError.message,
                        code: docError.code,
                        details: docError.details,
                        hint: docError.hint
                    });
                    throw new Error(errorMessage);
                }

                // Delete existing pages
                const { error: deleteError } = await supabase
                    .from('pages')
                    .delete()
                    .eq('document_id', documentId);

                if (deleteError) {
                    console.error('Error deleting old pages:', deleteError);
                    // Don't throw here, continue to insert new pages
                }

                // Insert updated pages
                if (pages.length > 0) {
                    const pagesToInsert = pages.map((page, index) => ({
                        document_id: documentId,
                        page_number: index + 1,
                        content: page.content || ''
                    }));

                    const { error: pagesError } = await supabase
                        .from('pages')
                        .insert(pagesToInsert);

                    if (pagesError) {
                        console.error('Error saving pages:', pagesError);
                        const errorMessage = pagesError.message || 
                                           pagesError.error_description || 
                                           pagesError.details || 
                                           (typeof pagesError === 'string' ? pagesError : JSON.stringify(pagesError)) ||
                                           'Failed to save pages';
                        console.error('Pages error details:', {
                            message: pagesError.message,
                            code: pagesError.code,
                            details: pagesError.details,
                            hint: pagesError.hint
                        });
                        throw new Error(errorMessage);
                    }
                }

                setLastSaved(new Date());
                console.log('Document updated successfully');
            }
        } catch (error: any) {
            console.error('Error saving document:', error);
            const errorMessage = error?.message || error?.error_description || 'Failed to save document';
            
            // Handle specific error codes
            if (error?.code === '42P01') {
                toast.error('Database tables not found. Please run the SQL migration in Supabase dashboard.');
            } else if (error?.code === 'PGRST301') {
                toast.error('Permission denied. You may not have permission to edit this document.');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Real-time collaboration: Subscribe to document changes
    useEffect(() => {
        if (!documentId || documentId === 'new' || !user) return;

        const channel = supabase
            .channel(`document:${documentId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'pages',
                filter: `document_id=eq.${documentId}`
            }, (payload) => {
                // Reload pages when updated by another user
                loadDocument(documentId);
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'pages',
                filter: `document_id=eq.${documentId}`
            }, (payload) => {
                loadDocument(documentId);
            })
            .subscribe();

        // Track active user
        const trackActiveUser = async () => {
            await supabase
                .from('active_users')
                .upsert({
                    document_id: documentId,
                    user_id: user.id,
                    last_seen: new Date().toISOString()
                });
        };

        trackActiveUser();
        const interval = setInterval(trackActiveUser, 30000); // Update every 30 seconds

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
            // Remove from active users
            supabase
                .from('active_users')
                .delete()
                .eq('document_id', documentId)
                .eq('user_id', user.id);
        };
    }, [documentId, user]);

    const handleAddPage = () => {
        const newId = crypto.randomUUID();
        const newPage: Page = { id: newId, content: '<p></p>' };
        setPages(prev => [...prev, newPage]);
        setActivePageId(newId);
        // Auto-save after adding page
        setTimeout(() => saveDocument(), 500);
    };

    const getWordCount = () => {
        if (!activeEditor) return 0;
        return activeEditor.getText().trim().split(/\s+/).filter((w: string) => w.length > 0).length;
    };

    // Track selection changes on the active editor
    useEffect(() => {
        if (!activeEditor) return;

        const handleSelectionUpdate = () => {
            const selection = activeEditor.state.selection;
            if (!selection.empty) {
                const text = activeEditor.state.doc.textBetween(selection.from, selection.to, ' ');
                setSelectionContext(text);
            } else {
                setSelectionContext('');
            }

            // Check if cursor is inside a table
            const isInTable = activeEditor.isActive('table');
            setIsTableActive(isInTable);
        };

        activeEditor.on('selectionUpdate', handleSelectionUpdate);
        activeEditor.on('transaction', handleSelectionUpdate);

        // Also check immediately
        handleSelectionUpdate();

        return () => {
            activeEditor.off('selectionUpdate', handleSelectionUpdate);
            activeEditor.off('transaction', handleSelectionUpdate);
        };
    }, [activeEditor]);

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
            {/* Sidebar */}
            <Sidebar activeItem={activeSidebarItem} onItemClick={setActiveSidebarItem} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <TopBar
                    documentTitle={documentTitle}
                    onTitleChange={(title) => {
                        setDocumentTitle(title);
                        setTimeout(() => saveDocument(), 500);
                    }}
                    onPreview={() => setIsImmersiveReaderOpen(true)}
                    onEnhanced={() => console.log('Enhanced')}
                    onShowCustomization={() => console.log('Show Customization')}
                    onGenerateAIMedia={() => setIsAiSidebarOpen(true)}
                    onShare={() => setIsShareDialogOpen(true)}
                />

                {/* Compact Toolbar */}
                <CompactToolbar editor={activeEditor} />

                {/* Editor Area */}
                <div className="flex-1 overflow-auto bg-[#0a0a0a] flex justify-center">
                    <div className="w-full max-w-5xl p-8">
                        <div className="flex flex-col gap-6">
                            {pages.map((page) => (
                                <PageEditor
                                    key={page.id}
                                    pageId={page.id}
                                    content={page.content}
                                    isActive={page.id === activePageId}
                                    zoomLevel={zoomLevel}
                                    margins={margins}
                                    onEditorReady={handleEditorReady}
                                    onFocus={handleFocus}
                                    onUpdate={handleUpdate}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <StatusBar
                    wordCount={getWordCount()}
                    currentPage={activePageId}
                    totalPages={pages.length}
                    zoom={zoomLevel}
                    onZoomChange={setZoomLevel}
                />
            </div>

            {/* AI Sidebar */}
            <AiSidebar
                isOpen={isAiSidebarOpen}
                onClose={() => setIsAiSidebarOpen(false)}
                editor={activeEditor}
            />

            {/* Immersive Reader */}
            <ImmersiveReader
                isOpen={isImmersiveReaderOpen}
                onClose={() => setIsImmersiveReaderOpen(false)}
                content={activeEditor ? activeEditor.getText() : ''}
                contextText={selectionContext}
            />

            {/* Share/Collaboration Dialog */}
            <ShareDialog
                open={isShareDialogOpen}
                onOpenChange={setIsShareDialogOpen}
                documentId={documentId}
                documentTitle={documentTitle}
            />
        </div>
    );
}
