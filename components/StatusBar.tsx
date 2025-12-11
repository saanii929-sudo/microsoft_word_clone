"use client";

import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusBarProps {
    wordCount?: number;
    currentPage?: number;
    totalPages?: number;
    zoom?: number;
    onZoomChange?: (zoom: number) => void;
}

export function StatusBar({
    wordCount = 0,
    currentPage = 1,
    totalPages = 1,
    zoom = 80,
    onZoomChange
}: StatusBarProps) {
    const handleZoomIn = () => {
        if (zoom < 200) {
            onZoomChange?.(zoom + 10);
        }
    };

    const handleZoomOut = () => {
        if (zoom > 50) {
            onZoomChange?.(zoom - 10);
        }
    };

    const handleReset = () => {
        onZoomChange?.(100);
    };

    return (
        <div className="h-14 bg-gradient-to-r from-[#1A1A1A]/90 to-[#252525]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-6">
            {/* Left: Word Count */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Total Words:</span>
                    <span className="text-white font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {wordCount}
                    </span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Current Page:</span>
                    <span className="text-white font-semibold">{Math.floor(wordCount / totalPages)}</span>
                </div>
            </div>

            {/* Right: Page & Zoom Controls */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Page</span>
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                        <span className="text-white font-semibold">{currentPage}</span>
                        <span className="text-gray-400 mx-1">of</span>
                        <span className="text-white font-semibold">{totalPages}</span>
                    </div>
                </div>

                <div className="w-px h-6 bg-white/10" />

                <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm">Zoom</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomOut}
                        className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all"
                    >
                        <Minus size={14} />
                    </Button>
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 min-w-[60px] text-center">
                        <span className="text-white font-semibold">{zoom}%</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomIn}
                        className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all"
                    >
                        <Plus size={14} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-8 px-3 rounded-full text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all"
                    >
                        <RotateCcw size={14} className="mr-1" />
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}
