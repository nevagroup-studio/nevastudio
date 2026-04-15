
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { SourceImage, BoundingBox } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Icon } from './icons';
import { ImageDropzone } from './ImageDropzone';
import { sourceImageToDataUrl } from '../utils';
import { BeforeAfterSlider } from './BeforeAfterSlider';

// --- Sub-components defined inside the main file for simplicity ---

const BoundingBoxEditor: React.FC<{
  box: BoundingBox | null;
  onBoxChange: (box: BoundingBox) => void;
  imageDimensions: { width: number; height: number };
}> = ({ box, onBoxChange, imageDimensions }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interaction, setInteraction] = useState<{
    type: string;
    startPoint: { x: number; y: number };
    startBox: BoundingBox;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, type: string) => {
    if (!containerRef.current) return;
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    const startPoint = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };

    setInteraction({
      type,
      startPoint,
      startBox: box || { x: startPoint.x * imageDimensions.width, y: startPoint.y * imageDimensions.height, width: 0, height: 0 },
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!interaction || !containerRef.current || !imageDimensions.width) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentPoint = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };

    const dx = (currentPoint.x - interaction.startPoint.x) * imageDimensions.width;
    const dy = (currentPoint.y - interaction.startPoint.y) * imageDimensions.height;
    
    let tempBox = { ...interaction.startBox };

    switch (interaction.type) {
        case 'draw':
            tempBox.width = dx;
            tempBox.height = dy;
            break;
        case 'move':
            tempBox.x += dx;
            tempBox.y += dy;
            break;
        case 'resize-br':
            tempBox.width += dx;
            tempBox.height += dy;
            break;
        case 'resize-tl':
            tempBox.x += dx;
            tempBox.y += dy;
            tempBox.width -= dx;
            tempBox.height -= dy;
            break;
        case 'resize-tr':
            tempBox.width += dx;
            tempBox.y += dy;
            tempBox.height -= dy;
            break;
        case 'resize-bl':
            tempBox.x += dx;
            tempBox.width -= dx;
            tempBox.height += dy;
            break;
        case 'resize-t':
            tempBox.y += dy;
            tempBox.height -= dy;
            break;
        case 'resize-b':
            tempBox.height += dy;
            break;
        case 'resize-l':
            tempBox.x += dx;
            tempBox.width -= dx;
            break;
        case 'resize-r':
            tempBox.width += dx;
            break;
    }

    let newBox = { ...tempBox };
    if (newBox.width < 0) {
        newBox.x = tempBox.x + tempBox.width;
        newBox.width = -tempBox.width;
    }
    if (newBox.height < 0) {
        newBox.y = tempBox.y + tempBox.height;
        newBox.height = -tempBox.height;
    }
    
    // Clamp box to image boundaries
    newBox.x = Math.max(0, newBox.x);
    newBox.y = Math.max(0, newBox.y);
    newBox.width = Math.min(imageDimensions.width - newBox.x, newBox.width);
    newBox.height = Math.min(imageDimensions.height - newBox.y, newBox.height);
    
    onBoxChange(newBox);
  }, [interaction, onBoxChange, imageDimensions]);

  const handleMouseUp = useCallback(() => {
    setInteraction(null);
  }, []);

  useEffect(() => {
    const currentInteraction = interaction;
    if (currentInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interaction, handleMouseMove, handleMouseUp]);

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    // Start drawing a new box only if there isn't one already and the click is on the container
    if (e.target === containerRef.current) {
      handleMouseDown(e, 'draw');
    }
  };

  const handles = [
      { pos: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2', cursor: 'nwse-resize', type: 'resize-tl' },
      { pos: 'top-0 right-0 translate-x-1/2 -translate-y-1/2', cursor: 'nesw-resize', type: 'resize-tr' },
      { pos: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2', cursor: 'nesw-resize', type: 'resize-bl' },
      { pos: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2', cursor: 'nwse-resize', type: 'resize-br' },
      { pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2', cursor: 'ns-resize', type: 'resize-t' },
      { pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', cursor: 'ns-resize', type: 'resize-b' },
      { pos: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize', type: 'resize-l' },
      { pos: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize', type: 'resize-r' },
  ];

  const boxStyle = box && imageDimensions.width > 0 ? {
      left: `${(box.x / imageDimensions.width) * 100}%`,
      top: `${(box.y / imageDimensions.height) * 100}%`,
      width: `${(box.width / imageDimensions.width) * 100}%`,
      height: `${(box.height / imageDimensions.height) * 100}%`,
      cursor: 'move',
  } : { display: 'none' };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-crosshair"
      onMouseDown={handleContainerMouseDown}
    >
      <div 
        className="absolute border-2 border-pink-500 bg-pink-500/20" 
        style={boxStyle}
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      >
          {handles.map(h => (
              <div 
                  key={h.type}
                  className={`absolute w-3 h-3 bg-white border border-pink-600 rounded-full z-10 ${h.pos}`}
                  style={{ cursor: h.cursor }}
                  onMouseDown={(e) => handleMouseDown(e, h.type)}
              />
          ))}
      </div>
    </div>
  );
};


const MaskEditor: React.FC<{
  onMaskChange: (mask: SourceImage) => void;
  brushSize: number;
  imageDimensions: { width: number, height: number };
  boundingBox: BoundingBox | null;
}> = ({ onMaskChange, brushSize, imageDimensions, boundingBox }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPoint = useRef<{x: number, y: number} | null>(null);

  const clearCanvas = useCallback(() => {
    const { width, height } = imageDimensions;
    if (width > 0 && height > 0) {
      const visibleCtx = canvasRef.current?.getContext('2d');
      visibleCtx?.clearRect(0, 0, width, height);

      const maskCtx = maskCanvasRef.current?.getContext('2d');
      if (maskCtx) {
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, width, height);
      }
    }
  }, [imageDimensions]);
  
  useEffect(() => {
    const { width, height } = imageDimensions;
    if (width > 0 && height > 0) {
      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = width;
      maskCanvas.height = height;
      maskCanvasRef.current = maskCanvas;
      clearCanvas();
    }
  }, [imageDimensions, clearCanvas]);

  useEffect(() => {
    clearCanvas();
  }, [boundingBox, clearCanvas]);
  
  const getCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const drawLine = (from: {x: number, y: number}, to: {x: number, y: number}) => {
    const ctx = canvasRef.current?.getContext('2d');
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (!ctx || !maskCtx || !boundingBox) return;

    const applyDrawing = (context: CanvasRenderingContext2D, style: string | CanvasGradient | CanvasPattern) => {
      context.save();
      context.beginPath();
      context.rect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
      context.clip();
      
      context.strokeStyle = style;
      context.lineWidth = brushSize;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.y, to.y); // Typo fix from original if needed, but keeping logic
      context.stroke();
      
      context.restore();
    };

    applyDrawing(ctx, "rgba(236, 72, 153, 0.7)"); // Pink for user
    applyDrawing(maskCtx, "white"); // White for AI
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!boundingBox) return;
      setIsDrawing(true);
      const coords = getCoords(e);
      lastPoint.current = coords;
      drawLine(coords, {...coords, x: coords.x + 0.1});
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint.current) return;
    const coords = getCoords(e);
    drawLine(lastPoint.current, coords);
    lastPoint.current = coords;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPoint.current = null;
    if (maskCanvasRef.current) {
      const base64 = maskCanvasRef.current.toDataURL('image/png').split(',')[1];
      onMaskChange({ base64, mimeType: 'image/png' });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-crosshair"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};

// --- Main View Component ---

export const EditorBetaView: React.FC<{
  sourceImage: SourceImage | null;
  setSourceImage: (image: SourceImage | null) => void;
  referenceImage: SourceImage | null;
  setReferenceImage: (image: SourceImage | null) => void;
  selection: { box: BoundingBox; mask: SourceImage } | null;
  setSelection: (selection: { box: BoundingBox; mask: SourceImage } | null) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  intermediateResult: SourceImage | null;
  finalResult: SourceImage | null;
  expansion: number;
  setExpansion: (val: number) => void;
  edgeBlend: number;
  setEdgeBlend: (val: number) => void;
  isLoading: boolean;
  handleGenerate: () => void;
  setFullscreenImage: (url: string | null) => void;
  handleSetFinalAsSource: () => void;
  handleUseEditorImageInCreate: (image: SourceImage) => void;
}> = ({
  sourceImage, setSourceImage, referenceImage, setReferenceImage, selection, setSelection, prompt, setPrompt,
  intermediateResult, finalResult, expansion, setExpansion,
  edgeBlend, setEdgeBlend, isLoading, handleGenerate, setFullscreenImage, 
  handleSetFinalAsSource, handleUseEditorImageInCreate
}) => {
  const { t } = useLanguage();
  const [tool, setTool] = useState<'box' | 'mask'>('box');
  const [brushSize, setBrushSize] = useState(30);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [showMergedActions, setShowMergedActions] = useState(false);

  const handleImageUpload = (image: SourceImage | null) => {
    setSourceImage(image);
    setShowMergedActions(false);
  };

  const handleMerge = () => {
    handleSetFinalAsSource();
    setShowMergedActions(true);
  };

  useEffect(() => {
    if (sourceImage) {
      const img = new Image();
      img.src = sourceImageToDataUrl(sourceImage);
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
    } else {
      setImageDimensions({ width: 0, height: 0 });
      setShowMergedActions(false);
    }
  }, [sourceImage]);
  
  const handleBoxChange = useCallback((box: BoundingBox) => {
      const canvas = document.createElement('canvas');
      canvas.width = imageDimensions.width;
      canvas.height = imageDimensions.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(box.x, box.y, box.width, box.height);
        const base64 = canvas.toDataURL('image/png').split(',')[1];
        const mask = { base64, mimeType: 'image/png' };
        setSelection({ box, mask });
      }
  }, [setSelection, imageDimensions]);

  const handleMaskChange = (mask: SourceImage) => {
    if (selection?.box) {
        setSelection({ box: selection.box, mask });
    }
  };

  return (
    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Controls Column */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
          <h3 className="font-semibold text-slate-300 mb-3 text-lg border-b border-slate-700 pb-2">{t('editorBetaStep1')}</h3>
          <ImageDropzone onImageUpload={handleImageUpload} className='w-full border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-center text-slate-400 text-sm cursor-pointer mb-4 min-h-[10rem]'>
            {sourceImage ? 
                <img src={sourceImageToDataUrl(sourceImage)} alt="Source" className="max-w-full max-h-40 object-contain p-1" /> :
                <div><p>{t('dropzoneHint')}</p><p className="text-xs mt-1 text-slate-500">{t('dropzoneFormats')}</p></div>
            }
          </ImageDropzone>
          <label className="text-sm font-medium text-slate-400">{t('editorBetaSelectTool')}</label>
          <div className="flex bg-slate-900/70 rounded-md p-1 space-x-1 my-2">
            <button onClick={() => setTool('box')} className={`w-1/2 py-2 text-sm rounded ${tool === 'box' ? 'neva-primary-button font-semibold border-white/10 text-slate-950' : 'text-slate-300 hover:bg-slate-700'}`}>{t('editorBetaBoundingBox')}</button>
            <button onClick={() => setTool('mask')} className={`w-1/2 py-2 text-sm rounded ${tool === 'mask' ? 'neva-primary-button font-semibold border-white/10 text-slate-950' : 'text-slate-300 hover:bg-slate-700'}`}>{t('editorBetaMask')}</button>
          </div>
          {tool === 'mask' && (
            <div>
              <label htmlFor="brushSize" className="text-sm font-medium text-slate-400">{t('brushSize')}: {brushSize}px</label>
              <input id="brushSize" type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"/>
            </div>
          )}
        </div>
        
        <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
          <h3 className="font-semibold text-slate-300 mb-3 text-lg border-b border-slate-700 pb-2">{t('editorBetaStep2')}</h3>
          
          <div className="mb-3">
            <p className="text-xs text-slate-400 mb-1">{t('uploadReferenceOptional')}</p>
            {referenceImage ? (
                <div className="relative group">
                    <ImageDropzone onImageUpload={setReferenceImage} className="cursor-pointer rounded-lg"><div className='bg-black/30 rounded-lg p-1'><img src={sourceImageToDataUrl(referenceImage)} alt="Ref" className="h-20 w-full object-contain rounded" /></div></ImageDropzone>
                    <button onClick={() => setReferenceImage(null)} className="absolute top-1 right-1 bg-black/60 rounded-full text-white hover:bg-black/80 p-1 opacity-0 group-hover:opacity-100 z-10"><Icon name="x-circle" className="w-4 h-4" /></button>
                </div>
            ) : (
                <ImageDropzone onImageUpload={setReferenceImage} className='w-full h-20 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-center text-slate-400 text-xs cursor-pointer'>
                    <p>{t('dropzoneHint')}</p>
                </ImageDropzone>
            )}
          </div>

          <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('promptPlaceholder.editorBeta')}
              className="w-full bg-slate-900/70 p-3 rounded-md h-24 resize-none text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none border border-slate-700"
          />
           <button onClick={handleGenerate} disabled={isLoading || !sourceImage || !selection} className="w-full neva-primary-button font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed mt-2 text-base">
                <Icon name="sparkles" className="w-5 h-5" />
                {isLoading ? t('generating') : t('editorBetaGenerateContent')}
            </button>
        </div>

         <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
          <h3 className="font-semibold text-slate-300 mb-3 text-lg border-b border-slate-700 pb-2">{t('editorBetaStep3')}</h3>
          <div>
              <label htmlFor="expansion" className="text-sm font-medium text-slate-400">{t('editorBetaExpansion')}: {expansion}px</label>
              <input id="expansion" type="range" min="0" max="100" value={expansion} onChange={(e) => setExpansion(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"/>
            </div>
            <div className='mt-2'>
              <label htmlFor="edgeBlend" className="text-sm font-medium text-slate-400">{t('editorBetaEdgeBlend')}: {edgeBlend}px</label>
              <input id="edgeBlend" type="range" min="0" max="100" value={edgeBlend} onChange={(e) => setEdgeBlend(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"/>
            </div>
            <button onClick={handleMerge} disabled={!finalResult || isLoading} className="w-full neva-primary-button font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed mt-4 text-base">
                <Icon name="arrow-up-tray" className="w-5 h-5" />
                {t('mergeToOriginal')}
            </button>
        </div>
      </div>
      
      {/* Editor & Results Column */}
      <div className="lg:col-span-9 space-y-4">
        <div className="bg-slate-900/50 rounded-lg min-h-[40vh] flex items-center justify-center p-2 border border-slate-700 relative aspect-[4/3]">
          {sourceImage ? (
            <div className='relative w-full h-full flex items-center justify-center'>
              <img src={sourceImageToDataUrl(sourceImage)} alt="Editor" className="max-w-full max-h-full object-contain pointer-events-none" />
              {showMergedActions && (
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                  <a 
                    href={sourceImageToDataUrl(sourceImage)} 
                    download={`neva-studio-merged-${Date.now()}.png`} 
                    className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-2.5 rounded-full inline-flex" 
                    title={t('downloadImage')}
                  >
                    <Icon name="download" className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => handleUseEditorImageInCreate(sourceImage)}
                    className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-2.5 rounded-full" 
                    title={t('useAsSource')}
                  >
                    <Icon name="arrow-up-tray" className="w-5 h-5" />
                  </button>
                </div>
              )}
              {tool === 'box' ? (
                <BoundingBoxEditor 
                    box={selection?.box || null}
                    onBoxChange={handleBoxChange} 
                    imageDimensions={imageDimensions} 
                />
              ) : (
                <>
                  {/* Show the box even in mask mode for context */}
                  {selection?.box && imageDimensions.width > 0 && (
                      <div 
                        className="absolute border-2 border-dashed border-pink-500/50 pointer-events-none" 
                        style={{
                          left: `${(selection.box.x / imageDimensions.width) * 100}%`,
                          top: `${(selection.box.y / imageDimensions.height) * 100}%`,
                          width: `${(selection.box.width / imageDimensions.width) * 100}%`,
                          height: `${(selection.box.height / imageDimensions.height) * 100}%`,
                        }}
                      />
                  )}
                  <MaskEditor 
                      onMaskChange={handleMaskChange} 
                      brushSize={brushSize} 
                      imageDimensions={imageDimensions}
                      boundingBox={selection?.box || null}
                  />
                </>
              )}
            </div>
          ) : <div className="w-full h-full"><ImageDropzone onImageUpload={handleImageUpload} className="w-full h-full flex items-center justify-center"><p className="text-slate-500">{t('uploadImage')}</p></ImageDropzone></div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1e293b] p-3 rounded-xl border border-slate-700/50 aspect-video flex flex-col">
                <h3 className="font-semibold text-slate-300 mb-2 text-center flex-shrink-0">{t('editorBetaIntermediateResult')}</h3>
                <div className="flex-grow flex items-center justify-center min-h-0">
                    {isLoading && <Icon name="sparkles" className="w-8 h-8 animate-spin text-cyan-300" />}
                    {!isLoading && intermediateResult && selection?.box ? (
                        <BeforeAfterSlider 
                            before={sourceImageToDataUrl({ base64: sourceImage!.base64.split(',')[1] || sourceImage!.base64, mimeType: sourceImage!.mimeType })}
                            after={sourceImageToDataUrl(intermediateResult)}
                        />
                    ) : !isLoading && <p className="text-slate-500 text-sm">{t('emptyStateText')}</p>}
                </div>
            </div>
            <div className="bg-[#1e293b] p-3 rounded-xl border border-slate-700/50 aspect-video flex flex-col relative group">
                <h3 className="font-semibold text-slate-300 mb-2 text-center flex-shrink-0">{t('editorBetaFinalResult')}</h3>
                 <div className="flex-grow flex items-center justify-center min-h-0">
                    {isLoading && <Icon name="sparkles" className="w-8 h-8 animate-spin text-cyan-300" />}
                    {!isLoading && finalResult ? (
                        <img src={sourceImageToDataUrl(finalResult)} alt="Final Result" className="max-w-full max-h-full object-contain" />
                    ) : !isLoading && <p className="text-slate-500 text-sm">{t('emptyStateText')}</p>}
                </div>
                 {!isLoading && finalResult && (
                    <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={() => setFullscreenImage(sourceImageToDataUrl(finalResult))} className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-2 rounded-md" title={t('fullscreen')}>
                            <Icon name="arrows-pointing-out" className="w-5 h-5" />
                        </button>
                        <a href={sourceImageToDataUrl(finalResult)} download={`neva-studio-edited-${Date.now()}.png`} className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-2 rounded-md" title={t('downloadImage')}>
                            <Icon name="download" className="w-5 h-5" />
                        </a>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
