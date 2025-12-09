"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Square, Circle, Triangle, ArrowRight, Star } from 'lucide-react';

interface ShapeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInsert: (type: string, width: number, height: number, fillColor: string, borderColor: string, borderWidth: number) => void;
}

const SHAPE_OPTIONS = [
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'roundedRectangle', name: 'Rounded Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'triangle', name: 'Triangle', icon: Triangle },
    { id: 'arrow', name: 'Arrow', icon: ArrowRight },
    { id: 'star', name: 'Star', icon: Star },
];

export function ShapeDialog({ open, onOpenChange, onInsert }: ShapeDialogProps) {
    const [selectedType, setSelectedType] = useState('rectangle');
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(150);
    const [fillColor, setFillColor] = useState('#3b82f6');
    const [borderColor, setBorderColor] = useState('#1e40af');
    const [borderWidth, setBorderWidth] = useState(2);

    const handleInsert = () => {
        onInsert(selectedType, width, height, fillColor, borderColor, borderWidth);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Square className="w-5 h-5 text-indigo-500" />
                        Insert Shape
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Shape Type Selection */}
                    <div className="space-y-4">
                        <Label>Shape Type</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {SHAPE_OPTIONS.map((shape) => (
                                <button
                                    key={shape.id}
                                    onClick={() => setSelectedType(shape.id)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${selectedType === shape.id
                                            ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
                                            : 'border-black/5 hover:border-black/10 hover:bg-black/5'
                                        }`}
                                >
                                    <shape.icon size={24} className="mb-2" />
                                    <span className="text-xs font-medium text-center">{shape.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Controls */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="width">Width (px)</Label>
                            <Input
                                id="width"
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(parseInt(e.target.value) || 200)}
                                className="bg-white/50 border-black/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Height (px)</Label>
                            <Input
                                id="height"
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(parseInt(e.target.value) || 150)}
                                className="bg-white/50 border-black/10"
                            />
                        </div>
                    </div>

                    {/* Color Controls */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fill">Fill Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="fill"
                                    type="color"
                                    value={fillColor}
                                    onChange={(e) => setFillColor(e.target.value)}
                                    className="w-16 h-10 p-1 bg-white/50 border-black/10"
                                />
                                <Input
                                    type="text"
                                    value={fillColor}
                                    onChange={(e) => setFillColor(e.target.value)}
                                    className="flex-1 bg-white/50 border-black/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="border">Border Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="border"
                                    type="color"
                                    value={borderColor}
                                    onChange={(e) => setBorderColor(e.target.value)}
                                    className="w-16 h-10 p-1 bg-white/50 border-black/10"
                                />
                                <Input
                                    type="text"
                                    value={borderColor}
                                    onChange={(e) => setBorderColor(e.target.value)}
                                    className="flex-1 bg-white/50 border-black/10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Border Width */}
                    <div className="space-y-2">
                        <Label htmlFor="borderWidth">Border Width (px)</Label>
                        <Input
                            id="borderWidth"
                            type="number"
                            value={borderWidth}
                            onChange={(e) => setBorderWidth(parseInt(e.target.value) || 2)}
                            className="bg-white/50 border-black/10"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleInsert}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
                    >
                        Insert Shape
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
