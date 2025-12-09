"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ZoomIn, ZoomOut, ChevronDown } from "lucide-react";

interface WordStatusBarProps {
  wordCount: number;
  characterCount: number;
  pageCount: number;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
}

export function WordStatusBar({
  wordCount,
  characterCount,
  pageCount,
  zoomLevel,
  onZoomChange,
}: WordStatusBarProps) {
  const zoomLevels = [50, 75, 100, 125, 150, 200];

  return (
    <div className="bg-white dark:bg-gray-800 border-t px-4 py-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-4">
        <span>Page {pageCount} of {pageCount}</span>
        <span>Words: {wordCount}</span>
        <span>Characters: {characterCount}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onZoomChange(Math.max(50, zoomLevel - 10))}
          className="h-6 w-6 p-0"
        >
          <ZoomOut className="h-3 w-3" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              {zoomLevel}%
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {zoomLevels.map((zoom) => (
              <DropdownMenuItem
                key={zoom}
                onClick={() => onZoomChange(zoom)}
              >
                {zoom}%
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onZoomChange(Math.min(200, zoomLevel + 10))}
          className="h-6 w-6 p-0"
        >
          <ZoomIn className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

