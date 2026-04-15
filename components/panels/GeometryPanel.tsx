
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { sourceImageToDataUrl, dataUrlToSourceImage } from '../../utils';
import type { SourceImage } from '../../types';
import { PerspectiveTransform } from '../../utils/perspective';
import { detectPerspective } from '../../services/geminiService';

interface GeometryPanelProps {
    sourceImage: SourceImage;
    onImageUpdate: (newImage: SourceImage) => void;
}

export const GeometryPanel: React.FC<GeometryPanelProps> = ({ sourceImage, onImageUpdate }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    
    const [vertical, setVertical] = useState(0);
    const [horizontal, setHorizontal] = useState(0);
    const [rotate, setRotate] = useState(0);
    const [scale, setScale] = useState(100);
    const [aspect, setAspect] = useState(0);
    
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const reset = () => {
        setVertical(0);
        setHorizontal(0);
        setRotate(0);
        setScale(100);
        setAspect(0);
    };

    const applyTransform = async () => {
        if (!sourceImage) return;
        setIsProcessing(true);
        
        try {
            const img = new Image();
            img.src = sourceImageToDataUrl(sourceImage);
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            // Calculate Homography
            // For 2-point perspective, we can approximate it with a 3x3 matrix
            // Vertical perspective: tilt around X axis
            // Horizontal perspective: tilt around Y axis
            
            const w = canvas.width;
            const h = canvas.height;
            
            // We'll use a simplified model:
            // Map 4 corners to new positions
            // TL, TR, BL, BR
            
            const vFactor = vertical / 100;
            const hFactor = horizontal / 100;
            const rRad = (rotate * Math.PI) / 180;
            const sFactor = scale / 100;
            const aFactor = aspect / 100;

            // Define source points (corners)
            const srcPoints = [
                0, 0,
                w, 0,
                w, h,
                0, h
            ];

            // Define destination points based on sliders
            const dstPoints = [
                0, 0,
                w, 0,
                w, h,
                0, h
            ];

            // Vertical perspective: top and bottom edges change width
            if (vertical !== 0) {
                const shift = (w * Math.abs(vFactor)) / 2;
                if (vFactor > 0) {
                    // Top wider, bottom narrower
                    dstPoints[0] -= shift;
                    dstPoints[2] += shift;
                    dstPoints[4] -= shift;
                    dstPoints[6] += shift;
                } else {
                    // Top narrower, bottom wider
                    dstPoints[0] += shift;
                    dstPoints[2] -= shift;
                    dstPoints[4] += shift;
                    dstPoints[6] -= shift;
                }
            }

            // Horizontal perspective: left and right edges change height
            if (horizontal !== 0) {
                const shift = (h * Math.abs(hFactor)) / 2;
                if (hFactor > 0) {
                    dstPoints[1] -= shift;
                    dstPoints[7] += shift;
                    dstPoints[3] -= shift;
                    dstPoints[5] += shift;
                } else {
                    dstPoints[1] += shift;
                    dstPoints[7] -= shift;
                    dstPoints[3] += shift;
                    dstPoints[5] -= shift;
                }
            }

            // Calculate Homography using perspective-transform
            const transform = new PerspectiveTransform(srcPoints, dstPoints);
            
            if (transform) {
                renderWarpedImage(img, canvas, transform, sFactor, rRad, aFactor);
                const dataUrl = canvas.toDataURL(sourceImage.mimeType);
                const newSourceImage = dataUrlToSourceImage(dataUrl);
                if (newSourceImage) {
                    onImageUpdate(newSourceImage);
                    reset();
                }
            }
        } catch (error) {
            console.error("Geometry transform failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // A better way to do perspective in 2D canvas without WebGL is to use subdivision
    const renderWarpedImage = (img: HTMLImageElement, canvas: HTMLCanvasElement, transform: any, scale: number, rotate: number, aspect: number) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        
        // Apply global transforms (Rotate, Scale, Aspect)
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotate);
        ctx.scale(scale, scale * (1 + aspect));
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Triangle-based subdivision warp
        const rows = 30; // Increased resolution for better quality
        const cols = 30;
        const sw = img.naturalWidth / cols;
        const sh = img.naturalHeight / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const sx = c * sw;
                const sy = r * sh;
                
                const p1_arr = transform.transform(sx, sy);
                const p2_arr = transform.transform(sx + sw, sy);
                const p3_arr = transform.transform(sx, sy + sh);
                const p4_arr = transform.transform(sx + sw, sy + sh);
                
                const p1 = { x: p1_arr[0], y: p1_arr[1] };
                const p2 = { x: p2_arr[0], y: p2_arr[1] };
                const p3 = { x: p3_arr[0], y: p3_arr[1] };
                const p4 = { x: p4_arr[0], y: p4_arr[1] };

                drawTriangle(ctx, img, sx, sy, sw, sh, p1, p2, p3);
                drawTriangle(ctx, img, sx + sw, sy + sh, -sw, -sh, p4, p3, p2);
            }
        }
        ctx.restore();
    };

    const drawTriangle = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, p1: any, p2: any, p3: any) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.clip();

        // Calculate affine transform for this triangle
        const denom = (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
        if (Math.abs(denom) < 0.1) {
            ctx.restore();
            return;
        }

        const a = ((p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)) / denom; // This is not quite right, need full affine solve
        // Standard affine transform from (0,0), (sw,0), (0,sh) to p1, p2, p3
        const m11 = (p2.x - p1.x) / sw;
        const m12 = (p2.y - p1.y) / sw;
        const m21 = (p3.x - p1.x) / sh;
        const m22 = (p3.y - p1.y) / sh;
        const dx = p1.x;
        const dy = p1.y;

        ctx.setTransform(m11, m12, m21, m22, dx, dy);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        ctx.restore();
    };

    const autoDetect = async () => {
        if (!sourceImage) return;
        setIsProcessing(true);
        try {
            const points = await detectPerspective(sourceImage);
            if (!points || points.length < 4) {
                alert("Không thể tự động nhận diện phối cảnh. Vui lòng điều chỉnh thủ công.");
                return;
            }

            const img = new Image();
            img.src = sourceImageToDataUrl(sourceImage);
            await new Promise((resolve) => img.onload = resolve);

            const w = img.naturalWidth;
            const h = img.naturalHeight;

            // points are in 0-1000 range, convert to image pixels
            const srcPoints = points.map(p => [p[0] * w / 1000, p[1] * h / 1000]).flat();
            
            // Target points: a perfect rectangle centered in the image
            // We'll use the average width and height of the detected points to maintain scale
            const minX = Math.min(...points.map(p => p[0]));
            const maxX = Math.max(...points.map(p => p[0]));
            const minY = Math.min(...points.map(p => p[1]));
            const maxY = Math.max(...points.map(p => p[1]));
            
            const targetW = (maxX - minX) * w / 1000;
            const targetH = (maxY - minY) * h / 1000;
            
            const centerX = (minX + maxX) / 2 * w / 1000;
            const centerY = (minY + maxY) / 2 * h / 1000;

            const dstPoints = [
                centerX - targetW / 2, centerY - targetH / 2,
                centerX + targetW / 2, centerY - targetH / 2,
                centerX + targetW / 2, centerY + targetH / 2,
                centerX - targetW / 2, centerY + targetH / 2
            ];

            const transform = new PerspectiveTransform(srcPoints, dstPoints);
            if (transform) {
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                renderWarpedImage(img, canvas, transform, 1, 0, 0);
                const dataUrl = canvas.toDataURL(sourceImage.mimeType);
                const newSourceImage = dataUrlToSourceImage(dataUrl);
                if (newSourceImage) {
                    onImageUpdate(newSourceImage);
                    reset();
                }
            }
        } catch (error) {
            console.error("Auto detect failed:", error);
            alert("Lỗi khi tự động nhận diện phối cảnh.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={`mt-4 border ${theme.border} rounded-lg overflow-hidden animate-fade-in`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-3 ${theme.inputBg} hover:bg-white/5 transition-colors`}
            >
                <div className="flex items-center gap-2">
                    <Icon name="maximize" className="w-4 h-4 text-cyan-300" />
                    <span className={`text-sm font-semibold ${theme.textMain}`}>Geometry (Cân chỉnh phối cảnh)</span>
                </div>
                <Icon name={isOpen ? "chevron-up" : "chevron-down"} className="w-4 h-4 text-slate-400" />
            </button>
            
            {isOpen && (
                <div className={`p-4 space-y-4 ${theme.panelBg} border-t ${theme.border}`}>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Vertical */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <label className={theme.textSub}>Vertical (Dọc)</label>
                                <span className="text-cyan-300 font-mono">{vertical}</span>
                            </div>
                            <input 
                                type="range" min="-100" max="100" value={vertical} 
                                onChange={(e) => setVertical(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"
                            />
                        </div>

                        {/* Horizontal */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <label className={theme.textSub}>Horizontal (Ngang)</label>
                                <span className="text-cyan-300 font-mono">{horizontal}</span>
                            </div>
                            <input 
                                type="range" min="-100" max="100" value={horizontal} 
                                onChange={(e) => setHorizontal(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"
                            />
                        </div>

                        {/* Rotate */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <label className={theme.textSub}>Rotate (Xoay)</label>
                                <span className="text-cyan-300 font-mono">{rotate}°</span>
                            </div>
                            <input 
                                type="range" min="-45" max="45" value={rotate} 
                                onChange={(e) => setRotate(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"
                            />
                        </div>

                        {/* Scale */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <label className={theme.textSub}>Scale (Tỷ lệ)</label>
                                <span className="text-cyan-300 font-mono">{scale}%</span>
                            </div>
                            <input 
                                type="range" min="50" max="150" value={scale} 
                                onChange={(e) => setScale(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"
                            />
                        </div>

                        {/* Aspect */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                                <label className={theme.textSub}>Aspect (Khung hình)</label>
                                <span className="text-cyan-300 font-mono">{aspect}</span>
                            </div>
                            <input 
                                type="range" min="-100" max="100" value={aspect} 
                                onChange={(e) => setAspect(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button 
                            onClick={autoDetect}
                            className={`flex-1 py-2 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1`}
                        >
                            <Icon name="sparkles" className="w-3 h-3" />
                            Auto
                        </button>
                        <button 
                            onClick={reset}
                            className={`flex-1 py-2 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors`}
                        >
                            Reset
                        </button>
                        <button 
                            onClick={applyTransform}
                            disabled={isProcessing || (vertical === 0 && horizontal === 0 && rotate === 0 && scale === 100 && aspect === 0)}
                            className={`flex-[2] py-2 text-xs rounded neva-primary-button font-semibold border-white/10 text-slate-950 disabled:bg-slate-700 disabled:text-slate-500 transition-colors`}
                        >
                            {isProcessing ? "Đang xử lý..." : "Áp dụng"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
