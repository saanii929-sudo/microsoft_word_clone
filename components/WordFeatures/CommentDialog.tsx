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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (comment: string) => void;
  author?: string;
}

export function CommentDialog({
  open,
  onOpenChange,
  onInsert,
  author,
}: CommentDialogProps) {
  const [comment, setComment] = useState("");

  const handleInsert = () => {
    if (comment.trim()) {
      onInsert(comment);
      setComment("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Comment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {author && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Author: {author}
            </div>
          )}
          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment..."
              className="mt-1"
              rows={4}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  handleInsert();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setComment("");
            onOpenChange(false);
          }}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!comment.trim()}>
            Insert Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

