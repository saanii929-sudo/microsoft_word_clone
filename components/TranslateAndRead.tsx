"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Languages, Volume2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TranslateAndReadProps {
  editor?: any;
  selectedText?: string;
  onTextSelected?: (text: string) => void;
}

const languages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-PT', name: 'Portuguese' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'nl-NL', name: 'Dutch' },
  { code: 'pl-PL', name: 'Polish' },
  { code: 'tr-TR', name: 'Turkish' },
];

export function TranslateAndRead({ editor, selectedText: externalSelectedText, onTextSelected }: TranslateAndReadProps) {
  const [selectedText, setSelectedText] = useState(externalSelectedText || '');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (externalSelectedText) {
      setSelectedText(externalSelectedText);
    }
  }, [externalSelectedText]);

  // Handle text selection in editor
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { state } = editor;
      const { selection } = state;
      
      if (!selection.empty) {
        const text = state.doc.textBetween(selection.from, selection.to, ' ');
        if (text.trim()) {
          setSelectedText(text);
          onTextSelected?.(text);
          
          // Calculate popup position
          const { view } = editor;
          const { from } = selection;
          const coords = view.coordsAtPos(from);
          
          setPopupPosition({
            top: coords.top + window.scrollY - 10,
            left: coords.left + window.scrollX + (coords.right - coords.left) / 2,
          });
          
          setShowPopup(true);
        } else {
          setShowPopup(false);
        }
      } else {
        setShowPopup(false);
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('transaction', handleSelectionUpdate);

    // Also listen to document selection changes
    const handleDocumentSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const text = selection.toString().trim();
        setSelectedText(text);
        onTextSelected?.(text);
        
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setPopupPosition({
          top: rect.top + window.scrollY - 10,
          left: rect.left + window.scrollX + (rect.width / 2),
        });
        
        setShowPopup(true);
      } else if (!editor.state.selection.empty) {
        // Fallback to editor selection
        handleSelectionUpdate();
      } else {
        setShowPopup(false);
      }
    };

    document.addEventListener('selectionchange', handleDocumentSelection);
    document.addEventListener('mouseup', handleDocumentSelection);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('transaction', handleSelectionUpdate);
      document.removeEventListener('selectionchange', handleDocumentSelection);
      document.removeEventListener('mouseup', handleDocumentSelection);
    };
  }, [editor, onTextSelected]);

  const handleTranslate = async () => {
    if (!selectedText.trim()) {
      toast.error('Please select some text first');
      return;
    }

    setIsTranslating(true);
    setTranslatedText('');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          targetLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Translation failed');
      }

      setTranslatedText(data.translatedText);
      toast.success('Translation completed!');
    } catch (error: any) {
      console.error('Translation error:', error);
      toast.error(`Translation failed: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReadAloud = () => {
    const textToRead = translatedText || selectedText;
    
    if (!textToRead.trim()) {
      toast.error('No text to read');
      return;
    }

    if (isPlaying) {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
      setIsPlaying(false);
      return;
    }

    if (!speechSynthesisRef.current) {
      toast.error('Speech synthesis not available');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Set language for speech
    utterance.lang = targetLanguage;
    
    // Try to find a voice matching the target language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(targetLanguage.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsPlaying(false);
      toast.error('Failed to read text aloud');
    };

    utteranceRef.current = utterance;
    speechSynthesisRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const popupContent = showPopup && selectedText ? (
    <div
      className={cn(
        "translate-popup fixed z-[9999] flex flex-col gap-2 bg-white dark:bg-gray-800",
        "shadow-2xl rounded-lg border-2 border-blue-500 dark:border-blue-400",
        "p-3 animate-in fade-in-0 zoom-in-95 duration-200",
        "min-w-[280px] max-w-[400px]"
      )}
      style={{
        top: `${popupPosition.top}px`,
        left: `${popupPosition.left}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'auto',
        position: 'fixed',
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Translate & Read</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPopup(false)}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-2">
        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslate}
            disabled={isTranslating || !selectedText.trim()}
            className="flex-1 h-8 text-xs"
          >
            {isTranslating ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="h-3 w-3 mr-1" />
                Translate
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleReadAloud}
            disabled={isPlaying && !translatedText && !selectedText.trim()}
            className="h-8 px-3 text-xs"
          >
            {isPlaying ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </Button>
        </div>

        {translatedText && (
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">Translated:</p>
            <p className="text-xs text-blue-800 dark:text-blue-200">{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  ) : null;

  // Use portal to render at document body level
  if (typeof window === 'undefined') return null;

  return createPortal(popupContent, document.body);
}

