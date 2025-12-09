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

interface SignatureLineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (signerName: string, signerTitle: string, showDate: boolean) => void;
}

export function SignatureLineDialog({
  open,
  onOpenChange,
  onInsert,
}: SignatureLineDialogProps) {
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [showDate, setShowDate] = useState(true);

  const handleInsert = () => {
    onInsert(signerName, signerTitle, showDate);
    setSignerName("");
    setSignerTitle("");
    setShowDate(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Signature Line</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="signer-name">Signer Name (optional)</Label>
            <Input
              id="signer-name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="John Doe"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="signer-title">Signer Title (optional)</Label>
            <Input
              id="signer-title"
              value={signerTitle}
              onChange={(e) => setSignerTitle(e.target.value)}
              placeholder="CEO, Manager, etc."
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-date"
              checked={showDate}
              onCheckedChange={(checked) => setShowDate(checked as boolean)}
            />
            <Label htmlFor="show-date" className="text-sm font-normal">
              Show date
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert Signature Line</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

