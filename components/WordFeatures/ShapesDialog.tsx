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
import {
  Square, Circle, Triangle, RectangleHorizontal,
  Hexagon, Octagon, Heart, Star, ArrowRight, ArrowDown,
  ArrowLeft, ArrowUp, Minus, Plus, X, Check
} from "lucide-react";

interface ShapesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (shape: string, type: string) => void;
}

const basicShapes = [
  { name: "Rectangle", icon: Square, type: "rect" },
  { name: "Circle", icon: Circle, type: "circle" },
  { name: "Triangle", icon: Triangle, type: "triangle" },
  { name: "Oval", icon: RectangleHorizontal, type: "oval" },
  { name: "Hexagon", icon: Hexagon, type: "hexagon" },
  { name: "Octagon", icon: Octagon, type: "octagon" },
];

const symbolShapes = [
  { name: "Heart", icon: Heart, type: "heart" },
  { name: "Star", icon: Star, type: "star" },
  { name: "Plus", icon: Plus, type: "plus" },
  { name: "Minus", icon: Minus, type: "minus" },
  { name: "X", icon: X, type: "x" },
  { name: "Check", icon: Check, type: "check" },
];

const arrowShapes = [
  { name: "Right Arrow", icon: ArrowRight, type: "arrow-right" },
  { name: "Down Arrow", icon: ArrowDown, type: "arrow-down" },
  { name: "Left Arrow", icon: ArrowLeft, type: "arrow-left" },
  { name: "Up Arrow", icon: ArrowUp, type: "arrow-up" },
];

export function ShapesDialog({
  open,
  onOpenChange,
  onInsert,
}: ShapesDialogProps) {
  const [selectedShape, setSelectedShape] = useState<{ name: string; type: string } | null>(null);

  const handleInsert = () => {
    if (selectedShape) {
      onInsert(selectedShape.type, selectedShape.name);
      onOpenChange(false);
      setSelectedShape(null);
    }
  };

  const renderShapeGrid = (shapes: typeof basicShapes) => (
    <div className="grid grid-cols-3 gap-4">
      {shapes.map((shape) => {
        const Icon = shape.icon;
        return (
          <button
            key={shape.type}
            onClick={() => setSelectedShape({ name: shape.name, type: shape.type })}
            className={`p-6 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
              selectedShape?.type === shape.type
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
            }`}
          >
            <Icon className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">{shape.name}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Insert Shape</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Shapes</TabsTrigger>
            <TabsTrigger value="symbols">Symbols</TabsTrigger>
            <TabsTrigger value="arrows">Arrows</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4">
            {renderShapeGrid(basicShapes)}
          </TabsContent>

          <TabsContent value="symbols" className="mt-4">
            {renderShapeGrid(symbolShapes)}
          </TabsContent>

          <TabsContent value="arrows" className="mt-4">
            {renderShapeGrid(arrowShapes)}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!selectedShape}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

