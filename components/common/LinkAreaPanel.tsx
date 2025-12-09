"use client"

import React, { useState } from 'react'
import { ArrowLeft, ArrowDown2 } from 'iconsax-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LinkAreaPanel({ onBack }: { onBack: () => void }) {
    const [url, setUrl] = useState('')
    const [tooltip, setTooltip] = useState('Go to URL')
    const [openIn, setOpenIn] = useState('New tab')
    const [cornerRoundness, setCornerRoundness] = useState('2')

    const handleSave = () => {
        console.log('Link area saved:', { url, tooltip, openIn, cornerRoundness })
    }

    return (
        <div className='flex flex-col w-full h-full gap-6 bg-[#181923]'>
            <div className='flex items-center gap-3 text-white'>
                <Button onClick={onBack} aria-label="Back" variant="ghost" className='p-1 rounded hover:bg-white/10 cursor-pointer'>
                    <ArrowLeft size="20" color="#ffffff" />
                </Button>
                <p className='text-sm'>Link Area</p>
            </div>

            <div className='flex flex-col gap-6'>
                {/* URL Input */}
                <div className='flex flex-col gap-2'>
                    <label className='text-white text-sm font-medium'>URL</label>
                    <Input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Set your URL"
                        className='w-full h-10 bg-[#2A2C39] border-[#2A2C39] text-white rounded-lg px-3'
                    />
                </div>

                {/* Tooltip Input */}
                <div className='flex flex-col gap-2'>
                    <label className='text-white text-sm font-medium'>Tooltip</label>
                    <Input
                        type="text"
                        value={tooltip}
                        onChange={(e) => setTooltip(e.target.value)}
                        className='w-full h-10 bg-[#2A2C39] border-[#2A2C39] text-white rounded-lg px-3'
                    />
                </div>

                {/* Open in Dropdown */}
                <div className='flex flex-col gap-2'>
                    <label className='text-white text-sm font-medium'>Open in</label>
                    <div className='relative'>
                        <select
                            value={openIn}
                            onChange={(e) => setOpenIn(e.target.value)}
                            className='w-full h-10 bg-[#2A2C39] border-[#2A2C39] text-white rounded-lg px-3 appearance-none cursor-pointer'
                        >
                            <option value="New tab">New tab</option>
                            <option value="Same tab">Same tab</option>
                            <option value="New window">New window</option>
                        </select>
                        <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                            <ArrowDown2 size="16" color="#ffffff" />
                        </div>
                    </div>
                </div>

                {/* Corner roundness Input */}
                <div className='flex flex-col gap-2'>
                    <label className='text-white text-sm font-medium'>Corner roundness</label>
                    <Input
                        type="number"
                        value={cornerRoundness}
                        onChange={(e) => setCornerRoundness(e.target.value)}
                        min="0"
                        max="50"
                        className='w-full h-10 bg-[#2A2C39] border-[#2A2C39] text-white rounded-lg px-3'
                    />
                </div>

                {/* Save Button */}
                <div className='flex justify-center mt-4'>
                    <Button
                        onClick={handleSave}
                        className='bg-[#006977] hover:bg-[#1d3235] text-white w-full h-10 rounded-lg font-medium cursor-pointer'
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}
