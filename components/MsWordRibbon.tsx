"use client";

import React, { useState, useRef } from "react";
import {
    Clipboard, Copy, Scissors, Paintbrush,
    Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Indent, Outdent,
    Image as ImageIcon, Table, Link as LinkIcon,
    Undo, Redo,
    Type, Highlighter, Palette,
    ChevronDown,
    Layout as LayoutIcon,
    FileText, FilePlus, Minus,
    Shapes, Box, PieChart, Monitor, Video, Bookmark,
    MessageSquare, FileType, Hash, Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MsWordRibbonProps {
    editor: any;
    onMarginsChange?: (margins: { top: number, right: number, bottom: number, left: number }) => void;
    onToggleAiSidebar?: () => void;
}

const TABS = ["File", "Home", "Insert", "Layout", "AI Tools", "References", "Review", "View", "Help"];
// ... (imports and other consts remain same)

const FONT_FAMILIES = [
    "Calibri", "Arial", "Times New Roman", "Segoe UI", "Georgia", "Verdana", "Roboto"
];

const FONT_SIZES = [
    "8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "36", "48", "72"
];

export function MsWordRibbon({ editor, onMarginsChange, onToggleAiSidebar }: MsWordRibbonProps) {
    const [activeTab, setActiveTab] = useState("Home");
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!editor) return null;

    const addImageOnline = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addImageDevice = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    editor.chain().focus().setImage({ src: result }).run();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter link URL:', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const addPageBreak = () => {
        editor.chain().focus().setPageBreak().run();
    };

    return (
        <div className="flex flex-col w-full bg-[#f3f3f3] border-b border-[#d6d6d6]">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            {/* Title Bar / Top Strip */}
            <div className="flex items-center justify-between px-4 h-8 bg-[#2B579A] text-white select-none">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-[#1e3e70] rounded-none" onClick={() => editor.chain().focus().undo().run()}>
                            <Undo size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-[#1e3e70] rounded-none" onClick={() => editor.chain().focus().redo().run()}>
                            <Redo size={14} />
                        </Button>
                    </div>
                    <span className="text-xs font-medium">Document1 - Word</span>
                </div>
                <div className="flex items-center">
                    {/* Window Controls Simulation */}
                    <Button variant="ghost" size="icon" className="h-8 w-10 text-white hover:bg-[#E81123] rounded-none">
                        <span className="text-sm">✕</span>
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center px-2 bg-[#2B579A]">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-4 py-1 text-sm transition-colors rounded-t-sm",
                            activeTab === tab
                                ? "bg-[#f3f3f3] text-[#2B579A] font-semibold"
                                : "text-white hover:bg-[#436ba8] hover:text-white"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Ribbon Content (Toolbar) */}
            <div className="h-28 px-2 py-1 flex items-start gap-2 overflow-x-auto bg-[#f3f3f3]">
                {activeTab === "Home" && (
                    <>
                        {/* Clipboard Group */}
                        <div className="flex flex-col items-center justify-between h-full px-2 border-r border-gray-300">
                            <div className="flex flex-col gap-1">
                                <Button variant="ghost" className="flex flex-col h-14 w-12 gap-1 px-1 hover:bg-[#dcdcdc]" onClick={() => navigator.clipboard.readText().then(t => editor.commands.insertContent(t))}>
                                    <Clipboard size={20} className="text-[#2B579A]" />
                                    <span className="text-[10px]">Paste</span>
                                </Button>
                            </div>
                            <div className="flex flex-col gap-1 items-start">
                                <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]" onClick={() => document.execCommand('cut')}>
                                    <Scissors size={12} /> Cut
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]" onClick={() => document.execCommand('copy')}>
                                    <Copy size={12} /> Copy
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]">
                                    <Paintbrush size={12} /> Format
                                </Button>
                            </div>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">Clipboard</span>
                        </div>

                        {/* Font Group */}
                        <div className="flex flex-col items-center h-full px-2 border-r border-gray-300 gap-1">
                            <div className="flex gap-1 mb-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-6 w-32 justify-between text-xs bg-white border-gray-300 hover:bg-[#e6f0ff]">
                                            {editor.getAttributes('textStyle').fontFamily || "Calibri"} <ChevronDown size={10} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                                        {FONT_FAMILIES.map(font => (
                                            <DropdownMenuItem key={font} onClick={() => editor.chain().focus().setFontFamily(font).run()} style={{ fontFamily: font }}>
                                                {font}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-6 w-14 justify-between text-xs bg-white border-gray-300 hover:bg-[#e6f0ff]">
                                            {editor.getAttributes('textStyle').fontSize || "11"} <ChevronDown size={10} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                                        {FONT_SIZES.map(size => (
                                            <DropdownMenuItem key={size} onClick={() => editor.chain().focus().setFontSize(size + "px").run()}>
                                                {size}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex gap-1">
                                <div className="flex bg-white/50 rounded-sm">
                                    <ToolbarButton isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} icon={Bold} />
                                    <ToolbarButton isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} icon={Italic} />
                                    <ToolbarButton isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} icon={Underline} />
                                    <ToolbarButton isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} icon={Strikethrough} />
                                    <ToolbarButton isActive={editor.isActive('subscript')} onClick={() => editor.chain().focus().toggleSubscript().run()} icon={Subscript} />
                                    <ToolbarButton isActive={editor.isActive('superscript')} onClick={() => editor.chain().focus().toggleSuperscript().run()} icon={Superscript} />
                                </div>
                            </div>

                            <div className="flex gap-1 mt-1">
                                <ToolbarButton onClick={() => editor.chain().focus().setHighlight({ color: '#FFFF00' }).run()} icon={Highlighter} className="text-yellow-500" />
                                <ToolbarButton onClick={() => editor.chain().focus().setColor('#FF0000').run()} icon={Palette} className="text-red-500" />
                            </div>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">Font</span>
                        </div>

                        {/* Paragraph Group */}
                        <div className="flex flex-col items-center h-full px-2 border-r border-gray-300 gap-1">
                            <div className="flex gap-1">
                                <ToolbarButton isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} icon={List} />
                                <ToolbarButton isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={ListOrdered} />
                                <ToolbarButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} icon={Outdent} />
                                <ToolbarButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} icon={Indent} />
                            </div>
                            <div className="flex gap-1">
                                <ToolbarButton isActive={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} icon={AlignLeft} />
                                <ToolbarButton isActive={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} icon={AlignCenter} />
                                <ToolbarButton isActive={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} icon={AlignRight} />
                                <ToolbarButton isActive={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} icon={AlignJustify} />
                            </div>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">Paragraph</span>
                        </div>
                    </>
                )}

                {activeTab === "Insert" && (
                    <>
                        {/* Pages Group */}
                        <div className="flex flex-col items-center h-full px-2 border-r border-gray-300 gap-1">
                            <div className="flex gap-1">
                                <Button variant="ghost" className="flex flex-col h-14 w-12 gap-1 px-1 hover:bg-[#dcdcdc]">
                                    <FileText size={20} className="text-[#2B579A]" />
                                    <span className="text-[10px] mt-1">Cover Page</span>
                                </Button>
                                <Button variant="ghost" className="flex flex-col h-14 w-12 gap-1 px-1 hover:bg-[#dcdcdc]" onClick={() => {
                                    // Insert Blank Page: Break -> Empty Para -> Break
                                    editor.chain().focus().setPageBreak().insertContent({ type: 'paragraph' }).setPageBreak().run();
                                }}>
                                    <FilePlus size={20} className="text-[#2B579A]" />
                                    <span className="text-[10px] mt-1">Blank Page</span>
                                </Button>
                                <Button variant="ghost" className="flex flex-col h-14 w-12 gap-1 px-1 hover:bg-[#dcdcdc]" onClick={addPageBreak}>
                                    <Minus size={20} className="text-[#2B579A]" />
                                    <span className="text-[10px] mt-1">Page Break</span>
                                </Button>
                            </div>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">Pages</span>
                        </div>

                        {/* Tables Group */}
                        <div className="flex flex-col items-center h-full px-2 border-r border-gray-300 gap-1">
                            <Button variant="ghost" className="flex flex-col h-14 w-12 gap-1 px-1 hover:bg-[#dcdcdc]" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>
                                <Table size={24} className="text-[#2B579A]" />
                                <span className="text-[10px] mt-1">Table</span>
                            </Button>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">Tables</span>
                        </div>

                        {/* Illustrations Group */}
                        <div className="flex flex-col items-center h-full px-2 border-r border-gray-300 gap-1">
                            <div className="flex gap-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex flex-col h-14 w-14 gap-1 px-1 hover:bg-[#dcdcdc]">
                                            <ImageIcon size={24} className="text-[#2B579A]" />
                                            <span className="text-[10px] mt-1">Pictures</span>
                                            <ChevronDown size={10} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={addImageDevice}>This Device...</DropdownMenuItem>
                                        <DropdownMenuItem onClick={addImageOnline}>Online Pictures...</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="flex flex-col gap-1 items-start">
                                    <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]">
                                        <Shapes size={12} /> Shapes
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]">
                                        <Box size={12} /> 3D Models
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]">
                                        <PieChart size={12} /> SmartArt
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]">
                                        <Monitor size={12} /> Chart
                                    </Button>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">Illustrations</span>
                        </div>

                        {/* Media */}
                        <div className="flex flex-col items-center h-full px-2 border-r border-gray-300 gap-1">
                            <Button variant="ghost" className="flex flex-col h-14 w-12 gap-1 px-1 hover:bg-[#dcdcdc]">
                                <Video size={24} className="text-[#2B579A]" />
                                <span className="text-[10px] mt-1">Online Video</span>
                            </Button>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">Media</span>
                        </div>

                        {/* Links */}
                        <div className="flex flex-col items-center h-full px-2 border-r border-gray-300 gap-1">
                            <div className="flex flex-col gap-1">
                                <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]" onClick={addLink}>
                                    <LinkIcon size={12} /> Link
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]">
                                    <Bookmark size={12} /> Bookmark
                                </Button>
                            </div>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">Links</span>
                        </div>

                        {/* Header & Footer */}
                        <div className="flex flex-col items-center h-full px-2 border-r border-gray-300 gap-1">
                            <div className="flex flex-col gap-1">
                                <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]">
                                    <FileText size={12} /> Header
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]">
                                    <FileText size={12} /> Footer
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 px-1 text-[10px] gap-2 hover:bg-[#dcdcdc]">
                                    <Hash size={12} /> Page Number
                                </Button>
                            </div>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">Header & Footer</span>
                        </div>
                    </>
                )}

                {activeTab === "Layout" && (
                    <>
                        <div className="flex flex-col items-center h-full px-2 border-r border-gray-300 gap-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex flex-col h-14 w-14 gap-1 px-1 hover:bg-[#dcdcdc]">
                                        <LayoutIcon size={24} className="text-[#2B579A]" />
                                        <span className="text-[10px] mt-1">Margins</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => onMarginsChange?.({ top: 96, right: 96, bottom: 96, left: 96 })}>
                                        Normal (1")
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onMarginsChange?.({ top: 48, right: 48, bottom: 48, left: 48 })}>
                                        Narrow (0.5")
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onMarginsChange?.({ top: 96, right: 192, bottom: 96, left: 192 })}>
                                        Wide (2")
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">Page Setup</span>
                        </div>
                    </>
                )}

                {activeTab === "AI Tools" && (
                    <>
                        <div className="flex flex-col items-center h-full px-2 border-r border-gray-300 gap-1">
                            <Button variant="ghost" className="flex flex-col h-14 w-16 gap-1 px-1 hover:bg-[#dcdcdc]" onClick={onToggleAiSidebar}>
                                <Wand2 size={24} className="text-[#2B579A]" />
                                <span className="text-[10px] mt-1">Media Studio</span>
                            </Button>
                            <span className="text-[10px] text-gray-500 mt-auto mb-1">AI Generation</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, isActive, icon: Icon, className }: any) {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
                "h-7 w-7 p-0 hover:bg-[#c6d8f5] data-[active=true]:bg-[#c6d8f5] data-[active=true]:border-[#a3c2f0] border border-transparent rounded-sm transition-none",
                className
            )}
            data-active={isActive}
        >
            <Icon size={16} />
        </Button>
    )
}

