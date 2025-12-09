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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";

interface DateTimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (formatted: string) => void;
}

const dateFormats = [
  { label: "MM/DD/YYYY", value: "MM/dd/yyyy", example: format(new Date(), "MM/dd/yyyy") },
  { label: "DD/MM/YYYY", value: "dd/MM/yyyy", example: format(new Date(), "dd/MM/yyyy") },
  { label: "Month DD, YYYY", value: "MMMM dd, yyyy", example: format(new Date(), "MMMM dd, yyyy") },
  { label: "DD Month YYYY", value: "dd MMMM yyyy", example: format(new Date(), "dd MMMM yyyy") },
  { label: "YYYY-MM-DD", value: "yyyy-MM-dd", example: format(new Date(), "yyyy-MM-dd") },
];

const timeFormats = [
  { label: "HH:MM", value: "HH:mm", example: format(new Date(), "HH:mm") },
  { label: "HH:MM:SS", value: "HH:mm:ss", example: format(new Date(), "HH:mm:ss") },
  { label: "h:MM AM/PM", value: "h:mm a", example: format(new Date(), "h:mm a") },
  { label: "h:MM:SS AM/PM", value: "h:mm:ss a", example: format(new Date(), "h:mm:ss a") },
];

export function DateTimeDialog({
  open,
  onOpenChange,
  onInsert,
}: DateTimeDialogProps) {
  const [type, setType] = useState<"date" | "time" | "both">("date");
  const [dateFormat, setDateFormat] = useState("MM/dd/yyyy");
  const [timeFormat, setTimeFormat] = useState("HH:mm");
  const [updateAutomatically, setUpdateAutomatically] = useState(false);

  const handleInsert = () => {
    let formatted = "";
    const now = new Date();

    if (type === "date") {
      formatted = format(now, dateFormat);
    } else if (type === "time") {
      formatted = format(now, timeFormat);
    } else {
      formatted = `${format(now, dateFormat)} ${format(now, timeFormat)}`;
    }

    if (updateAutomatically) {
      // Insert as a special field that updates
      formatted = `[DATE:${formatted}:${type}:${dateFormat}:${timeFormat}]`;
    }

    onInsert(formatted);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Date and Time</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Type</Label>
            <RadioGroup value={type} onValueChange={(value) => setType(value as any)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="date" />
                <Label htmlFor="date" className="font-normal">Date only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="time" id="time" />
                <Label htmlFor="time" className="font-normal">Time only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="font-normal">Date and Time</Label>
              </div>
            </RadioGroup>
          </div>

          {type !== "time" && (
            <div>
              <Label>Date Format</Label>
              <div className="mt-2 space-y-2">
                {dateFormats.map((format) => (
                  <div key={format.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`date-${format.value}`}
                      name="dateFormat"
                      value={format.value}
                      checked={dateFormat === format.value}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="rounded"
                    />
                    <Label htmlFor={`date-${format.value}`} className="font-normal flex-1">
                      {format.label} <span className="text-gray-500">({format.example})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type !== "date" && (
            <div>
              <Label>Time Format</Label>
              <div className="mt-2 space-y-2">
                {timeFormats.map((format) => (
                  <div key={format.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`time-${format.value}`}
                      name="timeFormat"
                      value={format.value}
                      checked={timeFormat === format.value}
                      onChange={(e) => setTimeFormat(e.target.value)}
                      className="rounded"
                    />
                    <Label htmlFor={`time-${format.value}`} className="font-normal flex-1">
                      {format.label} <span className="text-gray-500">({format.example})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="auto-update"
              checked={updateAutomatically}
              onChange={(e) => setUpdateAutomatically(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="auto-update" className="text-sm font-normal">
              Update automatically
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

