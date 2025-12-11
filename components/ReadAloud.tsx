"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ReadAloudProps {
  editor: any;
}

export function ReadAloud({ editor }: ReadAloudProps) {
  const [selectedText, setSelectedText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Log component mount
  useEffect(() => {
    console.log('ReadAloud: Component mounted', { 
      hasEditor: !!editor,
      hasView: !!(editor?.view),
      editorType: typeof editor
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    return () => {
      // Cleanup: stop any ongoing speech when component unmounts
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    console.log('ReadAloud: useEffect triggered', { 
      hasEditor: !!editor,
      hasView: !!(editor?.view),
      editorState: editor?.state ? 'has state' : 'no state'
    });

    if (!editor) {
      console.log('ReadAloud: No editor provided');
      return;
    }

    if (!editor.view) {
      console.log('ReadAloud: Editor view not ready, waiting...');
      // Wait a bit for editor to be ready
      const timeout = setTimeout(() => {
        if (editor.view) {
          console.log('ReadAloud: Editor view ready after delay');
        } else {
          console.log('ReadAloud: Editor view still not ready');
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }

    console.log('ReadAloud: Setting up selection listeners');

    const handleSelectionUpdate = () => {
      try {
        if (!editor || !editor.state) return;
        
        const { from, to } = editor.state.selection;
        
        if (from !== to) {
          // Text is selected
          const text = editor.state.doc.textBetween(from, to, ' ');
          
          if (text.trim().length > 0) {
            setSelectedText(text.trim());
            
            // Get selection coordinates for popup positioning
            try {
              const { view } = editor;
              if (!view || !view.coordsAtPos) {
                console.warn('ReadAloud: view.coordsAtPos not available');
                return;
              }
              
              const startPos = view.coordsAtPos(from);
              const endPos = view.coordsAtPos(to);
              
              if (!startPos || !endPos) {
                console.warn('ReadAloud: Could not get coordinates');
                return;
              }
              
              // Position popup above the selection, centered
              // coordsAtPos returns coordinates relative to the viewport
              const top = Math.min(startPos.top, endPos.top) - 50;
              const left = (startPos.left + endPos.left) / 2;
              
              // Ensure popup stays within viewport
              const popupWidth = 150; // Approximate popup width
              const adjustedLeft = Math.max(
                popupWidth / 2 + 10,
                Math.min(left, window.innerWidth - popupWidth / 2 - 10)
              );
              
              // Ensure popup doesn't go above viewport
              const adjustedTop = Math.max(10, top);
              
              console.log('ReadAloud: Selection detected', { 
                text: text.substring(0, 20), 
                top: adjustedTop, 
                left: adjustedLeft,
                from,
                to
              });
              
              setPopupPosition({ top: adjustedTop, left: adjustedLeft });
              setShowPopup(true);
            } catch (error) {
              console.error('ReadAloud: Error calculating popup position:', error);
              // Fallback positioning - center of screen
              setPopupPosition({ 
                top: window.innerHeight / 2, 
                left: window.innerWidth / 2 
              });
              setShowPopup(true);
            }
          } else {
            setShowPopup(false);
            setSelectedText('');
          }
        } else {
          // No selection
          setShowPopup(false);
          setSelectedText('');
        }
      } catch (error) {
        console.error('ReadAloud: Error in handleSelectionUpdate:', error);
      }
    };

    const handleTransaction = () => {
      // Check selection after transactions too
      setTimeout(handleSelectionUpdate, 10);
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('transaction', handleTransaction);
    editor.on('blur', () => {
      setShowPopup(false);
      setSelectedText('');
    });

    // Also listen to mouseup and selection changes
    const editorElement = editor.view.dom;
    
    console.log('ReadAloud: Editor element found', { 
      element: editorElement,
      tagName: editorElement?.tagName 
    });

    const handleMouseUp = (e: MouseEvent) => {
      console.log('ReadAloud: Mouse up event');
      // Small delay to ensure selection is updated
      setTimeout(() => {
        console.log('ReadAloud: Checking selection after mouseup');
        handleSelectionUpdate();
      }, 100);
    };

    const handleMouseDown = (e: MouseEvent) => {
      console.log('ReadAloud: Mouse down event');
      // Check selection on mousedown too
      setTimeout(() => {
        handleSelectionUpdate();
      }, 100);
    };

    // Hide popup when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const popup = target.closest('.read-aloud-popup');
      
      if (!popup) {
        // Check if selection is still active
        const { from, to } = editor.state.selection;
        if (from === to) {
          setShowPopup(false);
          setSelectedText('');
        }
      }
    };

    // Listen to native selection changes
    const handleSelectionChange = () => {
      setTimeout(handleSelectionUpdate, 50);
    };

    if (editorElement) {
      editorElement.addEventListener('mouseup', handleMouseUp, true);
      editorElement.addEventListener('mousedown', handleMouseDown, true);
      console.log('ReadAloud: Event listeners attached to editor element');
    } else {
      console.error('ReadAloud: Editor element not found!');
    }

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('selectionchange', handleSelectionChange);
    console.log('ReadAloud: Document event listeners attached');

    // Also try to check selection immediately
    setTimeout(() => {
      console.log('ReadAloud: Initial selection check');
      handleSelectionUpdate();
    }, 500);

    return () => {
      console.log('ReadAloud: Cleaning up event listeners');
      if (editor) {
        editor.off('selectionUpdate', handleSelectionUpdate);
        editor.off('transaction', handleTransaction);
        editor.off('blur', handleSelectionUpdate);
      }
      if (editorElement) {
        editorElement.removeEventListener('mouseup', handleMouseUp, true);
        editorElement.removeEventListener('mousedown', handleMouseDown, true);
      }
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('selectionchange', handleSelectionChange);
      
      // Stop any ongoing speech
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, [editor]);

  const handleReadAloud = () => {
    if (!selectedText || !speechSynthesisRef.current) {
      toast.error('No text selected or speech synthesis not available');
      return;
    }

    // Stop any ongoing speech
    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      toast.error('Your browser does not support text-to-speech');
      return;
    }

    setIsPlaying(true);

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(selectedText);
    utteranceRef.current = utterance;

    // Configure voice settings
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume

    // Try to use a natural-sounding voice
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoices = voices.filter(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Natural') || voice.name.includes('Premium') || voice.name.includes('Enhanced'))
    );
    
    if (preferredVoices.length > 0) {
      utterance.voice = preferredVoices[0];
    } else if (voices.length > 0) {
      // Fallback to first English voice
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      if (englishVoices.length > 0) {
        utterance.voice = englishVoices[0];
      } else {
        utterance.voice = voices[0];
      }
    }

    // Event handlers
    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      toast.error('Error reading text aloud');
    };

    // Speak the text
    speechSynthesisRef.current.speak(utterance);
  };

  // Load voices when they become available
  useEffect(() => {
    if (typeof window !== 'undefined' && speechSynthesisRef.current) {
      const loadVoices = () => {
        // Voices might not be loaded immediately
        speechSynthesisRef.current?.getVoices();
      };
      
      speechSynthesisRef.current.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  // Debug: Log when popup should show
  useEffect(() => {
    if (showPopup && selectedText) {
      console.log('ReadAloud popup should be visible:', {
        showPopup,
        selectedText: selectedText.substring(0, 30),
        position: popupPosition
      });
    }
  }, [showPopup, selectedText, popupPosition]);

  // Render popup using portal to avoid z-index and positioning issues
  const popupContent = showPopup && selectedText ? (
    <div
      className={cn(
        "read-aloud-popup fixed z-[9999] flex items-center gap-2 bg-white dark:bg-gray-800",
        "shadow-2xl rounded-lg border-2 border-blue-500 dark:border-blue-400",
        "px-3 py-2 animate-in fade-in-0 zoom-in-95 duration-200",
        "backdrop-blur-sm"
      )}
      style={{
        top: `${popupPosition.top}px`,
        left: `${popupPosition.left}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'auto',
        position: 'fixed',
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReadAloud}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        title={isPlaying ? 'Stop reading' : 'Read aloud'}
      >
        {isPlaying ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        ) : (
          <Volume2 className="h-4 w-4 text-blue-600" />
        )}
      </Button>
      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {isPlaying ? 'Reading...' : 'Read aloud'}
      </span>
    </div>
  ) : null;

  // Use portal to render at document body level
  if (typeof window !== 'undefined') {
    return (
      <>
        {createPortal(popupContent, document.body)}
        {/* Debug indicator - remove this later */}
        {process.env.NODE_ENV === 'development' && (
          <div 
            style={{
              position: 'fixed',
              bottom: '10px',
              right: '10px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              fontSize: '10px',
              zIndex: 99999,
              borderRadius: '4px'
            }}
          >
            ReadAloud: {editor ? 'Ready' : 'No Editor'}
          </div>
        )}
      </>
    );
  }

  return null;
}

