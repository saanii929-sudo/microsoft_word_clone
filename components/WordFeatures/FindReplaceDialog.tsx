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

interface FindReplaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: any;
}

export function FindReplaceDialog({
  open,
  onOpenChange,
  editor,
}: FindReplaceDialogProps) {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWords, setWholeWords] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  const findMatches = () => {
    if (!editor || !findText) return;

    const content = editor.getText();
    let searchText = findText;

    if (!matchCase) {
      searchText = searchText.toLowerCase();
    }

    const regex = wholeWords
      ? new RegExp(`\\b${searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, matchCase ? "g" : "gi")
      : new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), matchCase ? "g" : "gi");

    const matches = content.match(regex);
    setTotalMatches(matches ? matches.length : 0);

    if (matches && matches.length > 0) {
      setCurrentMatch(1);
    }
  };

  const findNext = () => {
    findMatches();
    // Implementation would highlight next match
  };

  const replace = () => {
    if (!editor || !findText) return;

    const html = editor.getHTML();
    let searchText = findText;
    let replaceWith = replaceText;

    if (!matchCase) {
      const regex = new RegExp(searchText, "gi");
      const newHTML = html.replace(regex, replaceWith);
      editor.commands.setContent(newHTML);
    } else {
      const newHTML = html.replace(new RegExp(searchText, "g"), replaceWith);
      editor.commands.setContent(newHTML);
    }

    findMatches();
  };

  const replaceAll = () => {
    if (!editor || !findText) return;

    const html = editor.getHTML();
    let searchText = findText;
    let replaceWith = replaceText;

    if (!matchCase) {
      const regex = new RegExp(searchText, "gi");
      const newHTML = html.replace(regex, replaceWith);
      editor.commands.setContent(newHTML);
    } else {
      const newHTML = html.replace(new RegExp(searchText, "g"), replaceWith);
      editor.commands.setContent(newHTML);
    }

    setTotalMatches(0);
    setCurrentMatch(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => {
                setFindText(e.target.value);
                setTotalMatches(0);
                setCurrentMatch(0);
              }}
              placeholder="Enter text to find..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  findNext();
                }
              }}
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="matchCase"
              checked={matchCase}
              onCheckedChange={(checked) => setMatchCase(checked as boolean)}
            />
            <Label htmlFor="matchCase" className="text-sm font-normal">
              Match case
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="wholeWords"
              checked={wholeWords}
              onCheckedChange={(checked) => setWholeWords(checked as boolean)}
            />
            <Label htmlFor="wholeWords" className="text-sm font-normal">
              Find whole words only
            </Label>
          </div>

          {totalMatches > 0 && (
            <div className="text-sm text-gray-600">
              {currentMatch} of {totalMatches} matches
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button onClick={findNext} disabled={!findText}>
              Find Next
            </Button>
            <Button onClick={replace} disabled={!findText}>
              Replace
            </Button>
            <Button onClick={replaceAll} disabled={!findText}>
              Replace All
            </Button>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

