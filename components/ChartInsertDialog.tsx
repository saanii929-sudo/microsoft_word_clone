// components/ChartInsertDialog.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Plus, 
  Trash2,
  Palette
} from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ChartInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChartInsert: (chartData: any) => void;
}

const chartTypes = [
  { value: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
  { value: 'line', label: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { value: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Display parts of a whole' },
];

const defaultColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export function ChartInsertDialog({ open, onOpenChange, onChartInsert }: ChartInsertDialogProps) {
  const [chartType, setChartType] = useState('bar');
  const [chartTitle, setChartTitle] = useState('');
  const [chartData, setChartData] = useState<ChartData[]>([
    { label: 'Product A', value: 30, color: defaultColors[0] },
    { label: 'Product B', value: 45, color: defaultColors[1] },
    { label: 'Product C', value: 25, color: defaultColors[2] },
  ]);

  const addDataPoint = () => {
    const newColor = defaultColors[chartData.length % defaultColors.length];
    setChartData(prev => [
      ...prev,
      { label: `Category ${prev.length + 1}`, value: 0, color: newColor }
    ]);
  };

  const removeDataPoint = (index: number) => {
    if (chartData.length > 1) {
      setChartData(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateDataPoint = (index: number, field: keyof ChartData, value: string) => {
    setChartData(prev => prev.map((item, i) => {
      if (i === index) {
        if (field === 'value') {
          return { ...item, value: parseInt(value) || 0 };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const updateColor = (index: number, color: string) => {
    setChartData(prev => prev.map((item, i) => 
      i === index ? { ...item, color } : item
    ));
  };

  const handleInsert = () => {
    const chartConfig = {
      type: chartType,
      title: chartTitle || `${chartTypes.find(t => t.value === chartType)?.label} Chart`,
      data: chartData,
      colors: chartData.map(item => item.color || defaultColors[0]),
    };

    onChartInsert(chartConfig);
    onOpenChange(false);
    
    // Reset form
    setChartTitle('');
    setChartData([
      { label: 'Product A', value: 30, color: defaultColors[0] },
      { label: 'Product B', value: 45, color: defaultColors[1] },
      { label: 'Product C', value: 25, color: defaultColors[2] },
    ]);
  };

  const ChartPreview = () => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-sm">Preview</h4>
          <div className="space-y-3">
            {chartType === 'bar' && (
              <div className="space-y-2">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-20 text-xs truncate">{item.label}</div>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                    <div className="w-8 text-xs text-right">{item.value}</div>
                  </div>
                ))}
              </div>
            )}
            
            {chartType === 'pie' && (
              <div className="flex items-center justify-center h-24">
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  {chartData.map((item, index) => {
                    const percentage = total > 0 ? (item.value / total) * 100 : 0;
                    const rotation = chartData
                      .slice(0, index)
                      .reduce((sum, d) => sum + (d.value / total) * 360, 0);
                    
                    return (
                      <div
                        key={index}
                        className="absolute inset-0"
                        style={{
                          clipPath: `conic-gradient(from ${rotation}deg, ${item.color} 0%, ${item.color} ${percentage}%, transparent ${percentage}%)`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            
            {chartType === 'line' && (
              <div className="h-16 flex items-end gap-1">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-primary/20 rounded-t transition-all duration-300"
                    style={{
                      height: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Insert Chart</DialogTitle>
          <DialogDescription>
            Create and customize charts for your document
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Chart Type Selection */}
          <div>
            <Label>Chart Type</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {chartTypes.map(type => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all border-2 ${
                      chartType === type.value 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setChartType(type.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Chart Title */}
          <div>
            <Label htmlFor="chart-title">Chart Title (Optional)</Label>
            <Input
              id="chart-title"
              placeholder="Enter chart title..."
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Chart Data */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Chart Data</Label>
              <Button variant="outline" size="sm" onClick={addDataPoint}>
                <Plus className="h-4 w-4 mr-1" />
                Add Data
              </Button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      value={item.label}
                      onChange={(e) => updateDataPoint(index, 'label', e.target.value)}
                      placeholder="Label"
                    />
                    <Input
                      type="number"
                      value={item.value}
                      onChange={(e) => updateDataPoint(index, 'value', e.target.value)}
                      placeholder="Value"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="color"
                        value={item.color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="w-8 h-8 rounded border cursor-pointer"
                      />
                      <Palette className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white mix-blend-difference" />
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDataPoint(index)}
                      disabled={chartData.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Preview */}
          <ChartPreview />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsert}>
              Insert Chart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}