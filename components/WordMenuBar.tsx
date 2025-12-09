"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { MessageSquare } from "lucide-react";
import {
  FileText, FolderOpen, Save, Download, Upload, Printer,
  Undo, Redo, Scissors, Copy, Clipboard, Search, Replace,
  ZoomIn, ZoomOut, Eye, Ruler, Columns, Image as ImageIcon,
  Table, Link as LinkIcon, Type, AlignLeft, Settings,
  HelpCircle, BookOpen, Users, Lock, Unlock, Share2
} from "lucide-react";

interface WordMenuBarProps {
  editor: any;
  onSave: () => void;
  onExport: (format: 'pdf' | 'docx' | 'html') => void;
  onPrint: () => void;
  onPageSetup: () => void;
  onFindReplace: () => void;
  onTableOfContents: () => void;
  saving: boolean;
}

export function WordMenuBar({
  editor,
  onSave,
  onExport,
  onPrint,
  onPageSetup,
  onFindReplace,
  onTableOfContents,
  onCoverPage,
  onBlankPage,
  onShapes,
  onCharts,
  onIcons,
  onHeaderFooter,
  onSymbol,
  onEquation,
  onDateTime,
  onTextBox,
  onWordArt,
  onDropCap,
  onSignatureLine,
  saving,
}: WordMenuBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b px-4 py-1 flex items-center gap-1 text-sm">
      {/* File Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            File
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <FileText className="h-4 w-4 mr-2" />
            New
            <span className="ml-auto text-xs text-gray-500">Ctrl+N</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderOpen className="h-4 w-4 mr-2" />
            Open
            <span className="ml-auto text-xs text-gray-500">Ctrl+O</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Save
            <span className="ml-auto text-xs text-gray-500">Ctrl+S</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Download className="h-4 w-4 mr-2" />
              Export
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('docx')}>
                Export as Word
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('html')}>
                Export as HTML
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={onPrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
            <span className="ml-auto text-xs text-gray-500">Ctrl+P</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onPageSetup}>
            <Settings className="h-4 w-4 mr-2" />
            Page Setup
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            Edit
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4 mr-2" />
            Undo
            <span className="ml-auto text-xs text-gray-500">Ctrl+Z</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4 mr-2" />
            Redo
            <span className="ml-auto text-xs text-gray-500">Ctrl+Y</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => document.execCommand('cut')}>
            <Scissors className="h-4 w-4 mr-2" />
            Cut
            <span className="ml-auto text-xs text-gray-500">Ctrl+X</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => document.execCommand('copy')}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
            <span className="ml-auto text-xs text-gray-500">Ctrl+C</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => document.execCommand('paste')}>
            <Clipboard className="h-4 w-4 mr-2" />
            Paste
            <span className="ml-auto text-xs text-gray-500">Ctrl+V</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onFindReplace}>
            <Search className="h-4 w-4 mr-2" />
            Find
            <span className="ml-auto text-xs text-gray-500">Ctrl+F</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onFindReplace}>
            <Replace className="h-4 w-4 mr-2" />
            Replace
            <span className="ml-auto text-xs text-gray-500">Ctrl+H</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Eye className="h-4 w-4 mr-2" />
            Read Mode
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Ruler className="h-4 w-4 mr-2" />
            Ruler
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Columns className="h-4 w-4 mr-2" />
            Gridlines
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Insert Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            Insert
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          {/* Pages */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FileText className="h-4 w-4 mr-2" />
              Pages
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={onCoverPage}>
                Cover Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onBlankPage}>
                Blank Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor?.chain().focus().setPageBreak().run()}>
                Page Break
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Tables */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Table className="h-4 w-4 mr-2" />
              Tables
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => {/* Table */}}>
                Table
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Illustrations */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ImageIcon className="h-4 w-4 mr-2" />
              Illustrations
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => {/* Pictures - handled by ImageUploadDialog */}}>
                Pictures
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShapes}>
                Shapes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCharts}>
                Charts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onIcons}>
                Icons
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Add-ins */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Settings className="h-4 w-4 mr-2" />
              Add-ins
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => {/* Get Add-ins */}}>
                Get Add-ins
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {/* Wikipedia */}}>
                Wikipedia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {/* Translator */}}>
                Translator
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Comments */}
          <DropdownMenuItem onClick={() => {/* Comment */}}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Comment
          </DropdownMenuItem>

          {/* Header & Footer */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FileText className="h-4 w-4 mr-2" />
              Header & Footer
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={onHeaderFooter}>
                Header
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onHeaderFooter}>
                Footer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onHeaderFooter}>
                Page Number
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Text */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Type className="h-4 w-4 mr-2" />
              Text
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={onTextBox}>
                Text Box
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {/* Quick Parts - placeholder */}}>
                Quick Parts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onWordArt}>
                WordArt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDropCap}>
                Drop Cap
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSignatureLine}>
                Signature Line
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDateTime}>
                Date & Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {/* Object - placeholder */}}>
                Object
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Symbols */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Type className="h-4 w-4 mr-2" />
              Symbols
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={onEquation}>
                Equation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSymbol}>
                Symbol
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {/* Hyperlink */}}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Hyperlink
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onTableOfContents}>
            <BookOpen className="h-4 w-4 mr-2" />
            Table of Contents
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Format Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            Format
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Type className="h-4 w-4 mr-2" />
            Font...
          </DropdownMenuItem>
          <DropdownMenuItem>
            <AlignLeft className="h-4 w-4 mr-2" />
            Paragraph...
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Bullets and Numbering...
          </DropdownMenuItem>
          <DropdownMenuItem>
            Borders and Shading...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tools Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            Tools
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            Spelling and Grammar
          </DropdownMenuItem>
          <DropdownMenuItem>
            Word Count
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Users className="h-4 w-4 mr-2" />
            Track Changes
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Lock className="h-4 w-4 mr-2" />
            Protect Document
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Help Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            Help
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </DropdownMenuItem>
          <DropdownMenuItem>
            About
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

