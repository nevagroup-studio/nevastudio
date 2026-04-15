
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import type { SourceImage, BoundingBox } from '../types';

interface BrushEditorProps {
  sourceImage: SourceImage;
  onMaskReady: (mask: SourceImage | null) => void;
  brushSize: number;
  clipBox?: BoundingBox | null;
}

interface Point {
  x: number;
  y: number;
}

export const BrushEditor = forwardRef<{ clear: () => void }, BrushEditorProps>(({ sourceImage, onMaskReady, brushSize, clipBox }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const clear = () => {
    setIsDrawing(false);
    setLastPoint(null);
    setCurrentStroke([]);
    onMaskReady(null);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }

    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.fillStyle = '#000000';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    clear
  }));

  // Initialize canvases
  useEffect(() => {
    const img = new Image();
    img.src = `data:${sourceImage.mimeType};base64,${sourceImage.base64}`;
    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = naturalWidth;
        canvas.height = naturalHeight;
      }
      
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = naturalWidth;
      maskCanvas.height = naturalHeight;
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.fillStyle = '#000000';
        maskCtx.fillRect(0, 0, naturalWidth, naturalHeight);
      }
      maskCanvasRef.current = maskCanvas;
      
      clear();
    };
  }, [sourceImage]);

  const drawLine = (start: Point, end: Point) => {
    const visibleCtx = canvasRef.current?.getContext('2d');
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (!visibleCtx || !maskCtx) return;

    const applyDrawing = (ctx: CanvasRenderingContext2D, color: string) => {
        ctx.save();
        // Nếu có clipBox, giới hạn vùng vẽ
        if (clipBox) {
            ctx.beginPath();
            ctx.rect(clipBox.x, clipBox.y, clipBox.width, clipBox.height);
            ctx.clip();
        }
        
        ctx.beginPath(); // Luôn bắt đầu path mới để đảm bảo nét vẽ đúng
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
    };

    // Draw on visible canvas (for user feedback)
    applyDrawing(visibleCtx, 'rgba(220, 38, 38, 0.7)');
    
    // Draw on mask canvas (the actual mask)
    applyDrawing(maskCtx, '#FFFFFF');
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const coords = getCanvasCoordinates(e);
      if (!coords) return;
      setIsDrawing(true);
      setLastPoint(coords);
      setCurrentStroke([coords]);
      // Vẽ một điểm tại vị trí click
      drawLine(coords, { x: coords.x + 0.1, y: coords.y + 0.1 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoordinates(e);
    if (!coords || !lastPoint) return;

    drawLine(lastPoint, coords);
    setLastPoint(coords);
    setCurrentStroke(prev => [...prev, coords]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    // Check if the drawn path is a closed loop
    if (currentStroke.length > 2) {
      const startPoint = currentStroke[0];
      const endPoint = currentStroke[currentStroke.length - 1];
      const distance = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
      const closingThreshold = brushSize * 1.5;

      if (distance < closingThreshold) {
        const visibleCtx = canvasRef.current?.getContext('2d');
        const maskCtx = maskCanvasRef.current?.getContext('2d');
        if (visibleCtx && maskCtx) {
          const path = new Path2D();
          path.moveTo(currentStroke[0].x, currentStroke[0].y);
          for (let i = 1; i < currentStroke.length; i++) {
              path.lineTo(currentStroke[i].x, currentStroke[i].y);
          }
          path.closePath();

          const fillPath = (ctx: CanvasRenderingContext2D, color: string) => {
              ctx.save();
              if (clipBox) {
                  ctx.beginPath();
                  ctx.rect(clipBox.x, clipBox.y, clipBox.width, clipBox.height);
                  ctx.clip();
              }
              ctx.fillStyle = color;
              ctx.fill(path);
              ctx.restore();
          };

          fillPath(visibleCtx, 'rgba(220, 38, 38, 0.7)');
          fillPath(maskCtx, '#FFFFFF');
        }
      }
    }
    
    setIsDrawing(false);
    setLastPoint(null);
    setCurrentStroke([]);
    
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
        const base64 = maskCanvas.toDataURL('image/png').split(',')[1];
        onMaskReady({ base64, mimeType: 'image/png' });
    }
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
        handleMouseUp();
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full cursor-crosshair pointer-events-auto">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full"
      />
    </div>
  );
});
