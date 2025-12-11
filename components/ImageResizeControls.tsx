"use client";

import { useEffect, useRef, useState } from 'react';
import { GripVertical, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ImageResizeControlsProps {
  imageElement: HTMLImageElement;
  onResize: (width: number, height: number) => void;
  onClose: () => void;
}

export function ImageResizeControls({ imageElement, onResize, onClose }: ImageResizeControlsProps) {
  const [width, setWidth] = useState(parseInt(imageElement.width.toString()) || 500);
  const [height, setHeight] = useState(parseInt(imageElement.height.toString()) || 300);
  const [isResizing, setIsResizing] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      const currentWidth = parseInt(imageElement.width.toString()) || 500;
      const currentHeight = parseInt(imageElement.height.toString()) || 300;
      setWidth(currentWidth);
      setHeight(currentHeight);
    };

    updateSize();
    const observer = new MutationObserver(updateSize);
    observer.observe(imageElement, { attributes: true, attributeFilter: ['width', 'height', 'style'] });

    return () => observer.disconnect();
  }, [imageElement]);

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) return;

    const rect = imageElement.getBoundingClientRect();
    const newWidth = Math.max(50, Math.min(2000, e.clientX - rect.left));
    const newHeight = Math.max(50, Math.min(2000, e.clientY - rect.top));

    setWidth(newWidth);
    setHeight(newHeight);
    onResize(newWidth, newHeight);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', () => setIsResizing(false));
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', () => setIsResizing(false));
    };
  }, [isResizing]);

  const handleWidthChange = (newWidth: number) => {
    if (newWidth > 0 && newWidth <= 2000) {
      setWidth(newWidth);
      onResize(newWidth, height);
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (newHeight > 0 && newHeight <= 2000) {
      setHeight(newHeight);
      onResize(width, newHeight);
    }
  };

  const rect = imageElement.getBoundingClientRect();

  return (
    <div
      className="fixed z-[10000] pointer-events-none"
      style={{
        left: `${rect.right}px`,
        top: `${rect.top}px`,
      }}
    >
      <div className="pointer-events-auto bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg shadow-xl p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-semibold">Resize Image</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-gray-600 dark:text-gray-400">Width (px)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="50"
                max="2000"
                value={width}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 100)}
                className="h-8"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWidthChange(width - 10)}
                className="h-8 w-8 p-0"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWidthChange(width + 10)}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-gray-600 dark:text-gray-400">Height (px)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="50"
                max="2000"
                value={height}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 100)}
                className="h-8"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleHeightChange(height - 10)}
                className="h-8 w-8 p-0"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleHeightChange(height + 10)}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

