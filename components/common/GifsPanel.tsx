"use client"

import React from 'react'
import { ArrowLeft, SearchNormal1 } from 'iconsax-react'
import { Upload as UploadIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function GifsPanel({ onBack }: { onBack: () => void }) {
    const Section = ({ title }: { title: string }) => (
        <div className='w-full mt-2'>
            <div className='flex items-center justify-between text-white mb-2'>
                <span className='text-xs'>{title}</span>
                <button className='text-[11px] text-white/70 hover:text-white'>See all</button>
            </div>
            <div className='grid grid-cols-3 gap-3'>
                {Array.from({ length: 12 }).map((_, idx) => (
                    <div key={idx} className='w-full aspect-square bg-white rounded-[8px]' />
                ))}
            </div>
        </div>
    )

    return (
        <div className='flex flex-col w-full h-full gap-4'>
            <div className='flex items-center gap-3 text-white'>
                <Button onClick={onBack} aria-label="Back" variant="ghost" className='p-1 rounded hover:bg-white/10 cursor-pointer'>
                    <ArrowLeft size="20" color="#ffffff" />
                </Button>
                <p className='text-sm'>GIFs</p>
            </div>
            <div className='flex items-center justify-between px-3 h-[44px] w-full bg-white rounded-lg gap-2'>
                <SearchNormal1 size="18" color="#555555" className="shrink-0" />
                <Input
                    placeholder='Search gifs'
                    className='h-[44px] flex-1 outline-none border-none focus:ring-0 focus-visible:ring-0 px-0'
                />
            </div>

            <Section title='Artist marketplace' />
            <Section title='WODEY assets' />
            <Section title='Uploaded files' />

            <div className='sticky bottom-0 w-full pt-2 pb-4 bg-[#181923]'>
                <Button className='w-full bg-[#006977] hover:bg-[#1d3235]'>
                    <UploadIcon size="18" color="#ffffff" />
                    Upload media
                </Button>
            </div>
        </div>
    )
}


