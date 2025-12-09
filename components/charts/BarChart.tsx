"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
  name: string;
  phase: string;
  revenue?: number;
  costs?: number;
  duration?: string;
  [key: string]: any;
}

interface CustomBarChartProps {
  data: ChartDataPoint[];
  isVisible: boolean;
  title?: string;
  height?: number;
  formatValue?: (value: number) => string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  className?: string;
  bars?: Array<{
    dataKey: string;
    fill: string;
    name: string;
  }>;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  isVisible,
  title,
  height,
  formatValue,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  animated = true,
  className = '',
  bars = [
    { dataKey: 'revenue', fill: '#10B981', name: 'Revenue' },
    { dataKey: 'costs', fill: '#EF4444', name: 'Costs' }
  ]
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
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Reset animation when not visible
      setAnimationStarted(false);
    }
  }, [isVisible]);

  const defaultFormatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatFn = formatValue || defaultFormatValue;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 backdrop-blur-sm border border-white/30 rounded-lg p-4 shadow-lg">
          <p className="text-white font-semibold text-sm mb-2">{data.phase}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-bold text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatFn(entry.value)}
            </p>
          ))}
          {data.duration && (
            <p className="text-gray-300 text-xs mt-1">{data.duration}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const chartHeight = height || (isMobile ? 300 : 360);

  return (
    <>
      <style jsx>{`
        @keyframes barGrow {
          from {
            transform: scaleY(0);
            transform-origin: bottom;
          }
          to {
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }
        
        @keyframes barGlow {
          0%, 100% {
            filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3));
          }
          50% {
            filter: drop-shadow(0 6px 12px rgba(16, 185, 129, 0.6));
          }
        }
        
        @keyframes barPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .recharts-bar-rectangle {
          animation: ${animationStarted ? 'barPulse 2s ease-in-out infinite' : 'none'};
          animation-delay: ${animationStarted ? '2s' : '0s'};
        }
      `}</style>
      
      <div
        className={`bg-black/30 w-full backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:p-5 border border-white/10 shadow-2xl transition-all duration-1200 delay-150 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
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
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
          transitionDelay: '300ms'
        }}
      >
        {chartHeight > 0 && (
          <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            key={`chart-${animationKey}`}
            data={data}
            margin={{
              top: 20,
              right: isMobile ? 10 : 30,
              left: isMobile ? 0 : 20,
              bottom: 60,
            }}
            barGap={isMobile ? 5 : 10}
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
            
            {showLegend && (
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: isMobile ? '12px' : '14px'
                }}
                iconType="circle"
              />
            )}
            
            {bars.map((bar, index) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill}
                name={bar.name}
                radius={[4, 4, 0, 0]}
                animationDuration={animated && isVisible && animationStarted ? 1200 : 0}
                animationBegin={isVisible && animationStarted ? index * 300 : 0}
                animationEasing="ease-out"
                style={{
                  filter: `drop-shadow(0 4px 8px ${bar.fill}40)`,
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
    </>
  );
};

export default CustomBarChart;