"use client"

import React from 'react'
import { ArrowLeft, SearchNormal1 } from 'iconsax-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function StockPhotosPanel({ onBack }: { onBack: () => void }) {
    return (
        <div className='flex flex-col w-full h-full gap-4'>
            <div className='flex items-center gap-3 text-white'>
                <Button onClick={onBack} aria-label="Back" variant="ghost" className='p-1 rounded hover:bg-white/10 cursor-pointer'>
                    <ArrowLeft size="20" color="#ffffff" />
                </Button>
                <p className='text-sm'>Stock photos</p>
            </div>
            <div className='flex items-center justify-between px-3 h-[44px] w-full bg-white rounded-lg gap-2'>
                <SearchNormal1 size="18" color="#555555" className="shrink-0" />
                <Input
                    placeholder='Search stock photos'
                    className='h-[44px] flex-1 outline-none border-none focus:ring-0 focus-visible:ring-0 px-0'
                />
            </div>
            <div className='flex flex-col text-white mt-2'>
                {[
                    {
                        label: 'Marketplace',
                        images: [
                            'https://picsum.photos/id/1015/600/400',
                            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop'
                        ]
                    },
                    {
                        label: 'Business',
                        images: [
                            'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=600&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1523958203904-cdcb402031fd?q=80&w=600&auto=format&fit=crop'
                        ]
                    },
                    {
                        label: 'Art',
                        images: [
                            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=600&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=600&auto=format&fit=crop'
                        ]
                    },
                    {
                        label: 'Spring',
                        images: [
                            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1494783367193-149034c05e8f?q=80&w=600&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=600&auto=format&fit=crop'
                        ]
                    },
                    {
                        label: 'Earth day',
                        images: [
                            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=600&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop',
                            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop'
                        ]
                    }
                ].map((category) => (
                    <div key={category.label} className='w-full border-t border-white/10 py-4'>
                        <div className='flex items-center justify-between'>
                            <span className='text-xs'>{category.label}</span>
                            <button className='text-[11px] text-white/70 hover:text-white'>See all</button>
                        </div>
                        <div className='flex gap-2 mt-3 overflow-x-auto no-scrollbar'>
                            {category.images.map((src, idx) => (
                                <div key={idx} className='relative shrink-0 w-[88px] h-[66px] md:w-[104px] md:h-[78px] overflow-hidden rounded-md'>
                                    <Image src={src} alt={`${category.label}-${idx}`} fill className='object-cover' />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


