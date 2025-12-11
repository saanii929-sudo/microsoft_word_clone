"use client";

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
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

// Type definitions for Speech Recognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface Window {
  SpeechRecognition: {
    new (): SpeechRecognition;
  };
  webkitSpeechRecognition: {
    new (): SpeechRecognition;
  };
}

interface VoiceToTextProps {
  editor: any;
  onClose?: () => void;
}

export function VoiceToText({ editor, onClose }: VoiceToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const recognitionRef = useRef<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Common languages for speech recognition
  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'pt-PT', name: 'Portuguese (Portugal)' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'nl-NL', name: 'Dutch' },
    { code: 'pl-PL', name: 'Polish' },
    { code: 'tr-TR', name: 'Turkish' },
  ];

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        try {
          setIsSupported(true);
          const recognition = new SpeechRecognition();
          
          // Configure recognition settings
          recognition.continuous = true; // Keep listening until stopped
          recognition.interimResults = true; // Show interim results
          recognition.lang = selectedLanguage; // Use selected language
          
          // Set max alternatives (optional)
          if ('maxAlternatives' in recognition) {
            (recognition as any).maxAlternatives = 1;
          }
        
        // Event handlers
        recognition.onstart = () => {
          console.log('VoiceToText: Recognition started');
          setIsRecording(true);
          setIsProcessing(true);
          toast.success('Recording started...');
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          // Process all results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          // Update state
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript);
            setInterimTranscript('');
          } else {
            setInterimTranscript(interimTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('VoiceToText: Recognition error:', event);
          setIsRecording(false);
          setIsProcessing(false);
          
          // Handle different error object structures
          const errorCode = event?.error || event?.code || 'unknown';
          const errorMessage = event?.message || '';
          
          let userFriendlyMessage = 'Speech recognition error';
          
          switch (errorCode) {
            case 'no-speech':
              userFriendlyMessage = 'No speech detected. Please try again.';
              break;
            case 'audio-capture':
              userFriendlyMessage = 'No microphone found. Please check your microphone.';
              break;
            case 'not-allowed':
            case 'PermissionDeniedError':
              userFriendlyMessage = 'Microphone permission denied. Please allow microphone access in your browser settings.';
              break;
            case 'network':
            case 'NetworkError':
              userFriendlyMessage = 'Network error. Please check your connection.';
              break;
            case 'aborted':
            case 'AbortError':
              // User stopped recording, don't show error
              return;
            case 'service-not-allowed':
              userFriendlyMessage = 'Speech recognition service not available. Please try again later.';
              break;
            case 'bad-grammar':
              userFriendlyMessage = 'Grammar error in speech recognition.';
              break;
            case 'language-not-supported':
              userFriendlyMessage = 'Language not supported.';
              break;
            default:
              // If we have a message, use it; otherwise use the error code
              if (errorMessage) {
                userFriendlyMessage = errorMessage;
              } else if (errorCode !== 'unknown') {
                userFriendlyMessage = `Speech recognition error: ${errorCode}`;
              } else {
                userFriendlyMessage = 'Speech recognition failed. Please check your microphone and try again.';
              }
          }
          
          // Only show error if it's not a user-initiated abort
          if (errorCode !== 'aborted' && errorCode !== 'AbortError') {
            toast.error(userFriendlyMessage);
          }
        };

        recognition.onend = () => {
          console.log('VoiceToText: Recognition ended');
          setIsRecording(false);
          setIsProcessing(false);
          
          // Don't auto-insert - let user decide when to insert
          // This gives them a chance to review and edit the transcript first
        };

          recognitionRef.current = recognition;
        } catch (initError: any) {
          console.error('VoiceToText: Error initializing recognition:', initError);
          setIsSupported(false);
          toast.error('Failed to initialize speech recognition. Please refresh the page and try again.');
        }
      } else {
        setIsSupported(false);
        console.warn('VoiceToText: Speech recognition not supported in this browser');
        toast.error('Voice-to-text is not supported in your browser. Please use Chrome, Edge, or Safari.');
      }
    }

    return () => {
      // Cleanup: stop recognition if component unmounts
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]); // Re-initialize when language changes

  // Note: We'll handle insertion manually when user clicks "Insert into Editor" or when recording stops
  // This prevents infinite loops from useEffect dependencies

  const insertTranscriptToEditor = () => {
    if (!editor) {
      toast.error('Editor not available');
      return;
    }

    // Use current state values
    const currentTranscript = transcript;
    const currentInterim = interimTranscript;
    const textToInsert = currentTranscript + (currentInterim ? currentInterim : '');
    
    if (textToInsert.trim()) {
      try {
        // Focus the editor first, then insert text
        const textToAdd = textToInsert.trim() + ' ';
        
        // Use chain API for reliable text insertion
        editor
          .chain()
          .focus()
          .insertContent(textToAdd)
          .run();
        
        toast.success('Text inserted successfully!');
        
        // Reset transcript
        setTranscript('');
        setInterimTranscript('');
        
        // Close if onClose callback provided
        if (onClose) {
          onClose();
        }
      } catch (error: any) {
        console.error('Error inserting text:', error);
        toast.error('Failed to insert text. Please try again.');
      }
    } else {
      toast.error('No text to insert');
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not available');
      return;
    }

    if (!editor) {
      toast.error('Editor not available');
      return;
    }

    try {
      // Reset previous transcript
      setTranscript('');
      setInterimTranscript('');
      
      // Start recognition
      recognitionRef.current.start();
    } catch (error: any) {
      console.error('VoiceToText: Error starting recognition:', error);
      toast.error('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        // Check if recognition is active before stopping
        const recognition = recognitionRef.current as any;
        if (recognition.state === 'running' || recognition.state === 'listening') {
          recognition.stop();
        } else {
          // If not running, just update state
          setIsRecording(false);
          setIsProcessing(false);
        }
      } catch (error: any) {
        console.error('VoiceToText: Error stopping recognition:', error);
        // Force update state even if stop fails
        setIsRecording(false);
        setIsProcessing(false);
      }
    } else {
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Voice-to-text is not supported in your browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Voice to Text</h3>
          {isRecording && (
            <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              Recording...
            </span>
          )}
        </div>
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="sm"
          onClick={toggleRecording}
          disabled={isProcessing && !isRecording}
          className={cn(
            "gap-2",
            isRecording && "animate-pulse"
          )}
        >
          {isProcessing && !isRecording ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isRecording ? (
            <>
              <MicOff className="h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Start Recording
            </>
          )}
        </Button>
      </div>

      {/* Language Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span>🌐</span>
          Language:
        </label>
        <Select
          value={selectedLanguage}
          onValueChange={(value) => {
            if (isRecording) {
              toast.warning('Please stop recording before changing language');
              return;
            }
            setSelectedLanguage(value);
            toast.success(`Language changed to ${languages.find(l => l.code === value)?.name || value}`);
          }}
          disabled={isRecording}
        >
          <SelectTrigger className="w-full h-11 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 font-semibold shadow-md hover:shadow-lg transition-all">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="max-h-[400px] bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl">
            {languages.map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.code}
                className="cursor-pointer hover:bg-blue-50/80 dark:hover:bg-blue-900/30 focus:bg-blue-100 dark:focus:bg-blue-900/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 w-full">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{lang.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">({lang.code})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(transcript || interimTranscript) && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Transcript:
          </label>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 min-h-[60px] max-h-[200px] overflow-y-auto">
            <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {transcript}
              {interimTranscript && (
                <span className="text-gray-500 dark:text-gray-400 italic">
                  {interimTranscript}
                </span>
              )}
            </p>
          </div>
          
          {!isRecording && (transcript || interimTranscript) && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={insertTranscriptToEditor}
                className="flex-1"
              >
                Insert into Editor
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTranscript('');
                  setInterimTranscript('');
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      )}

      {!transcript && !interimTranscript && !isRecording && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
          Click "Start Recording" to begin voice input
        </p>
      )}
    </div>
  );
}

