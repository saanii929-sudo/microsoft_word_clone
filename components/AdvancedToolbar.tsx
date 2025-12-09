// components/AdvancedToolbar.tsx
import { useState, useRef } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough,
  Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Superscript, Subscript, Table, Image, Link, List, ListOrdered,
  Quote, Code, Paintbrush, ChartBar, Smile, Type, Palette,
  ChevronDown, Download, Upload, FileText, Save, FolderOpen,
  Undo, Redo, Scissors, Copy, Clipboard, Search, Replace,
  Columns, Ruler, Eye, ZoomIn, ZoomOut, Minus, Plus,
  MoreHorizontal, Settings, HelpCircle, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AdvancedToolbarProps {
  editor: any;
  onImageUpload: () => void;
  onChartInsert: () => void;
  onEmojiPicker: () => void;
  onTableEditor: () => void;
  onSave: () => void;
  onExport: (format: 'pdf' | 'docx' | 'html') => void;
  onPrint: () => void;
  wordCount: number;
  characterCount: number;
  pageCount: number;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
}

export function AdvancedToolbar({ 
  editor, 
  onImageUpload, 
  onChartInsert, 
  onEmojiPicker, 
  onTableEditor,
  onSave,
  onExport,
  onPrint,
  wordCount,
  characterCount,
  pageCount,
  zoomLevel,
  onZoomChange
}: AdvancedToolbarProps) {
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showFontDialog, setShowFontDialog] = useState(false);
  const [showParagraphDialog, setShowParagraphDialog] = useState(false);
  const [currentFont, setCurrentFont] = useState('Arial');
  const [currentFontSize, setCurrentFontSize] = useState('12');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  // Fixed: Unique font families with no duplicates
  const fontFamilies = [
    { name: 'Arial', category: 'Sans-serif' },
    { name: 'Helvetica', category: 'Sans-serif' },
    { name: 'Times New Roman', category: 'Serif' },
    { name: 'Georgia', category: 'Serif' },
    { name: 'Courier New', category: 'Monospace' },
    { name: 'Verdana', category: 'Sans-serif' },
    { name: 'Trebuchet MS', category: 'Sans-serif' },
    { name: 'Impact', category: 'Sans-serif' },
    { name: 'Comic Sans MS', category: 'Casual' },
    { name: 'Calibri', category: 'Sans-serif' },
    { name: 'Cambria', category: 'Serif' },
    { name: 'Tahoma', category: 'Sans-serif' },
    { name: 'Garamond', category: 'Serif' },
    { name: 'Palatino', category: 'Serif' },
    { name: 'Book Antiqua', category: 'Serif' }
  ];

  // Group fonts by category for better organization
  const fontsByCategory = fontFamilies.reduce((acc, font) => {
    if (!acc[font.category]) {
      acc[font.category] = [];
    }
    acc[font.category].push(font);
    return acc;
  }, {} as Record<string, typeof fontFamilies>);

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36'];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFFFFF', '#808080', '#FFA500'
  ];

  const highlightColors = [
    '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500',
    '#FFC0CB', '#ADD8E6', '#90EE90', '#FFB6C1', '#D3D3D3'
  ];

  const pageSizes = ['A4', 'Letter', 'Legal', 'A3', 'A5'];
  const pageOrientations = ['Portrait', 'Landscape'];
  const zoomLevels = [50, 75, 100, 125, 150, 200];

  // Font and Text Management
  const setFontFamily = (font: string) => {
    setCurrentFont(font);
    editor.chain().focus().setFontFamily(font).run();
  };

  const setFontSize = (size: string) => {
    setCurrentFontSize(size);
    editor.chain().focus().setFontSize(size + 'px').run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setHighlightColor = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  // Find and Replace functionality
  const handleFind = () => {
    if (!findText) return;
    // Implementation would depend on your editor's find capabilities
    console.log('Find:', findText);
  };

  const handleReplace = () => {
    if (!findText) return;
    // Implementation would depend on your editor's replace capabilities
    console.log('Replace:', findText, 'with', replaceText);
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    // Implementation for replace all
    console.log('Replace all:', findText, 'with', replaceText);
  };

  // Page setup
  const setPageSize = (size: string) => {
    console.log('Set page size to:', size);
  };

  const setPageOrientation = (orientation: string) => {
    console.log('Set page orientation to:', orientation);
  };

  const insertPageBreak = () => {
    editor.chain().focus().setHardBreak().run();
  };

  return (
    <TooltipProvider>
      <div className="bg-white border-b shadow-sm">
        {/* Main Menu Bar */}
        <div className="flex items-center justify-between px-4 py-1 bg-gray-50 border-b">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="font-semibold">
                  File
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  New Document
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Download className="h-4 w-4 mr-2" />
                    Export As
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => onExport('pdf')}>PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport('docx')}>Word Document</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport('html')}>HTML</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={onPrint}>
                  <span className="mr-2">🖨️</span>
                  Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem 
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo className="h-4 w-4 mr-2" />
                  Undo
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo className="h-4 w-4 mr-2" />
                  Redo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => document.execCommand('cut')}>
                  <Scissors className="h-4 w-4 mr-2" />
                  Cut
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => document.execCommand('copy')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => document.execCommand('paste')}>
                  <Clipboard className="h-4 w-4 mr-2" />
                  Paste
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowFindReplace(true)}>
                  <Search className="h-4 w-4 mr-2" />
                  Find and Replace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearFormatting}>
                  <Paintbrush className="h-4 w-4 mr-2" />
                  Clear Formatting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ZoomIn className="h-4 w-4 mr-2" />
                    Zoom
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {zoomLevels.map(zoom => (
                      <DropdownMenuItem 
                        key={zoom} 
                        onClick={() => onZoomChange(zoom)}
                      >
                        {zoom}%
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Ruler className="h-4 w-4 mr-2" />
                  Ruler
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Full Screen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm">
              Insert
            </Button>
            <Button variant="ghost" size="sm">
              Format
            </Button>
            <Button variant="ghost" size="sm">
              Tools
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Words: {wordCount}</span>
              <span>Characters: {characterCount}</span>
              <span>Pages: {pageCount}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {zoomLevel}%
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {zoomLevels.map(zoom => (
                  <DropdownMenuItem 
                    key={zoom} 
                    onClick={() => onZoomChange(zoom)}
                  >
                    {zoom}%
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Font Controls */}
            <div className="flex items-center gap-1 border-r pr-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-32 justify-between">
                    <span className="truncate" style={{ fontFamily: currentFont }}>
                      {currentFont}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-64 overflow-y-auto w-48">
                  {Object.entries(fontsByCategory).map(([category, fonts]) => (
                    <div key={category}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                        {category}
                      </div>
                      {fonts.map(font => (
                        <DropdownMenuItem
                          key={font.name}
                          onClick={() => setFontFamily(font.name)}
                          style={{ fontFamily: font.name }}
                          className="text-sm"
                        >
                          {font.name}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-16 justify-between">
                    {currentFontSize}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {fontSizes.map(size => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => setFontSize(size)}
                    >
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={editor.isActive('bold') ? 'bg-blue-100 border-blue-300' : ''}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={editor.isActive('italic') ? 'bg-blue-100 border-blue-300' : ''}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleUnderline().run()}
                      className={editor.isActive('underline') ? 'bg-blue-100 border-blue-300' : ''}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline (Ctrl+U)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                      className={editor.isActive('strike') ? 'bg-blue-100 border-blue-300' : ''}
                    >
                      <Strikethrough className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Strikethrough</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Text Color & Highlight */}
            <div className="flex items-center gap-1 border-r pr-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Palette className="h-4 w-4" />
                        <div className="w-3 h-1 bg-red-500 ml-1" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Text Color</TooltipContent>
                  </Tooltip>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <div className="p-2">
                    <div className="grid grid-cols-5 gap-2">
                      {colors.map(color => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                          onClick={() => setTextColor(color)}
                        />
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => setTextColor('#000000')}
                    >
                      Automatic
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Highlighter className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Text Highlight Color</TooltipContent>
                  </Tooltip>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <div className="p-2">
                    <div className="grid grid-cols-5 gap-2">
                      {highlightColors.map(color => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                          onClick={() => setHighlightColor(color)}
                        />
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => editor.chain().focus().unsetHighlight().run()}
                    >
                      No Color
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 border-blue-300' : ''}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Left</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 border-blue-300' : ''}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 border-blue-300' : ''}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 border-blue-300' : ''}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Justify</TooltipContent>
              </Tooltip>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-blue-100 border-blue-300' : ''}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-blue-100 border-blue-300' : ''}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>
            </div>

            {/* Insert Tools */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onTableEditor}
                  >
                    <Table className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Table</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onImageUpload}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Image</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onChartInsert}
                  >
                    <ChartBar className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Chart</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEmojiPicker}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Emoji</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-blue-100 border-blue-300' : ''}
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Quote</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'bg-blue-100 border-blue-300' : ''}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Code Block</TooltipContent>
              </Tooltip>
            </div>

            {/* Advanced Formatting */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    className={editor.isActive('superscript') ? 'bg-blue-100 border-blue-300' : ''}
                  >
                    <Superscript className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Superscript</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    className={editor.isActive('subscript') ? 'bg-blue-100 border-blue-300' : ''}
                  >
                    <Subscript className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Subscript</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFormatting}
                  >
                    <Paintbrush className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear Formatting</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Find and Replace Dialog */}
        <Dialog open={showFindReplace} onOpenChange={setShowFindReplace}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Find and Replace</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="find">Find what:</Label>
                <Input
                  id="find"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="Enter text to find..."
                />
              </div>
              <div>
                <Label htmlFor="replace">Replace with:</Label>
                <Input
                  id="replace"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Enter replacement text..."
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button onClick={handleFind} disabled={!findText}>
                  Find Next
                </Button>
                <Button onClick={handleReplace} disabled={!findText}>
                  Replace
                </Button>
                <Button onClick={handleReplaceAll} disabled={!findText}>
                  Replace All
                </Button>
              </div>
              <Button variant="outline" onClick={() => setShowFindReplace(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}