
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../icons';
import { ImageDropzone } from '../ImageDropzone';
import { generatePromptFromImage, generatePromptFromKeywords, classifyImageType } from '../../services/geminiService';
import { sourceImageToDataUrl, padImageToAspectRatio } from '../../utils';
import { ASPECT_RATIO_OPTIONS } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { translations } from '../../locales/translations';
import type { SourceImage } from '../../types';

export const CreateFreePanel: React.FC<any> = ({
    sourceImage, setSourceImage, referenceImage, setReferenceImage, prompt, setPrompt,
    negativePrompt, setNegativePrompt,
    imageCount, setImageCount, aspectRatio, setAspectRatio, handleSourceImageUpload,
    handleConvertToWatercolor, isLoading
}) => {
    const { language, t } = useLanguage();
    const { theme } = useTheme();
    // FIX: Cast to any to resolve Property 'constants' does not exist error
    const {
        predefinedReferenceImages, stylePrompts, contextPrompts, lightingPrompts, ASPECT_RATIO_LABELS
    } = (translations[language] as any).constants;
    
    const [showReferenceGallery, setShowReferenceGallery] = useState(false);
    const [selectedReferenceCategory, setSelectedReferenceCategory] = useState<keyof typeof predefinedReferenceImages>('building');
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
    const [isGeneratingPromptFromText, setIsGeneratingPromptFromText] = useState(false);
    const [isProcessingReference, setIsProcessingReference] = useState(false);
    const [imageType, setImageType] = useState<'interior' | 'exterior'>('exterior');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [prompt]);

    useEffect(() => {
        if (sourceImage) {
            classifyImageType(sourceImage).then(type => {
                setImageType(type);
            });
        } else {
            setImageType('exterior');
        }
    }, [sourceImage]);

    const handleGeneratePrompt = async () => {
        if (!sourceImage) {
            alert(t('alertUploadSource'));
            return;
        }
        setIsGeneratingPrompt(true);
        try {
            const newPrompt = await generatePromptFromImage(sourceImage, language, imageType);
            setPrompt(newPrompt);
        } catch (error) {
            alert(t('alertGenerationFailed'));
        } finally {
            setIsGeneratingPrompt(false);
        }
    };

    const handleGeneratePromptFromKeywords = async () => {
        if (!prompt) {
            alert(t('alertEnterPrompt'));
            return;
        }
        setIsGeneratingPromptFromText(true);
        try {
            const newPrompt = await generatePromptFromKeywords(prompt, language, imageType);
            setPrompt(newPrompt);
        } catch (error) {
            alert(t('alertGenerationFailed'));
        } finally {
            setIsGeneratingPromptFromText(false);
        }
    };

    const handleReferenceImageUpload = async (newReferenceImage: SourceImage) => {
        if (!sourceImage) {
            setReferenceImage(newReferenceImage);
            return;
        }
        setIsProcessingReference(true);
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
            console.error("Failed to pad reference image:", error);
            alert("Could not process reference image. Using original.");
            setReferenceImage(newReferenceImage);
        } finally {
            setIsProcessingReference(false);
        }
    };

    const handleSetReferenceFromUrl = async (url: string) => {
        setIsProcessingReference(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const newReferenceImage = await new Promise<SourceImage>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const dataUrl = reader.result as string;
                    const [, base64] = dataUrl.split(',');
                    if (base64) {
                        resolve({ base64, mimeType: blob.type });
                    } else {
                        reject(new Error("Could not read base64 from data URL."));
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            await handleReferenceImageUpload(newReferenceImage);
            setShowReferenceGallery(false);
        } catch (error) {
            alert("Could not load reference image.");
            setIsProcessingReference(false);
        }
    };

    const handlePromptSelect = (selectedPrompt: string, categoryPrompts: string[]) => {
        if (!selectedPrompt) return;
        setPrompt((currentPrompt: string) => {
            let existingPrompt = categoryPrompts.find(p => currentPrompt.includes(p));
            let newPrompt = currentPrompt;
            if (existingPrompt) newPrompt = newPrompt.replace(existingPrompt, selectedPrompt);
            else newPrompt = newPrompt.trim() === '' ? selectedPrompt : `${newPrompt}, ${selectedPrompt}`;
            return newPrompt;
        });
    };
    
    return (
        <div className="space-y-6">
            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-3`}>1. {t('uploadImageOptional')}</h3>
                <p className={`text-xs ${theme.textSub} -mt-2 mb-3`}>{t('handDrawnHint')}</p>
                {sourceImage ? (
                  <div className='space-y-3'>
                      <ImageDropzone onImageUpload={handleSourceImageUpload} className="cursor-pointer rounded-lg"><div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(sourceImage)} alt="Source" className="w-full h-auto object-contain rounded" /></div></ImageDropzone>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button onClick={() => setSourceImage(null)} className='flex-1 text-red-400 hover:text-red-500 text-xs py-2 px-3 rounded-md hover:bg-red-500/10 border border-red-500/20'>{t('delete')}</button>
                            <button 
                                onClick={handleConvertToWatercolor} 
                                disabled={isLoading}
                                className='flex-[2] bg-cyan-400/10 hover:bg-cyan-400/15 text-cyan-300 text-xs py-2 px-3 rounded-md border border-cyan-300/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50'
                            >
                                <Icon name="pencil-swoosh" className="w-3.5 h-3.5" />
                                {t('convertToWatercolor')}
                            </button>
                        </div>
                        <p className={`text-xs ${theme.textSub} mt-1`}>
                            " Nếu kết quả đầu ra không thay đổi bạn có thể chuyển qua sketch màu nước trước rồi mới tạo ảnh"
                        </p>
                      </div>
                  </div>
                ) : (
                  <ImageDropzone onImageUpload={handleSourceImageUpload} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}>
                      <div><p>{t('dropzoneHint')}</p><p className="text-xs mt-1 opacity-70">{t('dropzoneFormats')}</p></div>
                  </ImageDropzone>
                )}
            </section>

            <section>
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`font-semibold ${theme.textMain}`}>2. {t('referenceImage')}</h3>
                  <button onClick={() => setShowReferenceGallery(!showReferenceGallery)} className="text-sm text-cyan-300 hover:text-cyan-200 px-2 py-1">{showReferenceGallery ? t('close') : t('choosePresetImage')}</button>
                </div>
                {showReferenceGallery && (
                  <div className={`${theme.inputBg} p-3 rounded-md mb-3 border ${theme.border}`}>
                    <div className={`flex space-x-1 mb-3 border-b ${theme.border}`}>
                      {(Object.keys(predefinedReferenceImages) as Array<keyof typeof predefinedReferenceImages>).map(cat => (
                        <button key={cat as string} onClick={() => setSelectedReferenceCategory(cat)} className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-t-md ${selectedReferenceCategory === cat as string ? 'bg-slate-700 text-white' : `${theme.textSub} hover:bg-white/10`}`}>{cat as string}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {predefinedReferenceImages[selectedReferenceCategory].length > 0 ? (
                        predefinedReferenceImages[selectedReferenceCategory].map(img => <img key={img.url} src={img.url} alt={img.name} onClick={() => handleSetReferenceFromUrl(img.url)} className="w-full h-20 object-cover rounded cursor-pointer hover:ring-2 hover:ring-cyan-300/70" />)
                      ) : <p className={`col-span-2 text-center text-xs ${theme.textSub} py-4`}>No images in this category yet.</p>}
                    </div>
                  </div>
                )}
                <p className={`text-xs ${theme.textSub} mb-3`}>{t('referenceImageHelp')}</p>
                {isProcessingReference ? (
                    <div className={`w-full h-32 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm`}>
                        <p>{t('processingImage')}</p>
                    </div>
                ) : referenceImage ? (
                  <div className="relative group">
                    <ImageDropzone onImageUpload={handleReferenceImageUpload} className="cursor-pointer rounded-lg"><div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(referenceImage)} alt="Reference" className="w-full h-auto object-contain rounded" /></div></ImageDropzone>
                    <button onClick={() => setReferenceImage(null)} className="absolute top-3 right-3 bg-black/60 rounded-full text-white hover:bg-black/80 p-1 opacity-0 group-hover:opacity-100 z-10"><Icon name="x-circle" className="w-5 h-5" /></button>
                  </div>
                ) : <ImageDropzone onImageUpload={handleReferenceImageUpload} className={`w-full h-32 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}><p>{t('dropzoneHint')}</p></ImageDropzone>}
            </section>

            <section>
                <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-semibold ${theme.textMain}`}>3.{t('prompt')}</h3>
                    <button onClick={async () => {
                        const text = await navigator.clipboard.readText();
                        setPrompt((p: string) => p ? `${p} ${text}` : text);
                    }} title="Paste" className={`${theme.textSub} hover:text-cyan-300`}><Icon name="clipboard" className="w-5 h-5"/></button>
                </div>
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('promptPlaceholder.create')}
                    className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md min-h-[112px] overflow-hidden resize-none text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none border ${theme.border}`}
                />
                <div className="mt-3 space-y-2">
                  <p className={`text-xs ${theme.textSub} mb-1`}>{t('addFromPresets')}</p>
                  <select onChange={(e) => handlePromptSelect(e.target.value, stylePrompts)} value="" className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none appearance-none border ${theme.border}`} style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center/1.5em 1.5em no-repeat`}}><option value="" disabled>{t('style')}</option>{stylePrompts.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <select onChange={(e) => handlePromptSelect(e.target.value, contextPrompts)} value="" className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none appearance-none border ${theme.border}`} style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center/1.5em 1.5em no-repeat`}}><option value="" disabled>{t('context')}</option>{contextPrompts.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <select onChange={(e) => handlePromptSelect(e.target.value, lightingPrompts)} value="" className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none appearance-none border ${theme.border}`} style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") right 0.5rem center/1.5em 1.5em no-repeat`}}><option value="" disabled>{t('lighting')}</option>{lightingPrompts.map(p => <option key={p} value={p}>{p}</option>)}</select>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button 
                        onClick={handleGeneratePrompt} 
                        disabled={!sourceImage || isGeneratingPrompt || isGeneratingPromptFromText}
                        className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-lg ${theme.buttonSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Icon name="sparkles" className={`w-5 h-5 ${isGeneratingPrompt ? 'animate-spin' : ''}`} />
                        {isGeneratingPrompt ? t('generating') : t('generateFromImage')}
                    </button>
                    <button 
                        onClick={handleGeneratePromptFromKeywords} 
                        disabled={!prompt || isGeneratingPromptFromText || isGeneratingPrompt}
                        className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-lg ${theme.buttonSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Icon name="sparkles" className={`w-5 h-5 ${isGeneratingPromptFromText ? 'animate-spin' : ''}`} />
                        {isGeneratingPromptFromText ? t('generating') : t('generateFromPromptText')}
                    </button>
                </div>
            </section>

            <section>
                <h3 className={`font-semibold ${theme.textMain} mb-2`}>4. {t('negativePrompt')}</h3>
                <p className={`text-xs ${theme.textSub} mb-2`}>{t('negativePromptHelp')}</p>
                <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder={t('promptPlaceholder.negative')}
                    className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md h-20 resize-none text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none border ${theme.border}`}
                />
            </section>

             <section>
                <h3 className={`font-semibold ${theme.textMain} mb-2`}>5. {t('aspectRatio')}</h3>
                <p className={`text-xs ${theme.textSub} mb-3`}>{t('aspectRatioHelp')}</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                    {ASPECT_RATIO_OPTIONS.map(ratio => (
                        <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`py-2 px-2 text-center rounded-md border ${aspectRatio === ratio ? 'neva-primary-button font-semibold border-white/10 text-slate-950' : `${theme.inputBg} ${theme.textMain} hover:bg-white/10 ${theme.border}`}`}>{ASPECT_RATIO_LABELS[ratio]}</button>
                    ))}
                </div>
              </section>

              <section>
                  <h3 className={`font-semibold ${theme.textMain} mb-2`}>6. {t('imageCount')}</h3>
                  <div className={`flex items-center justify-between ${theme.inputBg} rounded-md p-2 border ${theme.border}`}>
                      <button onClick={() => setImageCount((c: number) => Math.max(1, c - 1))} className={`px-4 py-2 rounded text-xl font-bold ${theme.buttonSecondary} ${theme.textMain}`}>-</button>
                      <span className={`text-lg font-semibold ${theme.textMain}`}>{imageCount}</span>
                      <button onClick={() => setImageCount((c: number) => Math.min(10, c + 1))} className={`px-4 py-2 rounded text-xl font-bold ${theme.buttonSecondary} ${theme.textMain}`}>+</button>
                  </div>
              </section>
        </div>
    );
};
