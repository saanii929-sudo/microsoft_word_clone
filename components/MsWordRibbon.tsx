"use client";

import React, { useState, useRef } from "react";
import { ChartDialog } from './WordFeatures/ChartDialog';
import { ShapeDialog } from './WordFeatures/ShapeDialog';
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
    MessageSquare, FileType, Hash, Wand2,
    X, Menu, BookOpen, FilePlus2,
    TableProperties, Columns3, Rows3, Merge, Split
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MsWordRibbonProps {
    editor: any;
    onMarginsChange?: (margins: { top: number, right: number, bottom: number, left: number }) => void;
    onToggleAiSidebar?: () => void;
    onToggleImmersiveReader?: () => void;
    onInsertBlankPage?: () => void;
    isTableActive?: boolean;
}

const TABS = ["Home", "Insert", "Layout", "View", "AI Tools"];

const FONT_FAMILIES = [
    "Inter", "Outfit", "Calibri", "Times New Roman", "Consolas"
];

const FONT_SIZES = [
    "8", "10", "11", "12", "14", "16", "18", "24", "30", "36", "48", "60", "72"
];

const WORD_SHAPES = [
    { type: "rectangle", label: "Rectangle" },
    { type: "roundedRectangle", label: "Rounded Rectangle" },
    { type: "circle", label: "Circle" },
    { type: "triangle", label: "Triangle" },
];

const getShapeClipPath = (type: string) => {
    switch (type) {
        case 'circle': return 'circle(50% at 50% 50%)';
        case 'triangle': return 'polygon(50% 0%, 0% 100%, 100% 100%)';
        case 'roundedRectangle': return 'inset(0% round 20%)';
        default: return 'inset(0%)';
    }
};

export function MsWordRibbon({ editor, onMarginsChange, onToggleAiSidebar, onToggleImmersiveReader, onInsertBlankPage, isTableActive }: MsWordRibbonProps) {
    const [activeTab, setActiveTab] = useState("Home");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isChartDialogOpen, setIsChartDialogOpen] = useState(false);
    const [isShapeDialogOpen, setIsShapeDialogOpen] = useState(false);

    // ... (helper functions remain same)

    if (!editor) return null;

    const addImageOnline = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addImageDevice = () => {
        fileInputRef.current?.click();
        // Implementation for handling file selection would go here
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
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };


    const new_blank_page = `
      <div class="page-break-marker">
        <span class="page-break-text">Page Break</span>
      </div>
      <div class="word-page-separator"></div>
      <p></p>
    `;

    const addPageBreak = () => {
        if (onInsertBlankPage) {
            onInsertBlankPage();
        } else {
            editor.chain().focus().insertContent(new_blank_page).run();
        }
    };

    return (
        <div className="flex flex-col w-full glass-panel border-b-0 m-0 rounded-b-xl z-50">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            {/* Modern Header */}
            <div className="flex items-center justify-between px-4 h-12 bg-white/40 backdrop-blur border-b border-white/20 select-none">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <span className="font-bold">W</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">Untitled Document</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-200/50 rounded-full" onClick={() => editor.chain().focus().undo().run()}>
                        <Undo size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-200/50 rounded-full" onClick={() => editor.chain().focus().redo().run()}>
                        <Redo size={16} />
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center px-4 pt-2 gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-4 py-2 text-sm transition-all rounded-t-lg relative",
                            activeTab === tab
                                ? "text-indigo-600 font-medium"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/30"
                        )}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 rounded-full"
                            />
                        )}
                    </button>
                ))}

                {/* Contextual Table Design Tab */}
                {isTableActive && (
                    <button
                        onClick={() => setActiveTab("Table Design")}
                        className={cn(
                            "px-4 py-2 text-sm transition-all rounded-t-lg relative border-l-2 border-slate-200/60 ml-2",
                            activeTab === "Table Design"
                                ? "text-emerald-600 font-medium"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/30"
                        )}
                    >
                        Table Design
                        {activeTab === "Table Design" && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 rounded-full"
                            />
                        )}
                    </button>
                )}
            </div>

            {/* Toolbar Content */}
            <div className="h-24 px-4 py-2 flex items-center gap-4 overflow-x-auto no-scrollbar bg-white/40 backdrop-blur rounded-b-xl">
                {activeTab === "Home" && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                        {/* Font Family/Size */}
                        <div className="flex flex-col gap-2 border-r border-slate-200/60 pr-4">
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-32 justify-between text-xs bg-white/50 border-white/40 hover:bg-white/80">
                                            {editor.getAttributes('textStyle').fontFamily || "Inter"} <ChevronDown size={12} />
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
                                        <Button variant="outline" size="sm" className="w-16 justify-between text-xs bg-white/50 border-white/40 hover:bg-white/80">
                                            {editor.getAttributes('textStyle').fontSize || "11"} <ChevronDown size={12} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="h-60 overflow-y-auto">
                                        {FONT_SIZES.map(size => (
                                            <DropdownMenuItem key={size} onClick={() => editor.chain().focus().setFontSize(size + "px").run()}>
                                                {size}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex gap-1 bg-white/40 p-1 rounded-lg">
                                <ToolbarButton isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} icon={Bold} />
                                <ToolbarButton isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} icon={Italic} />
                                <ToolbarButton isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} icon={Underline} />
                                <div className="w-[1px] h-4 bg-slate-300 mx-1 my-auto inline-block"></div>
                                <ToolbarButton onClick={() => editor.chain().focus().setHighlight({ color: '#fef08a' }).run()} icon={Highlighter} className="text-yellow-600" />
                                <ToolbarButton onClick={() => editor.chain().focus().setColor('#ef4444').run()} icon={Palette} className="text-red-500" />
                            </div>
                        </div>

                        {/* Alignment */}
                        <div className="flex items-center gap-1 border-r border-slate-200/60 pr-4">
                            <div className="flex bg-white/40 p-1 rounded-lg">
                                <ToolbarButton isActive={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} icon={AlignLeft} />
                                <ToolbarButton isActive={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} icon={AlignCenter} />
                                <ToolbarButton isActive={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} icon={AlignRight} />
                            </div>
                        </div>

                        {/* Lists */}
                        <div className="flex items-center gap-1">
                            <div className="flex bg-white/40 p-1 rounded-lg">
                                <ToolbarButton isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} icon={List} />
                                <ToolbarButton isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={ListOrdered} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "Insert" && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                        <ActionButton onClick={addPageBreak} icon={FilePlus} label="Blank Page" />
                        <ActionButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()} icon={Table} label="Table" />

                        <div className="w-[1px] h-12 bg-slate-300 my-auto"></div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex flex-col h-16 w-16 gap-2 hover:bg-white/50">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                                        <ImageIcon size={20} />
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-600">Image</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={addImageDevice}>This Device...</DropdownMenuItem>
                                <DropdownMenuItem onClick={addImageOnline}>Online...</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex flex-col h-16 w-16 gap-2 hover:bg-white/50">
                                    <div className="p-2 bg-pink-100 text-pink-600 rounded-full">
                                        <Shapes size={20} />
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-600">Shapes</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64">
                                <div className="p-2">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => setIsShapeDialogOpen(true)}
                                    >
                                        More Shapes...
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <ActionButton onClick={() => setIsChartDialogOpen(true)} icon={PieChart} label="Chart" />
                        <ActionButton onClick={addLink} icon={LinkIcon} label="Link" />
                        <ActionButton onClick={() => editor.chain().focus().addComment?.().run()} icon={MessageSquare} label="Comment" />
                    </motion.div>
                )}

                {activeTab === "Layout" && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                        <ActionButton onClick={() => onMarginsChange?.({ top: 96, right: 96, bottom: 96, left: 96 })} icon={LayoutIcon} label="Normal" />
                        <ActionButton onClick={() => onMarginsChange?.({ top: 48, right: 48, bottom: 48, left: 48 })} icon={LayoutIcon} label="Narrow" />
                    </motion.div>
                )}

                {activeTab === "View" && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                        <Button variant="ghost" className="flex flex-col h-16 w-24 gap-2 hover:bg-white/50 group" onClick={onToggleImmersiveReader}>
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full group-hover:shadow-lg transition-all">
                                <BookOpen size={20} />
                            </div>
                            <span className="text-[10px] font-medium text-emerald-600">Immersive Reader</span>
                        </Button>
                    </motion.div>
                )}

                {activeTab === "AI Tools" && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                        <Button variant="ghost" className="flex flex-col h-16 w-24 gap-2 hover:bg-white/50 group" onClick={onToggleAiSidebar}>
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full group-hover:shadow-lg transition-all">
                                <Wand2 size={20} />
                            </div>
                            <span className="text-[10px] font-medium text-indigo-600">Media Studio</span>
                        </Button>
                    </motion.div>
                )}

                {activeTab === "Table Design" && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                        {/* Row Operations */}
                        <div className="flex flex-col gap-1 border-r border-slate-200/60 pr-4">
                            <span className="text-[10px] text-slate-500 mb-1">Rows</span>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs hover:bg-white/50"
                                    onClick={() => editor?.chain().focus().addRowBefore().run()}
                                >
                                    Insert Above
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs hover:bg-white/50"
                                    onClick={() => editor?.chain().focus().addRowAfter().run()}
                                >
                                    Insert Below
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs hover:bg-white/50 text-red-600"
                                    onClick={() => editor?.chain().focus().deleteRow().run()}
                                >
                                    Delete Row
                                </Button>
                            </div>
                        </div>

                        {/* Column Operations */}
                        <div className="flex flex-col gap-1 border-r border-slate-200/60 pr-4">
                            <span className="text-[10px] text-slate-500 mb-1">Columns</span>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs hover:bg-white/50"
                                    onClick={() => editor?.chain().focus().addColumnBefore().run()}
                                >
                                    Insert Left
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs hover:bg-white/50"
                                    onClick={() => editor?.chain().focus().addColumnAfter().run()}
                                >
                                    Insert Right
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs hover:bg-white/50 text-red-600"
                                    onClick={() => editor?.chain().focus().deleteColumn().run()}
                                >
                                    Delete Column
                                </Button>
                            </div>
                        </div>

                        {/* Cell Operations */}
                        <div className="flex flex-col gap-1 border-r border-slate-200/60 pr-4">
                            <span className="text-[10px] text-slate-500 mb-1">Cells</span>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs hover:bg-white/50"
                                    onClick={() => editor?.chain().focus().mergeCells().run()}
                                >
                                    Merge Cells
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs hover:bg-white/50"
                                    onClick={() => editor?.chain().focus().splitCell().run()}
                                >
                                    Split Cell
                                </Button>
                            </div>
                        </div>

                        {/* Table Operations */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-500 mb-1">Table</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs hover:bg-white/50 text-red-600"
                                onClick={() => editor?.chain().focus().deleteTable().run()}
                            >
                                Delete Table
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Chart Dialog */}
            <ChartDialog
                open={isChartDialogOpen}
                onOpenChange={setIsChartDialogOpen}
                onInsert={(type, data, title) => {
                    editor?.commands.insertContent({
                        type: 'chart',
                        attrs: { type, data, title }
                    });
                }}
            />

            {/* Shape Dialog */}
            <ShapeDialog
                open={isShapeDialogOpen}
                onOpenChange={setIsShapeDialogOpen}
                onInsert={(type, width, height, fillColor, borderColor, borderWidth) => {
                    editor?.commands.insertContent({
                        type: 'shape',
                        attrs: { type, width, height, fillColor, borderColor, borderWidth }
                    });
                }}
            />
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
                "h-8 w-8 p-0 hover:bg-white/60 text-slate-600 data-[active=true]:bg-indigo-100 data-[active=true]:text-indigo-600 rounded-md transition-all",
                className
            )}
            data-active={isActive}
        >
            <Icon size={18} />
        </Button>
    )
}

function ActionButton({ onClick, icon: Icon, label }: any) {
    return (
        <Button variant="ghost" className="flex flex-col h-16 w-16 gap-2 hover:bg-white/50" onClick={onClick}>
            <div className="p-2 bg-white border border-slate-200 rounded-full shadow-sm text-slate-700">
                <Icon size={20} />
            </div>
            <span className="text-[10px] font-medium text-slate-600">{label}</span>
        </Button>
    )
}
