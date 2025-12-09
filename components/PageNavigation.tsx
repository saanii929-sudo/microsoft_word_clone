// components/PageNavigation.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react';

interface DocumentPage {
  id: string;
  page_number: number;
  title: string;
}

interface PageNavigationProps {
  pages: DocumentPage[];
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  onAddPage: (afterIndex: number) => void;
  onDeletePage: (pageId: string) => void;
  onUpdatePageTitle: (pageId: string, title: string) => void;
}

export function PageNavigation({
  pages,
  currentPageIndex,
  onPageChange,
  onAddPage,
  onDeletePage,
  onUpdatePageTitle,
}: PageNavigationProps) {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      onPageChange(currentPageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      onPageChange(currentPageIndex + 1);
    }
  };

  const startEditing = (page: DocumentPage) => {
    setEditingPageId(page.id);
    setEditTitle(page.title);
  };

  const saveEdit = (pageId: string) => {
    if (editTitle.trim()) {
      onUpdatePageTitle(pageId, editTitle.trim());
    }
    setEditingPageId(null);
    setEditTitle('');
  };

  const cancelEdit = () => {
    setEditingPageId(null);
    setEditTitle('');
  };

  return (
    <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
      {/* Previous Button */}
      <Button
        onClick={handlePrevious}
        disabled={currentPageIndex === 0}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>

      {/* Pages List */}
      <div className="flex items-center gap-2 flex-1 justify-center overflow-x-auto">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              index === currentPageIndex
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted cursor-pointer'
            }`}
            onClick={() => onPageChange(index)}
          >
            {editingPageId === page.id ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => saveEdit(page.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(page.id);
                  if (e.key === 'Escape') cancelEdit();
                }}
                className="h-6 text-sm bg-background"
                autoFocus
              />
            ) : (
              <>
                <span className="text-sm font-medium">
                  {page.title || `Page ${page.page_number}`}
                </span>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-6 w-6 p-0 hover:bg-background/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEditing(page)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddPage(index)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Page After
                    </DropdownMenuItem>
                    {pages.length > 1 && (
                      <DropdownMenuItem
                        onClick={() => onDeletePage(page.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Page
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <Button
        onClick={handleNext}
        disabled={currentPageIndex === pages.length - 1}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}