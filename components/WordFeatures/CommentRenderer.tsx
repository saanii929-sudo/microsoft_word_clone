"use client";

import { useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X, Edit, Trash2 } from "lucide-react";

export function CommentRenderer() {
  useEffect(() => {
    // Add click handlers to all comment markers
    const handleCommentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('comment-marker') || target.closest('.comment-marker')) {
        const marker = target.classList.contains('comment-marker') 
          ? target 
          : target.closest('.comment-marker') as HTMLElement;
        
        if (marker) {
          const id = marker.getAttribute('data-comment-id');
          const author = marker.getAttribute('data-comment-author') || 'User';
          const content = marker.getAttribute('data-comment-content') || '';
          const date = marker.getAttribute('data-comment-date') || new Date().toISOString();
          
          // Show comment in a tooltip/popover
          showCommentTooltip(marker, { id, author, content, date });
        }
      }
    };

    document.addEventListener('click', handleCommentClick);
    return () => {
      document.removeEventListener('click', handleCommentClick);
    };
  }, []);

  const showCommentTooltip = (element: HTMLElement, comment: { id: string | null; author: string; content: string; date: string }) => {
    // Create a tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'comment-tooltip';
    tooltip.innerHTML = `
      <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 250px; z-index: 1000;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div>
            <div style="font-weight: 600; font-size: 14px;">${comment.author}</div>
            <div style="font-size: 11px; color: #666; margin-top: 2px;">${new Date(comment.date).toLocaleDateString()}</div>
          </div>
          <button onclick="this.closest('.comment-tooltip').remove()" style="background: none; border: none; cursor: pointer; padding: 4px;">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor">
              <path d="M1 1l12 12M13 1L1 13" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div style="font-size: 13px; color: #333; line-height: 1.5;">${comment.content}</div>
      </div>
    `;
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom + 5}px`;
    tooltip.style.zIndex = '10000';
    
    // Remove existing tooltips
    document.querySelectorAll('.comment-tooltip').forEach(t => t.remove());
    
    // Add to document
    document.body.appendChild(tooltip);
    
    // Close on click outside
    const closeTooltip = (e: MouseEvent) => {
      if (!tooltip.contains(e.target as Node) && !element.contains(e.target as Node)) {
        tooltip.remove();
        document.removeEventListener('click', closeTooltip);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeTooltip);
    }, 100);
  };

  return null;
}

