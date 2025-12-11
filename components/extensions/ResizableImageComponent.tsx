"use client";

import { useEffect, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ResizableImageComponentProps {
  node: {
    attrs: {
      src: string;
      width: number;
      height: number;
      alt?: string;
    };
  };
  updateAttributes: (attrs: { width?: number; height?: number }) => void;
  selected: boolean;
}

export function ResizableImageComponent({
  node,
  updateAttributes,
  selected,
}: ResizableImageComponentProps) {
  const { src, width, height, alt } = node.attrs;
  const [currentWidth, setCurrentWidth] = useState(width || 500);
  const [currentHeight, setCurrentHeight] = useState(height || 300);
  const [isResizing, setIsResizing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentWidth(width || 500);
    setCurrentHeight(height || 300);
  }, [width, height]);

  const handleWidthChange = (newWidth: number) => {
    if (newWidth > 0 && newWidth <= 2000) {
      setCurrentWidth(newWidth);
      updateAttributes({ width: newWidth });
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (newHeight > 0 && newHeight <= 2000) {
      setCurrentHeight(newHeight);
      updateAttributes({ height: newHeight });
    }
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const newWidth = Math.max(100, Math.min(2000, e.clientX - rect.left));
    const newHeight = Math.max(100, Math.min(2000, e.clientY - rect.top));

    handleWidthChange(newWidth);
    handleHeightChange(newHeight);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setShowControls(true);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', () => setIsResizing(false));
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
    };
  }, [isResizing]);

  return (
    <NodeViewWrapper className="resizable-image-wrapper my-4">
      <div
        className="relative inline-block group"
        style={{ width: `${currentWidth}px`, height: `${currentHeight}px` }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => !isResizing && setShowControls(false)}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt || ''}
          className="w-full h-full object-contain rounded-lg border-2 border-transparent group-hover:border-blue-400 transition-colors"
          style={{
            width: `${currentWidth}px`,
            height: `${currentHeight}px`,
          }}
        />

        {/* Resize Handle */}
        {showControls && (
          <div
            ref={resizeRef}
            className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-tl-lg cursor-nwse-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={handleMouseDown}
          >
            <GripVertical className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Size Controls */}
        {showControls && (
          <Popover open={showControls} onOpenChange={setShowControls}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white shadow-lg"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Image Size</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Width (px)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="50"
                          max="2000"
                          value={currentWidth}
                          onChange={(e) =>
                            handleWidthChange(parseInt(e.target.value) || 100)
                          }
                          className="h-8"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWidthChange(currentWidth - 10)}
                          className="h-8 w-8 p-0"
                        >
                          <Minimize2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWidthChange(currentWidth + 10)}
                          className="h-8 w-8 p-0"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Height (px)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="50"
                          max="2000"
                          value={currentHeight}
                          onChange={(e) =>
                            handleHeightChange(parseInt(e.target.value) || 100)
                          }
                          className="h-8"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHeightChange(currentHeight - 10)}
                          className="h-8 w-8 p-0"
                        >
                          <Minimize2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHeightChange(currentHeight + 10)}
                          className="h-8 w-8 p-0"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Drag the corner handle or use the controls above to resize
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </NodeViewWrapper>
  );
}

