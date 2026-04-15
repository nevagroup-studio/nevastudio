
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './icons';

interface BeforeAfterSliderProps {
    before: string;
    after: string;
    className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after, className = "" }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const newSliderPos = (x / rect.width) * 100;
        setSliderPos(Math.max(0, Math.min(100, newSliderPos)));
    };

    const onMouseDown = () => setIsDragging(true);
    const onMouseUp = () => setIsDragging(false);

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    };

    // Add global mouse up listener to handle drag ending outside container
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div 
            ref={containerRef}
            className={`relative w-full h-full select-none overflow-hidden rounded-lg cursor-ew-resize bg-black/20 ${className}`}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onTouchMove={onTouchMove}
            onTouchStart={onMouseDown}
        >
            {/* "Before" Layer (Source Image) */}
            <img 
                src={before} 
                alt="Before" 
                className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
            />

            {/* "After" Layer (Generated Image) */}
            <div 
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" 
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <img 
                    src={after} 
                    alt="After" 
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                />
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none uppercase tracking-widest">Gốc</div>
            <div className="absolute top-4 right-4 bg-cyan-400/80 text-slate-950 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none uppercase tracking-widest">Kết quả</div>

            {/* Slider Handle */}
            <div 
                className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10" 
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xl border-4 border-slate-800">
                    <div className="flex gap-0.5">
                        <Icon name="arrow-left-circle" className="w-4 h-4 text-slate-800" />
                        <Icon name="arrow-right-circle" className="w-4 h-4 text-slate-800" />
                    </div>
                </div>
            </div>
        </div>
    );
};
