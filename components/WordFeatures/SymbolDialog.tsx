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
import { ScrollArea } from "@/components/ui/scroll-area";

interface SymbolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (symbol: string) => void;
}

const symbolCategories = {
  'Common': ['©', '®', '™', '°', '±', '×', '÷', '¼', '½', '¾', '€', '£', '¥', '$', '¢'],
  'Math': ['∑', '∏', '∫', '√', '∞', '≈', '≠', '≤', '≥', '±', '×', '÷', '∂', '∇', '∆'],
  'Greek': ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'],
  'Arrows': ['←', '→', '↑', '↓', '↔', '↕', '⇒', '⇐', '⇑', '⇓', '⇔', '⇕', '↗', '↘', '↙', '↖'],
  'Special': ['•', '○', '●', '■', '□', '▲', '△', '▼', '▽', '◆', '◇', '★', '☆', '♠', '♣', '♥', '♦'],
  'Currency': ['€', '£', '¥', '$', '¢', '₹', '₽', '₩', '₪', '₫', '₭', '₮', '₯', '₰', '₱', '₲', '₳', '₴', '₵', '₶', '₷', '₸'],
  'Punctuation': ['…', '—', '–', '«', '»', '„', '‚', '‹', '›', '¿', '¡', '§', '¶', '†', '‡', '•'],
};

export function SymbolDialog({
  open,
  onOpenChange,
  onInsert,
}: SymbolDialogProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInsert = () => {
    if (selectedSymbol) {
      onInsert(selectedSymbol);
      onOpenChange(false);
      setSelectedSymbol(null);
      setSearchTerm("");
    }
  };

  const filteredSymbols = Object.entries(symbolCategories).reduce((acc, [category, symbols]) => {
    const filtered = symbols.filter(s => 
      s.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Insert Symbol</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search symbols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Tabs defaultValue={Object.keys(symbolCategories)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {Object.keys(symbolCategories).slice(0, 4).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(filteredSymbols).map(([category, symbols]) => (
              <TabsContent key={category} value={category} className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="grid grid-cols-8 gap-2">
                    {symbols.map((symbol, index) => (
                      <button
                        key={`${symbol}-${index}`}
                        onClick={() => setSelectedSymbol(symbol)}
                        className={`p-3 border-2 rounded text-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                          selectedSymbol === symbol
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2 mr-auto">
            {selectedSymbol && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Selected: <span className="text-2xl font-bold">{selectedSymbol}</span>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!selectedSymbol}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

