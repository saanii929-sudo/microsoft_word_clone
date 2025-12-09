"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent, Content } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import Focus from '@tiptap/extension-focus';
import FontFamily from '@tiptap/extension-font-family';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Typography from '@tiptap/extension-typography';
import { Video } from './extensions/Video';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { CollaborationBar } from '@/components/CollaborationBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Fragment, Node } from '@tiptap/pm/model';
import { WordMenuBar } from './WordMenuBar';
import { WordRibbon } from './WordRibbon';
import { WordStatusBar } from './WordStatusBar';
import { PageSetupDialog } from './WordFeatures/PageSetupDialog';
import { FindReplaceDialog } from './WordFeatures/FindReplaceDialog';
import { TableOfContents } from './WordFeatures/TableOfContents';
import { HeaderFooter } from './extensions/HeaderFooter';
import { PageBreak } from './extensions/PageBreak';
import { Comment } from './extensions/Comment';
import { Indent as IndentExtension } from './extensions/Indent';
import { LineSpacing } from './extensions/LineSpacing';
import { Shape } from './extensions/Shape';
import { TextBox } from './extensions/TextBox';
import { WordArt } from './extensions/WordArt';
import { DropCap } from './extensions/DropCap';
import { SignatureLine } from './extensions/SignatureLine';
import { CoverPageDialog } from './WordFeatures/CoverPageDialog';
import { ShapesDialog } from './WordFeatures/ShapesDialog';
import { ChartsDialog } from './WordFeatures/ChartsDialog';
import { IconsDialog } from './WordFeatures/IconsDialog';
import { HeaderFooterDialog } from './WordFeatures/HeaderFooterDialog';
import { SymbolDialog } from './WordFeatures/SymbolDialog';
import { EquationDialog } from './WordFeatures/EquationDialog';
import { DateTimeDialog } from './WordFeatures/DateTimeDialog';
import { CommentDialog } from './WordFeatures/CommentDialog';
import { LinkDialog } from './WordFeatures/LinkDialog';
import { WordArtDialog } from './WordFeatures/WordArtDialog';
import { SignatureLineDialog } from './WordFeatures/SignatureLineDialog';
import { CommentRenderer } from './WordFeatures/CommentRenderer';

// Custom FontSize extension
const FontSize = TextStyle.extend({
  name: 'fontSize',
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element) => {
          const fontSize = element.style.fontSize;
          if (fontSize) {
            return fontSize.replace('px', '');
          }
          return null;
        },
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}px`,
          };
        },
      },
    };
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ commands }) => {
        return commands.setMark(this.name, { fontSize });
      },
    };
  },
});

// Generate random color for user cursor
const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface ActiveUser {
  id: string;
  name: string;
  color: string;
}

export default function WordEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showPageSetup, setShowPageSetup] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [showCoverPage, setShowCoverPage] = useState(false);
  const [showShapes, setShowShapes] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [showHeaderFooter, setShowHeaderFooter] = useState(false);
  const [showSymbol, setShowSymbol] = useState(false);
  const [showEquation, setShowEquation] = useState(false);
  const [showDateTime, setShowDateTime] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [showWordArtDialog, setShowWordArtDialog] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [wordArtText, setWordArtText] = useState('WordArt');
  const [pageSettings, setPageSettings] = useState({
    size: 'A4',
    orientation: 'portrait',
    margins: { top: 72, right: 72, bottom: 72, left: 72 }
  });
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border font-mono',
          },
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing your document...',
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto border cursor-move',
        },
      }),
      TableKit.configure({
        resizable: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Underline,
      Color,
      TextStyle,
      FontSize,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline',
        },
      }),
      Superscript,
      Subscript,
      TaskList,
      TaskItem,
      CharacterCount,
      Dropcursor,
      Gapcursor,
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      HorizontalRule,
      Typography,
      HeaderFooter,
      PageBreak,
      Comment,
      IndentExtension,
      LineSpacing,
      Shape,
      TextBox,
      WordArt,
      DropCap,
      SignatureLine,
      Video,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[800px] p-8',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              if (editor) {
                editor.chain().focus().setImage({ src }).run();
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharacterCount(text.length);
      // Estimate pages (assuming ~500 words per page)
      setPageCount(Math.max(1, Math.ceil(words.length / 500)));
      
      // Convert any raw <comment> tags to proper comment nodes
      const html = editor.getHTML();
      if (html.includes('<comment>')) {
        // More robust regex that handles nested content
        const updatedHtml = html.replace(
          /<comment\s*>([\s\S]*?)<\/comment>/gi,
          (match, content) => {
            // Extract text content, removing any HTML tags
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const textContent = tempDiv.textContent || tempDiv.innerText || content.trim();
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            const escapedContent = textContent.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            return `<span data-type="comment" data-comment-id="${id}" data-comment-author="User" data-comment-content="${escapedContent}" data-comment-date="${new Date().toISOString()}" class="comment-marker" style="background-color: #ffeb3b; cursor: pointer; padding: 2px 6px; border-radius: 3px; display: inline-block; position: relative; margin: 0 2px;">💬</span>`;
          }
        );
        if (updatedHtml !== html) {
          // Use setTimeout to avoid infinite loop
          setTimeout(() => {
            if (editor && editor.getHTML() === html) {
              editor.commands.setContent(updatedHtml);
            }
          }, 0);
        }
      }
    },
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (id && id !== 'new') {
      fetchDocument();
      setupRealtimeSync();
      trackUserSession();
    }

    return () => {
      cleanupSession();
    };
  }, [id, user, router]);

  const fetchDocument = async () => {
    if (!id || id === 'new' || !editor) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setTitle(data.title || '');
      if (data.content) {
        // Convert any raw <comment> tags to proper format before loading
        let processedContent = data.content;
        if (processedContent.includes('<comment>')) {
          processedContent = processedContent.replace(
            /<comment\s*>([\s\S]*?)<\/comment>/gi,
            (match, content) => {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = content;
              const textContent = tempDiv.textContent || tempDiv.innerText || content.trim();
              const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
              const escapedContent = textContent.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
              return `<span data-type="comment" data-comment-id="${id}" data-comment-author="User" data-comment-content="${escapedContent}" data-comment-date="${new Date().toISOString()}" class="comment-marker" style="background-color: #ffeb3b; cursor: pointer; padding: 2px 6px; border-radius: 3px; display: inline-block; position: relative; margin: 0 2px;">💬</span>`;
            }
          );
        }
        editor.commands.setContent(processedContent);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      toast.error('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSync = useCallback(() => {
    if (!id || id === 'new' || !user || !editor) return;

    const channel = supabase
      .channel(`document:${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `id=eq.${id}`,
        },
        (payload: { eventType: string; new: { content: Content | Fragment | Node; }; }) => {
          if (payload.eventType === 'UPDATE' && payload.new.content && editor) {
            const currentContent = editor.getHTML();
            if (currentContent !== payload.new.content) {
              editor.commands.setContent(payload.new.content);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_sessions',
          filter: `document_id=eq.${id}`,
        },
        async () => {
          await fetchActiveSessions();
        }
      )
      .subscribe();

    fetchActiveSessions();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user, editor]);

  const fetchActiveSessions = async () => {
    if (!id || id === 'new') return;

    try {
      const { data, error } = await supabase
        .from('document_sessions')
        .select(`
          user_id,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('document_id', id)
        .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      if (error) throw error;

      const users: ActiveUser[] = (data || [])
        .filter((session: { user_id: any; }) => session.user_id !== user?.id)
        .map((session: { user_id: any; profiles: any; }) => ({
          id: session.user_id,
          name: (session.profiles as any)?.full_name || (session.profiles as any)?.email?.split('@')[0] || 'Anonymous',
          color: getRandomColor(),
        }));

      setActiveUsers(users);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  };

  const trackUserSession = async () => {
    if (!id || id === 'new' || !user) return;

    try {
      await supabase
        .from('document_sessions')
        .upsert({
          document_id: id,
          user_id: user.id,
          last_seen: new Date().toISOString(),
        });

      const interval = setInterval(async () => {
        await supabase
          .from('document_sessions')
          .upsert({
            document_id: id,
            user_id: user.id,
            last_seen: new Date().toISOString(),
          });
      }, 30000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error tracking session:', error);
    }
  };

  const cleanupSession = async () => {
    if (!id || id === 'new' || !user) return;

    try {
      await supabase
        .from('document_sessions')
        .delete()
        .eq('document_id', id)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error cleaning up session:', error);
    }
  };

  const handleSave = async () => {
    if (!editor || !user) return;
    if (!title.trim()) {
      toast.error('Please add a title');
      return;
    }

    setSaving(true);
    try {
      const content = editor.getHTML();

      if (id === 'new') {
        const { data, error } = await supabase
          .from('documents')
          .insert({
            title,
            content,
            author_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Document created!');
        router.push(`/editor/${data.id}`);
      } else {
        const { error } = await supabase
          .from('documents')
          .update({ title, content })
          .eq('id', id);

        if (error) throw error;
        toast.success('Document saved!');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'html') => {
    if (!editor) return;

    try {
      const content = editor.getHTML();
      
      if (format === 'html') {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'document'}.html`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Document exported as HTML');
      } else if (format === 'pdf') {
        toast.info('PDF export coming soon');
      } else if (format === 'docx') {
        toast.info('DOCX export coming soon');
      }
    } catch (error) {
      console.error('Error exporting document:', error);
      toast.error('Failed to export document');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const insertImage = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = (rows: number, cols: number) => {
    if (editor) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
    }
  };

  const insertPageBreak = () => {
    if (editor) {
      editor.chain().focus().setPageBreak().run();
    }
  };

  const insertComment = (commentText: string) => {
    if (editor && user) {
      editor.chain().focus().setComment({
        id: Date.now().toString(),
        author: user.email || 'User',
        content: commentText,
        date: new Date().toISOString(),
      }).run();
    }
  };

  const insertLink = (url: string, text?: string, openInNewTab?: boolean) => {
    if (editor) {
      if (text) {
        editor.chain().focus().insertContent(`<a href="${url}" ${openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: url, target: openInNewTab ? '_blank' : undefined }).run();
      }
    }
  };

  const insertBlankPage = () => {
    if (editor) {
      // In Microsoft Word, a blank page is simply two consecutive page breaks
      // This creates a full blank page in the document flow
      // The page styling is handled by the document container, not individual pages
      editor.chain().focus().setPageBreak().run();
      editor.chain().focus().setPageBreak().run();
    }
  };

  const insertCoverPage = (template: string) => {
    if (editor) {
      editor.chain().focus().insertContentAt(0, template).run();
    }
  };

  const insertShape = (type: string, name: string) => {
    if (editor) {
      editor.chain().focus().setShape({ type }).run();
    }
  };

  const insertChart = (chartType: string, data: any) => {
    if (editor) {
      const chartHTML = `
        <div data-chart-type="${chartType}" style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3 style="margin-bottom: 15px;">${data.title}</h3>
          <div style="display: flex; align-items: flex-end; gap: 10px; height: 200px;">
            ${data.values.map((value: number, index: number) => `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                <div style="background: linear-gradient(to top, #3b82f6, #60a5fa); width: 100%; height: ${(value / Math.max(...data.values)) * 100}%; margin-bottom: 5px; border-radius: 4px 4px 0 0;"></div>
                <span style="font-size: 12px;">${data.labels[index]}</span>
                <span style="font-size: 10px; color: #666;">${value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      editor.chain().focus().insertContent(chartHTML).run();
    }
  };

  const insertIcon = (iconName: string) => {
    if (editor) {
      editor.chain().focus().insertContent(`[ICON:${iconName}]`).run();
    }
  };

  const insertHeader = (content: string) => {
    if (editor) {
      editor.chain().focus().insertHeader().run();
    }
  };

  const insertFooter = (content: string) => {
    if (editor) {
      editor.chain().focus().insertFooter().run();
    }
  };

  const insertPageNumber = (position: string, alignment: string) => {
    if (editor) {
      const pageNumHTML = `<span data-page-number style="display: inline-block; padding: 5px;">1</span>`;
      editor.chain().focus().insertContent(pageNumHTML).run();
    }
  };

  const insertTextBox = () => {
    if (editor) {
      editor.chain().focus().setTextBox().run();
    }
  };

  const insertDropCap = () => {
    if (editor) {
      editor.chain().focus().setDropCap().run();
    }
  };

  const insertWordArt = (text: string, style: string, fontSize: number) => {
    if (editor) {
      editor.chain().focus().setWordArt({ text, style, fontSize }).run();
    }
  };

  const insertSignatureLine = (signerName: string, signerTitle: string, showDate: boolean) => {
    if (editor) {
      editor.chain().focus().setSignatureLine({ signerName, signerTitle, showDate }).run();
    }
  };

  const insertSymbol = (symbol: string) => {
    if (editor) {
      editor.chain().focus().insertContent(symbol).run();
    }
  };

  const insertEquation = (equation: string, isInline: boolean) => {
    if (editor) {
      const equationHTML = isInline
        ? `<span data-equation="${equation}" style="display: inline-block;">[EQUATION:${equation}]</span>`
        : `<div data-equation="${equation}" style="text-align: center; margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">[EQUATION:${equation}]</div>`;
      editor.chain().focus().insertContent(equationHTML).run();
    }
  };

  const insertDateTime = (formatted: string) => {
    if (editor) {
      editor.chain().focus().insertContent(formatted).run();
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (id && id !== 'new' && editor && !editor.isEmpty) {
      const interval = setInterval(() => {
        handleSave();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [id, editor, title]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowFindReplace(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowFindReplace(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, title]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <CollaborationBar activeUsers={activeUsers} />

      {/* Word-like Menu Bar */}
      <WordMenuBar
        editor={editor}
        onSave={handleSave}
        onExport={handleExport}
        onPrint={handlePrint}
        onPageSetup={() => setShowPageSetup(true)}
        onFindReplace={() => setShowFindReplace(true)}
        onTableOfContents={() => setShowTableOfContents(true)}
        onCoverPage={() => setShowCoverPage(true)}
        onBlankPage={insertBlankPage}
        onShapes={() => setShowShapes(true)}
        onCharts={() => setShowCharts(true)}
        onIcons={() => setShowIcons(true)}
        onHeaderFooter={() => setShowHeaderFooter(true)}
        onSymbol={() => setShowSymbol(true)}
        onEquation={() => setShowEquation(true)}
        onDateTime={() => setShowDateTime(true)}
        onTextBox={insertTextBox}
        onWordArt={() => setShowWordArtDialog(true)}
        onDropCap={insertDropCap}
        onSignatureLine={() => setShowSignatureDialog(true)}
        onComment={() => setShowComment(true)}
        saving={saving}
      />

      {/* Word-like Ribbon */}
      <WordRibbon
        editor={editor}
        onImageUpload={insertImage}
        onTableInsert={insertTable}
        onPageBreak={insertPageBreak}
        onComment={() => setShowComment(true)}
        onLink={() => setShowLink(true)}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
      />

      {/* Document Title */}
      <div className="px-8 py-4 bg-white dark:bg-gray-800 border-b">
        <Input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0 bg-transparent"
        />
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
        <div 
          className="max-w-4xl mx-auto my-8 bg-white dark:bg-gray-800 shadow-lg min-h-[1123px] p-8" 
          style={{ zoom: `${zoomLevel}%` }}
        >
          <CommentRenderer />
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Status Bar */}
      <WordStatusBar
        wordCount={wordCount}
        characterCount={characterCount}
        pageCount={pageCount}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
      />

      {/* Dialogs */}
      <PageSetupDialog
        open={showPageSetup}
        onOpenChange={setShowPageSetup}
        settings={pageSettings}
        onSettingsChange={setPageSettings}
      />

      <FindReplaceDialog
        open={showFindReplace}
        onOpenChange={setShowFindReplace}
        editor={editor}
      />

      <TableOfContents
        open={showTableOfContents}
        onOpenChange={setShowTableOfContents}
        editor={editor}
      />

      <CoverPageDialog
        open={showCoverPage}
        onOpenChange={setShowCoverPage}
        onInsert={insertCoverPage}
      />

      <ShapesDialog
        open={showShapes}
        onOpenChange={setShowShapes}
        onInsert={insertShape}
      />

      <ChartsDialog
        open={showCharts}
        onOpenChange={setShowCharts}
        onInsert={insertChart}
      />

      <IconsDialog
        open={showIcons}
        onOpenChange={setShowIcons}
        onInsert={insertIcon}
      />

      <HeaderFooterDialog
        open={showHeaderFooter}
        onOpenChange={setShowHeaderFooter}
        onInsertHeader={insertHeader}
        onInsertFooter={insertFooter}
        onInsertPageNumber={insertPageNumber}
      />

      <SymbolDialog
        open={showSymbol}
        onOpenChange={setShowSymbol}
        onInsert={insertSymbol}
      />

      <EquationDialog
        open={showEquation}
        onOpenChange={setShowEquation}
        onInsert={insertEquation}
      />

      <DateTimeDialog
        open={showDateTime}
        onOpenChange={setShowDateTime}
        onInsert={insertDateTime}
      />

      <CommentDialog
        open={showComment}
        onOpenChange={setShowComment}
        onInsert={insertComment}
        author={user?.email || 'User'}
      />

      <LinkDialog
        open={showLink}
        onOpenChange={setShowLink}
        onInsert={insertLink}
        selectedText={editor?.state.selection.empty ? undefined : editor?.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)}
      />

      <WordArtDialog
        open={showWordArtDialog}
        onOpenChange={setShowWordArtDialog}
        onInsert={insertWordArt}
      />

      <SignatureLineDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        onInsert={insertSignatureLine}
      />
    </div>
  );
}
