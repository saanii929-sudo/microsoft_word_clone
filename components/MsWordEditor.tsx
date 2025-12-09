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
import { MsWordRibbon } from './MsWordRibbon';
import { MsWordStatusBar } from './MsWordStatusBar';
import { AiSidebar } from './AiSidebar';
import { ImmersiveReader } from './ImmersiveReader';
import { PageBreak } from './extensions/PageBreak';
import ChartExtension from './extensions/ChartExtension';
import ShapeExtension from './extensions/ShapeExtension';

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
            StarterKit,
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
            Image,
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
                {/* Page Number Marker (Visual only) */}
                <div className="absolute bottom-4 right-8 text-[10px] text-gray-400 select-none pointer-events-none">
                    {pageId}
                </div>
            </div>
        </div>
    );
}

export default function MsWordEditor() {
    const [pages, setPages] = useState<Page[]>([
        { id: '1', content: '<h2>Welcome to your Modern Document</h2><p>This is Page 1. You can add more pages using the "Blank Page" button in the Insert tab.</p>' }
    ]);
    const [activePageId, setActivePageId] = useState<string>('1');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [margins, setMargins] = useState({ top: 96, right: 96, bottom: 96, left: 96 });
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
    const [isImmersiveReaderOpen, setIsImmersiveReaderOpen] = useState(false);
    const [selectionContext, setSelectionContext] = useState('');
    const [isTableActive, setIsTableActive] = useState(false);

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
        setPages(prev => prev.map(p => p.id === id ? { ...p, content } : p));
    }, []);

    const handleAddPage = () => {
        const newId = (pages.length + 1).toString();
        const newPage: Page = { id: newId, content: '<p></p>' };
        setPages(prev => [...prev, newPage]);
        // Focus will need to wait for render, but user can click
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
        <div className="flex flex-col h-screen overflow-hidden bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover">

            {/* Backdrop Blur Overlay */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl -z-10" />

            {/* Ribbon */}
            <div className="flex-none z-20 px-4 pt-4">
                <MsWordRibbon
                    editor={activeEditor}
                    onMarginsChange={setMargins}
                    onToggleAiSidebar={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
                    onToggleImmersiveReader={() => setIsImmersiveReaderOpen(true)}
                    onInsertBlankPage={handleAddPage}
                    isTableActive={isTableActive}
                />
            </div>

            {/* Pages Area */}
            <div className="flex-1 overflow-auto relative scroll-smooth flex flex-col items-center">
                <div className="pb-20">
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

                <AiSidebar isOpen={isAiSidebarOpen} onClose={() => setIsAiSidebarOpen(false)} editor={activeEditor} />
                <ImmersiveReader
                    isOpen={isImmersiveReaderOpen}
                    onClose={() => setIsImmersiveReaderOpen(false)}
                    content={activeEditor ? activeEditor.getText() : ''}
                    contextText={selectionContext}
                />
            </div>

            {/* Status Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-2">
                <div className="glass-panel rounded-lg py-1 px-4 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                    <div className="flex gap-4">
                        <span>Page {activePageId} of {pages.length}</span>
                        <span>{getWordCount()} words</span>
                        <span>English (US)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>{zoomLevel}%</span>
                        <input
                            type="range"
                            min="50"
                            max="200"
                            value={zoomLevel}
                            onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                            className="w-24 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
