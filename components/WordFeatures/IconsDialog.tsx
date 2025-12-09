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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as LucideIcons from "lucide-react";

interface IconsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (iconName: string) => void;
}

const iconCategories = {
  'Common': ['Home', 'User', 'Settings', 'Search', 'Heart', 'Star', 'Bookmark', 'Bell', 'Mail', 'Phone', 'Camera', 'Image', 'File', 'Folder', 'Download', 'Upload'],
  'Arrows': ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronDown', 'Move', 'Navigation'],
  'Shapes': ['Circle', 'Square', 'Triangle', 'Hexagon', 'Pentagon', 'Diamond'],
  'Communication': ['MessageSquare', 'MessageCircle', 'Phone', 'Video', 'Mail', 'Send', 'Reply', 'Forward'],
  'Media': ['Play', 'Pause', 'Stop', 'SkipBack', 'SkipForward', 'Volume2', 'VolumeX', 'Music', 'Video', 'Image'],
  'Tools': ['Wrench', 'Hammer', 'Screwdriver', 'Scissors', 'Paintbrush', 'Palette', 'Brush'],
};

export function IconsDialog({
  open,
  onOpenChange,
  onInsert,
}: IconsDialogProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [iconSize, setIconSize] = useState(24);

  const handleInsert = () => {
    if (selectedIcon) {
      onInsert(selectedIcon);
      onOpenChange(false);
      setSelectedIcon(null);
      setSearchTerm("");
    }
  };

  const getFilteredIcons = (category: string) => {
    const icons = iconCategories[category as keyof typeof iconCategories] || [];
    return icons.filter(icon => 
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className={`h-${iconSize/4} w-${iconSize/4}`} />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Insert Icon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Size"
              value={iconSize}
              onChange={(e) => setIconSize(parseInt(e.target.value) || 24)}
              className="w-20"
            />
          </div>

          <Tabs defaultValue={Object.keys(iconCategories)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {Object.keys(iconCategories).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(iconCategories).map((category) => (
              <TabsContent key={category} value={category} className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="grid grid-cols-8 gap-2">
                    {getFilteredIcons(category).map((iconName) => {
                      const IconComponent = (LucideIcons as any)[iconName];
                      if (!IconComponent) return null;
                      
                      return (
                        <button
                          key={iconName}
                          onClick={() => setSelectedIcon(iconName)}
                          className={`p-3 border-2 rounded-lg flex items-center justify-center transition-all ${
                            selectedIcon === iconName
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                          }`}
                          title={iconName}
                        >
                          <IconComponent className={`h-${iconSize/4} w-${iconSize/4}`} />
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <DialogFooter>
          {selectedIcon && (
            <div className="flex items-center gap-2 mr-auto">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Selected: {selectedIcon}
              </span>
            </div>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!selectedIcon}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

