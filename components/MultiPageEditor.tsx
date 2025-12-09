"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import Focus from "@tiptap/extension-focus";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import Paragraph from "@tiptap/extension-paragraph";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table,
  Image as ImageIcon,
  Link as LinkIcon,
  Palette,
  Highlighter,
  Type,
  Strikethrough,
  Quote,
  Undo,
  Redo,
  Code,
  Eye,
  Download,
  Upload,
  Columns,
  Shapes,
  BarChart3,
  Film,
  Save,
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  Settings,
  HelpCircle,
  User,
  Layout,
  PaintBucket,
  MousePointer,
  RotateCcw,
  RotateCw,
  Minus,
  Square,
  Circle,
  Triangle,
  LineChart,
  PieChart,
  Smile,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Zap,
  Globe,
  Moon,
  Sun,
  Laptop,
  Smartphone,
  Tablet,
  File,
  FolderOpen,
  Printer,
  Scissors,
  Copy,
  Clipboard,
  Paintbrush,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Indent,
  Outdent,
  WrapText,
  Columns as ColumnsIcon,
  Ruler,
  SpellCheck2,
  BookOpen,
  Languages,
  Mic,
  Bookmark,
  Footprints,
  FileSearch,
  Shield,
  Lock,
  Unlock,
  Users,
  Share,
  Mail as ShareMail,
  MessageCircle,
  Cloud,
  CloudUpload,
  CloudDownload,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Volume2,
  VolumeX,
  Play,
  Pause,
  StopCircle,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Music,
  Video,
  Camera,
  MicOff,
  Headphones,
  Radio,
  Tv,
  Monitor,
  Server,
  Database,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Bluetooth,
  Usb,
  Power,
  Settings2,
  Sliders,
  ToggleLeft,
  ToggleRight,
  CheckSquare,
  Square as BlankSquare,
  CheckCircle,
  Circle as BlankCircle,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Trash2,
  Archive,
  Inbox,
  Send,
  Reply,
  Forward,
  MailOpen,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle2,
  Clock4,
  CalendarDays,
  Map,
  Navigation,
  Compass,
  Car,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Activity,
  Thermometer,
  Droplets,
  Sun as WeatherSun,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  Wind,
  EyeOff,
  Key,
  QrCode,
  Scan,
  Fingerprint,
  UserCheck,
  UserPlus,
  UserMinus,
  Users2,
  UserX,
  Voicemail,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneOff,
  VideoOff,
  MessageSquare,
  MessageSquareText,
  MessageCircleDashed,
  Mailbox,
  Bell,
  BellOff,
  BellRing,
  Megaphone,
  Speaker,
  Volume1,
  FileCode,
  RefreshCw,
  GitCompare,
  GitMerge,
  ArrowLeft,
  ArrowRight,
  Edit,
  Expand,
  Group,
  Layers,
  Link2,
  Move,
  Omega,
  PenTool,
  Puzzle,
  Replace,
  Sigma,
  Target,
  Subscript,
  Superscript,
} from "lucide-react";
import { Superscript as SuperscriptExtension } from "@tiptap/extension-superscript";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Paperclip } from "iconsax-react";
import SuperScriptIcon from "./custom/SuperScriptIcon";
import { Subscript as SubscriptExtension } from "@tiptap/extension-subscript";
import CustomIcon from "./custom/SuperScriptIcon";
import { ShapeNode } from "./extensions/ShapeNode";

// Custom extensions for enhanced functionality
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element: { style: { fontSize: any } }) =>
          element.style.fontSize,
        renderHTML: (attributes: { fontSize: any }) => {
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
});

const LineHeight = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      lineHeight: {
        default: null,
        parseHTML: (element) => element.style.lineHeight,
        renderHTML: (attributes) => {
          if (!attributes.lineHeight) {
            return {};
          }
          return {
            style: `line-height: ${attributes.lineHeight}`,
          };
        },
      },
    };
  },
});

// Types
interface InitialPageContent {
  id: number;
  type: string;
  title: string;
  body: string;
}

interface Card {
  id: number;
  type: string;
  content: {
    title: string;
    body: string;
  };
}

interface EditableContainerProps {
  pageNum: number;
  totalPages: number;
  title: string;
  onAdd: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

interface TipTapEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
}

function WordRibbon({
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
  onZoomChange,
  onSpellCheck,
  onThesaurus,
  onWordCount,
  onInsertSymbol,
  onInsertEquation,
  onInsertComment,
  onTrackChanges,
  onProtectDocument,
  onMailMerge,
  onBibliography,
  onTableOfContents,
}: any) {
  const [activeTab, setActiveTab] = useState("home");
  const { theme, setTheme } = useTheme();
  const [isFindOpen, setFindOpen] = useState(false);
  const [isReplaceOpen, setReplaceOpen] = useState(false);

  const [showTableGrid, setShowTableGrid] = useState(false);
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
  const [showTableTools, setShowTableTools] = useState(false);
  const [tableStyle, setTableStyle] = useState("standard");
  const [showShapes, setShowShapes] = useState(false);
  const tableStyles = [
    { name: "Plain Table", value: "plain" },
    { name: "Grid Table", value: "grid" },
    { name: "List Table", value: "list" },
    { name: "Elegant", value: "elegant" },
    { name: "Modern", value: "modern" },
  ];

  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  const fontSizes = [
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "16",
    "18",
    "20",
    "24",
    "28",
    "32",
    "36",
    "42",
    "48",
    "54",
    "60",
    "66",
    "72",
  ];
  const fontFamilies = [
    "Arial",
    "Calibri",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Segoe UI",
    "Tahoma",
    "Courier New",
    "Comic Sans MS",
    "Impact",
    "Garamond",
    "Palatino Linotype",
    "Book Antiqua",
    "Brush Script MT",
    "Lucida Console",
    "Monaco",
    "Arial Unicode MS",
    "Segoe UI Emoji",
  ];
  const lineHeights = ["1.0", "1.15", "1.5", "2.0", "2.5", "3.0"];
  const headingStyles = [
    "Normal",
    "Heading 1",
    "Heading 2",
    "Heading 3",
    "Title",
    "Subtitle",
  ];

  const insertBlankPage = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `
      <hr data-page-break="true" class="page-break" />
      <section style="min-height: 800px;"></section>
    `
      )
      .run();
  };

  const insertCoverPage = () => {
    editor
      .chain()
      .focus()
      .insertContentAt(
        0,
        `
      <section class="cover-page" style="text-align:center; padding:120px 0;">
        <h1 style="font-size:48px; margin-bottom:20px;">Document Title</h1>
        <h3 style="font-size:20px; color:#666;">Subtitle or Tagline</h3>
        <p style="margin-top:40px;">Author Name</p>
        <p>${new Date().toLocaleDateString()}</p>
      </section>
      <hr data-page-break="true" class="page-break" />
    `
      )
      .run();
  };

  const WORD_SHAPES = [
    { type: "rectangle", label: "Rectangle" },
    { type: "roundedRectangle", label: "Rounded Rectangle" },
    { type: "circle", label: "Circle" },
    { type: "triangle", label: "Triangle" },
    { type: "rightTriangle", label: "Right Triangle" },
    { type: "diamond", label: "Diamond" },
    { type: "parallelogram", label: "Parallelogram" },
    { type: "trapezoid", label: "Trapezoid" },
    { type: "hexagon", label: "Hexagon" },
    { type: "octagon", label: "Octagon" },
    { type: "star", label: "Star" },
    { type: "heart", label: "Heart" },
    { type: "rightArrow", label: "Right Arrow" },
    { type: "leftArrow", label: "Left Arrow" },
    { type: "upArrow", label: "Up Arrow" },
    { type: "downArrow", label: "Down Arrow" },
    { type: "cloud", label: "Cloud" },
  ];

  const insertShape = (type: string) => {
    editor
      .chain()
      .focus()
      .insertContent({ type: "shape", attrs: { type } })
      .run();

    setShowShapes(false);
  };


  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-900/80 border-b backdrop-blur-lg supports-backdrop-blur:bg-white/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isFindOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded shadow-xl w-80">
            <h3 className="font-medium mb-2">Find</h3>

            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Search text…"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
            />

            <div className="flex justify-end mt-3 gap-2">
              <Button variant="outline" onClick={() => setFindOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  const content = editor?.getText() ?? "";
                  const found = content.includes(findText);
                  alert(found ? "Match found" : "No match found");
                }}
              >
                Find
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTableGrid && (
        <div
          className="absolute  z-50 p-3 bg-white dark:bg-gray-800 shadow-xl rounded-lg border"
          style={{ top: 140, left: 220 }} // adjust to match your layout
        >
          <div className="mb-2 text-xs text-gray-600 dark:text-gray-300">
            {gridSize.rows} × {gridSize.cols} Table
          </div>

          <div className="grid grid-cols-10 gap-1">
            {[...Array(10)].map((_, row) =>
              [...Array(10)].map((_, col) => {
                const isSelected = row < gridSize.rows && col < gridSize.cols;

                return (
                  <div
                    key={`${row}-${col}`}
                    onMouseEnter={() =>
                      setGridSize({ rows: row + 1, cols: col + 1 })
                    }
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .insertTable({
                          rows: gridSize.rows,
                          cols: gridSize.cols,
                          withHeaderRow: true,
                        })
                        .run();
                      setShowTableGrid(false);
                    }}
                    className={`h-5 w-5 border rounded ${
                      isSelected
                        ? "bg-blue-500 border-blue-600"
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300"
                    }`}
                  />
                );
              })
            )}
          </div>
        </div>
      )}

      {isReplaceOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded shadow-xl w-80">
            <h3 className="font-medium mb-2">Replace</h3>

            <input
              className="w-full border rounded px-2 py-1 mb-2"
              placeholder="Find…"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
            />

            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Replace with…"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
            />

            <div className="flex justify-end mt-3 gap-2">
              <Button variant="outline" onClick={() => setReplaceOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  const html = editor?.getHTML() ?? "";
                  const newHTML = html.replaceAll(findText, replaceText);
                  editor?.commands.setContent(newHTML);
                }}
              >
                Replace All
              </Button>
            </div>
          </div>
        </div>
      )}

      {showShapes && (
  <div className="absolute z-50 bg-white dark:bg-gray-800 border shadow-md p-4 rounded-lg grid grid-cols-3 gap-3">
    {WORD_SHAPES.map((shape) => (
      <button
        key={shape.type}
        className="p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200"
        onClick={() => {
          editor.chain().focus().insertContent({ type: "shape", attrs: { type: shape.type } }).run();
          setShowShapes(false); // close after insert
        }}
      >
        {shape.label}
      </button>
    ))}
  </div>
      )}



      {/* Ribbon Tabs */}
      <div className="flex border-b dark:border-gray-700">
        {[
          "home",
          "insert",
          "draw",
          "design",
          "layout",
          "references",
          "review",
          "view",
          "developer",
        ].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 text-sm font-medium capitalize transition-all duration-200 ${
              activeTab === tab
                ? "bg-white dark:bg-gray-800 border-x border-t border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Ribbon Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {activeTab === "home" && (
            <div className="flex flex-wrap gap-6">
              {/* Clipboard Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Clipboard
                </div>
                <div className="flex gap-1">
                  {[
                    {
                      name: "Paste",
                      icon: Clipboard,
                      action: () =>
                        navigator.clipboard
                          .readText()
                          .then((text) => editor.commands.insertContent(text)),
                    },
                    {
                      name: "Cut",
                      icon: Scissors,
                      action: () => document.execCommand("cut"),
                    },
                    {
                      name: "Copy",
                      icon: Copy,
                      action: () => document.execCommand("copy"),
                    },
                    {
                      name: "Format Painter",
                      icon: Paintbrush,
                      action: () => {},
                    },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Font Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Font
                </div>
                <div className="flex gap-2 items-center">
                  <Select
                    onValueChange={(value) =>
                      editor.chain().focus().setFontFamily(value).run()
                    }
                  >
                    <SelectTrigger className="w-32 h-9 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Calibri" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem
                          key={font}
                          value={font}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(value) =>
                      editor
                        .chain()
                        .focus()
                        .setFontSize(value + "px")
                        .run()
                    }
                  >
                    <SelectTrigger className="w-20 h-9 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="11" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-1">
                    {[
                      {
                        icon: Bold,
                        action: () => editor.chain().focus().toggleBold().run(),
                        active: "bold",
                      },
                      {
                        icon: Italic,
                        action: () =>
                          editor.chain().focus().toggleItalic().run(),
                        active: "italic",
                      },
                      {
                        icon: UnderlineIcon,
                        action: () =>
                          editor.chain().focus().toggleUnderline().run(),
                        active: "underline",
                      },
                      {
                        icon: Strikethrough,
                        action: () =>
                          editor.chain().focus().toggleStrike().run(),
                        active: "strike",
                      },
                      {
                        icon: Subscript,
                        action: () =>
                          editor.chain().focus().toggleSubscript().run(),
                        active: "subscript",
                      },
                      {
                        icon: Superscript,
                        action: () =>
                          editor.chain().focus().toggleSuperscript().run(),
                        active: "superscript",
                      },
                    ].map(({ icon: Icon, action, active }, index) => (
                      <motion.div
                        key={active}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={action}
                          className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${
                            editor?.isActive(active)
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                              : ""
                          }`}
                        >
                          <Icon size={16} />
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Palette size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <div className="grid grid-cols-4 gap-2 p-2">
                        {[
                          "#000000",
                          "#FF0000",
                          "#00FF00",
                          "#0000FF",
                          "#FFFF00",
                          "#FF00FF",
                          "#00FFFF",
                          "#FFA500",
                          "#800080",
                          "#008000",
                          "#800000",
                          "#008080",
                        ].map((color) => (
                          <Button
                            key={color}
                            variant="ghost"
                            size="sm"
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              editor.chain().focus().setColor(color).run()
                            }
                          />
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Highlighter size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <div className="grid grid-cols-4 gap-2 p-2">
                        {[
                          "#FFFF00",
                          "#00FF00",
                          "#00FFFF",
                          "#FF00FF",
                          "#FFA500",
                          "#FFC0CB",
                          "#ADD8E6",
                          "#90EE90",
                        ].map((color) => (
                          <Button
                            key={color}
                            variant="ghost"
                            size="sm"
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              editor
                                .chain()
                                .focus()
                                .toggleHighlight({ color })
                                .run()
                            }
                          />
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>

              {/* Paragraph Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Paragraph
                </div>
                <div className="flex gap-1">
                  {[
                    {
                      icon: List,
                      action: () =>
                        editor.chain().focus().toggleBulletList().run(),
                      active: "bulletList",
                    },
                    {
                      icon: ListOrdered,
                      action: () =>
                        editor.chain().focus().toggleOrderedList().run(),
                      active: "orderedList",
                    },
                    {
                      name: "Indent",
                      icon: Indent,
                      action: () =>
                        editor.chain().focus().sinkListItem("listItem").run(),
                    },
                    {
                      name: "Outdent",
                      icon: Outdent,
                      action: () =>
                        editor.chain().focus().liftListItem("listItem").run(),
                    },
                    {
                      icon: AlignLeft,
                      action: () =>
                        editor.chain().focus().setTextAlign("left").run(),
                      active: { textAlign: "left" },
                    },
                    {
                      icon: AlignCenter,
                      action: () =>
                        editor.chain().focus().setTextAlign("center").run(),
                      active: { textAlign: "center" },
                    },
                    {
                      icon: AlignRight,
                      action: () =>
                        editor.chain().focus().setTextAlign("right").run(),
                      active: { textAlign: "right" },
                    },
                    {
                      icon: AlignJustify,
                      action: () =>
                        editor.chain().focus().setTextAlign("justify").run(),
                      active: { textAlign: "justify" },
                    },
                  ].map(({ icon: Icon, action, active }, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          editor?.isActive(active)
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                            : ""
                        }`}
                      >
                        <Icon size={16} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Styles Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Styles
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    {
                      name: "Normal",
                      action: () => editor.chain().focus().setParagraph().run(),
                    },
                    {
                      name: "Heading 1",
                      action: () =>
                        editor
                          .chain()
                          .focus()
                          .toggleHeading({ level: 1 })
                          .run(),
                    },
                    {
                      name: "Heading 2",
                      action: () =>
                        editor
                          .chain()
                          .focus()
                          .toggleHeading({ level: 2 })
                          .run(),
                    },
                    {
                      name: "Title",
                      action: () =>
                        editor
                          .chain()
                          .focus()
                          .toggleHeading({ level: 1 })
                          .run(),
                    },
                    {
                      name: "Quote",
                      action: () =>
                        editor.chain().focus().toggleBlockquote().run(),
                    },
                  ].map(({ name, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {name}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Editing Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Editing
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    {
                      name: "Find",
                      icon: Search,
                      action: () => setFindOpen(true),
                    },
                    {
                      name: "Replace",
                      icon: Replace,
                      action: () => setReplaceOpen(true),
                    },
                    {
                      name: "Select",
                      icon: MousePointer,
                      action: () => editor?.chain().focus().selectAll().run(),
                    },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "insert" && (
            <div className="flex flex-wrap gap-6">
              {/* Pages Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Pages
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      name: "Cover Page",
                      icon: File,
                      action: () => {
                        insertCoverPage();
                      },
                    },
                    {
                      name: "Blank Page",
                      icon: Plus,
                      action: () => {
                        insertBlankPage();
                      },
                    },
                    {
                      name: "Page Break",
                      icon: Minus,
                      action: () => editor.chain().focus().setHardBreak().run(),
                    },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tables Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Tables
                </div>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTableGrid(!showTableGrid)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                    >
                      <Table size={16} />
                      <span className="text-xs">Table</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Illustrations Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Illustrations
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      name: "Pictures",
                      icon: ImageIcon,
                      action: onImageUpload,
                    },
                    { name: "Shapes", icon: Shapes, action: () => setShowShapes(true) },
                    { name: "Charts", icon: BarChart3, action: onChartInsert },
                    { name: "Icons", icon: Smile, action: onEmojiPicker },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Add-ins Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Add-ins
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Get Add-ins", icon: Puzzle, action: () => {} },
                    { name: "Wikipedia", icon: Globe, action: () => {} },
                    {
                      name: "Translator",
                      icon: Languages,
                      action: onThesaurus,
                    },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Comments Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Comments
                </div>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onInsertComment}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                    >
                      <MessageSquare size={16} />
                      <span className="text-xs">Comment</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Header & Footer Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Header & Footer
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Header", icon: Layout, action: () => {} },
                    { name: "Footer", icon: Layout, action: () => {} },
                    { name: "Page Number", icon: Pilcrow, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Text Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Text
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Text Box", icon: Square, action: () => {} },
                    { name: "Quick Parts", icon: Puzzle, action: () => {} },
                    { name: "WordArt", icon: Type, action: () => {} },
                    { name: "Drop Cap", icon: Heading1, action: () => {} },
                    { name: "Signature Line", icon: PenTool, action: () => {} },
                    {
                      name: "Date & Time",
                      icon: Calendar,
                      action: () =>
                        editor.commands.insertContent(
                          new Date().toLocaleDateString()
                        ),
                    },
                    { name: "Object", icon: PenTool, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Symbols Group */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Symbols
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Equation", icon: Sigma, action: onInsertEquation },
                    { name: "Symbol", icon: Omega, action: onInsertSymbol },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "design" && (
            <div className="flex flex-wrap gap-6">
              {/* Document Formatting */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Document Formatting
                </div>
                <div className="flex gap-2">
                  {["Modern", "Classic", "Professional", "Casual"].map(
                    (theme, index) => (
                      <motion.div
                        key={theme}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {theme}
                        </Button>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>

              {/* Page Background */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Page Background
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Watermark", icon: Droplets, action: () => {} },
                    { name: "Page Color", icon: PaintBucket, action: () => {} },
                    { name: "Page Borders", icon: Square, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Theme Toggle */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Theme
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    <span className="text-xs">
                      {theme === "dark" ? "Light" : "Dark"}
                    </span>
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "layout" && (
            <div className="flex flex-wrap gap-6">
              {/* Page Setup */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Page Setup
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Margins", icon: Layout, action: () => {} },
                    { name: "Orientation", icon: RotateCcw, action: () => {} },
                    { name: "Size", icon: Expand, action: () => {} },
                    { name: "Columns", icon: ColumnsIcon, action: () => {} },
                    { name: "Breaks", icon: Minus, action: () => {} },
                    {
                      name: "Line Numbers",
                      icon: ListOrdered,
                      action: () => {},
                    },
                    { name: "Hyphenation", icon: WrapText, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Paragraph */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Paragraph
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      name: "Indent",
                      icon: Indent,
                      action: () => editor.chain().focus().indent().run(),
                    },
                    { name: "Spacing", icon: WrapText, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Arrange */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Arrange
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Position", icon: Move, action: () => {} },
                    { name: "Wrap Text", icon: WrapText, action: () => {} },
                    { name: "Bring Forward", icon: Layers, action: () => {} },
                    { name: "Send Backward", icon: Layers, action: () => {} },
                    { name: "Selection Pane", icon: Layout, action: () => {} },
                    { name: "Align", icon: AlignLeft, action: () => {} },
                    { name: "Group", icon: Group, action: () => {} },
                    { name: "Rotate", icon: RotateCcw, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "references" && (
            <div className="flex flex-wrap gap-6">
              {/* Table of Contents */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Table of Contents
                </div>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onTableOfContents}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                    >
                      <List size={16} />
                      <span className="text-xs">TOC</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Footnotes */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Footnotes
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      name: "Insert Footnote",
                      icon: Footprints,
                      action: () => {},
                    },
                    {
                      name: "Insert Endnote",
                      icon: Footprints,
                      action: () => {},
                    },
                    {
                      name: "Next Footnote",
                      icon: ArrowRight,
                      action: () => {},
                    },
                    { name: "Show Notes", icon: Eye, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Citations & Bibliography */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Citations & Bibliography
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      name: "Insert Citation",
                      icon: BookOpen,
                      action: () => {},
                    },
                    {
                      name: "Manage Sources",
                      icon: FileSearch,
                      action: () => {},
                    },
                    { name: "Style", icon: Type, action: () => {} },
                    {
                      name: "Bibliography",
                      icon: BookOpen,
                      action: onBibliography,
                    },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Captions */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Captions
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Insert Caption", icon: Pilcrow, action: () => {} },
                    {
                      name: "Insert Table of Figures",
                      icon: List,
                      action: () => {},
                    },
                    { name: "Update Table", icon: RefreshCw, action: () => {} },
                    { name: "Cross-reference", icon: Link2, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Index */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Index
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Mark Entry", icon: Bookmark, action: () => {} },
                    { name: "Insert Index", icon: List, action: () => {} },
                    { name: "Update Index", icon: RefreshCw, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Table of Authorities */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Table of Authorities
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Mark Citation", icon: Bookmark, action: () => {} },
                    { name: "Insert Table", icon: List, action: () => {} },
                    { name: "Update Table", icon: RefreshCw, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "review" && (
            <div className="flex flex-wrap gap-6">
              {/* Proofing */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Proofing
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      name: "Spelling",
                      icon: SpellCheck2,
                      action: onSpellCheck,
                    },
                    { name: "Thesaurus", icon: BookOpen, action: onThesaurus },
                    { name: "Word Count", icon: FileText, action: onWordCount },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Language */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Language
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Translate", icon: Languages, action: onThesaurus },
                    { name: "Set Language", icon: Globe, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Comments */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Comments
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      name: "New Comment",
                      icon: MessageSquare,
                      action: onInsertComment,
                    },
                    { name: "Delete", icon: Trash2, action: () => {} },
                    { name: "Previous", icon: ArrowLeft, action: () => {} },
                    { name: "Next", icon: ArrowRight, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tracking */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Tracking
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      name: "Track Changes",
                      icon: Edit,
                      action: onTrackChanges,
                    },
                    { name: "Simple Markup", icon: Eye, action: () => {} },
                    { name: "All Markup", icon: List, action: () => {} },
                    { name: "No Markup", icon: EyeOff, action: () => {} },
                    {
                      name: "Show Comments",
                      icon: MessageSquare,
                      action: () => {},
                    },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Changes */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Changes
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Accept", icon: CheckCircle, action: () => {} },
                    { name: "Reject", icon: XCircle, action: () => {} },
                    { name: "Previous", icon: ArrowLeft, action: () => {} },
                    { name: "Next", icon: ArrowRight, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Compare */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Compare
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Compare", icon: GitCompare, action: () => {} },
                    { name: "Combine", icon: GitMerge, action: () => {} },
                    { name: "Show Source", icon: Eye, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Protect */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Protect
                </div>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onProtectDocument}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                    >
                      <Shield size={16} />
                      <span className="text-xs">Protect</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "view" && (
            <div className="flex flex-wrap gap-6">
              {/* Views */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Views
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Read Mode", icon: BookOpen, action: () => {} },
                    { name: "Print Layout", icon: Printer, action: () => {} },
                    { name: "Web Layout", icon: Globe, action: () => {} },
                    { name: "Outline", icon: List, action: () => {} },
                    { name: "Draft", icon: FileText, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Show */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Show
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Ruler", icon: Ruler, action: () => {} },
                    { name: "Gridlines", icon: Layout, action: () => {} },
                    { name: "Navigation", icon: Compass, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Zoom */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Zoom
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      name: "Zoom In",
                      icon: ZoomIn,
                      action: () => onZoomChange(Math.min(500, zoomLevel + 10)),
                    },
                    {
                      name: "Zoom Out",
                      icon: ZoomOut,
                      action: () => onZoomChange(Math.max(10, zoomLevel - 10)),
                    },
                    {
                      name: "100%",
                      icon: Target,
                      action: () => onZoomChange(100),
                    },
                    {
                      name: "Page Width",
                      icon: Monitor,
                      action: () => onZoomChange(120),
                    },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Window */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Window
                </div>
                <div className="flex gap-2">
                  {[
                    {
                      name: "New Window",
                      icon: Plus,
                      action: () => window.open(document.URL, "_blank"),
                    },
                    { name: "Arrange All", icon: Layout, action: () => {} },
                    { name: "Split", icon: Minus, action: () => {} },
                    {
                      name: "View Side by Side",
                      icon: Columns,
                      action: () => {},
                    },
                    {
                      name: "Synchronous Scrolling",
                      icon: MousePointer,
                      action: () => {},
                    },
                    {
                      name: "Reset Window Position",
                      icon: RefreshCw,
                      action: () => {},
                    },
                    { name: "Switch Windows", icon: Layout, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Macros */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Macros
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "View Macros", icon: Play, action: () => {} },
                    { name: "Record Macro", icon: Circle, action: () => {} },
                    {
                      name: "Use Relative References",
                      icon: MousePointer,
                      action: () => {},
                    },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "developer" && (
            <div className="flex flex-wrap gap-6">
              {/* Code */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Code
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Visual Basic", icon: Code, action: () => {} },
                    { name: "Macros", icon: Play, action: () => {} },
                    { name: "Script Editor", icon: FileCode, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Add-ins */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Add-ins
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "COM Add-ins", icon: Puzzle, action: () => {} },
                    { name: "Document Panel", icon: Layout, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Controls
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Rich Text", icon: Type, action: () => {} },
                    { name: "Plain Text", icon: Pilcrow, action: () => {} },
                    { name: "Picture", icon: ImageIcon, action: () => {} },
                    { name: "Combo Box", icon: List, action: () => {} },
                    { name: "List Box", icon: List, action: () => {} },
                    { name: "Date Picker", icon: Calendar, action: () => {} },
                    { name: "Check Box", icon: CheckSquare, action: () => {} },
                    { name: "Option Button", icon: Circle, action: () => {} },
                    {
                      name: "Toggle Button",
                      icon: ToggleLeft,
                      action: () => {},
                    },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* XML */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  XML
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Schema", icon: FileCode, action: () => {} },
                    { name: "Expand/Collapse", icon: Minus, action: () => {} },
                    { name: "Show XML Tags", icon: Code, action: () => {} },
                    { name: "Refresh Data", icon: RefreshCw, action: () => {} },
                    { name: "Import", icon: Download, action: () => {} },
                    { name: "Export", icon: Upload, action: () => {} },
                    { name: "Transform", icon: Zap, action: () => {} },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Protect */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Protect
                </div>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onProtectDocument}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                    >
                      <Lock size={16} />
                      <span className="text-xs">Protect</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Templates */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Templates
                </div>
                <div className="flex gap-2">
                  {[
                    { name: "Document Panel", icon: Layout, action: () => {} },
                    {
                      name: "Attach Template",
                      icon: Paperclip,
                      action: () => {},
                    },
                  ].map(({ name, icon: Icon, action }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={action}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center gap-1 h-16 w-16"
                      >
                        <Icon size={16} />
                        <span className="text-xs">{name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// Enhanced TipTap Editor with all Microsoft Word functionalities
function TipTapEditor({
  content,
  onContentChange,
  placeholder = "Start typing...",
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isReadMode, setIsReadMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTrackChanges, setIsTrackChanges] = useState(false);
  const [isSpellCheck, setIsSpellCheck] = useState(true);

  useEffect(() => {
    const words = content.split(/\s+/).filter((word) => word.length > 0).length;
    const characters = content.length;
    const estimatedPages = Math.ceil(words / 500);

    setWordCount(words);
    setCharacterCount(characters);
    setPageCount(estimatedPages || 1);
  }, [content]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border font-mono",
          },
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      ShapeNode,

      Placeholder.configure({ placeholder }),

      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto border cursor-move shadow-sm",
          draggable: "true",
        },
      }),

      TableKit.configure({
        table: { resizable: true },
      }),
      TableRow,
      TableHeader,
      TableCell,

      SubscriptExtension,
      SuperscriptExtension,

      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),

      Underline,
      Color,
      TextStyle,
      FontSize,

      Highlight.configure({ multicolor: true }),

      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 dark:text-blue-400 underline",
        },
      }),

      TaskList,
      TaskItem,
      CharacterCount,
      Dropcursor,
      Gapcursor,

      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),

      FontFamily.configure({
        types: ["textStyle"],
      }),

      LineHeight,
    ],

    content: content,
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-[600px] p-8 bg-white dark:bg-gray-900 mx-auto transition-all duration-300 ${
          isReadMode ? "max-w-4xl shadow-2xl my-8 rounded-xl" : ""
        } ${isFullscreen ? "fixed inset-0 z-50 !m-0 !rounded-none" : ""}`,
        style: `transform: scale(${
          zoomLevel / 100
        }); transform-origin: top center;`,
        spellcheck: isSpellCheck ? "true" : "false",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];

          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64 = e.target?.result as string;
              const { schema } = view.state;
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              if (coordinates) {
                const node = schema.nodes.image.create({ src: base64 });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        if (
          event.clipboardData &&
          event.clipboardData.files &&
          event.clipboardData.files[0]
        ) {
          const file = event.clipboardData.files[0];

          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64 = e.target?.result as string;
              editor?.commands.setImage({ src: base64 });
            };
            reader.readAsDataURL(file);
            event.preventDefault();
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange(html);
    },
    immediatelyRender: false,
  });

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleChartInsert = () => {
    const chartHTML = `
      <div class="border rounded-xl p-6 my-4 from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-sm">
        <div class="text-center font-semibold mb-4 text-gray-800 dark:text-gray-200">Sample Chart</div>
        <div class="flex items-end justify-center gap-3 h-32">
          <div class="w-10 from-blue-500 to-blue-600 h-16 rounded-t-lg shadow"></div>
          <div class="w-10 from-green-500 to-green-600 h-24 rounded-t-lg shadow"></div>
          <div class="w-10 from-yellow-500 to-yellow-600 h-20 rounded-t-lg shadow"></div>
          <div class="w-10 from-red-500 to-red-600 h-12 rounded-t-lg shadow"></div>
        </div>
      </div>
    `;
    editor?.commands.insertContent(chartHTML);
  };

  const handleTableEditor = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  };

  const handleSpellCheck = () => {
    setIsSpellCheck(!isSpellCheck);
  };

  const handleThesaurus = () => {
    // Implement thesaurus functionality
    alert("Thesaurus feature would be implemented here");
  };

  const handleWordCount = () => {
    alert(
      `Words: ${wordCount}\nCharacters: ${characterCount}\nPages: ${pageCount}`
    );
  };

  const handleInsertSymbol = () => {
    // Use SymbolDialog instead of prompt
    // For now, insert a default symbol - this should open SymbolDialog
    const symbol = "•";
    if (symbol) {
      editor?.commands.insertContent(symbol);
    }
  };

  const handleInsertEquation = () => {
    const equation = "x = [-b ± √(b² - 4ac)] / 2a";
    editor?.commands.insertContent(`<div class="equation">${equation}</div>`);
  };

  const handleInsertComment = () => {
    // This should open a comment dialog
    // For now, insert a properly formatted comment node
    if (editor) {
      // Use the Comment extension's setComment command if available
      // Otherwise, insert as HTML that will be parsed
      const commentHTML = `<span data-type="comment" data-comment-id="${Date.now()}" data-comment-author="User" data-comment-content="New comment" data-comment-date="${new Date().toISOString()}" class="comment-marker" style="background-color: #ffeb3b; cursor: pointer; padding: 2px 6px; border-radius: 3px; display: inline-block;">💬</span>`;
      editor.commands.insertContent(commentHTML);
    }
  };

  const handleTrackChanges = () => {
    setIsTrackChanges(!isTrackChanges);
    alert(`Track Changes: ${!isTrackChanges ? "ON" : "OFF"}`);
  };

  const handleProtectDocument = () => {
    // Use a proper dialog instead of prompt
    // For now, just show an alert - this should open a PasswordDialog
    alert("Password protection feature - use the dialog in WordEditor");
    if (password) {
      alert(`Document protected with password: ${password}`);
    }
  };

  const handleMailMerge = () => {
    alert("Mail Merge functionality would open here");
  };

  const handleBibliography = () => {
    alert("Bibliography manager would open here");
  };

  const handleTableOfContents = () => {
    alert("Table of Contents would be generated here");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleReadMode = () => {
    setIsReadMode(!isReadMode);
  };

  const handleSave = () => {
    const content = editor?.getHTML();
    const blob = new Blob([content || ""], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    alert("Export options: PDF, DOCX, TXT");
  };

  const handlePrint = () => {
    window.print();
  };

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Title Bar */}
      <div className="flex justify-between items-center px-6 py-3 from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b dark:border-gray-700">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <span className="font-bold text-gray-800 dark:text-gray-200">
            Document Editor
          </span>
        </div>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(100)}
              className="font-mono"
            >
              {zoomLevel}%
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleReadMode}
              className={isReadMode ? "bg-blue-100 dark:bg-blue-900" : ""}
            >
              <Eye size={16} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Word Ribbon */}
      <WordRibbon
        editor={editor}
        onImageUpload={handleImageUpload}
        onChartInsert={handleChartInsert}
        onTableEditor={handleTableEditor}
        onSave={handleSave}
        onExport={handleExport}
        onPrint={handlePrint}
        wordCount={wordCount}
        characterCount={characterCount}
        pageCount={pageCount}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        onSpellCheck={handleSpellCheck}
        onThesaurus={handleThesaurus}
        onWordCount={handleWordCount}
        onInsertSymbol={handleInsertSymbol}
        onInsertEquation={handleInsertEquation}
        onInsertComment={handleInsertComment}
        onTrackChanges={handleTrackChanges}
        onProtectDocument={handleProtectDocument}
        onMailMerge={handleMailMerge}
        onBibliography={handleBibliography}
        onTableOfContents={handleTableOfContents}
      />

      {/* Enhanced Editor Area */}
      <div
        className={`flex-1 overflow-auto from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 ${
          isFullscreen ? "fixed inset-0 z-40" : ""
        }`}
      >
        <motion.div
          className={`bg-white dark:bg-gray-900 transition-all duration-500 ${
            isReadMode
              ? "max-w-4xl mx-auto my-8 shadow-2xl rounded-xl"
              : "min-h-full"
          }`}
          layout
        >
          <EditorContent editor={editor} />
        </motion.div>
      </div>

      {/* Enhanced Status Bar */}
      <motion.div
        className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-900 border-t dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 backdrop-blur-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex gap-6">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Sparkles size={14} className="text-blue-500" />
            Page {pageCount}
          </motion.span>
          <motion.span whileHover={{ scale: 1.05 }}>
            Words: {wordCount}
          </motion.span>
          <motion.span whileHover={{ scale: 1.05 }}>
            Characters: {characterCount}
          </motion.span>
          {isTrackChanges && (
            <motion.span whileHover={{ scale: 1.05 }} className="text-red-500">
              Track Changes: ON
            </motion.span>
          )}
          {!isSpellCheck && (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-yellow-500"
            >
              Spell Check: OFF
            </motion.span>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(Math.max(10, zoomLevel - 10))}
            >
              <ZoomOut size={14} />
            </Button>
          </motion.div>
          <motion.span className="w-16 text-center font-mono">
            {zoomLevel}%
          </motion.span>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(Math.min(500, zoomLevel + 10))}
            >
              <ZoomIn size={14} />
            </Button>
          </motion.div>
          <div className="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((zoomLevel - 10) / 490) * 100}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64 = e.target?.result as string;
              editor.commands.setImage({ src: base64 });
            };
            reader.readAsDataURL(file);
          }
        }}
        className="hidden"
      />
    </motion.div>
  );
}

// Enhanced EditableContainer with modern animations
function EditableContainer({
  pageNum,
  totalPages,
  title,
  onAdd,
  onDelete,
  children,
}: EditableContainerProps) {
  return (
    <motion.div
      className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.01 }}
      layout
    >
      {/* Enhanced Header */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 dark:border-gray-800 from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center gap-4">
          <motion.h3
            className="text-xl font-bold text-gray-800 dark:text-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            {title}
          </motion.h3>
          <motion.span
            className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 px-4 py-2 rounded-full border shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            Page {pageNum} of {totalPages}
          </motion.span>
        </div>

        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onAdd}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
            >
              <Plus size={16} />
              Add Page
            </Button>
          </motion.div>

          {pageNum > 1 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onDelete}
                variant="outline"
                size="sm"
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
              >
                Delete Page
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content area */}
      <motion.div
        className="min-h-[600px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Enhanced RenderPageContent
function RenderPageContent({ page }: { page: InitialPageContent | Card }) {
  const [content, setContent] = useState(
    "content" in page ? page.content.body : page.body
  );
  const [title, setTitle] = useState(
    "content" in page ? page.content.title : page.title
  );

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <div className="space-y-8 p-8">
      {/* Enhanced Title input */}
      <motion.input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="w-full text-4xl font-bold border-none outline-none bg-transparent p-8 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800"
        placeholder="Document Title..."
        whileFocus={{ scale: 1.01 }}
      />

      {/* Enhanced TipTap Editor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <TipTapEditor
          content={content}
          onContentChange={handleContentChange}
          placeholder="Start writing your content here. Use the ribbon above for formatting options..."
        />
      </motion.div>
    </div>
  );
}

// Mock initial data
const initialPresentationData: InitialPageContent[] = [
  {
    id: 1,
    type: "document",
    title: "My Document",
    body: "<h1>🚀 Welcome to Your Modern Document</h1><p>Start editing your content here. Experience the cutting-edge interface with smooth animations and responsive design.</p>",
  },
];

// Theme Provider Component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme, mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return <div className={theme}>{children}</div>;
}

// Main Enhanced Frame Component
export default function MultiPageEditor() {
  const [initialPages, setInitialPages] = useState<InitialPageContent[]>(
    initialPresentationData
  );
  const [dynamicCards, setDynamicCards] = useState<Card[]>([]);
  const [nextId, setNextId] = useState(initialPresentationData.length + 1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddCard = () => {
    const newCard: Card = {
      id: nextId,
      type: "blank",
      content: {
        title: `Page ${nextId}`,
        body: `<p>Start typing your content here...</p>`,
      },
    };

    setDynamicCards((prev) => [...prev, newCard]);
    setNextId((prev) => prev + 1);
  };

  const handleDeleteCard = (id: number) => {
    const isInitialPage = initialPages.some((page) => page.id === id);

    if (isInitialPage) {
      setInitialPages((prev) => prev.filter((page) => page.id !== id));
    } else {
      setDynamicCards((prev) => prev.filter((card) => card.id !== id));
    }
  };

  const totalPages = initialPages.length + dynamicCards.length;
  const allPages = [...initialPages, ...dynamicCards];

  if (isLoading) {
    return (
      <div className="min-h-screen from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-semibold text-gray-700 dark:text-gray-300"
          >
            Loading Modern Editor...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
        {/* Enhanced Application Frame */}
        <div className="flex flex-col h-screen">
          {/* Enhanced Quick Access Toolbar */}
          <motion.div
            className="flex justify-between items-center px-6 py-3 bg-white/80 dark:bg-gray-900/80 border-b dark:border-gray-700 backdrop-blur-lg"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="flex gap-3">
              {[
                { icon: Save, action: () => alert("Save functionality") },
                { icon: Undo, action: () => alert("Undo functionality") },
                { icon: Redo, action: () => alert("Redo functionality") },
                {
                  icon: FolderOpen,
                  action: () => alert("Open file functionality"),
                },
                { icon: Printer, action: () => window.print() },
              ].map(({ icon: Icon, action }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={action}
                    className="rounded-lg"
                  >
                    <Icon size={18} />
                  </Button>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              {[
                { icon: HelpCircle, action: () => alert("Help") },
                { icon: Settings, action: () => alert("Settings") },
                { icon: User, action: () => alert("Account") },
              ].map(({ icon: Icon, action }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={action}
                    className="rounded-lg"
                  >
                    <Icon size={18} />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Main Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="container max-w-7xl mx-auto py-8">
              <AnimatePresence>
                <div className="flex flex-col items-center gap-8">
                  {allPages.map((page, index) => (
                    <EditableContainer
                      key={page.id}
                      pageNum={index + 1}
                      totalPages={totalPages}
                      title={
                        "content" in page ? page.content.title : page.title
                      }
                      onAdd={handleAddCard}
                      onDelete={() => handleDeleteCard(page.id)}
                    >
                      <RenderPageContent page={page} />
                    </EditableContainer>
                  ))}

                  {/* Enhanced Add New Page Button */}
                  <motion.div
                    className="w-full max-w-6xl flex justify-center mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full max-w-2xl"
                    >
                      <Button
                        onClick={handleAddCard}
                        className="flex justify-center items-center gap-4 py-8 px-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-2xl hover:shadow-3xl rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 w-full group backdrop-blur-sm"
                      >
                        <motion.div
                          whileHover={{ rotate: 90 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Plus
                            size={32}
                            className="text-blue-500 group-hover:text-blue-600 transition-colors"
                          />
                        </motion.div>
                        <span className="text-xl font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                          Add New Page
                        </span>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
