"use client"

import React from 'react'
import { ArrowLeft } from 'iconsax-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function ChartsPanel({ onBack }: { onBack: () => void }) {
    const ChartSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className='w-full mb-6'>
            <h3 className='text-white text-sm font-medium mb-4'>{title}</h3>
            <div className='grid grid-cols-1 gap-4'>
                {children}
            </div>
        </div>
    )

    return (
        <div className='flex flex-col w-full h-full gap-4'>
            <div className='flex items-center gap-3 text-white'>
                <Button onClick={onBack} aria-label="Back" variant="ghost" className='p-1 rounded hover:bg-white/10 cursor-pointer'>
                    <ArrowLeft size="20" color="#ffffff" />
                </Button>
                <p className='text-sm'>Charts</p>
            </div>

            <ChartSection title="Pie charts">
                <div className='bg-[#2A2C39] rounded-lg p-2 md:p-4 flex items-center justify-center'>
                    <Image 
                        src="/piechartpng.png" 
                        alt="Pie Chart" 
                        width={241} 
                        height={113} 
                        className='w-32  sm:w-36 sm:h-17 md:w-40 md:h-19 lg:w-44 lg:h-21 max-w-full h-auto' 
                    />
                </div>
            </ChartSection>

            <ChartSection title="Bar charts">
                <div className='bg-[#2A2C39] rounded-lg p-2 md:p-4 flex items-center justify-center'>
                    <Image 
                        src="/barchart.png" 
                        alt="Bar Chart" 
                        width={241} 
                        height={113} 
                        className='w-32  sm:w-36 sm:h-17 md:w-40 md:h-19 lg:w-44 lg:h-21 max-w-full h-auto' 
                    />
                </div>
            </ChartSection>

            <ChartSection title="Line charts">
                <div className='bg-[#2A2C39] rounded-lg p-2 md:p-4 flex items-center justify-center'>
                    <Image 
                        src="/linechart.png" 
                        alt="Line Chart" 
                        width={241} 
                        height={113} 
                        className='w-32 sm:w-36 sm:h-17 md:w-40 md:h-19 lg:w-44 lg:h-21 max-w-full h-auto' 
                    />
                </div>
            </ChartSection>
        </div>
    )
}
