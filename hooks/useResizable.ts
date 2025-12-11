import { useState, useCallback, useRef, useEffect } from 'react';

interface Dimensions {
    width: number;
    height: number;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

interface UseResizableOptions {
    initialDimensions?: Dimensions;
    minWidth?: number;
    minHeight?: number;
    maintainAspectRatio?: boolean;
    onResizeStart?: () => void;
    onResizeEnd?: (dimensions: Dimensions) => void;
    onResize?: (dimensions: Dimensions) => void;
    disabled?: boolean;
}

export function useResizable({
    initialDimensions = { width: 200, height: 150 },
    minWidth = 50,
    minHeight = 50,
    maintainAspectRatio = false,
    onResizeStart,
    onResizeEnd,
    onResize,
    disabled = false,
}: UseResizableOptions = {}) {
    const [dimensions, setDimensions] = useState<Dimensions>(initialDimensions);
    const [isResizing, setIsResizing] = useState(false);
    const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);
    const resizeStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const elementStartDimensions = useRef<Dimensions>(initialDimensions);
    const aspectRatio = useRef(initialDimensions.width / initialDimensions.height);

    const handleResizeStart = useCallback(
        (handle: ResizeHandle) => (e: React.MouseEvent) => {
            if (disabled) return;

            e.preventDefault();
            e.stopPropagation();

            setIsResizing(true);
            setActiveHandle(handle);
            resizeStartPos.current = { x: e.clientX, y: e.clientY };
            elementStartDimensions.current = dimensions;
            aspectRatio.current = dimensions.width / dimensions.height;
            onResizeStart?.();
        },
        [disabled, dimensions, onResizeStart]
    );

    useEffect(() => {
        if (!isResizing || !activeHandle) return;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - resizeStartPos.current.x;
            const deltaY = e.clientY - resizeStartPos.current.y;

            let newWidth = elementStartDimensions.current.width;
            let newHeight = elementStartDimensions.current.height;

            // Calculate new dimensions based on handle
            if (activeHandle.includes('e')) {
                newWidth = Math.max(minWidth, elementStartDimensions.current.width + deltaX);
            }
            if (activeHandle.includes('w')) {
                newWidth = Math.max(minWidth, elementStartDimensions.current.width - deltaX);
            }
            if (activeHandle.includes('s')) {
                newHeight = Math.max(minHeight, elementStartDimensions.current.height + deltaY);
            }
            if (activeHandle.includes('n')) {
                newHeight = Math.max(minHeight, elementStartDimensions.current.height - deltaY);
            }

            // Maintain aspect ratio if needed
            if (maintainAspectRatio) {
                if (activeHandle.includes('e') || activeHandle.includes('w')) {
                    newHeight = newWidth / aspectRatio.current;
                } else if (activeHandle.includes('n') || activeHandle.includes('s')) {
                    newWidth = newHeight * aspectRatio.current;
                }
            }

            const newDimensions = { width: newWidth, height: newHeight };
            setDimensions(newDimensions);
            onResize?.(newDimensions);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            setActiveHandle(null);
            onResizeEnd?.(dimensions);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, activeHandle, dimensions, minWidth, minHeight, maintainAspectRatio, onResize, onResizeEnd]);

    return {
        dimensions,
        setDimensions,
        isResizing,
        activeHandle,
        handleResizeStart,
    };
}
