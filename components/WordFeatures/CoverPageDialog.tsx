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
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, BookOpen, File, Briefcase, GraduationCap } from "lucide-react";

interface CoverPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (template: string) => void;
}

const coverPageTemplates = [
  {
    id: "modern",
    name: "Modern",
    icon: FileText,
    preview: "Clean and professional design",
  },
  {
    id: "academic",
    name: "Academic",
    icon: GraduationCap,
    preview: "Formal academic style",
  },
  {
    id: "business",
    name: "Business",
    icon: Briefcase,
    preview: "Professional business format",
  },
  {
    id: "report",
    name: "Report",
    icon: File,
    preview: "Structured report layout",
  },
  {
    id: "book",
    name: "Book",
    icon: BookOpen,
    preview: "Classic book cover style",
  },
];

export function CoverPageDialog({
  open,
  onOpenChange,
  onInsert,
}: CoverPageDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleInsert = () => {
    if (selectedTemplate) {
      const template = generateCoverPageHTML(selectedTemplate);
      onInsert(template);
      onOpenChange(false);
      setSelectedTemplate(null);
    }
  };

  const generateCoverPageHTML = (templateId: string): string => {
    const templates: Record<string, string> = {
      modern: `
        <div style="page-break-after: always; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 20px;">Document Title</h1>
          <h2 style="font-size: 24px; font-weight: 300; margin-bottom: 40px; opacity: 0.9;">Subtitle or Description</h2>
          <div style="margin-top: 60px; font-size: 18px;">
            <p>Author Name</p>
            <p style="margin-top: 10px; opacity: 0.8;">Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `,
      academic: `
        <div style="page-break-after: always; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px; border: 2px solid #333;">
          <h1 style="font-size: 42px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px;">Document Title</h1>
          <div style="width: 200px; height: 2px; background: #333; margin: 30px 0;"></div>
          <h2 style="font-size: 20px; font-weight: normal; margin-bottom: 50px;">A Research Paper</h2>
          <div style="margin-top: 80px; line-height: 1.8;">
            <p><strong>Author Name</strong></p>
            <p>Institution Name</p>
            <p style="margin-top: 20px;">${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `,
      business: `
        <div style="page-break-after: always; min-height: 100vh; display: flex; flex-direction: column; padding: 80px 60px; background: #f8f9fa;">
          <div style="border-left: 4px solid #007bff; padding-left: 30px; margin-bottom: 60px;">
            <h1 style="font-size: 44px; font-weight: 600; margin-bottom: 15px; color: #333;">Document Title</h1>
            <h2 style="font-size: 22px; font-weight: 300; color: #666;">Business Proposal</h2>
          </div>
          <div style="margin-top: auto; padding-top: 40px; border-top: 1px solid #ddd;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Prepared by:</strong></td>
                <td style="padding: 8px 0;">Author Name</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
                <td style="padding: 8px 0;">${new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Company:</strong></td>
                <td style="padding: 8px 0;">Company Name</td>
              </tr>
            </table>
          </div>
        </div>
      `,
      report: `
        <div style="page-break-after: always; min-height: 100vh; display: flex; flex-direction: column; padding: 60px;">
          <div style="text-align: center; margin-bottom: 80px;">
            <h1 style="font-size: 40px; font-weight: bold; margin-bottom: 20px;">REPORT TITLE</h1>
            <div style="width: 150px; height: 3px; background: #000; margin: 0 auto 20px;"></div>
            <h2 style="font-size: 18px; font-weight: normal; color: #555;">Annual Report</h2>
          </div>
          <div style="margin-top: auto; text-align: center;">
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Prepared by:</strong> Author Name</p>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Department:</strong> Department Name</p>
            <p style="font-size: 16px; margin-top: 30px;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `,
      book: `
        <div style="page-break-after: always; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px; background: #1a1a1a; color: #f5f5f5;">
          <div style="border: 3px solid #f5f5f5; padding: 60px 40px; max-width: 600px;">
            <h1 style="font-size: 52px; font-weight: bold; margin-bottom: 30px; font-family: 'Georgia', serif;">Book Title</h1>
            <div style="width: 100px; height: 2px; background: #f5f5f5; margin: 30px auto;"></div>
            <h2 style="font-size: 24px; font-weight: 300; margin-bottom: 50px; font-style: italic;">A Novel</h2>
            <div style="margin-top: 60px; font-size: 20px;">
              <p style="margin-bottom: 15px;">Author Name</p>
              <p style="font-size: 16px; opacity: 0.8;">${new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      `,
    };

    return templates[templateId] || templates.modern;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Insert Cover Page</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {coverPageTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-6 border-2 rounded-lg text-left transition-all ${selectedTemplate === template.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {template.preview}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!selectedTemplate}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

