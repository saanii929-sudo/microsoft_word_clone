// components/TableEditor.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Table as TableIcon,
  Plus,
  Minus,
  Merge,
  Split,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2
} from 'lucide-react';

interface TableEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: any;
}

export function TableEditor({ open, onOpenChange, editor }: TableEditorProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hasHeader, setHasHeader] = useState(true);
  const [borderStyle, setBorderStyle] = useState('solid');

  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({
        rows: parseInt(rows as any),
        cols: parseInt(cols as any),
        withHeaderRow: hasHeader,
      }).run();
      
      // Apply border style
      if (borderStyle !== 'solid') {
        setTimeout(() => {
          editor.chain().focus().updateAttributes('table', {
            style: `border: 1px ${borderStyle} #e2e8f0;`
          }).run();
        }, 100);
      }
      
      onOpenChange(false);
    }
  };

  const addRow = () => {
    if (editor) {
      editor.chain().focus().addRowAfter().run();
    }
  };

  const addColumn = () => {
    if (editor) {
      editor.chain().focus().addColumnAfter().run();
    }
  };

  const deleteRow = () => {
    if (editor) {
      editor.chain().focus().deleteRow().run();
    }
  };

  const deleteColumn = () => {
    if (editor) {
      editor.chain().focus().deleteColumn().run();
    }
  };

  const deleteTable = () => {
    if (editor) {
      editor.chain().focus().deleteTable().run();
      onOpenChange(false);
    }
  };

  const mergeCells = () => {
    if (editor) {
      editor.chain().focus().mergeCells().run();
    }
  };

  const splitCell = () => {
    if (editor) {
      editor.chain().focus().splitCell().run();
    }
  };

  const alignLeft = () => {
    if (editor) {
      editor.chain().focus().setCellAttribute('textAlign', 'left').run();
    }
  };

  const alignCenter = () => {
    if (editor) {
      editor.chain().focus().setCellAttribute('textAlign', 'center').run();
    }
  };

  const alignRight = () => {
    if (editor) {
      editor.chain().focus().setCellAttribute('textAlign', 'right').run();
    }
  };

  const isTableActive = editor?.isActive('table');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5" />
            {isTableActive ? 'Edit Table' : 'Insert Table'}
          </DialogTitle>
          <DialogDescription>
            {isTableActive 
              ? 'Modify your table structure and formatting' 
              : 'Create a new table for your document'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!isTableActive ? (
            /* Table Creation */
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rows">Number of Rows</Label>
                  <Input
                    id="rows"
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                    min="1"
                    max="20"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cols">Number of Columns</Label>
                  <Input
                    id="cols"
                    type="number"
                    value={cols}
                    onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                    min="1"
                    max="10"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="header-row" className="cursor-pointer">
                    Header Row
                  </Label>
                  <Switch
                    id="header-row"
                    checked={hasHeader}
                    onCheckedChange={setHasHeader}
                  />
                </div>

                <div>
                  <Label htmlFor="border-style">Border Style</Label>
                  <Select value={borderStyle} onValueChange={setBorderStyle}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                      <SelectItem value="none">No Border</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table Preview */}
              <div className="border rounded-lg p-4">
                <Label className="text-sm font-medium mb-2">Preview</Label>
                <div className="inline-block border border-border rounded overflow-hidden">
                  <table className="border-collapse">
                    <tbody>
                      {Array.from({ length: Math.min(rows, 3) }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          {Array.from({ length: Math.min(cols, 4) }).map((_, colIndex) => (
                            <td
                              key={colIndex}
                              className={`w-8 h-8 border border-border ${
                                hasHeader && rowIndex === 0 ? 'bg-muted font-medium' : 'bg-background'
                              }`}
                            />
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(rows > 3 || cols > 4) && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Preview showing first {Math.min(rows, 3)} rows and {Math.min(cols, 4)} columns
                  </p>
                )}
              </div>

              <Button onClick={insertTable} className="w-full">
                Insert Table
              </Button>
            </>
          ) : (
            /* Table Editing */
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Table Structure</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={addRow}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Row
                    </Button>
                    <Button variant="outline" size="sm" onClick={addColumn}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Column
                    </Button>
                    <Button variant="outline" size="sm" onClick={deleteRow}>
                      <Minus className="h-4 w-4 mr-1" />
                      Delete Row
                    </Button>
                    <Button variant="outline" size="sm" onClick={deleteColumn}>
                      <Minus className="h-4 w-4 mr-1" />
                      Delete Column
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Cell Operations</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={mergeCells}>
                      <Merge className="h-4 w-4 mr-1" />
                      Merge
                    </Button>
                    <Button variant="outline" size="sm" onClick={splitCell}>
                      <Split className="h-4 w-4 mr-1" />
                      Split
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Text Alignment</Label>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={alignLeft}>
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={alignCenter}>
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={alignRight}>
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="destructive" onClick={deleteTable}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Table
                </Button>
                <Button onClick={() => onOpenChange(false)}>
                  Done Editing
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}