"use client"

import React from 'react'
import { ArrowLeft } from 'iconsax-react'
import { Button } from '@/components/ui/button'

type Props = { onBack: () => void }

const tileClass = 'w-full aspect-square rounded-md bg-[#2A2C39] flex items-center justify-center'

export default function ShapesPanel({ onBack }: Props) {
    const tiles = [
        // Simple filled square
        { id: 'square', element: <div className="w-7 h-7 bg-white rounded-[2px]" /> },
        // Circle
        { id: 'circle', element: <div className="w-7 h-7 bg-white rounded-full" /> },
        // Triangle
        { id: 'triangle', element: <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-white" /> },
        // Star (svg)
        { id: 'star', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path fill="#fff" d="M12 2l2.7 6.5L22 9.2l-5 4.4 1.6 6.9L12 17.8 5.4 20.5 7 13.6 2 9.2l7.3-.7L12 2z"/></svg> },
        // Blob1
        { id: 'blob1', element: <div className="w-8 h-7 bg-white rounded-[12px_20px_18px_10px/14px_12px_18px_20px]" /> },
        // Burst
        { id: 'burst', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path fill="#fff" d="M12 2l1.3 4.5L18 4l-2.5 3.9L20 9l-4.5 1.3L18 14l-4.7-1.3L12 20l-1.3-7.3L6 14l2.5-3.7L4 9l4.5-1.1L6 4l4.7 2.5L12 2z"/></svg> },
        // Blob2
        { id: 'blob2', element: <div className="w-8 h-7 bg-white rounded-[16px_10px_14px_18px/18px_16px_14px_10px]" /> },
        // Blob3
        { id: 'blob3', element: <div className="w-8 h-7 bg-white rounded-[18px]" /> },
        // Outline circle
        { id: 'outline-circle', element: <div className="w-8 h-8 rounded-full border-2 border-white" /> },
        // Outline square
        { id: 'outline-square', element: <div className="w-8 h-8 rounded-sm border-2 border-white" /> },
        // Outline triangle
        { id: 'outline-triangle', element: <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-white" /> },
        // Chevron right
        { id: 'chevron', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="#fff" strokeWidth="2" d="M8 5l8 7-8 7"/></svg> },
        // Double line
        { id: 'double-line', element: <div className="flex items-center gap-1"><div className="w-5 h-[2px] bg-white"/><div className="w-5 h-[2px] bg-white"/></div> },
        // Arrows
        { id: 'arrows', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="#fff" strokeWidth="2" d="M6 12h8m0 0-3-3m3 3-3 3"/></svg> },
        // Triangle outline
        { id: 'triangle-outline', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="#fff" strokeWidth="2" d="M12 5l7 12H5l7-12z"/></svg> },
        // Rectangle outline
        { id: 'rectangle-outline', element: <div className="w-10 h-6 border-2 border-white" /> },
        // Arc
        { id: 'arc', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="#fff" strokeWidth="2" d="M5 16a7 7 0 0 1 14 0"/></svg> },
        // Cross
        { id: 'cross', element: <div className="relative w-7 h-7"><div className="absolute inset-x-[40%] inset-y-0 bg-white"/><div className="absolute inset-y-[40%] inset-x-0 bg-white"/></div> },
        // Bracket-like
        { id: 'bracket', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="#fff" strokeWidth="2" d="M9 7H6v10h3m6-10h3v10h-3"/></svg> },
        // Cube-ish
        { id: 'cube', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="#fff" strokeWidth="2" d="M12 3l7 4v10l-7 4-7-4V7l7-4zm0 0v10"/></svg> },
        // Semi circle
        { id: 'semi-circle', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="#fff" strokeWidth="2" d="M5 15a7 7 0 0 1 14 0"/></svg> },
        // Zigzag
        { id: 'zigzag', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="#fff" strokeWidth="2" d="M3 16l3-4 3 4 3-4 3 4 3-4"/></svg> },
        // Stacked
        { id: 'stacked', element: <div className="flex flex-col gap-1"><div className="w-8 h-1.5 bg-white rounded"/><div className="w-7 h-1.5 bg-white rounded"/><div className="w-6 h-1.5 bg-white rounded"/></div> },
        // Curves
        { id: 'curves', element: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="#fff" strokeWidth="2" d="M4 18c6-8 10-8 16 0"/></svg> },
        // Dotted circle corner
        { id: 'dotted-circle', element: <div className="relative w-8 h-8"><div className="absolute right-0 bottom-0 w-3 h-3 bg-white rounded-full"/></div> },
        // Square with accent
        { id: 'square-accent', element: <div className="relative w-8 h-8 bg-white/10 rounded-sm"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-[2px]"/></div> },
        // Tiles
        { id: 'tiles', element: <div className="grid grid-cols-3 gap-[2px]">
            <div className="w-2.5 h-2.5 bg-white"/>
            <div className="w-2.5 h-2.5 bg-white/60"/>
            <div className="w-2.5 h-2.5 bg-white"/>
            <div className="w-2.5 h-2.5 bg-white/60"/>
            <div className="w-2.5 h-2.5 bg-white"/>
            <div className="w-2.5 h-2.5 bg-white/60"/>
            <div className="w-2.5 h-2.5 bg-white"/>
            <div className="w-2.5 h-2.5 bg-white/60"/>
            <div className="w-2.5 h-2.5 bg-white"/>
        </div> },
    ]

    return (
        <div className='flex flex-col w-full h-full gap-4'>
            <div className='flex items-center gap-3 text-white'>
                <Button onClick={onBack} aria-label="Back" variant="ghost" className='p-1 rounded hover:bg-white/10 cursor-pointer'>
                    <ArrowLeft size="20" color="#ffffff" />
                </Button>
                <p className='text-sm'>Shapes</p>
            </div>
            <div className='grid grid-cols-3 gap-3 pb-10'>
                {tiles.map((tile) => (
                    <div key={tile.id} className={tileClass}>
                        {tile.element}
                    </div>
                ))}
            </div>
        </div>
    )
}


