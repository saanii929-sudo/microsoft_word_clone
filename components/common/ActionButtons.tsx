'use client'

import { Button } from '@/components/ui/button'
import React from 'react'


export interface ActionButtonsProps {
    icon: React.ReactNode,
    label?: string,
    buttonWidth?: number,
    isGhost?: boolean,
    onClick?: () => void
}

function ActionButtons({ icon, label, onClick, isGhost=false, buttonWidth}: ActionButtonsProps) {
  return (
    <div className={`flex flex-col gap-1 items-center align-middle cursor-pointer h-[50px]`} style={{ width: buttonWidth ? `${buttonWidth}px` : 'auto' }}>
        <Button
            onClick={onClick}
            className={`flex gap-2 items-center align-middle hover:bg-transparent w-full`}
            variant={isGhost ? 'ghost' : 'default'}
            aria-label={label || "Action button"}
        >
            {icon}
        </Button>
        {label && <p className={`text-xs text-white text-center w-full`}>{label}</p>}
    </div>
  )
}


export default ActionButtons
