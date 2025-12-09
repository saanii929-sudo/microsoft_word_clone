// components/FormatPainter.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Paintbrush, 
  Check,
  MousePointerClick
} from 'lucide-react';
import { toast } from 'sonner';

interface FormatPainterProps {
  editor: any;
}

interface FormatState {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontFamily?: string;
  textAlign?: string;
}

export function FormatPainter({ editor }: FormatPainterProps) {
  const [isActive, setIsActive] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<FormatState | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const copyFormat = () => {
    if (!editor) return;

    const format: FormatState = {
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      strike: editor.isActive('strike'),
      color: editor.getAttributes('textStyle').color,
      backgroundColor: editor.getAttributes('highlight')?.color,
      fontSize: editor.getAttributes('textStyle').fontSize,
      fontFamily: editor.getAttributes('textStyle').fontFamily,
      textAlign: editor.getAttributes('textStyle').textAlign,
    };

    setCopiedFormat(format);
    setIsActive(true);
    toast.success('Format copied! Click on text to apply.');
  };

  const applyFormat = () => {
    if (!editor || !copiedFormat) return;

    setIsApplying(true);

    // Apply text formatting
    if (copiedFormat.bold) {
      editor.chain().focus().setBold().run();
    } else {
      editor.chain().focus().unsetBold().run();
    }

    if (copiedFormat.italic) {
      editor.chain().focus().setItalic().run();
    } else {
      editor.chain().focus().unsetItalic().run();
    }

    if (copiedFormat.underline) {
      editor.chain().focus().setUnderline().run();
    } else {
      editor.chain().focus().unsetUnderline().run();
    }

    if (copiedFormat.strike) {
      editor.chain().focus().setStrike().run();
    } else {
      editor.chain().focus().unsetStrike().run();
    }

    // Apply colors
    if (copiedFormat.color) {
      editor.chain().focus().setColor(copiedFormat.color).run();
    } else {
      editor.chain().focus().unsetColor().run();
    }

    if (copiedFormat.backgroundColor) {
      editor.chain().focus().setHighlight({ color: copiedFormat.backgroundColor }).run();
    } else {
      editor.chain().focus().unsetHighlight().run();
    }

    // Apply font properties
    if (copiedFormat.fontSize) {
      editor.chain().focus().setFontSize(copiedFormat.fontSize).run();
    }

    if (copiedFormat.fontFamily) {
      editor.chain().focus().setFontFamily(copiedFormat.fontFamily).run();
    }

    if (copiedFormat.textAlign) {
      editor.chain().focus().setTextAlign(copiedFormat.textAlign).run();
    }

    setTimeout(() => {
      setIsApplying(false);
      toast.success('Format applied!');
    }, 300);
  };

  const toggleFormatPainter = () => {
    if (isActive) {
      setIsActive(false);
      setCopiedFormat(null);
      toast.info('Format painter deactivated');
    } else {
      copyFormat();
    }
  };

  // Listen for editor selection changes when format painter is active
  useEffect(() => {
    if (!editor || !isActive) return;

    const handleUpdate = () => {
      if (isActive && copiedFormat) {
        applyFormat();
        // Keep format painter active for multiple applications
        // setIsActive(false);
      }
    };

    editor.on('selectionUpdate', handleUpdate);
    return () => {
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor, isActive, copiedFormat]);

  // Add click handler for manual application
  useEffect(() => {
    if (!isActive) return;

    const handleClick = () => {
      if (copiedFormat && !isApplying) {
        applyFormat();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isActive, copiedFormat, isApplying]);

  const getFormatSummary = () => {
    if (!copiedFormat) return 'No format copied';
    
    const activeFormats = [];
    if (copiedFormat.bold) activeFormats.push('Bold');
    if (copiedFormat.italic) activeFormats.push('Italic');
    if (copiedFormat.underline) activeFormats.push('Underline');
    if (copiedFormat.strike) activeFormats.push('Strike');
    if (copiedFormat.color) activeFormats.push('Color');
    if (copiedFormat.backgroundColor) activeFormats.push('Highlight');
    
    return activeFormats.length > 0 
      ? activeFormats.join(', ') 
      : 'Basic formatting';
  };

  return (
    <div className="relative">
      <Button
        variant={isActive ? "default" : "outline"}
        size="sm"
        onClick={toggleFormatPainter}
        disabled={!editor}
        className={`relative ${
          isActive 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : ''
        }`}
      >
        {isActive ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            <MousePointerClick className="h-3 w-3 absolute -top-1 -right-1" />
          </>
        ) : (
          <Paintbrush className="h-4 w-4" />
        )}
      </Button>

      {/* Format preview tooltip */}
      {isActive && copiedFormat && (
        <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-popover border rounded-lg shadow-lg z-50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Format Painter Active</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {getFormatSummary()}
            </div>
            <div className="flex gap-1">
              <div 
                className="flex-1 h-4 rounded border"
                style={{ 
                  backgroundColor: copiedFormat.backgroundColor || 'transparent',
                  color: copiedFormat.color || 'inherit',
                  fontFamily: copiedFormat.fontFamily || 'inherit',
                  fontSize: copiedFormat.fontSize || 'inherit',
                  fontWeight: copiedFormat.bold ? 'bold' : 'normal',
                  fontStyle: copiedFormat.italic ? 'italic' : 'normal',
                  textDecoration: copiedFormat.underline ? 'underline' : 'none',
                }}
              >
                Aa
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsActive(false)}
              className="w-full text-xs"
            >
              Stop Painting
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}