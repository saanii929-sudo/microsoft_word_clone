"use client";

import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface EditableContainerProps {
  pageId: string;
  pageNum: number;
  totalPages: number;
  content: string;
  onChange: (updatedContent: string) => void;
}

export default function EditableContainer({
  pageId,
  pageNum,
  totalPages,
  content,
  onChange,
}: EditableContainerProps) {

  // Create Tiptap editor for this page
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false, // IMPORTANT for Next.js
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content updates if needed
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div
      className="
        w-[794px] h-[1123px]
        bg-white shadow-md border border-gray-300 rounded-lg
        p-6
      "
    >
      {/* Page header */}
      <div className="flex justify-between text-gray-600 text-sm mb-3">
        <span>Page {pageNum} of {totalPages}</span>
        <span>ID: {pageId.slice(0, 8)}</span>
      </div>

      {/* The editable Tiptap area */}
      <EditorContent editor={editor} />
    </div>
  );
}
