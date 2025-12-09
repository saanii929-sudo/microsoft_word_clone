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
import { useState } from 'react';
import { MsWordRibbon } from './MsWordRibbon';
import { MsWordStatusBar } from './MsWordStatusBar';
import { AiSidebar } from './AiSidebar';

import { PageBreak } from './extensions/PageBreak';

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


export default function MsWordEditor() {
    const [zoomLevel, setZoomLevel] = useState(100);
    const [wordCount, setWordCount] = useState(0);
    const [margins, setMargins] = useState({ top: 96, right: 96, bottom: 96, left: 96 }); // Default 1 inch = 96px
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            Subscript,
            Superscript,
            Highlight.configure({ multicolor: true }),
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({
                placeholder: 'Start typing...',
            }),
            PageBreak,
        ],
        content: `
      <h2>Welcome to your Word Clone</h2>
      <p>This is a document editor that looks and feels like Microsoft Word.</p>
      <p>Try using the ribbon above to format text, insert tables, and more.</p>
    `,
        onUpdate: ({ editor }) => {
            const text = editor.getText();
            setWordCount(text.trim().split(/\s+/).filter(w => w.length > 0).length);
        },
        editorProps: {
            attributes: {
                class: 'min-h-[900px] outline-none',
            }
        },
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    const handleMarginsChange = (newMargins: { top: number, right: number, bottom: number, left: number }) => {
        setMargins(newMargins);
    };

    return (
        <div className="flex flex-col h-screen bg-[#f0f0f0] overflow-hidden">
            <div className="flex-none z-20 shadow-sm">
                <MsWordRibbon
                    editor={editor}
                    onMarginsChange={handleMarginsChange}
                    onToggleAiSidebar={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
                />
            </div>

            <div className="flex-1 overflow-auto relative scroll-smooth bg-[#f0f0f0] flex">
                <div className="flex-1 flex justify-center p-8 pb-12" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}>
                    <div
                        className="word-page shadow-xl bg-white text-black print:shadow-none print:m-0 transition-all duration-300 ease-in-out"
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
                    </div>
                </div>
                <AiSidebar isOpen={isAiSidebarOpen} onClose={() => setIsAiSidebarOpen(false)} editor={editor} />
            </div>

            <MsWordStatusBar
                wordCount={wordCount}
                pageCount={1}
                zoomLevel={zoomLevel}
                onZoomChange={setZoomLevel}
            />
        </div>
    );
}
