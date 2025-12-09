"use client"

import React from 'react'
import { ArrowLeft, PlayCircle, SearchNormal1 } from 'iconsax-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function StockVideosPanel({ onBack }: { onBack: () => void }) {
    return (
        <div className='flex flex-col w-full h-full gap-4'>
            <div className='flex items-center gap-3 text-white'>
                <Button onClick={onBack} aria-label="Back" variant="ghost" className='p-1 rounded hover:bg-white/10 cursor-pointer'>
                    <ArrowLeft size="20" color="#ffffff" />
                </Button>
                <p className='text-sm'>Stock videos</p>
            </div>
            <div className='flex items-center justify-between px-3 h-[44px] w-full bg-white rounded-lg gap-2'>
                <SearchNormal1 size="18" color="#555555" className="shrink-0" />
                <Input
                    placeholder='Search stock videos'
                    className='h-[44px] flex-1 outline-none border-none focus:ring-0 focus-visible:ring-0 px-0'
                />
            </div>
            <div className='flex flex-col text-white mt-2'>
                {[
                    {
                        label: 'Business',
                        thumbs: [
                            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=300&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1523958203904-cdcb402031fd?q=80&w=300&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop'
                        ]
                    },
                    {
                        label: 'Interior design',
                        thumbs: [
                            'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=300&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=300&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=300&auto=format&fit=crop'
                        ]
                    },
                    {
                        label: 'Art',
                        thumbs: [
                            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=300&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=300&auto=format&fit=crop'
                        ]
                    },
                    {
                        label: 'Spring',
                        thumbs: [
                            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=300&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1494783367193-149034c05e8f?q=80&w=300&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=300&auto=format&fit=crop'
                        ]
                    },
                    {
                        label: 'Earth day',
                        thumbs: [
                            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=300&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=300&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop'
                        ]
                    }
                ].map((category) => (
                    <div key={category.label} className='w-full border-t border-white/10 py-4'>
                        <div className='flex items-center justify-between'>
                            <span className='text-xs'>{category.label}</span>
                            <button className='text-[11px] text-white/70 hover:text-white'>See all</button>
                        </div>
                        <div className='grid grid-cols-3 gap-6 mt-4'>
                            {category.thumbs.map((src, idx) => (
                                <button key={idx} className='relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden flex items-center justify-center group'>
                                    <Image src={src} alt={`${category.label}-thumb-${idx}`} fill className='object-cover' />
                                    <div className='absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors'></div>
                                    <PlayCircle size="18" color="#ffffff" className='relative' />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


