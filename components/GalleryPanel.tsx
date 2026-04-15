
import React, { useState, useMemo } from 'react';
import { Icon } from './icons';
import type { ActiveTab, SourceImage, ObjectTransform, EditSubMode, BoundingBox } from '../types';
import { ImageEditor } from './ImageEditor';
import { BrushEditor } from './BrushEditor';
import { AreaSelector } from './ArrowEditor';
import { InteractiveCanvas } from './InteractiveCanvas';
import { BoundingBoxEditor } from './BoundingBoxEditor';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { sourceImageToDataUrl } from '../utils';

interface GalleryPanelProps {
    isLoading: boolean;
    loadingMessage: string;
    imageCount: number;
    activeTab: ActiveTab;
    generatedVideoUrl: string | null;
    generatedImages: string[];
    generatedPrompts: string | null;
    selectedImage: string | null;
    lastUsedPrompt: string;
    sourceImage: SourceImage | null;
    sourceImage2: SourceImage | null;
    isSelectingArea: boolean;
    isEditingMask: boolean;
    editTool: 'lasso' | 'brush';
    brushSize: number;
    setSelectedImage: (image: string) => void;
    setMaskImage: (mask: SourceImage | null) => void;
    onAreaSelected: (annotatedImage: SourceImage | null, box?: BoundingBox) => void;
    setFullscreenImage: (url: string | null) => void;
    handleStartEditing: () => void;
    handleSetAsSourceImage: () => void;
    copyToClipboard: (text: string) => void;
    onGenerateFromPrompt: (prompt: string) => void;
    onGenerateBatch?: (prompts: string[]) => void;
    areaSelectorRef: React.RefObject<{ clear: () => void }>;
    lassoEditorRef: React.RefObject<{ clear: () => void }>;
    brushEditorRef: React.RefObject<{ clear: () => void }>;
    canvaObjects: SourceImage[];
    canvaObjectTransforms: ObjectTransform[];
    setCanvaObjectTransforms: React.Dispatch<React.SetStateAction<ObjectTransform[]>>;
    selectedCanvaObjectIndex: number | null;
    setSelectedCanvaObjectIndex: React.Dispatch<React.SetStateAction<number | null>>;
    isCanvaLayoutLocked: boolean;
    editSubMode?: EditSubMode;
    editBox: BoundingBox | null;
    setEditBox: (box: BoundingBox | null) => void;
    // Area Prompt Confirmation Props
    isConfirmingAreaPrompt?: boolean;
    areaPrompt?: string;
    setAreaPrompt?: (p: string) => void;
    pendingAreaImage?: SourceImage | null;
    handleConfirmAreaPrompt?: () => void;
    handleCancelAreaPrompt?: () => void;
}

const PromptDisplay: React.FC<{ 
    promptsText: string; 
    copyToClipboard: (text: string) => void; 
    onGenerateFromPrompt: (prompt: string) => void;
    onGenerateBatch?: (prompts: string[]) => void;
}> = ({ promptsText, copyToClipboard, onGenerateFromPrompt, onGenerateBatch }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    
    // State for parsing and editing lines
    const [lines, setLines] = useState<{ text: string, isHeader: boolean, originalIndex: number }[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    
    // Edit state
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState("");

    // Initialize lines when promptsText changes
    React.useEffect(() => {
        const rawLines = promptsText.split('\n').filter(line => line.trim() !== '');
        const processedLines = rawLines.map((line, idx) => ({
            text: line.trim(),
            isHeader: /^\s*\d+️⃣/.test(line.trim()),
            originalIndex: idx
        }));
        setLines(processedLines);
        // Reset selection when new prompts are generated
        setSelectedIndices(new Set());
    }, [promptsText]);

    const promptIndices = useMemo(() => lines.filter(l => !l.isHeader).map(l => l.originalIndex), [lines]);

    const toggleSelection = (idx: number) => {
        const newSet = new Set(selectedIndices);
        if (newSet.has(idx)) newSet.delete(idx);
        else newSet.add(idx);
        setSelectedIndices(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIndices.size === promptIndices.length) {
            setSelectedIndices(new Set());
        } else {
            setSelectedIndices(new Set(promptIndices));
        }
    };

    const handleBatch = () => {
        if (!onGenerateBatch) return;
        const selectedPrompts = lines
            .filter(l => selectedIndices.has(l.originalIndex))
            .map(l => l.text);
        onGenerateBatch(selectedPrompts);
    };

    const startEditing = (index: number, currentText: string) => {
        setEditingIndex(index);
        setEditText(currentText);
    };

    const saveEdit = (index: number) => {
        if (!editText.trim()) return;
        setLines(prev => prev.map((line) => line.originalIndex === index ? { ...line, text: editText } : line));
        setEditingIndex(null);
        setEditText("");
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditText("");
    };

    return (
        <div className={`relative h-full flex flex-col`}>
            {onGenerateBatch && (
                <div className="mb-2 flex items-center justify-between border-b border-white/8 pb-3">
                    <button 
                        onClick={toggleSelectAll} 
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${selectedIndices.size === promptIndices.length ? 'bg-cyan-400/12 text-cyan-200' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {selectedIndices.size === promptIndices.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <div className="text-xs text-slate-500">
                        {selectedIndices.size} selected
                    </div>
                </div>
            )}
            
            <div className={`space-y-2 ${theme.textSub} overflow-y-auto pr-2 flex-grow pb-16`}>
                {lines.map((item, index) => {
                    if (item.isHeader) {
                        return (
                            <h4 key={index} className={`sticky top-0 z-10 border-b border-transparent bg-[#09111f]/95 py-2 pt-4 text-lg font-semibold backdrop-blur first:pt-0 ${theme.textMain}`}>
                                {item.text}
                            </h4>
                        );
                    }
                    
                    const isSelected = selectedIndices.has(item.originalIndex);
                    const isEditing = editingIndex === item.originalIndex;

                    return (
                        <div 
                            key={item.originalIndex} 
                            onClick={() => !isEditing && onGenerateBatch && toggleSelection(item.originalIndex)}
                            className={`group flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-all ${
                                isEditing ? 'border-cyan-300/50 bg-slate-950/70' : 
                                isSelected 
                                ? 'border-cyan-300/30 bg-cyan-400/10' 
                                : `${theme.inputBg} border-white/8 hover:border-cyan-300/20`
                            }`}
                        >
                            {!isEditing && onGenerateBatch && (
                                <div className={`mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${isSelected ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-slate-500 bg-slate-900'}`}>
                                    {isSelected && <Icon name="sparkles" className="w-2.5 h-2.5 text-white" />}
                                </div>
                            )}
                            
                            {isEditing ? (
                                <div className="flex-grow flex flex-col gap-2 w-full">
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="neva-input min-h-[80px] w-full rounded-2xl p-3 text-sm"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); cancelEdit(); }} className="p-1 text-red-400 hover:bg-red-900/20 rounded">
                                            <Icon name="x-circle" className="w-5 h-5" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); saveEdit(item.originalIndex); }} className="p-1 text-green-400 hover:bg-green-900/20 rounded">
                                            <Icon name="check" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className={`text-sm flex-grow leading-relaxed ${isSelected ? 'text-slate-200' : ''}`}>{item.text}</p>
                                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); startEditing(item.originalIndex, item.text); }} title="Edit Prompt" className="rounded-md p-1.5 text-slate-400 hover:bg-slate-600/50 hover:text-cyan-300">
                                            <Icon name="pencil" className="w-4 h-4"/>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onGenerateFromPrompt(item.text); }} title={t('createFromThisPrompt')} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-600/50 hover:text-cyan-300">
                                            <Icon name="camera" className="w-5 h-5"/>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.text); }} title={t('copyPrompt')} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-600/50 hover:text-cyan-300">
                                            <Icon name="clipboard" className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {onGenerateBatch && selectedIndices.size > 0 && !editingIndex && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                    <button 
                        onClick={handleBatch}
                        className="neva-primary-button flex items-center gap-2 rounded-full px-8 py-3 font-bold transition-all hover:scale-105 active:scale-95"
                    >
                        <Icon name="sparkles" className="w-5 h-5" />
                        Generate {selectedIndices.size} Selected Images
                    </button>
                </div>
            )}
        </div>
    );
};

const LoadingState: React.FC<{ isVideo: boolean, isPromptGen: boolean, message: string }> = ({ isVideo, isPromptGen, message }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    if (isPromptGen) {
        return (
            <div className={`h-full flex flex-col items-center justify-center text-center ${theme.textSub}`}>
                <Icon name="cpu-chip" className="w-16 h-16 mb-4 text-slate-500 animate-pulse" />
                <h3 className={`text-xl font-semibold ${theme.textMain}`}>{message || t('loadingPromptHeader')}</h3>
            </div>
        );
    }
    if (isVideo) {
        return (
            <div className={`h-full flex flex-col items-center justify-center text-center ${theme.textSub}`}>
                <Icon name="video-camera" className="w-16 h-16 mb-4 text-slate-500 animate-pulse" />
                <h3 className={`text-xl font-semibold ${theme.textMain}`}>{message || t('loadingVideoHeader')}</h3>
            </div>
        );
    }
    return (
        <div className="h-full flex flex-col items-center justify-center text-center">
            <Icon name="camera" className="w-16 h-16 mb-6 text-slate-500 animate-pulse" />
            <h3 className={`text-2xl font-semibold ${theme.textMain}`}>{'\u0110ang t\u1ea1o \u1ea3nh'}</h3>
        </div>
    );
};

const EmptyState: React.FC<{ activeTab: ActiveTab }> = ({ activeTab }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    let message = t('emptyStateHeader');
    let subMessage = t('emptyStateText');

    if (activeTab === 'prompt') {
        message = t('emptyPromptHeader');
        subMessage = t('emptyPromptText');
    }

    return (
        <div className={`h-full flex flex-col items-center justify-center text-center ${theme.textSub}`}>
            <Icon name={'sparkles'} className="w-16 h-16 mb-4 text-slate-600" />
            <h3 className={`text-xl font-semibold ${theme.textSub}`}>
                {message}
            </h3>
            <p className="mt-2">
                {subMessage}
            </p>
        </div>
    );
};

export const GalleryPanel: React.FC<GalleryPanelProps> = ({
    isLoading, loadingMessage, imageCount, activeTab, generatedVideoUrl, generatedImages, generatedPrompts, selectedImage, lastUsedPrompt, sourceImage, sourceImage2,
    isSelectingArea, isEditingMask, editTool, brushSize, setSelectedImage, setMaskImage, onAreaSelected, setFullscreenImage,
    handleStartEditing, handleSetAsSourceImage, copyToClipboard, onGenerateFromPrompt, onGenerateBatch,
    areaSelectorRef, lassoEditorRef, brushEditorRef,
    canvaObjects, canvaObjectTransforms, setCanvaObjectTransforms, selectedCanvaObjectIndex, setSelectedCanvaObjectIndex, isCanvaLayoutLocked,
    editSubMode, editBox, setEditBox,
    isConfirmingAreaPrompt, areaPrompt, setAreaPrompt, pendingAreaImage, handleConfirmAreaPrompt, handleCancelAreaPrompt
}) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);
    const [isComparing, setIsComparing] = React.useState(false);
    const [imgNaturalSize, setImgNaturalSize] = React.useState({ width: 0, height: 0 });
    const containerRef = React.useRef<HTMLDivElement>(null);
    const imgRef = React.useRef<HTMLImageElement>(null);

    const handleNext = React.useCallback(() => {
        if (generatedImages.length > 1) {
            const currentIndex = generatedImages.indexOf(selectedImage || '');
            const nextIndex = (currentIndex + 1) % generatedImages.length;
            setSelectedImage(generatedImages[nextIndex]);
        }
    }, [generatedImages, selectedImage, setSelectedImage]);

    const handlePrev = React.useCallback(() => {
        if (generatedImages.length > 1) {
            const currentIndex = generatedImages.indexOf(selectedImage || '');
            const prevIndex = (currentIndex - 1 + generatedImages.length) % generatedImages.length;
            setSelectedImage(generatedImages[prevIndex]);
        }
    }, [generatedImages, selectedImage, setSelectedImage]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            else if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);
    
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setImgNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    };

    const renderContent = () => {
        if (isLoading) {
            return <LoadingState isVideo={activeTab === 'video'} isPromptGen={activeTab === 'prompt'} message={loadingMessage} />;
        }

        if (activeTab === 'prompt' && generatedPrompts) {
            return <PromptDisplay promptsText={generatedPrompts} copyToClipboard={copyToClipboard} onGenerateFromPrompt={onGenerateFromPrompt} onGenerateBatch={onGenerateBatch} />;
        }

        // --- Area Prompt Confirmation UI ---
        if (isConfirmingAreaPrompt && pendingAreaImage && handleConfirmAreaPrompt && handleCancelAreaPrompt && setAreaPrompt) {
            return (
                <div className="h-full flex flex-col items-center justify-center p-6 animate-fade-in">
                    <div className={`${theme.inputBg} ${theme.border} w-full max-w-2xl space-y-6 rounded-[28px] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.24)]`}>
                        <div className="flex items-center gap-4 border-b border-white/8 pb-4">
                            <div className="rounded-full bg-cyan-400/12 p-2.5">
                                <Icon name="sparkles" className="w-6 h-6 text-cyan-300" />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${theme.textMain}`}>{t('confirmAreaPrompt')}</h3>
                                <p className={`text-sm ${theme.textSub}`}>{t('editAreaPromptDesc')}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/3 flex-shrink-0">
                                <div className="flex h-full items-center justify-center rounded-2xl border border-white/8 bg-black/40 p-2">
                                    <img 
                                        src={sourceImageToDataUrl(pendingAreaImage)} 
                                        alt="Selected Area" 
                                        className="max-w-full max-h-40 object-contain rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-2/3 flex flex-col gap-2">
                                <label className={`text-xs font-bold uppercase tracking-widest ${theme.textSub}`}>{t('prompt')}</label>
                                <textarea
                                    value={areaPrompt}
                                    onChange={(e) => setAreaPrompt(e.target.value)}
                                    className={`neva-input ${theme.textMain} h-40 w-full flex-grow rounded-2xl p-4 text-sm leading-relaxed md:h-full`}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 border-t border-white/8 pt-4">
                            <button 
                                onClick={handleCancelAreaPrompt}
                                className={`flex-1 rounded-2xl px-4 py-3 font-bold transition-all ${theme.buttonSecondary}`}
                            >
                                {t('cancel')}
                            </button>
                            <button 
                                onClick={handleConfirmAreaPrompt}
                                className="neva-primary-button flex flex-[2] items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold transition-all"
                            >
                                <Icon name="camera" className="w-5 h-5" />
                                {t('confirmAndGenerate')}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // --- Canva Mix Logic inside Edit Tab ---
        if (activeTab === 'edit' && editSubMode === 'canva') {
            if (generatedImages.length > 1 && selectedImage !== sourceImageToDataUrl(sourceImage || {base64:'', mimeType:''})) {
                // Show result normally
            } else if (sourceImage) {
                return (
                    <InteractiveCanvas
                        bgImage={sourceImage} canvaObjects={canvaObjects} canvaObjectTransforms={canvaObjectTransforms}
                        setCanvaObjectTransforms={setCanvaObjectTransforms} selectedCanvaObjectIndex={selectedCanvaObjectIndex}
                        setSelectedCanvaObjectIndex={setSelectedCanvaObjectIndex} isCanvaLayoutLocked={isCanvaLayoutLocked}
                    />
                );
            } else return <EmptyState activeTab={activeTab} />;
        }

        if (generatedVideoUrl) {
            return (
                <div className="flex flex-col h-full">
                    <div className="flex-grow flex items-center justify-center relative group bg-black/30 rounded-lg overflow-hidden">
                        <video src={generatedVideoUrl} controls autoPlay loop className="max-w-full max-h-[75vh] object-contain" />
                        <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <a href={generatedVideoUrl} download={`neva-studio-video-${Date.now()}.mp4`} className="neva-icon-button rounded-xl p-2" title={t('downloadVideo')}>
                                <Icon name="download" className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                     <div className={`my-4 p-3 ${theme.inputBg} rounded-md border ${theme.border}`}>
                      <div className="flex justify-between items-start gap-3">
                        <p className={`text-sm ${theme.textMain} flex-grow`}>{lastUsedPrompt}</p>
                        <button onClick={() => copyToClipboard(lastUsedPrompt)} title={t('copyPrompt')} className="flex-shrink-0 text-slate-400 hover:text-cyan-300">
                          <Icon name="clipboard" className="w-5 h-5"/>
                        </button>
                      </div>
                    </div>
                </div>
            );
        }
        
        // --- Standard Image Results or Editable Source ---
        const imageToShow = selectedImage || (sourceImage ? sourceImageToDataUrl(sourceImage) : null);
        const hasResult = generatedImages.length > 0 && selectedImage;
        const canCompare = hasResult && sourceImage;

        if (imageToShow) {
            return (
                <div className="flex flex-col h-full">
                    <div className="flex-grow flex items-center justify-center relative group bg-black/30 rounded-lg overflow-hidden min-h-[50vh]" ref={containerRef}>
                        
                        {isComparing && canCompare ? (
                            <BeforeAfterSlider 
                                before={sourceImageToDataUrl(sourceImage!)} 
                                after={imageToShow} 
                                className="max-h-[65vh]"
                            />
                        ) : (
                            <>
                                <img 
                                    ref={imgRef}
                                    src={imageToShow} 
                                    alt="Gallery view" 
                                    className="max-w-full max-h-[65vh] object-contain" 
                                    onLoad={handleImgLoad}
                                />
                                
                                {generatedImages.length > 1 && !isSelectingArea && !isEditingMask && (
                                    <>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                            className="neva-icon-button absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full p-2 text-white/70 transition-all"
                                            title="Previous"
                                        >
                                            <Icon name="arrow-left-circle" className="w-8 h-8" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                            className="neva-icon-button absolute right-16 top-1/2 z-30 -translate-y-1/2 rounded-full p-2 text-white/70 transition-all"
                                            title="Next"
                                        >
                                            <Icon name="arrow-right-circle" className="w-8 h-8" />
                                        </button>
                                    </>
                                )}

                                {activeTab === 'cameraAngle' && sourceImage && isSelectingArea && (
                                    <AreaSelector ref={areaSelectorRef} sourceImage={sourceImage} onAreaSelected={onAreaSelected} />
                                )}
                                
                                {/* Editor Logic for Smart Edit vs Inpaint */}
                                {!isMobile && activeTab === 'edit' && sourceImage && (
                                  <>
                                    {editSubMode === 'smartEdit' ? (
                                        <>
                                            {!editBox ? (
                                                <AreaSelector 
                                                    ref={areaSelectorRef} 
                                                    sourceImage={sourceImage} 
                                                    onAreaSelected={onAreaSelected} 
                                                />
                                            ) : (
                                                <>
                                                    <BrushEditor 
                                                        ref={brushEditorRef} 
                                                        sourceImage={sourceImage} 
                                                        onMaskReady={setMaskImage} 
                                                        brushSize={brushSize}
                                                        clipBox={editBox}
                                                    />
                                                    {/* Interactive Bounding Box Editor */}
                                                    <BoundingBoxEditor 
                                                        box={editBox} 
                                                        onBoxChange={setEditBox}
                                                        imageDimensions={imgNaturalSize}
                                                    />
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        isEditingMask && (
                                            editTool === 'lasso' 
                                            ? <ImageEditor ref={lassoEditorRef} sourceImage={sourceImage} onMaskReady={setMaskImage} strokeWidth={brushSize}/>
                                            : <BrushEditor ref={brushEditorRef} sourceImage={sourceImage} onMaskReady={setMaskImage} brushSize={brushSize}/>
                                        )
                                    )}
                                  </>
                                )}
                            </>
                        )}
                        
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                            {canCompare && (
                                <button 
                                    onClick={() => setIsComparing(!isComparing)} 
                                    className={`rounded-full p-2.5 backdrop-blur-sm border shadow-lg transition-all ${isComparing ? 'bg-cyan-400/18 border-cyan-300/50 text-cyan-100' : 'neva-icon-button'}`} 
                                    title={isComparing ? "Tắt so sánh" : "Bật so sánh (Thanh kéo)"}
                                >
                                    <Icon name="sparkles" className="w-5 h-5" />
                                </button>
                            )}
                            <button onClick={() => imageToShow && setFullscreenImage(imageToShow)} className="neva-icon-button rounded-full p-2.5" title={t('fullscreen')}>
                                <Icon name="arrows-pointing-out" className="w-5 h-5" />
                            </button>
                            <button onClick={handleStartEditing} className="neva-icon-button rounded-full p-2.5" title={t('editThisImage')}>
                                <Icon name="pencil-swoosh" className="w-5 h-5" />
                            </button>
                            <button onClick={handleSetAsSourceImage} className="neva-icon-button rounded-full p-2.5" title={t('useAsSource')}>
                                <Icon name="arrow-up-tray" className="w-5 h-5" />
                            </button>
                            <a href={imageToShow} download={`neva-studio-${Date.now()}.png`} className="neva-icon-button inline-flex rounded-full p-2.5" title={t('downloadImage')}>
                                <Icon name="download" className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {(lastUsedPrompt || (activeTab === 'edit' && generatedImages.length > 0)) && (
                        <div className={`my-4 p-3 ${theme.inputBg} rounded-md border ${theme.border}`}>
                            <div className="flex justify-between items-start gap-3">
                                <p className={`text-sm ${theme.textMain} flex-grow`}>{lastUsedPrompt || t('noPrompt')}</p>
                                <button onClick={() => copyToClipboard(lastUsedPrompt)} title={t('copyPrompt')} className="flex-shrink-0 text-slate-400 hover:text-cyan-300">
                                    <Icon name="clipboard" className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    )}

                    {generatedImages.length > 1 && (
                        <div className={`flex-shrink-0 mt-4 grid grid-cols-${Math.min(generatedImages.length, 4)} gap-2`}>
                            {generatedImages.map((image, index) => (
                                <div key={index} className={`relative h-28 cursor-pointer overflow-hidden rounded-2xl transition-all duration-200 ${selectedImage === image ? 'ring-2 ring-cyan-300/70' : 'opacity-60 hover:opacity-100'}`} onClick={() => setSelectedImage(image)}>
                                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        return <EmptyState activeTab={activeTab} />;
    };
    
    return (
        <div className={`lg:col-span-8 xl:col-span-9 ${theme.panelBg} neon-border min-h-[60vh] rounded-[28px] p-4 shadow-[0_24px_80px_rgba(2,6,23,0.3)] lg:min-h-0`}>
            <div className='h-full max-h-[85vh] overflow-y-auto pr-2'>
                {renderContent()}
            </div>
        </div>
    );
};

