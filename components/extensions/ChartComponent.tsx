"use client";

import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function ChartComponent({ node, updateAttributes, selected }: any) {
    const { type, data, title, width = 600, height = 400, x = 0, y = 0 } = node.attrs;
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only start drag if clicking on the chart container, not resize handles
        if ((e.target as HTMLElement).classList.contains('chart-drag-handle')) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
            setDragStart({ x: e.clientX - x, y: e.clientY - y });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            updateAttributes({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragStart]);

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', r: 5 }}
                            activeDot={{ r: 7 }}
                        />
                    </LineChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                            {data.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                );
            default:
                return <div className="text-red-500 text-center">Unsupported chart type: {type}</div>;
        }
    };

    return (
        <NodeViewWrapper
            className={`my-6 inline-block ${selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-xl' : ''}`}
            style={{ position: 'relative', left: `${x}px`, top: `${y}px` }}
        >
            <div
                className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all ${isHovered ? 'shadow-2xl border-indigo-200' : 'hover:shadow-xl'
                    } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{ width: `${width}px`, maxWidth: '100%' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Drag Handle */}
                <div
                    className="chart-drag-handle absolute top-2 left-2 w-8 h-8 flex items-center justify-center cursor-grab hover:bg-indigo-100 rounded-md transition-colors opacity-0 hover:opacity-100"
                    onMouseDown={handleMouseDown}
                    style={{ opacity: isHovered || selected ? 1 : 0 }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-indigo-600">
                        <circle cx="4" cy="4" r="1.5" fill="currentColor" />
                        <circle cx="12" cy="4" r="1.5" fill="currentColor" />
                        <circle cx="4" cy="8" r="1.5" fill="currentColor" />
                        <circle cx="12" cy="8" r="1.5" fill="currentColor" />
                        <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                </div>

                {title && (
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        {title}
                    </h3>
                )}
                <div className="w-full" style={{ height: `${height}px` }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </div>
                {selected && (
                    <div className="mt-4 text-xs text-center text-gray-500 flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        Chart selected - Drag to move
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
}
