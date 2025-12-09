// components/ColorPicker.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Palette,
  Check,
  RefreshCw
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from './ui/input';

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  currentColor?: string;
  type?: 'text' | 'highlight';
}

const defaultColors = {
  text: [
    '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
    '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
    '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
    '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
    '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
    '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
    '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#741B47',
    '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
  ],
  highlight: [
    '#FFFF00', '#FFCC00', '#FF9900', '#FF6600', '#FF0000', '#FF99CC', '#FF66CC', '#FF00CC', '#CC00FF', '#9900FF',
    '#6600FF', '#3300FF', '#0066FF', '#00CCFF', '#00FFFF', '#00FFCC', '#00FF99', '#00FF66', '#00FF00', '#66FF00',
    '#CCFF00', '#FFFF66', '#FFCC66', '#FF9966', '#FF6666', '#FF6699', '#FF66FF', '#CC66FF', '#9966FF', '#6666FF',
    '#66CCFF', '#66FFFF', '#66FFCC', '#66FF99', '#99FF66', '#CCFF66', '#FFFF99', '#FFCC99', '#FF9999', '#FF99CC',
    '#FF99FF', '#CC99FF', '#9999FF', '#99CCFF', '#99FFFF', '#99FFCC', '#CCFF99', '#FFFFCC', '#FFE5CC', '#FFCCCC',
    '#FFCCE5', '#FFCCFF', '#E5CCFF', '#CCCCFF', '#CCE5FF', '#CCFFFF', '#CCFFE5', '#E5FFCC', '#FFFFE5', '#F2F2F2',
    '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373'
  ]
};

const recentColorsKey = (type: string) => `recent-colors-${type}`;

export function ColorPicker({ onColorChange, currentColor = '#000000', type = 'text' }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [customColor, setCustomColor] = useState(currentColor);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const customColorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent colors from localStorage
    const stored = localStorage.getItem(recentColorsKey(type));
    if (stored) {
      try {
        setRecentColors(JSON.parse(stored));
      } catch {
        setRecentColors([]);
      }
    }
  }, [type]);

  const saveToRecent = (color: string) => {
    const updated = [color, ...recentColors.filter(c => c !== color)].slice(0, 8);
    setRecentColors(updated);
    localStorage.setItem(recentColorsKey(type), JSON.stringify(updated));
  };

  const handleColorSelect = (color: string) => {
    onColorChange(color);
    saveToRecent(color);
    setCustomColor(color);
    setOpen(false);
  };

  const handleCustomColor = () => {
    if (customColor) {
      handleColorSelect(customColor);
    }
  };

  const clearRecentColors = () => {
    setRecentColors([]);
    localStorage.removeItem(recentColorsKey(type));
  };

  const colors = defaultColors[type];
  const displayColor = type === 'highlight' ? '#FFFF00' : '#000000';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative w-12 h-9 p-0 overflow-hidden"
          style={{
            backgroundColor: type === 'highlight' ? currentColor : 'transparent',
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Palette className="h-4 w-4" style={{ color: type === 'text' ? currentColor : '#000000' }} />
            {type === 'highlight' && (
              <div 
                className="absolute inset-0 opacity-50"
                style={{ backgroundColor: currentColor }}
              />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Recent</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentColors}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid grid-cols-8 gap-1">
                {recentColors.map((color, index) => (
                  <button
                    key={index}
                    className="w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform relative"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color === currentColor && (
                      <Check className="h-3 w-3 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Default Colors */}
          <div>
            <span className="text-xs font-medium text-muted-foreground mb-2 block">
              Default Colors
            </span>
            <div className="grid grid-cols-8 gap-1">
              {colors.map((color, index) => (
                <button
                  key={index}
                  className="w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform relative"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                >
                  {color === currentColor && (
                    <Check className="h-3 w-3 text-white absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground block">
              Custom Color
            </span>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={customColorInputRef}
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-full h-8 rounded border cursor-pointer"
                />
                <div 
                  className="absolute inset-0 rounded border pointer-events-none"
                  style={{ 
                    background: `conic-gradient(
                      red, yellow, lime, aqua, blue, magenta, red
                    )` 
                  }}
                />
              </div>
              <Input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#000000"
                className="h-8 text-xs"
              />
              <Button
                size="sm"
                onClick={handleCustomColor}
                className="h-8"
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleColorSelect(type === 'text' ? '#000000' : '#FFFF00')}
              className="flex-1 text-xs"
            >
              Default
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleColorSelect('transparent')}
              className="flex-1 text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}