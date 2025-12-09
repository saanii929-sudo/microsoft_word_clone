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
import { Checkbox } from "@/components/ui/checkbox";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (url: string, text?: string, openInNewTab?: boolean) => void;
  selectedText?: string;
}

export function LinkDialog({
  open,
  onOpenChange,
  onInsert,
  selectedText,
}: LinkDialogProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState(selectedText || "");
  const [openInNewTab, setOpenInNewTab] = useState(false);

  const handleInsert = () => {
    if (url.trim()) {
      onInsert(url, text || url, openInNewTab);
      setUrl("");
      setText(selectedText || "");
      setOpenInNewTab(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Hyperlink</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="link-text">Text to display</Label>
            <Input
              id="link-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Link text"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-tab"
              checked={openInNewTab}
              onCheckedChange={(checked) => setOpenInNewTab(checked as boolean)}
            />
            <Label htmlFor="new-tab" className="text-sm font-normal">
              Open in new tab
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setUrl("");
            setText(selectedText || "");
            onOpenChange(false);
          }}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!url.trim()}>
            Insert Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

