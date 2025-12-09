"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { BarChart3, PieChart, LineChart, TrendingUp } from 'lucide-react';

interface ChartDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInsert: (type: string, data: any[], title: string) => void;
}

const CHART_TYPES = [
    { id: 'bar', name: 'Column', icon: BarChart3 },
    { id: 'line', name: 'Line', icon: TrendingUp },
    { id: 'pie', name: 'Pie', icon: PieChart },
];

const DEFAULT_DATA = [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 200 },
    { name: 'Category D', value: 278 },
];

export function ChartDialog({ open, onOpenChange, onInsert }: ChartDialogProps) {
    const [selectedType, setSelectedType] = useState('bar');
    const [title, setTitle] = useState('New Chart');
    const [chartData, setChartData] = useState(DEFAULT_DATA);

    const handleDataChange = (index: number, field: 'name' | 'value', value: string) => {
        const newData = [...chartData];
        if (field === 'value') {
            newData[index] = { ...newData[index], value: parseInt(value) || 0 };
        } else {
            newData[index] = { ...newData[index], name: value };
        }
        setChartData(newData);
    };

    const handleInsert = () => {
        onInsert(selectedType, chartData, title);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        Insert Chart
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Chart Type Selection */}
                    <div className="space-y-4">
                        <Label>Chart Type</Label>
                        <div className="grid grid-cols-3 gap-4">
                            {CHART_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${selectedType === type.id
                                        ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
                                        : 'border-black/5 hover:border-black/10 hover:bg-black/5'
                                        }`}
                                >
                                    <type.icon size={24} className="mb-2" />
                                    <span className="text-sm font-medium">{type.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chart Title */}
                    <div className="space-y-2">
                        <Label htmlFor="chart-title">Chart Title</Label>
                        <Input
                            id="chart-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-white/50 border-black/10"
                        />
                    </div>

                    {/* Data Editor */}
                    <div className="space-y-2">
                        <Label>Data Points</Label>
                        <div className="rounded-lg border border-black/10 overflow-hidden">
                            <div className="grid grid-cols-2 bg-black/5 p-2 text-xs font-semibold text-muted-foreground">
                                <div>Label</div>
                                <div>Value</div>
                            </div>
                            <div className="bg-white/50 max-h-[200px] overflow-auto">
                                {chartData.map((row, index) => (
                                    <div key={index} className="grid grid-cols-2 border-b border-black/5 last:border-0 hover:bg-black/5 transition-colors">
                                        <input
                                            value={row.name}
                                            onChange={(e) => handleDataChange(index, 'name', e.target.value)}
                                            className="w-full bg-transparent p-2 text-sm outline-none border-r border-black/5"
                                        />
                                        <input
                                            type="number"
                                            value={row.value}
                                            onChange={(e) => handleDataChange(index, 'value', e.target.value)}
                                            className="w-full bg-transparent p-2 text-sm outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleInsert}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
                    >
                        Insert Chart
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
