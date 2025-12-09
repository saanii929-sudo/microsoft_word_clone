"use client";

import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

const SHAPE_TYPES = {
    rectangle: (w: number, h: number) => `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`,
    roundedRectangle: (w: number, h: number) => {
        const r = Math.min(w, h) * 0.1;
        return `M ${r} 0 L ${w - r} 0 Q ${w} 0 ${w} ${r} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} L ${r} ${h} Q 0 ${h} 0 ${h - r} L 0 ${r} Q 0 0 ${r} 0 Z`;
    },
    circle: (w: number, h: number) => {
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) / 2;
        return `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx - r} ${cy} Z`;
    },
    triangle: (w: number, h: number) => `M ${w / 2} 0 L ${w} ${h} L 0 ${h} Z`,
    arrow: (w: number, h: number) => {
        const headWidth = w * 0.4;
        const headHeight = h * 0.3;
        const shaftHeight = h - headHeight;
        const shaftWidth = w * 0.3;
        const shaftX = (w - shaftWidth) / 2;
        return `M ${shaftX} 0 L ${shaftX + shaftWidth} 0 L ${shaftX + shaftWidth} ${shaftHeight} L ${w} ${shaftHeight} L ${w / 2} ${h} L 0 ${shaftHeight} L ${shaftX} ${shaftHeight} Z`;
    },
    star: (w: number, h: number) => {
        const cx = w / 2;
        const cy = h / 2;
        const outerR = Math.min(w, h) / 2;
        const innerR = outerR * 0.4;
        const points = 5;
        let path = '';
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
        }
        return path + 'Z';
    },
};

export default function ShapeComponent({ node, updateAttributes, selected }: any) {
    const { type, width, height, fillColor, borderColor, borderWidth } = node.attrs;
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const shapeRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (handle: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeHandle(handle);
    };

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!shapeRef.current || !resizeHandle) return;

            const rect = shapeRef.current.getBoundingClientRect();
            let newWidth = width;
            let newHeight = height;

            if (resizeHandle.includes('e')) {
                newWidth = Math.max(50, e.clientX - rect.left);
            }
            if (resizeHandle.includes('s')) {
                newHeight = Math.max(50, e.clientY - rect.top);
            }
            if (resizeHandle.includes('w')) {
                newWidth = Math.max(50, rect.right - e.clientX);
            }
            if (resizeHandle.includes('n')) {
                newHeight = Math.max(50, rect.bottom - e.clientY);
            }

            updateAttributes({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            setResizeHandle(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, resizeHandle, width, height, updateAttributes]);

    const pathGenerator = SHAPE_TYPES[type as keyof typeof SHAPE_TYPES] || SHAPE_TYPES.rectangle;
    const pathData = pathGenerator(width, height);

    return (
        <NodeViewWrapper
            className={`inline-block relative my-4 ${selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
            style={{ width: `${width}px`, height: `${height}px` }}
            ref={shapeRef}
        >
            <svg
                width={width}
                height={height}
                className="block"
                style={{ cursor: selected ? 'move' : 'pointer' }}
            >
                <path
                    d={pathData}
                    fill={fillColor}
                    stroke={borderColor}
                    strokeWidth={borderWidth}
                />
            </svg>

            {/* Resize Handles */}
            {selected && (
                <>
                    {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map((handle) => {
                        const positions: Record<string, React.CSSProperties> = {
                            nw: { top: -4, left: -4, cursor: 'nw-resize' },
                            ne: { top: -4, right: -4, cursor: 'ne-resize' },
                            sw: { bottom: -4, left: -4, cursor: 'sw-resize' },
                            se: { bottom: -4, right: -4, cursor: 'se-resize' },
                            n: { top: -4, left: '50%', transform: 'translateX(-50%)', cursor: 'n-resize' },
                            s: { bottom: -4, left: '50%', transform: 'translateX(-50%)', cursor: 's-resize' },
                            e: { top: '50%', right: -4, transform: 'translateY(-50%)', cursor: 'e-resize' },
                            w: { top: '50%', left: -4, transform: 'translateY(-50%)', cursor: 'w-resize' },
                        };

                        return (
                            <div
                                key={handle}
                                onMouseDown={handleMouseDown(handle)}
                                className="absolute w-2 h-2 bg-white border-2 border-indigo-500 rounded-full hover:scale-150 transition-transform"
                                style={positions[handle]}
                            />
                        );
                    })}
                </>
            )}
        </NodeViewWrapper>
    );
}
