"use client";

import { Save, Eye, Sparkles, Settings as SettingsIcon, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface TopBarProps {
    documentTitle?: string;
    onTitleChange?: (title: string) => void;
    onPreview?: () => void;
    onEnhanced?: () => void;
    onShowCustomization?: () => void;
    onGenerateAIMedia?: () => void;
    onShare?: () => void;
}

export function TopBar({
    documentTitle = "Untitled Document",
    onTitleChange,
    onPreview,
    onEnhanced,
    onShowCustomization,
    onGenerateAIMedia,
    onShare
}: TopBarProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(documentTitle);

    const handleTitleSave = () => {
        setIsEditingTitle(false);
        onTitleChange?.(title);
    };

    return (
        <div className="h-16 bg-gradient-to-r from-[#1A1A1A]/80 to-[#252525]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
            {/* Left: Document Title */}
            <div className="flex items-center gap-4">
                {isEditingTitle ? (
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                        className="h-9 bg-[#252525] border-white/20 text-white w-64 rounded-full px-4"
                        autoFocus
                    />
                ) : (
                    <div
                        onClick={() => setIsEditingTitle(true)}
                        className="text-white font-semibold text-lg cursor-pointer hover:text-purple-400 transition-colors"
                    >
                        {title}
                    </div>
                )}
                <span className="text-gray-500 text-sm">Saved just now</span>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPreview}
                    className="h-9 px-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                    <Eye size={16} className="mr-2" />
                    Preview
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEnhanced}
                    className="h-9 px-4 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-all"
                >
                    <Sparkles size={16} className="mr-2" />
                    Enhanced
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShowCustomization}
                    className="h-9 px-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                    <SettingsIcon size={16} className="mr-2" />
                    Customize
                </Button>

                <Button
                    size="sm"
                    onClick={onGenerateAIMedia}
                    className="h-9 px-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 font-medium shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
                >
                    <Sparkles size={16} className="mr-2" />
                    AI Media
                </Button>

                <Button
                    size="sm"
                    onClick={onShare}
                    className="h-9 px-5 rounded-full bg-gradient-to-r from-pink-600 to-amber-600 text-white hover:from-pink-700 hover:to-amber-700 font-medium shadow-lg shadow-pink-500/30 transition-all hover:shadow-pink-500/50"
                >
                    <Share2 size={16} className="mr-2" />
                    Share
                </Button>
            </div>
        </div>
    );
}
