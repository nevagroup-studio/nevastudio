
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { BoundingBox } from '../types';

interface BoundingBoxEditorProps {
  box: BoundingBox;
  onBoxChange: (box: BoundingBox) => void;
  imageDimensions: { width: number; height: number };
}

export const BoundingBoxEditor: React.FC<BoundingBoxEditorProps> = ({ box, onBoxChange, imageDimensions }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interaction, setInteraction] = useState<{
    type: string;
    startPoint: { x: number; y: number };
    startBox: BoundingBox;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    setInteraction({
      type,
      startPoint: { x: e.clientX, y: e.clientY },
      startBox: { ...box },
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!interaction || !imageDimensions.width) return;

    const screenToNaturalScale = imageDimensions.width / (containerRef.current?.parentElement?.clientWidth || imageDimensions.width);

    const dx = (e.clientX - interaction.startPoint.x) * screenToNaturalScale;
    const dy = (e.clientY - interaction.startPoint.y) * screenToNaturalScale;
    
    let newBox = { ...interaction.startBox };

    switch (interaction.type) {
      case 'move':
        newBox.x += dx;
        newBox.y += dy;
        break;
      case 'resize-br':
        newBox.width += dx;
        newBox.height += dy;
        break;
      case 'resize-tl':
        newBox.x += dx;
        newBox.y += dy;
        newBox.width -= dx;
        newBox.height -= dy;
        break;
      case 'resize-tr':
        newBox.y += dy;
        newBox.width += dx;
        newBox.height -= dy;
        break;
      case 'resize-bl':
        newBox.x += dx;
        newBox.width -= dx;
        newBox.height += dy;
        break;
      case 'resize-t':
        newBox.y += dy;
        newBox.height -= dy;
        break;
      case 'resize-b':
        newBox.height += dy;
        break;
      case 'resize-l':
        newBox.x += dx;
        newBox.width -= dx;
        break;
      case 'resize-r':
        newBox.width += dx;
        break;
    }

    // Constraints
    const minSize = 20;
    if (newBox.width < minSize) newBox.width = minSize;
    if (newBox.height < minSize) newBox.height = minSize;

    // Clamp to image boundaries
    newBox.x = Math.max(0, Math.min(imageDimensions.width - newBox.width, newBox.x));
    newBox.y = Math.max(0, Math.min(imageDimensions.height - newBox.height, newBox.y));

    onBoxChange(newBox);
  }, [interaction, onBoxChange, imageDimensions]);

  const handleMouseUp = useCallback(() => {
    setInteraction(null);
  }, []);

  useEffect(() => {
    if (interaction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interaction, handleMouseMove, handleMouseUp]);

  // Convert natural pixels to percentages for rendering
  const boxStyle = {
    left: `${(box.x / imageDimensions.width) * 100}%`,
    top: `${(box.y / imageDimensions.height) * 100}%`,
    width: `${(box.width / imageDimensions.width) * 100}%`,
    height: `${(box.height / imageDimensions.height) * 100}%`,
  };

  const handleSizeClass = "w-4 h-4 bg-white border-2 border-cyan-300 rounded-full shadow-lg pointer-events-auto transition-transform hover:scale-125 z-30";

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Background Dimming (Outer) */}
      <div className="absolute inset-0 bg-black/40" style={{ clipPath: `polygon(0% 0%, 0% 100%, ${boxStyle.left} 100%, ${boxStyle.left} ${boxStyle.top}, calc(${boxStyle.left} + ${boxStyle.width}) ${boxStyle.top}, calc(${boxStyle.left} + ${boxStyle.width}) calc(${boxStyle.top} + ${boxStyle.height}), ${boxStyle.left} calc(${boxStyle.top} + ${boxStyle.height}), ${boxStyle.left} 100%, 100% 100%, 100% 0%)` }}></div>

      <div 
        className="absolute border-2 border-dashed border-cyan-300/50 shadow-[0_0_20px_rgba(249,115,22,0.6)]"
        style={boxStyle}
      >
        {/* Interior: Specifically transparent and non-blocking for BrushEditor beneath */}
        <div className="absolute inset-0 pointer-events-none" />

        {/* Draggable Edges for Move interaction */}
        <div className="absolute top-0 left-0 right-0 h-4 -translate-y-1/2 cursor-move pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'move')} />
        <div className="absolute bottom-0 left-0 right-0 h-4 translate-y-1/2 cursor-move pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'move')} />
        <div className="absolute top-0 bottom-0 left-0 w-4 -translate-x-1/2 cursor-move pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'move')} />
        <div className="absolute top-0 bottom-0 right-0 w-4 translate-x-1/2 cursor-move pointer-events-auto" onMouseDown={(e) => handleMouseDown(e, 'move')} />

        {/* Corner Handles for Resizing */}
        <div className={`absolute -top-2 -left-2 cursor-nwse-resize ${handleSizeClass}`} onMouseDown={(e) => handleMouseDown(e, 'resize-tl')} />
        <div className={`absolute -top-2 -right-2 cursor-nesw-resize ${handleSizeClass}`} onMouseDown={(e) => handleMouseDown(e, 'resize-tr')} />
        <div className={`absolute -bottom-2 -left-2 cursor-nesw-resize ${handleSizeClass}`} onMouseDown={(e) => handleMouseDown(e, 'resize-bl')} />
        <div className={`absolute -bottom-2 -right-2 cursor-nwse-resize ${handleSizeClass}`} onMouseDown={(e) => handleMouseDown(e, 'resize-br')} />

        {/* Side Handles for Resizing */}
        <div className={`absolute top-1/2 -left-2 -translate-y-1/2 cursor-ew-resize ${handleSizeClass}`} onMouseDown={(e) => handleMouseDown(e, 'resize-l')} />
        <div className={`absolute top-1/2 -right-2 -translate-y-1/2 cursor-ew-resize ${handleSizeClass}`} onMouseDown={(e) => handleMouseDown(e, 'resize-r')} />
        <div className={`absolute -top-2 left-1/2 -translate-x-1/2 cursor-ns-resize ${handleSizeClass}`} onMouseDown={(e) => handleMouseDown(e, 'resize-t')} />
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 cursor-ns-resize ${handleSizeClass}`} onMouseDown={(e) => handleMouseDown(e, 'resize-b')} />
      </div>
    </div>
  );
};
