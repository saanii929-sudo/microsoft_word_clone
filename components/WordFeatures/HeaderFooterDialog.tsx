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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderFooterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertHeader: (content: string) => void;
  onInsertFooter: (content: string) => void;
  onInsertPageNumber: (position: string, alignment: string) => void;
}

export function HeaderFooterDialog({
  open,
  onOpenChange,
  onInsertHeader,
  onInsertFooter,
  onInsertPageNumber,
}: HeaderFooterDialogProps) {
  const [headerContent, setHeaderContent] = useState("");
  const [footerContent, setFooterContent] = useState("");
  const [pageNumberPosition, setPageNumberPosition] = useState("footer");
  const [pageNumberAlignment, setPageNumberAlignment] = useState("center");
  const [differentFirstPage, setDifferentFirstPage] = useState(false);

  const handleInsertHeader = () => {
    onInsertHeader(headerContent);
    onOpenChange(false);
  };

  const handleInsertFooter = () => {
    onInsertFooter(footerContent);
    onOpenChange(false);
  };

  const handleInsertPageNumber = () => {
    onInsertPageNumber(pageNumberPosition, pageNumberAlignment);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Header & Footer</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="header" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="page-number">Page Number</TabsTrigger>
          </TabsList>

          <TabsContent value="header" className="space-y-4">
            <div>
              <Label htmlFor="header-content">Header Content</Label>
              <Input
                id="header-content"
                value={headerContent}
                onChange={(e) => setHeaderContent(e.target.value)}
                placeholder="Enter header text..."
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="different-first-header"
                checked={differentFirstPage}
                onCheckedChange={(checked) => setDifferentFirstPage(checked as boolean)}
              />
              <Label htmlFor="different-first-header" className="text-sm font-normal">
                Different first page
              </Label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleInsertHeader}>Insert Header</Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="footer" className="space-y-4">
            <div>
              <Label htmlFor="footer-content">Footer Content</Label>
              <Input
                id="footer-content"
                value={footerContent}
                onChange={(e) => setFooterContent(e.target.value)}
                placeholder="Enter footer text..."
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="different-first-footer"
                checked={differentFirstPage}
                onCheckedChange={(checked) => setDifferentFirstPage(checked as boolean)}
              />
              <Label htmlFor="different-first-footer" className="text-sm font-normal">
                Different first page
              </Label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleInsertFooter}>Insert Footer</Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="page-number" className="space-y-4">
            <div>
              <Label>Position</Label>
              <Select
                value={pageNumberPosition}
                onValueChange={setPageNumberPosition}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Alignment</Label>
              <Select
                value={pageNumberAlignment}
                onValueChange={setPageNumberAlignment}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleInsertPageNumber}>Insert Page Number</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

