"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Wand2, Sparkles, RefreshCw, Maximize2, Minimize2, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface AiWriterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedText: string;
    onInsert: (text: string) => void;
}

const AI_ACTIONS = [
    { id: 'rewrite', label: 'Rewrite', icon: RefreshCw, description: 'Improve clarity and style' },
    { id: 'longer', label: 'Make Longer', icon: Maximize2, description: 'Expand with details' },
    { id: 'shorter', label: 'Make Shorter', icon: Minimize2, description: 'Make concise' },
    { id: 'fix', label: 'Fix Grammar', icon: CheckCircle2, description: 'Correct errors' },
    { id: 'summarize', label: 'Summarize', icon: FileText, description: 'Create summary' },
];

const TONE_OPTIONS = [
    { id: 'formal', label: 'Formal' },
    { id: 'casual', label: 'Casual' },
    { id: 'professional', label: 'Professional' },
];

export function AiWriterDialog({ open, onOpenChange, selectedText, onInsert }: AiWriterDialogProps) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedText, setGeneratedText] = useState('');

    const handleAction = async (action: string) => {
        if (action === 'generate' && !prompt.trim()) {
            toast.error('Please enter a prompt');
            return;
        }

        if (action !== 'generate' && !selectedText) {
            toast.error('Please select some text first');
            return;
        }

        setIsGenerating(true);
        setGeneratedText('');

        try {
            console.log('Sending request to /api/ai-writer with:', { prompt: prompt.trim(), action, selectedText });

            const response = await fetch('/api/ai-writer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    action,
                    selectedText,
                }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                console.error('API Error:', data);
                toast.error(data.message || data.error || 'Failed to generate text');
                return;
            }

            setGeneratedText(data.text);
            toast.success('Text generated successfully!');
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(`Failed to generate text: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleInsert = () => {
        if (generatedText) {
            onInsert(generatedText);
            setGeneratedText('');
            setPrompt('');
            onOpenChange(false);
            toast.success('Text inserted!');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">
                            <Wand2 className="w-5 h-5" />
                        </div>
                        AI Writer
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-2">
                    {/* Generate Section */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700">Generate New Content</Label>
                        <div className="flex gap-2">
                            <Textarea
                                placeholder="Describe what you want to write..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="flex-1 min-h-[60px] bg-white/60 border-white/40 focus-visible:ring-indigo-400"
                            />
                            <Button
                                onClick={() => handleAction('generate')}
                                disabled={!prompt.trim() || isGenerating}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-auto"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate
                            </Button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    {selectedText && (
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-slate-700">Quick Actions</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {AI_ACTIONS.map((action) => (
                                    <Button
                                        key={action.id}
                                        variant="outline"
                                        onClick={() => handleAction(action.id)}
                                        disabled={isGenerating}
                                        className="justify-start h-auto py-3 bg-white/60 border-white/40 hover:bg-white/80"
                                    >
                                        <action.icon className="w-4 h-4 mr-2 text-indigo-600" />
                                        <div className="text-left">
                                            <div className="font-medium text-sm">{action.label}</div>
                                            <div className="text-xs text-slate-500">{action.description}</div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tone Options */}
                    {selectedText && (
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-slate-700">Change Tone</Label>
                            <div className="flex gap-2">
                                {TONE_OPTIONS.map((tone) => (
                                    <Button
                                        key={tone.id}
                                        variant="outline"
                                        onClick={() => handleAction(tone.id)}
                                        disabled={isGenerating}
                                        className="flex-1 bg-white/60 border-white/40 hover:bg-white/80"
                                    >
                                        {tone.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Generated Text */}
                    {(isGenerating || generatedText) && (
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700">Generated Text</Label>
                            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 min-h-[120px]">
                                {isGenerating ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{generatedText}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t border-slate-200/60 pt-4 mt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleInsert}
                        disabled={!generatedText}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        Insert Text
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
