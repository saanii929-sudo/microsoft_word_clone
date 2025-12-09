"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WordArtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (text: string, style: string, fontSize: number) => void;
}

const wordArtStyles = [
  { value: "gradient", label: "Gradient" },
  { value: "shadow", label: "Shadow" },
  { value: "outline", label: "Outline" },
  { value: "3d", label: "3D" },
];

export function WordArtDialog({
  open,
  onOpenChange,
  onInsert,
}: WordArtDialogProps) {
  const [text, setText] = useState("WordArt");
  const [style, setStyle] = useState("gradient");
  const [fontSize, setFontSize] = useState(48);

  const handleInsert = () => {
    if (text.trim()) {
      onInsert(text, style, fontSize);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert WordArt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="wordart-text">Text</Label>
            <Input
              id="wordart-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="wordart-style">Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {wordArtStyles.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="wordart-size">Font Size</Label>
            <Input
              id="wordart-size"
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value) || 48)}
              min={12}
              max={144}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!text.trim()}>
            Insert WordArt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

