"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Settings, Rewind, FastForward, Volume2, Type, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ImmersiveReaderProps {
    isOpen: boolean;
    onClose: () => void;
    content: string; // Plain text content
    contextText?: string; // Selected text for context
}

export function ImmersiveReader({ isOpen, onClose, content, contextText }: ImmersiveReaderProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');
    const [textSize, setTextSize] = useState(24);
    const [speed, setSpeed] = useState(1);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    const [bgImage, setBgImage] = useState<string | null>(null);
    const [isGeneratingBg, setIsGeneratingBg] = useState(false);

    // Split content into words for highlighting
    const words = content.split(/\s+/);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Handle AI Background Generation
    const handleMagicBackground = async () => {
        setIsGeneratingBg(true);
        // Simulate "AI" analysis of the text to find keywords
        // In a real app, this would call an LLM to extract visual keywords
        // Here we just use the selected text or the first few words
        const queryText = contextText && contextText.length > 0 ? contextText : content.slice(0, 50);

        // Simple keyword extraction (remove stops, take top words) - very naive
        const keywords = queryText.split(/\s+/)
            .filter(w => w.length > 4)
            .slice(0, 3)
            .join(',');

        const query = keywords || "calm landscape";

        // Fetch from Unsplash Source (easy way to get random image by keyword)
        const imageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;

        // Preload image
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            setBgImage(imageUrl);
            setIsGeneratingBg(false);
        };
        img.onerror = () => {
            setBgImage("https://images.unsplash.com/photo-1497250681960-ef048c0ab947?q=80&w=2070&auto=format&fit=crop"); // Fallback
            setIsGeneratingBg(false);
        };
    };

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            // Default to first English voice
            const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
            if (defaultVoice) setVoice(defaultVoice);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        if (!isOpen) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setCurrentWordIndex(-1);
        }
    }, [isOpen]);

    const handlePlayPause = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setCurrentWordIndex(-1);
        } else {
            const utterance = new SpeechSynthesisUtterance(content);
            if (voice) utterance.voice = voice;
            utterance.rate = speed;
            utterance.pitch = 1;

            utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    // Estimate word index based on char index (rough approximation)
                    // A proper implementation would map char indices to word indices accurately
                    const charIndex = event.charIndex;
                    const textBefore = content.substring(0, charIndex);
                    const wordCount = textBefore.split(/\s+/).length;
                    setCurrentWordIndex(wordCount - 1);
                }
            };

            utterance.onend = () => {
                setIsPlaying(false);
                setCurrentWordIndex(-1);
            };

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
        }
    };

    if (!isOpen) return null;

    const themeStyles = {
        light: "bg-white text-slate-900",
        dark: "bg-slate-900 text-slate-100",
        sepia: "bg-[#f4ecd8] text-[#5b4636]"
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn("fixed inset-0 z-[100] flex flex-col", themeStyles[theme])}
            >
                {/* Top Bar */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                        >
                            <X size={24} />
                        </Button>
                        <h2 className="text-xl font-semibold font-display">Immersive Reader</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Text Settings */}
                        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/10 p-2 rounded-full">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTextSize(Math.max(16, textSize - 2))}
                                className="h-8 w-8 rounded-full"
                            >
                                <span className="text-xs">A</span>
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">{textSize}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTextSize(Math.min(64, textSize + 2))}
                                className="h-8 w-8 rounded-full"
                            >
                                <span className="text-lg">A</span>
                            </Button>
                        </div>

                        {/* Theme Toggle */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMagicBackground}
                                disabled={isGeneratingBg}
                                className="group flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 mr-4"
                            >
                                <Wand2 size={14} className={isGeneratingBg ? "animate-spin" : "group-hover:rotate-12 transition-transform"} />
                                <span>{isGeneratingBg ? "Generating..." : "Magic Background"}</span>
                            </Button>

                            <button onClick={() => { setTheme('light'); setBgImage(null); }} className="w-6 h-6 rounded-full bg-white border border-slate-300 shadow-sm" title="Light" />
                            <button onClick={() => { setTheme('sepia'); setBgImage(null); }} className="w-6 h-6 rounded-full bg-[#f4ecd8] border border-[#d3c5a3] shadow-sm" title="Sepia" />
                            <button onClick={() => { setTheme('dark'); setBgImage(null); }} className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 shadow-sm" title="Dark" />
                        </div>
                    </div>
                </div>

                {/* Background Image Layer */}
                {bgImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${bgImage})` }}
                    >
                        <div className={cn(
                            "absolute inset-0 backdrop-blur-sm",
                            theme === 'light' ? "bg-white/80" :
                                theme === 'dark' ? "bg-black/80" :
                                    "bg-[#f4ecd8]/90"
                        )} />
                    </motion.div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-12 md:p-24 flex justify-center">
                    <div
                        className="max-w-4xl w-full leading-relaxed transition-all duration-300"
                        style={{ fontSize: `${textSize}px` }}
                    >
                        {words.map((word, index) => (
                            <span
                                key={index}
                                className={cn(
                                    "transition-colors duration-200 rounded px-0.5 mx-0.5 inline-block",
                                    index === currentWordIndex
                                        ? "bg-yellow-300 text-black transform scale-105"
                                        : ""
                                )}
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="h-24 border-t border-black/10 dark:border-white/10 flex flex-col justify-center px-8 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                    <div className="max-w-2xl mx-auto w-full flex items-center gap-6">

                        <div className="flex-1 flex items-center gap-4">
                            <Volume2 size={20} className="text-muted-foreground" />
                            <Select
                                value={voice?.name}
                                onValueChange={(val) => setVoice(voices.find(v => v.name === val) || null)}
                            >
                                <SelectTrigger className="w-full bg-transparent border-black/20 dark:border-white/20">
                                    <SelectValue placeholder="Select Voice" />
                                </SelectTrigger>
                                <SelectContent>
                                    {voices.map(v => (
                                        <SelectItem key={v.name} value={v.name}>{v.name} ({v.lang})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 rounded-full border-2 border-black/10 dark:border-white/10"
                                onClick={handlePlayPause}
                            >
                                {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                            </Button>
                        </div>

                        <div className="flex-1 flex items-center gap-4">
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Speed: {speed}x</span>
                            <Slider
                                value={[speed]}
                                min={0.5}
                                max={2}
                                step={0.25}
                                onValueChange={([val]) => setSpeed(val)}
                                className="w-32"
                            />
                        </div>

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

