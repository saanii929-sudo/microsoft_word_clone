import { useState, useCallback, useRef, useEffect } from 'react';

interface Position {
    x: number;
    y: number;
}

interface UseDraggableOptions {
    initialPosition?: Position;
    onDragStart?: () => void;
    onDragEnd?: (position: Position) => void;
    onDrag?: (position: Position) => void;
    disabled?: boolean;
}

export function useDraggable({
    initialPosition = { x: 0, y: 0 },
    onDragStart,
    onDragEnd,
    onDrag,
    disabled = false,
}: UseDraggableOptions = {}) {
    const [position, setPosition] = useState<Position>(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef<Position>({ x: 0, y: 0 });
    const elementStartPos = useRef<Position>(initialPosition);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (disabled) return;

            e.preventDefault();
            e.stopPropagation();

            setIsDragging(true);
            dragStartPos.current = { x: e.clientX, y: e.clientY };
            elementStartPos.current = position;
            onDragStart?.();
        },
        [disabled, position, onDragStart]
    );

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - dragStartPos.current.x;
            const deltaY = e.clientY - dragStartPos.current.y;

            const newPosition = {
                x: elementStartPos.current.x + deltaX,
                y: elementStartPos.current.y + deltaY,
            };

            setPosition(newPosition);
            onDrag?.(newPosition);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            onDragEnd?.(position);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, position, onDrag, onDragEnd]);

    return {
        position,
        setPosition,
        isDragging,
        handleMouseDown,
    };
}
