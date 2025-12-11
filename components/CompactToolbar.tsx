"use client";

import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, ChevronDown, Image as ImageIcon, Table as TableIcon, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import { ChartDialog } from './WordFeatures/ChartDialog';
import { ShapeDialog } from './WordFeatures/ShapeDialog';
import { VoiceToText } from './VoiceToText';

interface CompactToolbarProps {
    editor: any;
}

const STYLES = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Title', 'Subtitle'];
const FONTS = ['Arial', 'Times New Roman', 'Calibri', 'Georgia', 'Verdana'];

export function CompactToolbar({ editor }: CompactToolbarProps) {
    const [isChartDialogOpen, setIsChartDialogOpen] = useState(false);
    const [isShapeDialogOpen, setIsShapeDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!editor) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                // Try to use ResizableImage first, fallback to regular Image
                if (editor.commands.setResizableImage) {
                    editor.chain().focus().setResizableImage({ src: url }).run();
                } else {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    return (
        <>
            <div className="h-12 bg-[#1a1a1a] border-b border-white/10 flex items-center px-4 gap-2">
                {/* Style Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-[#2a2a2a] border-white/10 text-white hover:bg-white/5 min-w-[100px] justify-between"
                        >
                            Normal <ChevronDown size={14} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#2a2a2a] border-white/10">
                        {STYLES.map((style) => (
                            <DropdownMenuItem
                                key={style}
                                className="text-white hover:bg-white/10"
                                onClick={() => {
                                    if (style === 'Normal') {
                                        editor.chain().focus().setParagraph().run();
                                    } else if (style === 'Heading 1') {
                                        editor.chain().focus().toggleHeading({ level: 1 }).run();
                                    } else if (style === 'Heading 2') {
                                        editor.chain().focus().toggleHeading({ level: 2 }).run();
                                    } else if (style === 'Heading 3') {
                                        editor.chain().focus().toggleHeading({ level: 3 }).run();
                                    }
                                }}
                            >
                                {style}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Font Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-[#2a2a2a] border-white/10 text-white hover:bg-white/5 min-w-[120px] justify-between"
                        >
                            Default <ChevronDown size={14} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#2a2a2a] border-white/10">
                        {FONTS.map((font) => (
                            <DropdownMenuItem
                                key={font}
                                className="text-white hover:bg-white/10"
                                onClick={() => editor.chain().focus().setFontFamily(font).run()}
                            >
                                {font}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Formatting Buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn(
                            "h-8 w-8 p-0 hover:bg-white/10",
                            editor.isActive('bold') ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400"
                        )}
                    >
                        <Bold size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn(
                            "h-8 w-8 p-0 hover:bg-white/10",
                            editor.isActive('italic') ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400"
                        )}
                    >
                        <Italic size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={cn(
                            "h-8 w-8 p-0 hover:bg-white/10",
                            editor.isActive('underline') ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400"
                        )}
                    >
                        <Underline size={16} />
                    </Button>
                </div>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Alignment Buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={cn(
                            "h-8 w-8 p-0 hover:bg-white/10",
                            editor.isActive({ textAlign: 'left' }) ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400"
                        )}
                    >
                        <AlignLeft size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={cn(
                            "h-8 w-8 p-0 hover:bg-white/10",
                            editor.isActive({ textAlign: 'center' }) ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400"
                        )}
                    >
                        <AlignCenter size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={cn(
                            "h-8 w-8 p-0 hover:bg-white/10",
                            editor.isActive({ textAlign: 'right' }) ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400"
                        )}
                    >
                        <AlignRight size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={cn(
                            "h-8 w-8 p-0 hover:bg-white/10",
                            editor.isActive({ textAlign: 'justify' }) ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400"
                        )}
                    >
                        <AlignJustify size={16} />
                    </Button>
                </div>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* List Buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={cn(
                            "h-8 w-8 p-0 hover:bg-white/10",
                            editor.isActive('bulletList') ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400"
                        )}
                    >
                        <List size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={cn(
                            "h-8 w-8 p-0 hover:bg-white/10",
                            editor.isActive('orderedList') ? "bg-[#00d4ff]/20 text-[#00d4ff]" : "text-gray-400"
                        )}
                    >
                        <ListOrdered size={16} />
                    </Button>
                </div>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Insert Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-[#2a2a2a] border-white/10 text-white hover:bg-white/5"
                        >
                            Insert <ChevronDown size={14} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#2a2a2a] border-white/10">
                        <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImageIcon size={16} className="mr-2" />
                            Image
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={insertTable}
                        >
                            <TableIcon size={16} className="mr-2" />
                            Table
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={() => setIsChartDialogOpen(true)}
                        >
                            Chart
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={() => setIsShapeDialogOpen(true)}
                        >
                            Shape
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Voice to Text Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-[#2a2a2a] border-white/10 text-white hover:bg-white/5"
                            title="Voice to Text"
                        >
                            <Mic size={16} className="mr-1" />
                            Voice
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#2a2a2a] border-white/10 text-white max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-white">Voice to Text</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Record your voice and it will be transcribed into the editor
                            </DialogDescription>
                        </DialogHeader>
                        <VoiceToText editor={editor} />
                    </DialogContent>
                </Dialog>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
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
        </>
    );
}

