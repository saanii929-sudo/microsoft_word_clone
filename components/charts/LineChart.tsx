"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
    name: string;
    phase: string;
    value: number;
    duration?: string;
    [key: string]: any;
}

interface CustomLineChartProps {
    data: ChartDataPoint[];
    isVisible: boolean;
    title?: string;
    valueKey?: string;
    color?: string;
    height?: number;
    formatValue?: (value: number) => string;
    showGrid?: boolean;
    showTooltip?: boolean;
    animated?: boolean;
    className?: string;
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
    data,
    isVisible,
    title,
    valueKey = 'value',
    color = '#f59e0b',
    height,
    formatValue,
    showGrid = true,
    showTooltip = true,
    animated = true,
    className = ''
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [animationStarted, setAnimationStarted] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isVisible) {
            // Reset animation when becoming visible
            setAnimationStarted(false);
            setAnimationKey(prev => prev + 1);
            const timer = setTimeout(() => {
                setAnimationStarted(true);
            }, 400);
            return () => clearTimeout(timer);
        } else {
            // Reset animation when not visible
            setAnimationStarted(false);
        }
    }, [isVisible]);

    const defaultFormatValue = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return `${value}`;
    };

    const formatFn = formatValue || defaultFormatValue;

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-black/90 backdrop-blur-sm border border-amber-500/30 rounded-lg p-3 shadow-lg">
                    <p className="text-white font-semibold text-sm">{data.phase || data.name}</p>
                    <p className="text-amber-400 font-bold">
                        {formatFn(data[valueKey])} {valueKey === 'subscribers' ? 'subscribers' : ''}
                    </p>
                    {data.duration && (
                        <p className="text-gray-300 text-xs">{data.duration}</p>
                    )}
                </div>
            );
        }
        return null;
    };

    const CustomDot = (props: any) => {
        const { cx, cy, index } = props;
        return (
            <g>
                <circle
                    cx={cx}
                    cy={cy}
                    r="8"
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                    style={{
                        animation: animationStarted ? `dotAppear 0.6s ease-out ${0.8 + index * 0.3}s both` : 'none'
                    }}
                />
                <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill={color}
                    fillOpacity="0.3"
                    className={animated && animationStarted ? "animate-pulse" : ""}
                    style={{
                        animation: animationStarted ? `dotGlow 0.6s ease-out ${1.2 + index * 0.3}s both` : 'none'
                    }}
                />
            </g>
        );
    };

    const chartHeight = height || (isMobile ? 250 : 260);

    return (
        <>
            <style jsx>{`
        @keyframes lineDrawIn {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes dotAppear {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes dotGlow {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 0.3;
            transform: scale(1);
          }
        }
        
        @keyframes linePulse {
          0%, 100% {
            filter: drop-shadow(0 0 4px ${color}60);
          }
          50% {
            filter: drop-shadow(0 0 8px ${color}80);
          }
        }
        
        .recharts-line-curve {
          animation: ${animationStarted ? 'lineDrawIn 1.5s ease-out 0.5s both, linePulse 3s ease-in-out 2.5s infinite' : 'none'};
        }
      `}</style>

            <div
                className={`bg-black/30 w-full backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:p-5 border border-white/10 shadow-2xl transition-all duration-1200 delay-150 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
                    } ${className}`}
            >
                {/* Chart Title */}
                {title && (
                    <div
                        className="text-center mb-4 md:mb-8 transition-all duration-800"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
                            transitionDelay: '200ms'
                        }}
                    >
                        <h3 className="text-white text-xl md:text-2xl font-semibold">{title}</h3>
                    </div>
                )}

                {/* Chart Container */}
                <div
                    className="w-full transition-all duration-1200 ease-out"
                    style={{
                        height: chartHeight,
                        minHeight: chartHeight,
                        width: '100%',
                        minWidth: 250,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                        transitionDelay: '300ms'
                    }}
                >
                    {chartHeight > 0 && (
                        <ResponsiveContainer width="100%" height={chartHeight} minWidth={300} minHeight={chartHeight}>
                            <LineChart
                                key={`line-chart-${animationKey}`}
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 60,
                                }}
                            >
                                {showGrid && (
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.1)"
                                        horizontal={true}
                                        vertical={false}
                                    />
                                )}

                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: '#9CA3AF',
                                        fontSize: isMobile ? 10 : 12,
                                        textAnchor: 'middle'
                                    }}
                                    interval={0}
                                    angle={isMobile ? -45 : 0}
                                    textAnchor={isMobile ? 'end' : 'middle'}
                                    height={isMobile ? 80 : 60}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: '#9CA3AF',
                                        fontSize: isMobile ? 10 : 12
                                    }}
                                    tickFormatter={formatFn}
                                    width={isMobile ? 50 : 80}
                                />

                                {showTooltip && <Tooltip content={<CustomTooltip />} />}

                                <Line
                                    type="monotone"
                                    dataKey={valueKey}
                                    stroke={color}
                                    strokeWidth={4}
                                    dot={<CustomDot />}
                                    activeDot={{
                                        r: 12,
                                        fill: color,
                                        stroke: '#ffffff',
                                        strokeWidth: 3,
                                        filter: `drop-shadow(0 0 12px ${color})`
                                    }}
                                    animationDuration={animated && isVisible && animationStarted ? 1500 : 0}
                                    animationBegin={isVisible && animationStarted ? 500 : 0}
                                    animationEasing="ease-out"
                                    style={{
                                        filter: `drop-shadow(0 2px 8px ${color}40)`,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Legend */}
                <div
                    className="flex justify-center mt-4 md:mt-8 transition-all duration-800"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.95)',
                        transitionDelay: '2000ms'
                    }}
                >
                    <div className="flex items-center gap-2 md:gap-3 bg-white/5 rounded-full px-3 md:px-5 py-1 md:py-2 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div
                            className="w-3 h-3 md:w-4 md:h-4 rounded-full shadow-lg animate-pulse"
                            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
                        ></div>
                        <span className="text-white font-medium text-sm md:text-base">
                            {valueKey === 'subscribers' ? 'Paid Users' : 'Value'}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomLineChart;