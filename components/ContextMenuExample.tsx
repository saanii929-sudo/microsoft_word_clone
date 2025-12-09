import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useContextMenuTriggers } from "@/hooks/useContextMenuTriggers";

const ContextMenuExample: React.FC = () => {
  const { handlers } = useContextMenuTriggers({
    longPressDelay: 500,  // 500ms for long press
    doubleClickDelay: 300 // 300ms for double click detection
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Context Menu Example</h2>
      <p className="mb-4">
        This component demonstrates how to use the context menu with:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Right-click (desktop)</li>
        <li>Long press (mobile - 500ms)</li>
        <li>Double click (mobile and desktop)</li>
      </ul>

      <div className="mt-6">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              className="bg-blue-100 p-6 rounded-lg shadow-md cursor-pointer text-center"
              {...handlers}
            >
              <p className="font-medium">
                Try right-click, long press, or double click me!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Works on both desktop and mobile devices
              </p>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Option 1</ContextMenuItem>
            <ContextMenuItem>Option 2</ContextMenuItem>
            <ContextMenuItem>Option 3</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  );
};

export default ContextMenuExample;
