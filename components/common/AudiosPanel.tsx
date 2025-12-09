"use client"

import React from 'react'
import { ArrowLeft, SearchNormal1, Play } from 'iconsax-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AudiosPanel({ onBack }: { onBack: () => void }) {
    const items = [
        { title: "GOD'S OTHER COUNTRY" },
        { title: "GOOD MORNING, GABE HAGER!" },
        { title: "GOD'S OTHER COUNTRY" },
        { title: "GOOD MORNING, GABE HAGER!" },
        { title: "GOD'S OTHER COUNTRY" },
        { title: "GOOD MORNING, GABE HAGER!" },
    ]

    return (
        <div className='flex flex-col w-full h-full gap-4'>
            <div className='flex items-center gap-3 text-white'>
                <Button onClick={onBack} aria-label="Back" variant="ghost" className='p-1 rounded hover:bg-white/10 cursor-pointer'>
                    <ArrowLeft size="20" color="#ffffff" />
                </Button>
                <p className='text-sm'>Audios</p>
            </div>
            <div className='flex items-center justify-between px-3 h-[44px] w-full bg-white rounded-lg gap-2'>
                <SearchNormal1 size="18" color="#555555" className="shrink-0" />
                <Input
                    placeholder='Search audio'
                    className='h-[44px] flex-1 outline-none border-none focus:ring-0 focus-visible:ring-0 px-0'
                />
            </div>

            <div className='grid grid-cols-2 gap-4 pb-6'>
                {items.map((item, idx) => (
                    <Button key={idx} variant="ghost" className='w-full h-[140px] rounded-[10px] bg-[#2A2C39] text-left p-3 relative group hover:bg-[#2A2C39]'>
                        <div className='absolute right-3 bottom-20 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_0_16px_rgba(255,255,255,0.3)]'>
                            <Play size="12" color="#0F172A" />
                        </div>
                        <div className='absolute left-3 bottom-3 pr-10'>
                            <p className='text-white text-[11px] font-semibold leading-tight'>{item.title}</p>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    )
}


