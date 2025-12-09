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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface EquationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (equation: string, isInline: boolean) => void;
}

const equationTemplates = [
  { name: "Quadratic Formula", formula: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" },
  { name: "Pythagorean Theorem", formula: "a^2 + b^2 = c^2" },
  { name: "Euler's Identity", formula: "e^{i\\pi} + 1 = 0" },
  { name: "Newton's Second Law", formula: "F = ma" },
  { name: "Einstein's Mass-Energy", formula: "E = mc^2" },
  { name: "Schrödinger Equation", formula: "i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi" },
  { name: "Fourier Transform", formula: "F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt" },
  { name: "Integral", formula: "\\int_{a}^{b} f(x) dx" },
  { name: "Summation", formula: "\\sum_{i=1}^{n} x_i" },
  { name: "Limit", formula: "\\lim_{x \\to \\infty} f(x)" },
];

export function EquationDialog({
  open,
  onOpenChange,
  onInsert,
}: EquationDialogProps) {
  const [equation, setEquation] = useState("");
  const [isInline, setIsInline] = useState(false);
  const [error, setError] = useState("");

  const handleInsert = () => {
    if (!equation.trim()) {
      setError("Please enter an equation");
      return;
    }

    try {
      // Validate equation by trying to render it
      onInsert(equation, isInline);
      onOpenChange(false);
      setEquation("");
      setError("");
    } catch (err) {
      setError("Invalid equation syntax");
    }
  };

  const handleTemplateSelect = (formula: string) => {
    setEquation(formula);
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Insert Equation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="equation">Equation (LaTeX syntax)</Label>
            <Textarea
              id="equation"
              value={equation}
              onChange={(e) => {
                setEquation(e.target.value);
                setError("");
              }}
              placeholder="Enter LaTeX equation, e.g., E = mc^2"
              className="mt-1 font-mono"
              rows={4}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inline"
              checked={isInline}
              onChange={(e) => setIsInline(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="inline" className="text-sm font-normal">
              Inline equation
            </Label>
          </div>

          {equation && (
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <Label className="text-sm mb-2 block">Preview:</Label>
              <div className="text-center">
                {isInline ? (
                  <InlineMath math={equation} />
                ) : (
                  <BlockMath math={equation} />
                )}
              </div>
            </div>
          )}

          <div>
            <Label className="mb-2 block">Templates</Label>
            <ScrollArea className="h-[200px] border rounded-lg p-4">
              <div className="space-y-2">
                {equationTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleTemplateSelect(template.formula)}
                    className="w-full text-left p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="font-semibold text-sm mb-1">{template.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                      {template.formula}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert Equation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

