"use client"

import React, { useState } from 'react'
import { ArrowLeft, ArrowUp2, ArrowDown2 } from 'iconsax-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TablePanel({ onBack }: { onBack: () => void }) {
    const [rows, setRows] = useState(3)
    const [columns, setColumns] = useState(3)

    const incrementRows = () => setRows(prev => Math.min(prev + 1, 20))
    const decrementRows = () => setRows(prev => Math.max(prev - 1, 1))
    const incrementColumns = () => setColumns(prev => Math.min(prev + 1, 20))
    const decrementColumns = () => setColumns(prev => Math.max(prev - 1, 1))

    const handleCreateTable = () => {
        // Handle table creation logic here
        console.log(`Creating table with ${rows} rows and ${columns} columns`)
    }

    return (
        <div className='flex flex-col w-full h-full gap-6'>
            <div className='flex items-center gap-3 text-white'>
                <Button onClick={onBack} aria-label="Back" variant="ghost" className='p-1 rounded hover:bg-white/10 cursor-pointer'>
                    <ArrowLeft size="20" color="#ffffff" />
                </Button>
                <p className='text-sm'>Table</p>
            </div>

            <div className='flex flex-col gap-6'>
                {/* Rows and Columns Inputs on same line */}
                <div className='flex gap-4'>
                    {/* Rows Input */}
                    <div className='flex-1 flex flex-col gap-2'>
                        <label className='text-white text-sm font-medium'>Rows</label>
                        <div className='relative'>
                            <Input
                                type="number"
                                value={rows}
                                onChange={(e) => setRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                                className='w-full h-10 bg-[#2A2C39] border-[#2A2C39] text-white rounded-lg pr-8'
                            />
                            <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-0.5'>
                            <button
                                onClick={incrementRows}
                                className='w-4 h-3 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer'
                            >
                                <ArrowUp2 size="12" color="#ffffff" />
                            </button>
                            <button
                                onClick={decrementRows}
                                className='w-4 h-3 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer'
                            >
                                <ArrowDown2 size="12" color="#ffffff" />
                            </button>
                            </div>
                        </div>
                    </div>

                    {/* Columns Input */}
                    <div className='flex-1 flex flex-col gap-2'>
                        <label className='text-white text-sm font-medium'>Columns</label>
                        <div className='relative'>
                            <Input
                                type="number"
                                value={columns}
                                onChange={(e) => setColumns(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                                className='w-full h-10 bg-[#2A2C39] border-[#2A2C39] text-white rounded-lg pr-8'
                            />
                            <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-0.5'>
                            <button
                                onClick={incrementColumns}
                                className='w-4 h-3 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer'
                            >
                                <ArrowUp2 size="12" color="#ffffff" />
                            </button>
                            <button
                                onClick={decrementColumns}
                                className='w-4 h-3 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer'
                            >
                                <ArrowDown2 size="12" color="#ffffff" />
                            </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Table Button */}
                <div className='flex justify-center mt-4'>
                    <Button
                        onClick={handleCreateTable}
                        className='bg-[#006977] hover:bg-[#1d3235] text-white w-full h-10 rounded-lg font-medium'
                    >
                        Create table
                    </Button>
                </div>
            </div>
        </div>
    )
}
