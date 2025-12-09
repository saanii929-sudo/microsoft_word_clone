"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface MsWordStatusBarProps {
    wordCount: number;
    pageCount: number;
    zoomLevel: number;
    onZoomChange: (value: number) => void;
}

export function MsWordStatusBar({ wordCount, pageCount, zoomLevel, onZoomChange }: MsWordStatusBarProps) {
    return (
        <div className="h-6 bg-[#2B579A] text-white flex items-center px-2 text-xs select-none justify-between fixed bottom-0 w-full z-10">
            <div className="flex items-center gap-4">
                <div className="hover:bg-[#436ba8] px-1 py-0.5 cursor-pointer">
                    Page {pageCount} of {pageCount}
                </div>
                <div className="hover:bg-[#436ba8] px-1 py-0.5 cursor-pointer">
                    {wordCount} words
                </div>
                <div className="hover:bg-[#436ba8] px-1 py-0.5 cursor-pointer">
                    English (United States)
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-48">
                    <span className="cursor-pointer" onClick={() => onZoomChange(Math.max(10, zoomLevel - 10))}>-</span>
                    <Slider
                        value={[zoomLevel]}
                        min={10}
                        max={200}
                        step={10}
                        onValueChange={(val: any[]) => onZoomChange(val[0])}
                        className="w-32 cursor-pointer"
                    />
                    <span className="cursor-pointer" onClick={() => onZoomChange(Math.min(200, zoomLevel + 10))}>+</span>
                    <span>{zoomLevel}%</span>
                </div>
            </div>
        </div>
    );
}
