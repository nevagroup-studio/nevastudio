
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '../icons';
import { ImageDropzone } from '../ImageDropzone';
import { sourceImageToDataUrl, padImageToAspectRatio } from '../../utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { translations } from '../../locales/translations';
import { PromptInput } from '../shared/ControlCommon';
import type { SourceImage, EditSubMode, ObjectTransform, BoundingBox } from '../../types';
import { ImageEditor } from '../ImageEditor';
import { BrushEditor } from '../BrushEditor';
import { MergeHouseEditor } from '../MergeHouseEditor';
import { GeometryPanel } from './GeometryPanel';

export const CameraAnglePanel: React.FC<any> = ({ sourceImage, setSourceImage, prompt, setPrompt, imageCount, setImageCount, isSelectingArea, setIsSelectingArea, areaSelectorRef, handleSourceImageUpload }) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [prompt]);

    // FIX: Cast to any to resolve Property 'constants' does not exist error
    const { cameraAnglePrompts } = (translations[language] as any).constants;

    const handleToggleSelectingArea = () => {
        if (!isSelectingArea) {
            areaSelectorRef.current?.clear();
        }
        setIsSelectingArea((prev: boolean) => !prev);
    };

    const handleClearSelection = () => {
        areaSelectorRef.current?.clear();
        if (isSelectingArea) setIsSelectingArea(false);
    };

    return (
        <div className="space-y-6">
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>1. {t('uploadImage')}</h3>
                {sourceImage ? (
                    <div className='space-y-3'>
                        <ImageDropzone onImageUpload={handleSourceImageUpload} className="cursor-pointer rounded-lg"><div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(sourceImage)} alt="Source" className="w-full h-auto object-contain rounded" /></div></ImageDropzone>
                        <button onClick={() => setSourceImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                    </div>
                ) : <ImageDropzone onImageUpload={handleSourceImageUpload} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}><div><p>{t('dropzoneHint')}</p><p className="text-xs mt-1 opacity-70">{t('dropzoneFormats')}</p></div></ImageDropzone>}
            </section>

            {sourceImage && (
                <section>
                    <h3 className={`font-semibold ${theme.textMain} mb-3`}>2. {t('specifyCloseUpAngle')}</h3>
                    <p className={`text-xs ${theme.textSub} mb-3`}>{t('specifyCloseUpHelp')}</p>
                    <div className='flex items-center gap-2'>
                        <button onClick={handleToggleSelectingArea} className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-lg ${isSelectingArea ? 'bg-red-600 hover:bg-red-700 text-white' : `${theme.buttonSecondary}`}`}><Icon name="pencil-swoosh" className="w-5 h-5" />{isSelectingArea ? t('cancel') : t('selectArea')}</button>
                        {(isSelectingArea) && (<button onClick={handleClearSelection} className={`flex-shrink-0 flex items-center justify-center gap-2 text-sm ${theme.textMain} px-3 py-2.5 rounded-md ${theme.inputBg} hover:bg-white/10`} title={t('clearSelection')}><Icon name="trash" className="w-4 h-4" /></button>)}
                    </div>
                </section>
            )}

            <div className={`${isSelectingArea ? 'opacity-50 pointer-events-none' : ''} transition-opacity space-y-6`}>
                <section>
                    <h3 className={`font-semibold ${theme.textMain} mb-3`}>3. {t('chooseCameraAngle')}</h3>
                    <select disabled={isSelectingArea} value={cameraAnglePrompts.some((p: any) => p.value === prompt) ? prompt : ""} onChange={(e) => setPrompt(e.target.value)} className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none appearance-none border ${theme.border}`} style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center/1.5em 1.5em no-repeat`}}><option value="" disabled>{t('selectCameraAnglePlaceholder')}</option>{cameraAnglePrompts.map((p: any) => <option key={p.display} value={p.value}>{p.display}</option>)}</select>
                </section>
                <section>
                    <h3 className={`font-semibold ${theme.textMain} mb-2`}>4. {t('customDescription')}</h3>
                    <textarea
                        ref={textareaRef}
                        disabled={isSelectingArea}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('customDescriptionPlaceholder')}
                        className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md min-h-[96px] overflow-hidden resize-none text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none border ${theme.border}`}
                    />
                </section>
            </div>
            
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('imageCount')}</h3>
                <div className={`flex items-center justify-between ${theme.inputBg} rounded-md p-2 border ${theme.border}`}>
                    <button onClick={() => setImageCount((c: number) => Math.max(1, c - 1))} className={`px-4 py-2 rounded text-xl font-bold ${theme.buttonSecondary} ${theme.textMain}`}>-</button>
                    <span className={`text-lg font-semibold ${theme.textMain}`}>{imageCount}</span>
                    <button onClick={() => setImageCount((c: number) => Math.min(10, c + 1))} className={`px-4 py-2 rounded text-xl font-bold ${theme.buttonSecondary} ${theme.textMain}`}>+</button>
                </div>
            </section>
        </div>
    );
};

export const EditPanel: React.FC<any> = ({ 
    sourceImage, setSourceImage, prompt, setPrompt, imageCount, setImageCount, 
    editReferenceImage, setEditReferenceImage, editTool, setEditTool, brushSize, setBrushSize, 
    lassoEditorRef, brushEditorRef, handleSourceImageUpload, maskImage, setMaskImage,
    editSubMode, setEditSubMode, sourceImage2, setSourceImage2,
    canvaObjects, setCanvaObjects, canvaObjectTransforms, setCanvaObjectTransforms,
    selectedCanvaObjectIndex, setSelectedCanvaObjectIndex, isCanvaLayoutLocked, setIsCanvaLayoutLocked,
    handleDeleteSelectedCanvaObject, editBox, setEditBox, areaSelectorRef,
    materialOptions, setMaterialOptions
}) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    // FIX: Cast to any to resolve Property 'constants' does not exist error
    const { predefinedMaterialImages, materialChangeOptions, furnitureChangeOptions, materialTypeOptions, tileSizeOptions, materialPropertyOptions, tilePatternOptions } = (translations[language] as any).constants;

    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);
    const [showMaterialGallery, setShowMaterialGallery] = useState(false);
    const [isProcessingMaterialRef, setIsProcessingMaterialRef] = useState(false);
    const [mergeHouseDrawMode, setMergeHouseDrawMode] = useState<'line' | 'rect'>('line');
    const mergeHouseEditorRef = useRef<{ clear: () => void }>(null);
    
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleEditReferenceImageUpload = async (newReferenceImage: SourceImage) => {
        if (!sourceImage) {
            setEditReferenceImage(newReferenceImage);
            return;
        }
        try {
            const sourceImg = new Image();
            sourceImg.src = sourceImageToDataUrl(sourceImage);
            await new Promise<void>((resolve, reject) => {
                sourceImg.onload = () => resolve();
                sourceImg.onerror = reject;
            });
            const targetAspectRatio = sourceImg.naturalWidth / sourceImg.naturalHeight;
            const paddedImage = await padImageToAspectRatio(newReferenceImage, targetAspectRatio);
            setEditReferenceImage(paddedImage);
        } catch (error) {
            console.error("Failed to pad edit reference image:", error);
            setEditReferenceImage(newReferenceImage);
        }
    };

    const handleSourceImage2Upload = async (newImage: SourceImage) => {
        if (sourceImage && (editSubMode !== 'inpaint' && editSubMode !== 'canva')) {
            const loadingPrompt = prompt;
            setPrompt(t('processingImage'));
            try {
                const img1 = new Image();
                img1.src = sourceImageToDataUrl(sourceImage);
                await new Promise((resolve, reject) => {
                    img1.onload = resolve;
                    img1.onerror = reject;
                });
                const targetAspectRatio = img1.naturalWidth / img1.naturalHeight;
                const paddedImage = await padImageToAspectRatio(newImage, targetAspectRatio);
                setSourceImage2(paddedImage);
            } catch (error) {
                console.error("Failed to pad image:", error);
                setSourceImage2(newImage);
            } finally {
                setPrompt(loadingPrompt);
            }
        } else {
            setSourceImage2(newImage);
        }
    };

    const handleDecorUpload = async (images: SourceImage[]) => {
        if (!sourceImage) { alert(t('alertUploadBg')); return; }
        try {
            const bgImg = new Image(); bgImg.src = sourceImageToDataUrl(sourceImage);
            await new Promise((resolve, reject) => { bgImg.onload = resolve; bgImg.onerror = reject; });
            const targetAspectRatio = bgImg.naturalWidth / bgImg.naturalHeight;
            const processedImages = await Promise.all(images.map(img => padImageToAspectRatio(img, targetAspectRatio)));
            const newTransforms: ObjectTransform[] = processedImages.map(() => ({
                x: 50, y: 50, scale: 20, rotation: 0, flipHorizontal: false, flipVertical: false
            }));
            setCanvaObjects((prev: SourceImage[]) => [...prev, ...processedImages]);
            setCanvaObjectTransforms((prev: ObjectTransform[]) => [...prev, ...newTransforms]);
        } catch (error) {
            console.error("Error processing decor images:", error);
            const newTransforms: ObjectTransform[] = images.map(() => ({
                x: 50, y: 50, scale: 20, rotation: 0, flipHorizontal: false, flipVertical: false
            }));
            setCanvaObjects((prev: SourceImage[]) => [...prev, ...images]);
            setCanvaObjectTransforms((prev: ObjectTransform[]) => [...prev, ...newTransforms]);
        }
    };

    const handleDuplicateObject = (idx: number) => {
        const obj = canvaObjects[idx]; if (!obj) return;
        setCanvaObjects((prev: SourceImage[]) => [...prev, obj]);
        setCanvaObjectTransforms((prev: ObjectTransform[]) => [...prev, { x: 50, y: 50, scale: 20, rotation: 0, flipHorizontal: false, flipVertical: false }]);
        setSelectedCanvaObjectIndex(canvaObjects.length);
    };

    const updateSelectedObjectTransform = (updates: Partial<ObjectTransform>) => {
        if (selectedCanvaObjectIndex === null) return;
        setCanvaObjectTransforms((transforms: ObjectTransform[]) => transforms.map((t, i) => i === selectedCanvaObjectIndex ? { ...t, ...updates } : t));
    };

    const handleSetMaterialFromUrl = async (url: string) => {
        setIsProcessingMaterialRef(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const newImage = await new Promise<SourceImage>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const dataUrl = reader.result as string;
                    const [, base64] = dataUrl.split(',');
                    if (base64) resolve({ base64, mimeType: blob.type }); else reject(new Error("No base64"));
                };
                reader.onerror = reject; reader.readAsDataURL(blob);
            });
            await handleSourceImage2Upload(newImage); setShowMaterialGallery(false);
        } catch (error) { console.error(error); alert("Could not load material image."); } finally { setIsProcessingMaterialRef(false); }
    };

    const selectedTransform = selectedCanvaObjectIndex !== null ? canvaObjectTransforms[selectedCanvaObjectIndex] : null;

    return (
        <div className="space-y-6">
            <div className={`p-3 rounded-lg bg-cyan-400/10 border border-cyan-300/20 text-center animate-fade-in`}>
                <p className={`text-xs ${theme.textMain} font-medium`}>{t(`editFunctionHelp.${editSubMode}`)}</p>
            </div>
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>
                    {editSubMode === 'mergeHouse' ? 'Ảnh hiện trạng' : t('uploadSourceImage')}
                </h3>
                {editSubMode === 'mergeHouse' && (
                    <p className={`text-xs ${theme.textSub} -mt-2 mb-3`}>Tải ảnh hiện trạng đã tô đỏ vào vùng cần thêm công trình</p>
                )}
                {sourceImage ? (
                    <div className='space-y-2'>
                        <ImageDropzone onImageUpload={handleSourceImageUpload} className="cursor-pointer rounded-lg">
                            <div className="relative bg-black/30 p-2 rounded-lg">
                                <img src={sourceImageToDataUrl(sourceImage)} alt="Source" className="w-full h-auto object-contain rounded-lg" />
                                {isMobile && editSubMode === 'inpaint' && (editTool === 'lasso' ? <ImageEditor ref={lassoEditorRef} sourceImage={sourceImage} onMaskReady={setMaskImage} strokeWidth={brushSize}/> : <BrushEditor ref={brushEditorRef} sourceImage={sourceImage} onMaskReady={setMaskImage} brushSize={brushSize}/>)}
                                {editSubMode === 'mergeHouse' && (
                                    <MergeHouseEditor 
                                        ref={mergeHouseEditorRef} 
                                        sourceImage={sourceImage} 
                                        onMaskReady={setMaskImage} 
                                        brushSize={brushSize} 
                                        drawMode={mergeHouseDrawMode} 
                                    />
                                )}
                            </div>
                        </ImageDropzone>
                        {editSubMode === 'mergeHouse' && (
                            <GeometryPanel 
                                sourceImage={sourceImage} 
                                onImageUpdate={handleSourceImageUpload} 
                            />
                        )}
                        <button onClick={() => setSourceImage(null)} className='text-sm text-red-400 hover:text-red-500 w-full text-left px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('resetImage')}</button>
                    </div>
                ) : <ImageDropzone onImageUpload={handleSourceImageUpload} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}><div><p>{t('dropzoneHint')}</p></div></ImageDropzone>}
            </section>

            {editSubMode === 'mergeHouse' && sourceImage && (
                <section className="animate-fade-in">
                    <h3 className={`font-semibold ${theme.textMain} mb-3`}>{t('selectionTool')}</h3>
                    <div className={`flex ${theme.inputBg} rounded-md p-1 space-x-1 mb-4 border ${theme.border}`}>
                        <button 
                            onClick={() => setMergeHouseDrawMode('line')} 
                            className={`flex-1 py-2 text-xs rounded flex items-center justify-center gap-2 ${mergeHouseDrawMode === 'line' ? 'neva-primary-button font-semibold border-white/10 text-slate-950' : `${theme.textSub} hover:bg-white/10`}`}
                        >
                            <Icon name="brush" className="w-4 h-4" />
                            {t('drawTool')}
                        </button>
                        <button 
                            onClick={() => setMergeHouseDrawMode('rect')} 
                            className={`flex-1 py-2 text-xs rounded flex items-center justify-center gap-2 ${mergeHouseDrawMode === 'rect' ? 'neva-primary-button font-semibold border-white/10 text-slate-950' : `${theme.textSub} hover:bg-white/10`}`}
                        >
                            <Icon name="square" className="w-4 h-4" />
                            {t('rectTool')}
                        </button>
                    </div>
                    <div className='space-y-2'>
                        <div className="flex justify-between items-center">
                            <label className={`text-[10px] font-medium ${theme.textSub}`}>{t('strokeWidth')}: {brushSize}px</label>
                            <button onClick={() => mergeHouseEditorRef.current?.clear()} className="text-[10px] text-cyan-300 hover:underline">{t('clearDrawing')}</button>
                        </div>
                        <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"/>
                    </div>
                </section>
            )}

            {(sourceImage || editSubMode === 'mergeHouse') && (
                <>
                    {editSubMode === 'smartEdit' && (
                      <div className='space-y-4 animate-fade-in'>
                          <section className={`p-3 rounded-lg border ${editBox ? 'border-green-500 bg-green-500/5' : 'border-slate-700'}`}>
                              <h3 className={`font-semibold text-sm ${theme.textMain} mb-1 flex items-center gap-2`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${editBox ? 'bg-green-600' : 'bg-cyan-400/18 text-cyan-100'} text-white`}>1</span>
                                {t('smartEditStep1')}
                              </h3>
                              <p className="text-[10px] text-slate-400 mb-2">{t('smartEditStep1Desc')}</p>
                              {editBox ? (
                                <button onClick={() => setEditBox(null)} className="text-xs text-cyan-300 hover:underline">Xóa khung và vẽ lại</button>
                              ) : (
                                <p className="text-xs text-cyan-300 italic">Dùng chuột khoanh 1 khung trên ảnh bên phải</p>
                              )}
                          </section>

                          <section className={`p-3 rounded-lg border ${maskImage ? 'border-green-500 bg-green-500/5' : 'border-slate-700'}`}>
                              <h3 className={`font-semibold text-sm ${theme.textMain} mb-1 flex items-center gap-2`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${maskImage ? 'bg-green-600' : 'bg-cyan-400/18 text-cyan-100'} text-white`}>2</span>
                                {t('smartEditStep2')}
                              </h3>
                              <p className="text-[10px] text-slate-400 mb-2">{t('smartEditStep2Desc')}</p>
                              <div className='space-y-2 mt-2'>
                                  <label className={`text-xs font-medium ${theme.textSub}`}>{t('brushSize')}: {brushSize}px</label>
                                  <input type="range" min="1" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"/>
                              </div>
                          </section>

                          <section className={``}>
                              <h3 className={`font-semibold text-sm ${theme.textMain} mb-2 flex items-center gap-2`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-cyan-400/18 text-cyan-100`}>3</span>
                                {t('smartEditStep3')}
                              </h3>
                              <PromptInput prompt={prompt} setPrompt={setPrompt} placeholder={t('promptPlaceholder.smartEdit')} />
                          </section>
                      </div>
                    )}

                    {editSubMode === 'inpaint' && (
                        <div className='space-y-4 animate-fade-in'>
                            <section>
                                <h3 className={`font-semibold ${theme.textMain} mb-3`}>3. {t('chooseToolAndDraw')}</h3>
                                <div className={`flex ${theme.inputBg} rounded-md p-1 space-x-1 mb-4 border ${theme.border}`}>
                                    <button onClick={() => setEditTool('lasso')} className={`w-1/2 py-2 text-sm rounded ${editTool === 'lasso' ? 'neva-primary-button font-semibold border-white/10 text-slate-950' : `${theme.textSub} hover:bg-white/10`}`}>{t('lassoTool')}</button>
                                    <button onClick={() => setEditTool('brush')} className={`w-1/2 py-2 text-sm rounded ${editTool === 'brush' ? 'neva-primary-button font-semibold border-white/10 text-slate-950' : `${theme.textSub} hover:bg-white/10`}`}>{t('brushTool')}</button>
                                </div>
                                <div className='space-y-2'>
                                    <label className={`text-xs font-medium ${theme.textSub}`}>{t('brushSize')}: {brushSize}px</label>
                                    <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"/>
                                </div>
                            </section>
                            <section>
                                <h3 className={`font-semibold ${theme.textMain} mb-3`}>4. {t('uploadReferenceOptional')}</h3>
                                {editReferenceImage ? (
                                    <div className="relative group">
                                        <ImageDropzone onImageUpload={handleEditReferenceImageUpload} className="cursor-pointer rounded-lg"><div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(editReferenceImage)} alt="Ref" className="w-full h-auto object-contain rounded" /></div></ImageDropzone>
                                        <button onClick={() => setEditReferenceImage(null)} className="absolute top-3 right-3 bg-black/60 rounded-full text-white p-1"><Icon name="x-circle" className="w-5 h-5" /></button>
                                    </div>
                                ) : <ImageDropzone onImageUpload={handleEditReferenceImageUpload} className={`w-full h-24 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-xs cursor-pointer`}><p>{t('dropzoneHint')}</p></ImageDropzone>}
                            </section>
                            <PromptInput prompt={prompt} setPrompt={setPrompt} placeholder={t('promptPlaceholder.inpaint')} />
                        </div>
                    )}

                    {(editSubMode === 'mergeHouse' || editSubMode === 'mergeMaterial' || editSubMode === 'mergeFurniture') && (
                        <div className='space-y-4 animate-fade-in'>
                           <section>
                                <h3 className={`font-semibold ${theme.textMain} mb-3`}>{editSubMode === 'mergeHouse' ? t('uploadBuildingImage') : t('uploadMaterialFurnitureImage')}</h3>
                                {editSubMode === 'mergeHouse' && (
                                    <p className={`text-xs ${theme.textSub} -mt-2 mb-3`}>Tải ảnh công trình đã xóa nền</p>
                                )}
                                {(editSubMode === 'mergeMaterial' || editSubMode === 'mergeFurniture') && (
                                    <button onClick={() => setShowMaterialGallery(!showMaterialGallery)} className="text-xs text-cyan-300 hover:text-cyan-200 mb-2 w-full text-right">{showMaterialGallery ? t('close') : t('choosePresetMaterial')}</button>
                                )}
                                {showMaterialGallery && (
                                  <div className={`${theme.inputBg} p-2 rounded-md mb-3 border ${theme.border} max-h-40 overflow-y-auto`}>
                                      <div className="grid grid-cols-2 gap-2">
                                          {predefinedMaterialImages['Vietceramics'].map((img: any) => <img key={img.url} src={img.url} onClick={() => handleSetMaterialFromUrl(img.url)} className="w-full h-16 object-cover rounded cursor-pointer hover:ring-2 hover:ring-cyan-300/70" />)}
                                      </div>
                                  </div>
                                )}
                                {sourceImage2 ? (
                                    <div className='space-y-2'>
                                        <ImageDropzone onImageUpload={handleSourceImage2Upload} className="cursor-pointer rounded-lg"><div className='bg-black/30 p-2 rounded-lg'><img src={sourceImageToDataUrl(sourceImage2)} alt="Source 2" className="w-full h-auto object-contain rounded" /></div></ImageDropzone>
                                        <button onClick={() => setSourceImage2(null)} className='text-xs text-red-400 hover:text-red-500 w-full text-left'>{t('delete')}</button>
                                    </div>
                                ) : <ImageDropzone onImageUpload={handleSourceImage2Upload} className={`w-full h-32 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-xs cursor-pointer`}><p>{t('dropzoneHint')}</p></ImageDropzone>}
                            </section>

                            {editSubMode === 'mergeMaterial' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`text-xs font-bold ${theme.textMain} uppercase tracking-wider`}>Cấu hình vật liệu</h3>
                                        <span className="px-2 py-0.5 bg-cyan-400/20 text-cyan-200 text-[9px] font-bold rounded-full border border-cyan-300/30 animate-pulse">
                                            STRICTLY ENFORCED
                                        </span>
                                    </div>
                                    <section>
                                        <h3 className={`text-xs font-semibold ${theme.textSub} uppercase tracking-wider mb-2`}>Loại vật liệu</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {materialTypeOptions.map((opt: any) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setMaterialOptions({ ...materialOptions, type: opt.value })}
                                                    className={`py-2 px-3 text-xs rounded-md border transition-all ${materialOptions.type === opt.value ? 'neva-primary-button border-white/10 text-slate-950' : `${theme.inputBg} ${theme.border} ${theme.textMain} hover:border-cyan-300/50`}`}
                                                >
                                                    {opt.display}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className={`text-xs font-semibold ${theme.textSub} uppercase tracking-wider mb-2`}>Kích thước lát phổ biến</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {tileSizeOptions.map((opt: any) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setMaterialOptions({ ...materialOptions, tileSize: opt.value })}
                                                    className={`py-2 px-3 text-xs rounded-md border transition-all ${materialOptions.tileSize === opt.value ? 'neva-primary-button border-white/10 text-slate-950' : `${theme.inputBg} ${theme.border} ${theme.textMain} hover:border-cyan-300/50`}`}
                                                >
                                                    {opt.display}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className={`text-xs font-semibold ${theme.textSub} uppercase tracking-wider mb-2`}>Kiểu lát gạch</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {tilePatternOptions.map((opt: any) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setMaterialOptions({ ...materialOptions, pattern: opt.value })}
                                                    className={`py-2 px-3 text-xs rounded-md border transition-all ${materialOptions.pattern === opt.value ? 'neva-primary-button border-white/10 text-slate-950' : `${theme.inputBg} ${theme.border} ${theme.textMain} hover:border-cyan-300/50`}`}
                                                >
                                                    {opt.display}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className={`text-xs font-semibold ${theme.textSub} uppercase tracking-wider mb-2`}>Tính chất vật liệu</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {materialPropertyOptions.map((opt: any) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setMaterialOptions({ ...materialOptions, property: opt.value })}
                                                    className={`py-2 px-3 text-xs rounded-md border transition-all ${materialOptions.property === opt.value ? 'neva-primary-button border-white/10 text-slate-950' : `${theme.inputBg} ${theme.border} ${theme.textMain} hover:border-cyan-300/50`}`}
                                                >
                                                    {opt.display}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className={`text-xs font-semibold ${theme.textSub} uppercase tracking-wider mb-2`}>Tỉ lệ (Scale)</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-[10px] ${theme.textSub}`}>Nhỏ</span>
                                                <span className={`text-[10px] ${theme.textSub}`}>Lớn</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0.5" 
                                                max="2.0" 
                                                step="0.1" 
                                                value={materialOptions.scale || 1.0} 
                                                onChange={(e) => setMaterialOptions({ ...materialOptions, scale: e.target.value })} 
                                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-300"
                                            />
                                            <p className="text-[10px] text-center text-cyan-300">{materialOptions.scale || 1.0}x</p>
                                        </div>
                                    </section>
                                </div>
                            )}
                            
                            <section>
                                <PromptInput prompt={prompt} setPrompt={setPrompt} placeholder={t(`promptPlaceholder.${editSubMode}`)}/>
                                <div className="mt-3 space-y-2">
                                    <p className={`text-xs ${theme.textSub} mb-1`}>{t('suggestions')}</p>
                                    {editSubMode === 'mergeMaterial' && (
                                        <select onChange={(e) => setPrompt(e.target.value)} value="" className={`w-full ${theme.inputBg} ${theme.textMain} p-2.5 rounded-md text-sm appearance-none border ${theme.border}`} style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center/1.5em 1.5em no-repeat`}}>
                                            <option value="" disabled>{t('selectOption')}</option>
                                            {materialChangeOptions.map((p: any) => <option key={p.display} value={p.value}>{p.display}</option>)}
                                        </select>
                                    )}
                                    {editSubMode === 'mergeFurniture' && (
                                        <select onChange={(e) => setPrompt(e.target.value)} value="" className={`w-full ${theme.inputBg} ${theme.textMain} p-2.5 rounded-md text-sm appearance-none border ${theme.border}`} style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center/1.5em 1.5em no-repeat`}}>
                                            <option value="" disabled>{t('selectOption')}</option>
                                            {furnitureChangeOptions.map((p: any) => <option key={p.display} value={p.value}>{p.display}</option>)}
                                        </select>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    {editSubMode === 'canva' && (
                        <div className='space-y-4 animate-fade-in'>
                            <section>
                                <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('uploadDecorImage')}</h3>
                                <ImageDropzone onImagesUpload={handleDecorUpload} multiple={true} className={`w-full h-24 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-xs cursor-pointer`}><p>{t('dropzoneHint')}</p></ImageDropzone>
                                {canvaObjects.length > 0 && (
                                    <div className="mt-2 grid grid-cols-4 gap-1">
                                        {canvaObjects.map((obj: SourceImage, i: number) => <img key={i} src={sourceImageToDataUrl(obj)} onClick={() => handleDuplicateObject(i)} className={`w-full h-12 object-contain rounded cursor-pointer ${theme.inputBg} border ${theme.border} p-0.5`} />)}
                                    </div>
                                )}
                            </section>
                            <section>
                                <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('adjustments')}</h3>
                                <div className={`flex items-center justify-between p-2 ${theme.inputBg} rounded border ${theme.border} text-xs`}>
                                    <label className='flex items-center gap-2'><input type="checkbox" checked={isCanvaLayoutLocked} onChange={(e) => setIsCanvaLayoutLocked(e.target.checked)} className="w-3 h-3 text-cyan-300"/> {t('lockLayout')}</label>
                                    {selectedCanvaObjectIndex !== null && <button onClick={handleDeleteSelectedCanvaObject} className="text-red-400 hover:text-red-500"><Icon name="trash" className="w-4 h-4"/></button>}
                                </div>
                                {selectedTransform && !isCanvaLayoutLocked && (
                                    <div className={`mt-2 space-y-2 p-2 ${theme.inputBg} rounded border ${theme.border}`}>
                                        <label className='text-[10px] block'>{t('rotate')}: {selectedTransform.rotation}°</label>
                                        <input type="range" min="0" max="360" value={selectedTransform.rotation} onChange={(e) => updateSelectedObjectTransform({ rotation: Number(e.target.value) })} className="w-full h-1.5 accent-cyan-300"/>
                                        <div className="flex gap-1">
                                            <button onClick={() => updateSelectedObjectTransform({ flipHorizontal: !selectedTransform.flipHorizontal })} className={`w-1/2 text-[10px] py-1 rounded ${theme.buttonSecondary}`}>{t('flipHorizontal')}</button>
                                            <button onClick={() => updateSelectedObjectTransform({ flipVertical: !selectedTransform.flipVertical })} className={`w-1/2 text-[10px] py-1 rounded ${theme.buttonSecondary}`}>{t('flipVertical')}</button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>
                    )}

                    <section>
                        <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('imageCount')}</h3>
                        <div className={`flex items-center justify-between ${theme.inputBg} rounded-md p-2 border ${theme.border}`}>
                            <button onClick={() => setImageCount(Math.max(1, imageCount - 1))} className={`px-4 py-1.5 rounded text-lg font-bold ${theme.buttonSecondary}`}>-</button>
                            <span className={`text-lg font-semibold`}>{imageCount}</span>
                            <button onClick={() => setImageCount(Math.min(10, imageCount + 1))} className={`px-4 py-1.5 rounded text-lg font-bold ${theme.buttonSecondary}`}>+</button>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export const PlanTo3dPanel: React.FC<any> = ({ 
    sourceImage, setSourceImage, referenceImage, setReferenceImage, prompt, setPrompt, 
    planTo3dMode, setPlanTo3dMode, imageCount, setImageCount, handleSourceImageUpload,
    onGeneratePromptFromPlan, onAnalyzePlanStyle
}) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const { planStylePrompts, planRoomTypePrompts, planColorizePrompts } = (translations[language] as any).constants;
    const [isGeneratingPromptLocal, setIsGeneratingPromptLocal] = useState(false);
    const [isAnalyzingPromptLocal, setIsAnalyzingPromptLocal] = useState(false);

    const handlePromptSelect = (selectedPrompt: string) => {
        setPrompt((current: string) => current.trim() === '' ? selectedPrompt : `${current}, ${selectedPrompt}`);
    };

    const handleGeneratePromptClick = async () => {
        setIsGeneratingPromptLocal(true);
        await onGeneratePromptFromPlan();
        setIsGeneratingPromptLocal(false);
    };

    const handleAnalyzePlanStyleClick = async () => {
        setIsAnalyzingPromptLocal(true);
        await onAnalyzePlanStyle();
        setIsAnalyzingPromptLocal(false);
    };

    const handleMoodboardUpload = async (newReferenceImage: SourceImage) => {
        if (!sourceImage) {
            setReferenceImage(newReferenceImage);
            return;
        }
        try {
            const sourceImg = new Image();
            sourceImg.src = sourceImageToDataUrl(sourceImage);
            await new Promise<void>((resolve, reject) => {
                sourceImg.onload = () => resolve();
                sourceImg.onerror = reject;
            });
            const targetAspectRatio = sourceImg.naturalWidth / sourceImg.naturalHeight;
            const paddedImage = await padImageToAspectRatio(newReferenceImage, targetAspectRatio);
            setReferenceImage(paddedImage);
        } catch (error) {
            console.error("Failed to pad moodboard image:", error);
            setReferenceImage(newReferenceImage);
        }
    };

    return (
        <div className="space-y-6">
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>1. {t('upload2dPlan')}</h3>
                {sourceImage ? (
                    <div className='space-y-3'>
                        <ImageDropzone onImageUpload={handleSourceImageUpload} className="cursor-pointer rounded-lg"><div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(sourceImage)} alt="Plan" className="w-full h-auto object-contain rounded" /></div></ImageDropzone>
                        <button onClick={() => setSourceImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                    </div>
                ) : <ImageDropzone onImageUpload={handleSourceImageUpload} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}><div><p>{t('dropzoneHint')}</p></div></ImageDropzone>}
            </section>

            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>2. {t('referenceImage')} (Style mẫu)</h3>
                {referenceImage ? (
                    <div className='space-y-3'>
                        <ImageDropzone onImageUpload={handleMoodboardUpload} className="cursor-pointer rounded-lg"><div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(referenceImage)} alt="Moodboard" className="w-full h-auto object-contain rounded" /></div></ImageDropzone>
                        <button onClick={() => setReferenceImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                    </div>
                ) : <ImageDropzone onImageUpload={handleMoodboardUpload} className={`w-full h-32 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}><p>{t('dropzoneHint')}</p></ImageDropzone>}
            </section>

            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>3. {t('chooseGoal')}</h3>
                <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
                    <button onClick={() => setPlanTo3dMode('render')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${planTo3dMode === 'render' ? 'neva-primary-button text-slate-950 shadow-lg shadow-cyan-500/20 border-white/10' : 'text-slate-400 hover:text-slate-200'}`}>{t('create3DImage')}</button>
                    <button onClick={() => setPlanTo3dMode('colorize')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${planTo3dMode === 'colorize' ? 'neva-primary-button text-slate-950 shadow-lg shadow-cyan-500/20 border-white/10' : 'text-slate-400 hover:text-slate-200'}`}>{t('colorizePlan')}</button>
                </div>
                
                {sourceImage && planTo3dMode === 'render' && (
                    <button 
                        onClick={handleGeneratePromptClick}
                        disabled={isGeneratingPromptLocal}
                        className={`mt-4 w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg border transition-all ${isGeneratingPromptLocal ? 'opacity-50 cursor-not-allowed' : 'neva-primary-button border-white/10 text-slate-950'}`}
                    >
                        <Icon name="sparkles" className={`w-4 h-4 ${isGeneratingPromptLocal ? 'animate-spin' : ''}`} />
                        {isGeneratingPromptLocal ? t('generating') : t('createPrompt')}
                    </button>
                )}

                {referenceImage && planTo3dMode === 'colorize' && (
                    <button 
                        onClick={handleAnalyzePlanStyleClick}
                        disabled={isAnalyzingPromptLocal}
                        className={`mt-4 w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg border transition-all ${isAnalyzingPromptLocal ? 'opacity-50 cursor-not-allowed' : 'neva-primary-button border-white/10 text-slate-950'}`}
                    >
                        <Icon name="sparkles" className={`w-4 h-4 ${isAnalyzingPromptLocal ? 'animate-spin' : ''}`} />
                        {isAnalyzingPromptLocal ? t('generating') : t('analyzePlanPrompt')}
                    </button>
                )}
            </section>
            
            <section>
                <PromptInput prompt={prompt} setPrompt={setPrompt} placeholder={planTo3dMode === 'render' ? t('promptPlaceholder.planTo3dRender') : t('promptPlaceholder.planTo3dColorize')} />
                <div className="mt-3 space-y-2">
                    <p className={`text-xs ${theme.textSub} mb-1`}>{t('suggestions')}</p>
                    {planTo3dMode === 'render' ? (
                        <>
                            <select onChange={(e) => handlePromptSelect(e.target.value)} value="" className={`w-full ${theme.inputBg} ${theme.textMain} p-2.5 rounded-md text-sm appearance-none border ${theme.border}`} style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center/1.5em 1.5em no-repeat`}}>
                                <option value="" disabled>{t('style')}</option>
                                {planStylePrompts.map((p: string) => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <select onChange={(e) => handlePromptSelect(e.target.value)} value="" className={`w-full ${theme.inputBg} ${theme.textMain} p-2.5 rounded-md text-sm appearance-none border ${theme.border}`} style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center/1.5em 1.5em no-repeat`}}>
                                <option value="" disabled>{t('roomType')}</option>
                                {planRoomTypePrompts.map((p: string) => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </>
                    ) : (
                        <select onChange={(e) => setPrompt(e.target.value)} value="" className={`w-full ${theme.inputBg} ${theme.textMain} p-2.5 rounded-md text-sm appearance-none border ${theme.border}`} style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center/1.5em 1.5em no-repeat`}}>
                            <option value="" disabled>{t('selectOption')}</option>
                            {planColorizePrompts.map((p: string) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    )}
                </div>
            </section>
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('imageCount')}</h3>
                <div className={`flex items-center justify-between ${theme.inputBg} rounded-md p-2 border ${theme.border}`}>
                    <button onClick={() => setImageCount(Math.max(1, imageCount - 1))} className={`px-4 py-1.5 rounded text-lg font-bold ${theme.buttonSecondary}`}>-</button>
                    <span className={`text-lg font-semibold`}>{imageCount}</span>
                    <button onClick={() => setImageCount(Math.min(10, imageCount + 1))} className={`px-4 py-1.5 rounded text-lg font-bold ${theme.buttonSecondary}`}>+</button>
                </div>
            </section>
        </div>
    );
};

export const VideoPanel: React.FC<any> = ({ sourceImage, setSourceImage, prompt, setPrompt, handleSourceImageUpload }) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [prompt]);

    const { videoPrompts } = (translations[language] as any).constants;

    return (
        <div className="space-y-6">
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>1. {t('uploadImage')}</h3>
                {sourceImage ? (
                    <div className='space-y-3'>
                        <ImageDropzone onImageUpload={handleSourceImageUpload} className="cursor-pointer rounded-lg"><div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(sourceImage)} alt="Source" className="w-full h-auto object-contain rounded" /></div></ImageDropzone>
                        <button onClick={() => setSourceImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                    </div>
                ) : <ImageDropzone onImageUpload={handleSourceImageUpload} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}><div><p>{t('dropzoneHint')}</p></div></ImageDropzone>}
            </section>
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>2. {t('promptExamples')}</h3>
                <select value={videoPrompts.some((p: any) => p.value === prompt) ? prompt : ""} onChange={(e) => setPrompt(e.target.value)} className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md text-sm appearance-none border ${theme.border}`} style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center/1.5em 1.5em no-repeat`}}>
                    <option value="" disabled>{t('selectSuggestion')}</option>
                    {videoPrompts.map((p: any) => <option key={p.display} value={p.value}>{p.display}</option>)}
                </select>
            </section>
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-2`}>3. {t('motionDescription')}</h3>
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('promptPlaceholder.video')}
                    className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md min-h-[96px] overflow-hidden resize-none text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none border ${theme.border}`}
                />
            </section>
        </div>
    );
};

export const CanvaPanel: React.FC<any> = ({ 
    sourceImage, setSourceImage, handleSourceImageUpload,
    canvaObjects, setCanvaObjects, canvaObjectTransforms, setCanvaObjectTransforms,
    selectedCanvaObjectIndex, setSelectedCanvaObjectIndex, isCanvaLayoutLocked, setIsCanvaLayoutLocked,
    handleDeleteSelectedCanvaObject
}) => {
    const { t } = useLanguage();
    const { theme } = useTheme();

    const handleDecorUpload = async (images: SourceImage[]) => {
        if (!sourceImage) { alert(t('alertUploadBg')); return; }
        try {
            const bgImg = new Image(); bgImg.src = sourceImageToDataUrl(sourceImage);
            await new Promise((resolve, reject) => { bgImg.onload = resolve; bgImg.onerror = reject; });
            const targetAspectRatio = bgImg.naturalWidth / bgImg.naturalHeight;
            const processedImages = await Promise.all(images.map(img => padImageToAspectRatio(img, targetAspectRatio)));
            const newTransforms: ObjectTransform[] = processedImages.map(() => ({
                x: 50, y: 50, scale: 20, rotation: 0, flipHorizontal: false, flipVertical: false
            }));
            setCanvaObjects((prev: SourceImage[]) => [...prev, ...processedImages]);
            setCanvaObjectTransforms((prev: ObjectTransform[]) => [...prev, ...newTransforms]);
        } catch (error) {
            console.error("Error processing decor images:", error);
            const newTransforms: ObjectTransform[] = images.map(() => ({
                x: 50, y: 50, scale: 20, rotation: 0, flipHorizontal: false, flipVertical: false
            }));
            setCanvaObjects((prev: SourceImage[]) => [...prev, ...images]);
            setCanvaObjectTransforms((prev: ObjectTransform[]) => [...prev, ...newTransforms]);
        }
    };

    const handleDuplicateObject = (idx: number) => {
        const obj = canvaObjects[idx]; if (!obj) return;
        setCanvaObjects((prev: SourceImage[]) => [...prev, obj]);
        setCanvaObjectTransforms((prev: ObjectTransform[]) => [...prev, { x: 50, y: 50, scale: 20, rotation: 0, flipHorizontal: false, flipVertical: false }]);
        setSelectedCanvaObjectIndex(canvaObjects.length);
    };

    const updateSelectedObjectTransform = (updates: Partial<ObjectTransform>) => {
        if (selectedCanvaObjectIndex === null) return;
        setCanvaObjectTransforms((transforms: ObjectTransform[]) => transforms.map((t, i) => i === selectedCanvaObjectIndex ? { ...t, ...updates } : t));
    };

    const selectedTransform = selectedCanvaObjectIndex !== null ? canvaObjectTransforms[selectedCanvaObjectIndex] : null;

    return (
        <div className="space-y-6">
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>{t('uploadSpaceImage')}</h3>
                {sourceImage ? (
                    <div className='space-y-2'>
                        <ImageDropzone onImageUpload={handleSourceImageUpload} className="cursor-pointer rounded-lg">
                            <div className="bg-black/30 p-2 rounded-lg">
                                <img src={sourceImageToDataUrl(sourceImage)} alt="Background" className="w-full h-auto object-contain rounded-lg" />
                            </div>
                        </ImageDropzone>
                        <button onClick={() => setSourceImage(null)} className='text-sm text-red-400 hover:text-red-500 w-full text-left px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('changeBgImage')}</button>
                    </div>
                ) : <ImageDropzone onImageUpload={handleSourceImageUpload} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}><div><p>{t('dropzoneHint')}</p></div></ImageDropzone>}
            </section>
            
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('uploadDecorImage')}</h3>
                <ImageDropzone onImagesUpload={handleDecorUpload} multiple={true} className={`w-full h-24 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-xs cursor-pointer`}><p>{t('dropzoneHint')}</p></ImageDropzone>
                {canvaObjects.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-1">
                        {canvaObjects.map((obj: SourceImage, i: number) => <img key={i} src={sourceImageToDataUrl(obj)} onClick={() => handleDuplicateObject(i)} className={`w-full h-12 object-contain rounded cursor-pointer ${theme.inputBg} border ${theme.border} p-0.5`} />)}
                    </div>
                )}
            </section>
            
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('adjustments')}</h3>
                <div className={`flex items-center justify-between p-2 ${theme.inputBg} rounded border ${theme.border} text-xs`}>
                    <label className='flex items-center gap-2'><input type="checkbox" checked={isCanvaLayoutLocked} onChange={(e) => setIsCanvaLayoutLocked(e.target.checked)} className="w-3 h-3 text-cyan-300"/> {t('lockLayout')}</label>
                    {selectedCanvaObjectIndex !== null && <button onClick={handleDeleteSelectedCanvaObject} className="text-red-400 hover:text-red-500"><Icon name="trash" className="w-4 h-4"/></button>}
                </div>
                {selectedTransform && !isCanvaLayoutLocked && (
                    <div className={`mt-2 space-y-2 p-2 ${theme.inputBg} rounded border ${theme.border}`}>
                        <label className='text-[10px] block'>{t('rotate')}: {selectedTransform.rotation}°</label>
                        <input type="range" min="0" max="360" value={selectedTransform.rotation} onChange={(e) => updateSelectedObjectTransform({ rotation: Number(e.target.value) })} className="w-full h-1.5 accent-cyan-300"/>
                        <div className="flex gap-1">
                            <button onClick={() => updateSelectedObjectTransform({ flipHorizontal: !selectedTransform.flipHorizontal })} className={`w-1/2 text-[10px] py-1 rounded ${theme.buttonSecondary}`}>{t('flipHorizontal')}</button>
                            <button onClick={() => updateSelectedObjectTransform({ flipVertical: !selectedTransform.flipVertical })} className={`w-1/2 text-[10px] py-1 rounded ${theme.buttonSecondary}`}>{t('flipVertical')}</button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export const PromptGenPanel: React.FC<any> = ({ 
    sourceImage, setSourceImage, characterImage, setCharacterImage, 
    characterDescription, setCharacterDescription, isAnalyzingCharacter, handleSourceImageUpload 
}) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [characterDescription]);

    return (
        <div className="space-y-6">
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>1. {t('uploadToAnalyze')}</h3>
                <p className={`text-xs ${theme.textSub} -mt-2 mb-3`}>{t('analyzeHelp')}</p>
                {sourceImage ? (
                    <div className='space-y-3'>
                        <ImageDropzone onImageUpload={handleSourceImageUpload} className="cursor-pointer rounded-lg"><div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(sourceImage)} alt="Source" className="w-full h-auto object-contain rounded" /></div></ImageDropzone>
                        <button onClick={() => setSourceImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                    </div>
                ) : <ImageDropzone onImageUpload={handleSourceImageUpload} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}><div><p>{t('dropzoneHint')}</p></div></ImageDropzone>}
            </section>

            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>2. {t('uploadCharacterImage')}</h3>
                <p className={`text-xs ${theme.textSub} -mt-2 mb-3`}>{t('characterHelp')}</p>
                {characterImage ? (
                    <div className='space-y-3'>
                        <div className="relative group">
                            <ImageDropzone onImageUpload={setCharacterImage} className="cursor-pointer rounded-lg"><div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(characterImage)} alt="Character" className="w-full h-auto object-contain rounded" /></div></ImageDropzone>
                            {isAnalyzingCharacter && <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg text-white text-[10px]"><Icon name="sparkles" className="w-4 h-4 animate-spin mb-1"/>{t('analyzingCharacter')}</div>}
                        </div>
                        <button onClick={() => setCharacterImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                    </div>
                ) : <ImageDropzone onImageUpload={setCharacterImage} className={`w-full h-32 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}><div><p>{t('dropzoneHint')}</p></div></ImageDropzone>}
            </section>

            <section className="animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-xs font-semibold ${theme.textSub} uppercase tracking-wider`}>
                        {t('characterDescriptionLabel')}
                    </h3>
                    {isAnalyzingCharacter && (
                        <div className="flex items-center gap-1 text-[10px] text-cyan-300">
                             <Icon name="sparkles" className="w-3 h-3 animate-spin"/>
                             <span>{t('analyzingCharacter')}</span>
                        </div>
                    )}
                </div>
                <textarea
                    ref={textareaRef}
                    value={characterDescription}
                    onChange={(e) => setCharacterDescription(e.target.value)}
                    placeholder="Nhập mô tả nhân vật thủ công hoặc tải ảnh để AI tự động phân tích..."
                    className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md min-h-[96px] overflow-hidden resize-none text-xs leading-relaxed border ${theme.border} focus:ring-2 focus:ring-cyan-400/30 focus:outline-none`}
                />
                <p className="text-[10px] text-slate-500 mt-1 italic">
                    * Bạn có thể tải ảnh lên để AI phân tích mô tả tự động, sau đó chỉnh sửa lại nếu cần.
                </p>
            </section>
        </div>
    );
};
