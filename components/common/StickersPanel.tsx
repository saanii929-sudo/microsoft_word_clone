"use client"

import React from 'react'
import { ArrowLeft, SearchNormal1 } from 'iconsax-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function StickersPanel({ onBack }: { onBack: () => void }) {
    const Sticker = ({ text, className = '' }: { text: string, className?: string }) => (
        <div className={`px-3 py-2 text-[11px] font-semibold rounded-[10px] shadow-sm bg-white ${className}`}>{text}</div>
    )

    return (
        <div className='flex flex-col w-full h-full gap-4'>
            <div className='flex items-center gap-3 text-white'>
                <Button onClick={onBack} aria-label="Back" variant="ghost" className='p-1 rounded hover:bg-white/10 cursor-pointer'>
                    <ArrowLeft size="20" color="#ffffff" />
                </Button>
                <p className='text-sm'>Stickers</p>
            </div>
            <div className='flex items-center justify-between px-3 h-[44px] w-full bg-white rounded-lg gap-2'>
                <SearchNormal1 size="18" color="#555555" className="shrink-0" />
                <Input
                    placeholder='Search stickers'
                    className='h-[44px] flex-1 outline-none border-none focus:ring-0 focus-visible:ring-0 px-0'
                />
            </div>

            {/* Placeholder tiles grid */}
            <div className='grid grid-cols-3 gap-3'>
                {Array.from({ length: 18 }).map((_, idx) => (
                    <div key={idx} className='w-full aspect-square bg-white rounded-[10px]' />
                ))}
            </div>

            {/* Sample text stickers row (matches screenshot vibe) */}
            <div className='grid grid-cols-3 gap-3'>
                <Sticker text='button' className='bg-[#4B4BFF] text-white rounded-[12px]' />
                <Sticker text='oh yeah!' className='text-[#1E5AF9] border border-[#1E5AF9] rounded-[12px] bg-white' />
                <Sticker text='sunflower' className='bg-[#F6EFA6] text-[#3A3A3A] rounded-[16px]' />

                <Sticker text='yes sire' className='text-[#FF7A00] border-2 border-[#FF7A00] rounded-[10px]' />
                <Sticker text='cool' className='text-white bg-gradient-to-r from-[#5D2AE6] to-[#A729F5] rounded-[10px]' />
                <Sticker text='Chamfer' className='text-white bg-[#FF6B3D] rounded-[8px]' />

                <Sticker text='garden' className='text-white bg-[#1E8E3E] rounded-[14px]' />
                <Sticker text='gavin' className='text-[#7C3AED] border-2 border-[#7C3AED] rounded-[12px] bg-white' />
                <Sticker text='tron' className='text-[#3B82F6] border-2 border-[#3B82F6] rounded-[10px]' />

                <Sticker text='buy now' className='text-black bg-[#FFE45E] rounded-[8px]' />
                <div className='w-full aspect-square bg-white rounded-[10px]' />
                <div className='w-full aspect-square bg-white rounded-[10px]' />
            </div>
        </div>
    )
}


