
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import type { SourceImage } from '../types';

interface MergeHouseEditorProps {
  sourceImage: SourceImage;
  onMaskReady: (mask: SourceImage | null) => void;
  brushSize: number;
  drawMode: 'line' | 'rect';
}

interface Point {
  x: number;
  y: number;
}

export const MergeHouseEditor = forwardRef<{ clear: () => void }, MergeHouseEditorProps>(({ sourceImage, onMaskReady, brushSize, drawMode }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);

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
    setStartPoint(null);
    setCurrentPoint(null);
    setHistory([]);
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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    setIsDrawing(true);
    setStartPoint(coords);
    setCurrentPoint(coords);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setHistory(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    setCurrentPoint(coords);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Restore last state before drawing preview
    if (history.length > 0) {
      ctx.putImageData(history[history.length - 1], 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.strokeStyle = '#dc2626'; // Red
    ctx.fillStyle = '#dc2626'; // Red
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (drawMode === 'line') {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else {
      const x = Math.min(startPoint.x, coords.x);
      const y = Math.min(startPoint.y, coords.y);
      const w = Math.abs(startPoint.x - coords.x);
      const h = Math.abs(startPoint.y - coords.y);
      ctx.fillRect(x, y, w, h);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (canvas && maskCanvas) {
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx && startPoint && currentPoint) {
        maskCtx.fillStyle = '#FFFFFF';
        if (drawMode === 'line') {
          maskCtx.strokeStyle = '#FFFFFF';
          maskCtx.lineWidth = brushSize;
          maskCtx.lineCap = 'round';
          maskCtx.beginPath();
          maskCtx.moveTo(startPoint.x, startPoint.y);
          maskCtx.lineTo(currentPoint.x, currentPoint.y);
          maskCtx.stroke();
        } else {
          const x = Math.min(startPoint.x, currentPoint.x);
          const y = Math.min(startPoint.y, currentPoint.y);
          const w = Math.abs(startPoint.x - currentPoint.x);
          const h = Math.abs(startPoint.y - currentPoint.y);
          maskCtx.fillRect(x, y, w, h);
        }
        const base64 = maskCanvas.toDataURL('image/png').split(',')[1];
        onMaskReady({ base64, mimeType: 'image/png' });
      }
    }
    setStartPoint(null);
    setCurrentPoint(null);
  };

  return (
    <div className="absolute inset-0 w-full h-full cursor-crosshair pointer-events-auto">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full"
      />
    </div>
  );
});
