
"use client";

import React, { useState } from "react";
import { X, Send, Image as ImageIcon, Video, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AiSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    editor: any;
}

type MediaType = "image" | "video";

export function AiSidebar({ isOpen, onClose, editor }: AiSidebarProps) {
    const [prompt, setPrompt] = useState("");
    const [mediaType, setMediaType] = useState<MediaType>("image");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedHistory, setGeneratedHistory] = useState<{ type: MediaType, url: string, prompt: string }[]>([]);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);

        try {
            const endpoint = mediaType === 'image'
                ? '/api/generate-image'
                : '/api/generate-video';

            // Try to fetch from API
            let response: Response;
            try {
                response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: prompt.trim(),
                        size: '1024x1024',
                        duration: 5,
                    }),
                });
            } catch (fetchError: any) {
                console.error('Network error:', fetchError);
                toast.error(`Network Error: ${fetchError.message || 'Failed to connect to server'}. Make sure your development server is running.`);
                setIsGenerating(false);
                return;
            }

            // Try to parse JSON response
            let data: any = {};
            const contentType = response.headers.get('content-type') || 'unknown';
            let responseText = '';
            
            try {
                // Get the raw response text first
                responseText = await response.text();
                console.log('Raw response received:', {
                    status: response.status,
                    statusText: response.statusText,
                    contentType: contentType,
                    textLength: responseText.length,
                    textPreview: responseText.substring(0, 200)
                });
                
                if (contentType.includes('application/json')) {
                    if (responseText.trim()) {
                        try {
                            data = JSON.parse(responseText);
                            console.log('Successfully parsed JSON response:', Object.keys(data));
                        } catch (parseError: any) {
                            console.error('JSON parse error:', parseError.message, 'Response text preview:', responseText.substring(0, 200));
                            data = { 
                                error: 'Invalid JSON response from server', 
                                message: `Failed to parse JSON: ${parseError.message}`,
                                rawResponse: responseText.substring(0, 500)
                            };
                        }
                    } else {
                        console.warn('Empty JSON response body');
                        data = { 
                            error: 'Empty response from server', 
                            message: 'Server returned an empty response body'
                        };
                    }
                } else {
                    // Not JSON
                    console.warn('Non-JSON response. Content-Type:', contentType);
                    data = { 
                        error: 'Invalid response format', 
                        message: responseText || `Server returned ${contentType} instead of JSON`,
                        rawResponse: responseText.substring(0, 500)
                    };
                }
            } catch (textError: any) {
                console.error('Error reading response text:', textError.message || textError);
                data = { 
                    error: 'Failed to read response', 
                    message: textError.message || 'Could not read response from server'
                };
            }

            // If API fails, show detailed error
            if (!response.ok) {
                const errorMessage = data.details || data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
                const hint = data.hint || '';
                
                // Log error details safely
                try {
                    console.error('API Error Details:', {
                        status: response.status,
                        statusText: response.statusText,
                        contentType: contentType,
                        endpoint: endpoint,
                        hasError: !!data.error,
                        hasMessage: !!data.message,
                        hasDetails: !!data.details,
                        errorMessage: data.error,
                        message: data.message,
                        details: data.details,
                        dataKeys: Object.keys(data || {})
                    });
                } catch (logError) {
                    // Fallback if logging fails
                    console.error('API Error (simplified):', response.status, response.statusText, endpoint);
                }

                // Show specific error messages based on status code
                if (response.status === 500 && (data.error?.includes('not configured') || data.message?.includes('not configured'))) {
                    toast.error(`API Key Error: ${errorMessage}${hint ? '. ' + hint : ''}. Please check your .env.local file and restart the server.`, {
                        duration: 6000
                    });
                } else if (response.status === 401) {
                    toast.error(`Invalid API Key: ${errorMessage}. Please verify your key at platform.openai.com`, {
                        duration: 6000
                    });
                } else if (response.status === 402) {
                    toast.error(`Payment Required: ${errorMessage}. Please add credits to your OpenAI account.`, {
                        duration: 6000
                    });
                } else if (response.status === 429) {
                    toast.error(`Rate Limit: ${errorMessage}. Please wait a moment and try again.`, {
                        duration: 6000
                    });
                } else {
                    toast.error(`Generation Failed: ${errorMessage}${hint ? '. ' + hint : ''}`, {
                        duration: 6000
                    });
                }
                
                setIsGenerating(false);
                return;
            }

            // Success path
            const newMedia = {
                type: mediaType,
                url: data.url,
                prompt: data.revised_prompt || prompt,
            };

            setGeneratedHistory(prev => [newMedia, ...prev]);
            setPrompt("");
        } catch (error: any) {
            console.error('Error generating media:', error);
            toast.error(`Failed to generate ${mediaType}: ${error.message || 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const insertMedia = (item: { type: MediaType, url: string }) => {
        if (item.type === 'image') {
            editor.chain().focus().setImage({ src: item.url }).run();
            toast.success('Image inserted');
        } else {
            // Check if editor has setVideo command (from Video extension)
            if (editor.can().setVideo({ src: item.url })) {
                editor.chain().focus().setVideo({ src: item.url, controls: true }).run();
                toast.success('Video inserted');
            } else {
                // Fallback: insert as image with video indicator
                editor.chain().focus().setImage({ src: item.url, title: "AI Generated Video" }).run();
                toast.success('Video inserted (as image placeholder)');
            }
        }
    };

    return (
        <div className="w-80 h-screen bg-white border-l border-[#d6d6d6] flex flex-col shadow-xl absolute right-0 top-0 z-50 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] border-b border-[#e2e2e2]">
                <div className="flex items-center gap-2">
                    <Wand2 size={16} className="text-[#2B579A]" />
                    <span className="font-semibold text-gray-800">AI Media Studio</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 hover:bg-gray-200 rounded-full">
                    <X size={14} />
                </Button>
            </div>

            <div className="flex flex-col flex-1 p-4 gap-4 bg-[#f0f2f5]">
                {/* Controls */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e2e2] flex flex-col gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold text-gray-600">Media Type</Label>
                        <Select value={mediaType} onValueChange={(v: MediaType) => setMediaType(v)}>
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="image"><div className="flex items-center gap-2"><ImageIcon size={14} /> Generate Image</div></SelectItem>
                                <SelectItem value="video"><div className="flex items-center gap-2"><Video size={14} /> Generate Video</div></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-semibold text-gray-600">Prompt</Label>
                        <Textarea
                            placeholder={`Describe the ${mediaType} you want to create...`}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="resize-none min-h-[80px] text-sm focus-visible:ring-[#2B579A]"
                        />
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className="bg-[#2B579A] hover:bg-[#1e3e70] text-xs h-8"
                    >
                        {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                </div>

                {/* History / Results */}
                <div className="flex-1 flex flex-col min-h-0">
                    <Label className="text-xs font-semibold text-gray-600 mb-2">Recent Generations</Label>
                    <ScrollArea className="flex-1">
                        <div className="flex flex-col gap-3 pr-3">
                            {generatedHistory.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-xs italic">
                                    No media generated yet.
                                </div>
                            )}
                            {generatedHistory.map((item, i) => (
                                <div key={i} className="bg-white rounded-lg border border-[#e2e2e2] overflow-hidden group">
                                    <div className="aspect-video bg-gray-100 relative">
                                        <img src={item.url} alt="Generated" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button size="sm" variant="secondary" onClick={() => insertMedia(item)} className="h-7 text-xs">
                                                Insert
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-[10px] text-gray-500 line-clamp-2" title={item.prompt}>{item.prompt}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
