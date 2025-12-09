"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: {
    size: string;
    orientation: string;
    margins: { top: number; right: number; bottom: number; left: number };
  };
  onSettingsChange: (settings: {
    size: string;
    orientation: string;
    margins: { top: number; right: number; bottom: number; left: number };
  }) => void;
}

export interface PageSetupSettings {
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  orientation: "portrait" | "landscape";
  pageSize: "A4" | "Letter" | "Legal" | "A3" | "A5";
  columns: number;
}

export function PageSetupDialog({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: PageSetupDialogProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleApply = () => {
    onSettingsChange(localSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Page Setup</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="margins" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="margins">Margins</TabsTrigger>
            <TabsTrigger value="paper">Paper</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="margins" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="top">Top (pt)</Label>
                <Input
                  id="top"
                  type="number"
                  value={localSettings.margins.top}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      margins: {
                        ...localSettings.margins,
                        top: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bottom">Bottom (pt)</Label>
                <Input
                  id="bottom"
                  type="number"
                  value={localSettings.margins.bottom}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      margins: {
                        ...localSettings.margins,
                        bottom: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="left">Left (pt)</Label>
                <Input
                  id="left"
                  type="number"
                  value={localSettings.margins.left}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      margins: {
                        ...localSettings.margins,
                        left: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="right">Right (pt)</Label>
                <Input
                  id="right"
                  type="number"
                  value={localSettings.margins.right}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      margins: {
                        ...localSettings.margins,
                        right: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    margins: { top: 72, bottom: 72, left: 72, right: 72 },
                  })
                }
              >
                Normal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    margins: { top: 36, bottom: 36, left: 36, right: 36 },
                  })
                }
              >
                Narrow
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    margins: { top: 144, bottom: 144, left: 144, right: 144 },
                  })
                }
              >
                Wide
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="paper" className="space-y-4">
            <div>
              <Label htmlFor="pageSize">Paper Size</Label>
              <Select
                value={localSettings.size}
                onValueChange={(value: string) =>
                  setLocalSettings({ ...localSettings, size: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Letter">Letter (8.5" × 11")</SelectItem>
                  <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="Legal">Legal (8.5" × 14")</SelectItem>
                  <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
                  <SelectItem value="A5">A5 (148 × 210 mm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="orientation">Orientation</Label>
              <Select
                value={localSettings.orientation}
                onValueChange={(value: string) =>
                  setLocalSettings({ ...localSettings, orientation: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div>
              <Label>Layout options coming soon</Label>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

