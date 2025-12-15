"use client";

import { Save, Eye, Sparkles, Settings as SettingsIcon, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

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
    documentTitle,
    onTitleChange,
    onPreview,
    onEnhanced,
    onShowCustomization,
    onGenerateAIMedia,
    onShare
}: TopBarProps) {
    const t = useTranslations('Editor');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(documentTitle || t('untitled'));

    const handleTitleSave = () => {
        setIsEditingTitle(false);
        onTitleChange?.(title);
    };

    return (
        <div className="h-16 bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
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
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPreview}
                    className="h-9 px-4 rounded-full bg-white/5 hover:cursor-pointer border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                    <Eye size={16} className="mr-2" />
                    {t('preview')}
                </Button>


                <Button
                    size="sm"
                    onClick={onGenerateAIMedia}
                    className="h-9 px-4 rounded-full bg-white/5 hover:cursor-pointer border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                    <Sparkles size={16} className="mr-2" />
                    {t('aiMedia')}
                </Button>

                <Button
                    size="sm"
                    onClick={onShare}
                    className="h-9 px-4 rounded-full hover:cursor-pointer bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                    <Share2 size={16} className="mr-2" />
                    {t('share')}
                </Button>
            </div>
        </div>
    );
}
