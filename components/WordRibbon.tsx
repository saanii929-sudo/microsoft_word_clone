"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Highlighter, Palette, Type, Table, Image as ImageIcon,
  Link as LinkIcon, Quote, Code, Minus, Plus,
  ChevronDown, ZoomIn, ZoomOut, MessageSquare
} from "lucide-react";
import { ColorPicker } from "./ColorPicker";
import { ImageUploadDialog } from "./ImageUploadDialog";

interface WordRibbonProps {
  editor: any;
  onImageUpload: (url: string) => void;
  onTableInsert: (rows: number, cols: number) => void;
  onPageBreak: () => void;
  onComment: () => void;
  onLink: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
}

const fontFamilies = [
  'Arial', 'Calibri', 'Cambria', 'Comic Sans MS', 'Courier New',
  'Georgia', 'Helvetica', 'Impact', 'Times New Roman', 'Trebuchet MS',
  'Verdana', 'Tahoma', 'Garamond', 'Palatino', 'Book Antiqua'
];

const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

export function WordRibbon({
  editor,
  onImageUpload,
  onTableInsert,
  onPageBreak,
  onComment,
  onLink,
  zoomLevel,
  onZoomChange,
}: WordRibbonProps) {
  if (!editor) return null;

  // Get current formatting attributes safely
  const textStyleAttrs = editor.getAttributes('textStyle') || {};
  const currentFont = textStyleAttrs.fontFamily || 'Calibri';
  const currentFontSize = textStyleAttrs.fontSize || '12';
  const currentColor = textStyleAttrs.color || '#000000';

  return (
    <div className="bg-white dark:bg-gray-800 border-b">
      {/* Clipboard Group */}
      <div className="px-4 py-2 flex items-center gap-2 border-b">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.execCommand('paste')}
            className="h-8"
          >
            <span className="text-xs">Paste</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.execCommand('cut')}
            className="h-8"
          >
            <span className="text-xs">Cut</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.execCommand('copy')}
            className="h-8"
          >
            <span className="text-xs">Copy</span>
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6" />

        {/* Font Group */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-32 justify-between">
                <span style={{ fontFamily: currentFont }} className="text-xs">
                  {currentFont}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-64 overflow-y-auto w-48">
              {fontFamilies.map((font) => (
                <DropdownMenuItem
                  key={font}
                  onClick={() => editor.chain().focus().setFontFamily(font).run()}
                  style={{ fontFamily: font }}
                >
                  {font}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-16 justify-between">
                <span className="text-xs">{currentFontSize}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {fontSizes.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => editor.chain().focus().setFontSize(size).run()}
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-0.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-blue-100' : ''}`}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-blue-100' : ''}`}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-blue-100' : ''}`}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('strike') ? 'bg-blue-100' : ''}`}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('subscript') ? 'bg-blue-100' : ''}`}
            >
              <SubscriptIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('superscript') ? 'bg-blue-100' : ''}`}
            >
              <SuperscriptIcon className="h-4 w-4" />
            </Button>
          </div>

          <ColorPicker
            currentColor={currentColor}
            onColorChange={(color) => editor.chain().focus().setColor(color).run()}
            type="text"
          />

          <ColorPicker
            currentColor="#FFFF00"
            onColorChange={(color) => editor.chain().focus().setHighlight({ color }).run()}
            type="highlight"
          />
        </div>
        <Separator orientation="vertical" className="h-6" />

        {/* Paragraph Group */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100' : ''}`}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100' : ''}`}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100' : ''}`}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100' : ''}`}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-blue-100' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-blue-100' : ''}`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const { from, to } = editor.state.selection;
              const selectedNodes: any[] = [];
              editor.state.doc.nodesBetween(from, to, (node, pos) => {
                if (node.type.name === 'paragraph' || node.type.name.startsWith('heading')) {
                  selectedNodes.push({ node, pos });
                }
              });
              
              if (selectedNodes.length > 0) {
                const tr = editor.state.tr;
                selectedNodes.forEach(({ node, pos }) => {
                  const currentIndent = node.attrs.indent || 0;
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    indent: currentIndent + 40,
                  });
                });
                editor.view.dispatch(tr);
              }
            }}
            className="h-8 w-8 p-0"
          >
            <Indent className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const { from, to } = editor.state.selection;
              const selectedNodes: any[] = [];
              editor.state.doc.nodesBetween(from, to, (node, pos) => {
                if (node.type.name === 'paragraph' || node.type.name.startsWith('heading')) {
                  selectedNodes.push({ node, pos });
                }
              });
              
              if (selectedNodes.length > 0) {
                const tr = editor.state.tr;
                selectedNodes.forEach(({ node, pos }) => {
                  const currentIndent = node.attrs.indent || 0;
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    indent: Math.max(0, currentIndent - 40),
                  });
                });
                editor.view.dispatch(tr);
              }
            }}
            className="h-8 w-8 p-0"
          >
            <Outdent className="h-4 w-4" />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6" />

        {/* Insert Group */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Table className="h-4 w-4 mr-1" />
                <span className="text-xs">Table</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="p-2">
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 25 }).map((_, i) => {
                    const rows = Math.floor(i / 5) + 1;
                    const cols = (i % 5) + 1;
                    return (
                      <button
                        key={i}
                        className="w-6 h-6 border hover:bg-blue-100"
                        onClick={() => onTableInsert(rows, cols)}
                        title={`${rows}x${cols}`}
                      />
                    );
                  })}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <ImageUploadDialog
            onImageInsert={onImageUpload}
            userId="current-user"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8"
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              <span className="text-xs">Image</span>
            </Button>
          </ImageUploadDialog>

          <Button
            variant="outline"
            size="sm"
            onClick={onLink}
            className="h-8"
          >
            <LinkIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">Link</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onPageBreak}
            className="h-8"
          >
            <Minus className="h-4 w-4 mr-1" />
            <span className="text-xs">Page Break</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onComment}
            className="h-8"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-xs">Comment</span>
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.max(50, zoomLevel - 10))}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={zoomLevel}
            onChange={(e) => onZoomChange(parseInt(e.target.value) || 100)}
            className="h-8 w-16 text-center text-xs"
            min={50}
            max={200}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.min(200, zoomLevel + 10))}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

