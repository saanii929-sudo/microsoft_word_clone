"use client";

import { Search, Image as ImageIcon, Video, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MediaLibraryPanelProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const TABS = ['Uploaded (0)', 'AI Generated (1)', 'All (1)'];

export function MediaLibraryPanel({ isOpen = true, onClose }: MediaLibraryPanelProps) {
    const [activeTab, setActiveTab] = useState('AI Generated (1)');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    return (
        <div className="w-80 h-full bg-[#1a1a1a] border-r border-white/10 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">Media Library</h2>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <Input
                        placeholder="Search media..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 bg-[#2a2a2a] border-white/10 text-white placeholder:text-gray-500"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 mt-3">
                    <select className="flex-1 h-8 bg-[#2a2a2a] border border-white/10 rounded-md text-white text-sm px-2">
                        <option>All folders</option>
                    </select>
                    <select className="flex-1 h-8 bg-[#2a2a2a] border border-white/10 rounded-md text-white text-sm px-2">
                        <option>All types</option>
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 py-2 text-sm transition-colors",
                            activeTab === tab
                                ? "text-[#00d4ff] border-b-2 border-[#00d4ff]"
                                : "text-gray-400 hover:text-white"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Generate Buttons */}
            <div className="p-4 space-y-2">
                <Button
                    variant="outline"
                    className="w-full justify-start h-9 bg-[#2a2a2a] border-white/10 text-white hover:bg-white/5"
                >
                    <ImageIcon size={16} className="mr-2" />
                    Generate Image
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start h-9 bg-[#2a2a2a] border-white/10 text-white hover:bg-white/5"
                >
                    <Video size={16} className="mr-2" />
                    Generate Video
                </Button>
            </div>

            {/* Media Grid */}
            <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 pb-4">
                    {/* Sample AI Generated Image */}
                    <div className="group relative rounded-lg overflow-hidden bg-[#2a2a2a] cursor-pointer hover:ring-2 hover:ring-[#00d4ff] transition-all">
                        <div className="aspect-video bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
                            <div className="text-white text-xs text-center px-4">
                                AI Generated Image
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="flex items-center gap-2 mb-1">
                                <ImageIcon size={12} className="text-[#00d4ff]" />
                                <span className="text-xs text-white font-medium">AI Generated Image</span>
                            </div>
                            <div className="text-[10px] text-gray-500">0 B</div>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="sm" className="h-7 bg-[#00d4ff] text-black hover:bg-[#00b8e6]">
                                Insert
                            </Button>
                        </div>
                    </div>

                    {/* Empty State */}
                    {activeTab === 'Uploaded (0)' && (
                        <div className="text-center py-12 text-gray-500 text-sm">
                            <Plus size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No uploaded media</p>
                            <p className="text-xs mt-1">Upload images or videos to get started</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
