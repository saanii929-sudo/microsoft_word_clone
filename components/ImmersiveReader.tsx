"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Settings, Rewind, FastForward, Volume2, Type, Wand2, Languages, Loader2 } from 'lucide-react';
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
import { toast } from 'sonner';
import { TranslateAndRead } from './TranslateAndRead';
import { useTranslations } from 'next-intl';

interface ImmersiveReaderProps {
    isOpen: boolean;
    onClose: () => void;
    content: string; // Plain text content
    contextText?: string; // Selected text for context
}

export function ImmersiveReader({ isOpen, onClose, content, contextText }: ImmersiveReaderProps) {
    const t = useTranslations('ImmersiveReader');
    const [isPlaying, setIsPlaying] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');
    const [textSize, setTextSize] = useState(24);
    const [lineSpacing, setLineSpacing] = useState(1.8);
    const [lineFocusEnabled, setLineFocusEnabled] = useState(false);
    const [focusedLineIndex, setFocusedLineIndex] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    const [bgImage, setBgImage] = useState<string | null>(null);
    const [isGeneratingBg, setIsGeneratingBg] = useState(false);
    const [translationLanguage, setTranslationLanguage] = useState('en-US');
    const [translatedContent, setTranslatedContent] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    // Split content into lines and words (use translated content if available)
    const displayContent = translatedContent || content;
    const lines = displayContent.split(/\n+/).filter(line => line.trim().length > 0);
    const words = displayContent.split(/\s+/);
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
            console.log('ImmersiveReader: Loaded voices', availableVoices.length);

            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                // Default to first English voice if no voice is selected
                if (!voice) {
                    const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
                    if (defaultVoice) setVoice(defaultVoice);
                }
            } else {
                // If no voices loaded, try again after a short delay
                console.log('ImmersiveReader: No voices found, retrying...');
                setTimeout(loadVoices, 500);
            }
        };

        // Load voices immediately
        loadVoices();

        // Also listen for when voices become available
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        // Retry loading voices after a delay (some browsers load voices asynchronously)
        const retryTimer = setTimeout(loadVoices, 1000);

        return () => {
            clearTimeout(retryTimer);
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

    const handleTranslateDocument = async () => {
        if (!content.trim()) {
            toast.error('No content to translate');
            return;
        }

        setIsTranslating(true);
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: content,
                    targetLanguage: translationLanguage,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Translation failed');
            }

            setTranslatedContent(data.translatedText);
            toast.success('Document translated successfully!');
        } catch (error: any) {
            console.error('Translation error:', error);
            toast.error(`Translation failed: ${error.message}`);
        } finally {
            setIsTranslating(false);
        }
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setCurrentWordIndex(-1);
        } else {
            // Use translated content if available, otherwise use original
            const textToRead = translatedContent || content;
            const utterance = new SpeechSynthesisUtterance(textToRead);
            if (voice) utterance.voice = voice;
            utterance.rate = speed;
            utterance.pitch = 1;
            // Set language for speech
            utterance.lang = translationLanguage;

            utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    // Estimate word index based on char index (rough approximation)
                    const charIndex = event.charIndex;
                    const textBefore = textToRead.substring(0, charIndex);
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

    // Render TranslateAndRead for selected text in Immersive Reader
    const renderTranslateAndRead = () => {
        if (selectedText) {
            return (
                <TranslateAndRead
                    selectedText={selectedText}
                    onTextSelected={setSelectedText}
                />
            );
        }
        return null;
    };

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
                        <h2 className="text-xl font-semibold font-display">{t('title')}</h2>
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

                        {/* Line Spacing */}
                        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/10 p-2 rounded-full">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setLineSpacing(Math.max(1.2, lineSpacing - 0.2))}
                                className="h-8 px-3 rounded-full text-xs"
                            >
                                {t('tabs.textPrefs')}
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{lineSpacing.toFixed(1)}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setLineSpacing(Math.min(3, lineSpacing + 0.2))}
                                className="h-8 px-3 rounded-full text-xs"
                            >
                                {t('tabs.textPrefs')}
                            </Button>
                        </div>

                        {/* Line Focus Toggle */}
                        <Button
                            variant={lineFocusEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setLineFocusEnabled(!lineFocusEnabled)}
                            className="rounded-full"
                        >
                            <Type size={16} className="mr-2" />
                            {t('lineFocus')}
                        </Button>

                        {/* Translation Language Selector */}
                        <div className="flex items-center gap-2">
                            <Languages size={16} className="text-slate-600 dark:text-slate-400" />
                            <Select value={translationLanguage} onValueChange={setTranslationLanguage}>
                                <SelectTrigger className="w-40 h-9 text-xs bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600">
                                    <SelectValue placeholder={t('translateTo')} />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-2xl">
                                    <SelectItem value="en-US">English (US)</SelectItem>
                                    <SelectItem value="en-GB">English (UK)</SelectItem>
                                    <SelectItem value="es-ES">Spanish</SelectItem>
                                    <SelectItem value="fr-FR">French</SelectItem>
                                    <SelectItem value="de-DE">German</SelectItem>
                                    <SelectItem value="it-IT">Italian</SelectItem>
                                    <SelectItem value="pt-PT">Portuguese</SelectItem>
                                    <SelectItem value="ru-RU">Russian</SelectItem>
                                    <SelectItem value="ja-JP">Japanese</SelectItem>
                                    <SelectItem value="ko-KR">Korean</SelectItem>
                                    <SelectItem value="zh-CN">Chinese</SelectItem>
                                    <SelectItem value="ar-SA">Arabic</SelectItem>
                                    <SelectItem value="hi-IN">Hindi</SelectItem>
                                    <SelectItem value="nl-NL">Dutch</SelectItem>
                                    <SelectItem value="pl-PL">Polish</SelectItem>
                                    <SelectItem value="tr-TR">Turkish</SelectItem>
                                    <SelectItem value="he-IL">Hebrew</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTranslateDocument}
                                disabled={isTranslating || !content.trim()}
                                className="h-9 px-3 text-xs"
                            >
                                {isTranslating ? (
                                    <>
                                        <Loader2 size={14} className="mr-1 animate-spin" />
                                        {t('translating')}
                                    </>
                                ) : (
                                    <>
                                        <Languages size={14} className="mr-1" />
                                        {t('translate')}
                                    </>
                                )}
                            </Button>
                            {translatedContent && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setTranslatedContent(null);
                                        toast.info(t('showingOriginal'));
                                    }}
                                    className="h-9 px-2 text-xs"
                                >
                                    <X size={14} />
                                </Button>
                            )}
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
                                <span>{isGeneratingBg ? t('generating') : t('magicBackground')}</span>
                            </Button>

                            <button onClick={() => { setTheme('light'); setBgImage(null); }} className="w-6 h-6 rounded-full bg-white border border-slate-300 shadow-sm" title={t('themes.light')} />
                            <button onClick={() => { setTheme('sepia'); setBgImage(null); }} className="w-6 h-6 rounded-full bg-[#f4ecd8] border border-[#d3c5a3] shadow-sm" title={t('themes.sepia')} />
                            <button onClick={() => { setTheme('dark'); setBgImage(null); }} className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 shadow-sm" title={t('themes.dark')} />
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
                        className="max-w-4xl w-full transition-all duration-300"
                        style={{
                            fontSize: `${textSize}px`,
                            lineHeight: lineSpacing
                        }}
                    >
                        {lineFocusEnabled ? (
                            // Line Focus Mode
                            <div className="space-y-4">
                                {lines.map((line, lineIndex) => (
                                    <div
                                        key={lineIndex}
                                        className={cn(
                                            "transition-all duration-300 p-4 rounded-lg cursor-pointer",
                                            lineIndex === focusedLineIndex
                                                ? "opacity-100 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500"
                                                : "opacity-30 hover:opacity-60"
                                        )}
                                        onClick={() => setFocusedLineIndex(lineIndex)}
                                        onMouseEnter={() => setFocusedLineIndex(lineIndex)}
                                    >
                                        {line}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Normal Mode with Word Highlighting
                            <div
                                onMouseUp={() => {
                                    const selection = window.getSelection();
                                    if (selection && selection.toString().trim()) {
                                        setSelectedText(selection.toString().trim());
                                    }
                                }}
                            >
                                {words.map((word, index) => (
                                    <span
                                        key={index}
                                        className={cn(
                                            "transition-colors duration-200 rounded px-0.5 mx-0.5 inline-block cursor-pointer",
                                            index === currentWordIndex
                                                ? "bg-yellow-300 text-black transform scale-105"
                                                : ""
                                        )}
                                    >
                                        {word}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="h-24 border-t border-black/10 dark:border-white/10 flex flex-col justify-center px-8 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                    <div className="max-w-2xl mx-auto w-full flex items-center gap-6">

                        <div className="flex-1 flex items-center gap-4">
                            <Volume2 size={20} className="text-slate-600 dark:text-slate-400 flex-shrink-0" />
                            <Select
                                value={voice?.name || ''}
                                onValueChange={(val) => {
                                    const selectedVoice = voices.find(v => v.name === val);
                                    if (selectedVoice) {
                                        setVoice(selectedVoice);
                                        console.log('ImmersiveReader: Voice selected', selectedVoice.name);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full min-w-[300px] h-12 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-slate-100 font-semibold shadow-md hover:shadow-lg transition-all relative z-10">
                                    <SelectValue placeholder={voices.length > 0 ? t('selectVoice') : t('loadingVoices')} />
                                </SelectTrigger>
                                <SelectContent
                                    className="max-h-[450px] !bg-white dark:!bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-2xl !opacity-100"
                                    style={{ zIndex: 10000 }}
                                >
                                    {voices.length === 0 ? (
                                        <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                            <div className="animate-pulse">{t('loadingVoices')}</div>
                                        </div>
                                    ) : (
                                        (() => {
                                            // Enhanced voice categorization
                                            const maleVoices = voices.filter(v => {
                                                const name = v.name.toLowerCase();
                                                return name.includes('male') ||
                                                    name.includes('man') ||
                                                    name.includes('david') ||
                                                    name.includes('daniel') ||
                                                    name.includes('james') ||
                                                    name.includes('thomas') ||
                                                    name.includes('mark') ||
                                                    name.includes('alex') ||
                                                    name.includes('male voice') ||
                                                    name.includes('google uk english male') ||
                                                    name.includes('microsoft david');
                                            });

                                            const femaleVoices = voices.filter(v => {
                                                const name = v.name.toLowerCase();
                                                return name.includes('female') ||
                                                    name.includes('woman') ||
                                                    name.includes('samantha') ||
                                                    name.includes('karen') ||
                                                    name.includes('susan') ||
                                                    name.includes('zira') ||
                                                    name.includes('hazel') ||
                                                    name.includes('linda') ||
                                                    name.includes('female voice') ||
                                                    name.includes('google uk english female') ||
                                                    name.includes('microsoft zira') ||
                                                    name.includes('microsoft hazel');
                                            });

                                            const otherVoices = voices.filter(v =>
                                                !maleVoices.includes(v) && !femaleVoices.includes(v)
                                            );

                                            return (
                                                <>
                                                    {femaleVoices.length > 0 && (
                                                        <>
                                                            <div className="px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-900/30 dark:to-pink-800/20 border-b border-pink-200/50 dark:border-pink-800/50 sticky top-0 z-10 backdrop-blur-sm">
                                                                🔊 Female Voices ({femaleVoices.length})
                                                            </div>
                                                            {femaleVoices.map(v => (
                                                                <SelectItem
                                                                    key={v.name}
                                                                    value={v.name}
                                                                    className="cursor-pointer hover:bg-pink-50/80 dark:hover:bg-pink-900/30 focus:bg-pink-100 dark:focus:bg-pink-900/40 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-2.5 w-full">
                                                                        <span className="text-lg">👩</span>
                                                                        <div className="flex-1 min-w-0">
                                                                            <span className="font-medium text-slate-900 dark:text-slate-100 block truncate">{v.name}</span>
                                                                            <span className="text-xs text-slate-500 dark:text-slate-400">{v.lang}</span>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                            {(maleVoices.length > 0 || otherVoices.length > 0) && (
                                                                <div className="border-t border-slate-200/50 dark:border-slate-700/50 my-1" />
                                                            )}
                                                        </>
                                                    )}
                                                    {maleVoices.length > 0 && (
                                                        <>
                                                            <div className="px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 border-b border-blue-200/50 dark:border-blue-800/50 sticky top-0 z-10 backdrop-blur-sm">
                                                                🔊 Male Voices ({maleVoices.length})
                                                            </div>
                                                            {maleVoices.map(v => (
                                                                <SelectItem
                                                                    key={v.name}
                                                                    value={v.name}
                                                                    className="cursor-pointer hover:bg-blue-50/80 dark:hover:bg-blue-900/30 focus:bg-blue-100 dark:focus:bg-blue-900/40 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-2.5 w-full">
                                                                        <span className="text-lg">👨</span>
                                                                        <div className="flex-1 min-w-0">
                                                                            <span className="font-medium text-slate-900 dark:text-slate-100 block truncate">{v.name}</span>
                                                                            <span className="text-xs text-slate-500 dark:text-slate-400">{v.lang}</span>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                            {otherVoices.length > 0 && (
                                                                <div className="border-t border-slate-200/50 dark:border-slate-700/50 my-1" />
                                                            )}
                                                        </>
                                                    )}
                                                    {otherVoices.length > 0 && (
                                                        <>
                                                            <div className="px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-10 backdrop-blur-sm">
                                                                🔊 Other Voices ({otherVoices.length})
                                                            </div>
                                                            {otherVoices.map(v => (
                                                                <SelectItem
                                                                    key={v.name}
                                                                    value={v.name}
                                                                    className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-2.5 w-full">
                                                                        <div className="flex-1 min-w-0">
                                                                            <span className="font-medium text-slate-900 dark:text-slate-100 block truncate">{v.name}</span>
                                                                            <span className="text-xs text-slate-500 dark:text-slate-400">{v.lang}</span>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </>
                                                    )}
                                                    {/* Fallback: if no categorization worked, show all */}
                                                    {maleVoices.length === 0 && femaleVoices.length === 0 && otherVoices.length === 0 && voices.length > 0 && (
                                                        <>
                                                            <div className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                                                All Voices ({voices.length})
                                                            </div>
                                                            {voices.map(v => (
                                                                <SelectItem key={v.name} value={v.name}>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium">{v.name}</span>
                                                                        <span className="text-xs text-slate-500 dark:text-slate-400">({v.lang})</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </>
                                                    )}
                                                </>
                                            );
                                        })()
                                    )}
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
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{t('speed')}: {speed}x</span>
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
            {renderTranslateAndRead()}
        </AnimatePresence>
    );
}

