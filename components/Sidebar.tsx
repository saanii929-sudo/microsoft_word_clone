"use client";

import { Home, Image, BarChart3, Wand2, Settings, Type, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SidebarProps {
    activeItem?: string;
    onItemClick?: (item: string) => void;
}

export function Sidebar({ activeItem = 'pages', onItemClick }: SidebarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const t = useTranslations('Sidebar');

    const SIDEBAR_ITEMS = [
        { id: 'pages', icon: Home, label: t('pages') },
    ];

    return (
        <div
            className={cn(
                "h-full bg-[#1A1A1A] border-r border-white/10 flex flex-col items-start py-4 gap-2 transition-all duration-300 ease-in-out",
                isExpanded ? "w-48" : "w-[60px]"
            )}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => onItemClick?.(item.id)}
                        className={cn(
                            "w-full h-12 flex items-center gap-3 px-3 rounded-r-xl transition-all duration-300 relative group",
                            isActive
                                ? " bg-purple-600/20 text-white"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <div className={cn(
                            "w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300",
                            isActive && "  shadow-lg shadow-purple-500/50"
                        )}>
                            <Icon size={18} />
                        </div>

                        <span className={cn(
                            "text-sm font-medium whitespace-nowrap transition-all duration-300",
                            isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        )}>
                            {item.label}
                        </span>

                        {isActive && (
                            <div className="absolute left-0 w-1 h-8 bg-purple-600  rounded-r-full" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
