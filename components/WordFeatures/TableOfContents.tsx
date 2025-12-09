"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { List } from "lucide-react";

interface TableOfContentsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: any;
}

export function TableOfContents({ open, onOpenChange, editor }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Array<{ level: number; text: string; id: string }>>([]);

  useEffect(() => {
    if (!editor) return;

    const updateHeadings = () => {
      const content = editor.getHTML();
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
      
      const headingList: Array<{ level: number; text: string; id: string }> = [];
      headingElements.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || "";
        headingList.push({
          level,
          text,
          id: `heading-${index}`,
        });
      });

      setHeadings(headingList);
    };

    updateHeadings();
    editor.on("update", updateHeadings);
    editor.on("selectionUpdate", updateHeadings);

    return () => {
      editor.off("update", updateHeadings);
      editor.off("selectionUpdate", updateHeadings);
    };
  }, [editor]);

  const generateTOC = () => {
    if (headings.length === 0) {
      alert("No headings found in the document. Add headings to generate a table of contents.");
      return;
    }

    let tocHTML = '<div class="table-of-contents" style="margin: 20px 0; padding: 20px; border: 1px solid #e0e0e0; background: #f9f9f9;"><h2>Table of Contents</h2><ul style="list-style: none; padding-left: 0;">';
    
    headings.forEach((heading) => {
      const indent = (heading.level - 1) * 20;
      tocHTML += `<li style="margin-left: ${indent}px; margin-top: 8px;"><a href="#${heading.id}" style="text-decoration: none; color: #0066cc;">${heading.text}</a></li>`;
    });
    
    tocHTML += "</ul></div>";

    editor.commands.insertContent(tocHTML);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Table of Contents</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {headings.length > 0 ? (
            <>
              <div className="text-sm text-gray-600">
                Found {headings.length} heading{headings.length !== 1 ? "s" : ""} in the document.
              </div>
              <div className="max-h-64 overflow-y-auto border rounded p-2">
                {headings.map((heading, index) => (
                  <div
                    key={index}
                    style={{ marginLeft: `${(heading.level - 1) * 20}px` }}
                    className="text-sm py-1"
                  >
                    {heading.text}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600">
              No headings found. Add headings to your document to generate a table of contents.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={generateTOC} disabled={headings.length === 0}>
            <List className="h-4 w-4 mr-2" />
            Insert Table of Contents
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

