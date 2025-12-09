"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";

interface ChartsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (chartType: string, data: any) => void;
}

export function ChartsDialog({
  open,
  onOpenChange,
  onInsert,
}: ChartsDialogProps) {
  const [selectedType, setSelectedType] = useState<string>("bar");
  const [chartTitle, setChartTitle] = useState("Chart Title");
  const [dataLabels, setDataLabels] = useState("Category 1, Category 2, Category 3");
  const [dataValues, setDataValues] = useState("10, 20, 30");

  const handleInsert = () => {
    const labels = dataLabels.split(',').map(l => l.trim());
    const values = dataValues.split(',').map(v => parseFloat(v.trim()) || 0);
    
    const chartData = {
      type: selectedType,
      title: chartTitle,
      labels,
      values,
    };

    onInsert(selectedType, chartData);
    onOpenChange(false);
  };

  const chartTypes = [
    { id: "bar", name: "Bar Chart", icon: BarChart3 },
    { id: "line", name: "Line Chart", icon: LineChart },
    { id: "pie", name: "Pie Chart", icon: PieChart },
    { id: "area", name: "Area Chart", icon: TrendingUp },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Insert Chart</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Chart Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {chartTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                      selectedType === type.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="chart-title">Chart Title</Label>
            <Input
              id="chart-title"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="data-labels">Data Labels (comma-separated)</Label>
            <Input
              id="data-labels"
              value={dataLabels}
              onChange={(e) => setDataLabels(e.target.value)}
              placeholder="Category 1, Category 2, Category 3"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="data-values">Data Values (comma-separated)</Label>
            <Input
              id="data-values"
              value={dataValues}
              onChange={(e) => setDataValues(e.target.value)}
              placeholder="10, 20, 30"
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert Chart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

