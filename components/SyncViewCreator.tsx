
import React, { useState, useEffect } from 'react';
import type { SourceImage, HistoryItem, ImageSize } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './icons';
import { ImageDropzone } from './ImageDropzone';
import { sourceImageToDataUrl } from '../utils';
import { syncView } from '../services/geminiService';

interface SyncViewCreatorProps {
    onBack: () => void;
    addImageToLibrary: (imageDataUrl: string) => Promise<void>;
    addHistoryItem: (item: Omit<HistoryItem, 'id'>) => Promise<void>;
    aiModel: string;
    setFullscreenData: (images: string[], index: number) => void;
}

export const SyncViewCreator: React.FC<SyncViewCreatorProps> = ({ onBack, addImageToLibrary, addHistoryItem, aiModel, setFullscreenData }) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const [referenceImage, setReferenceImage] = useState<SourceImage | null>(null);
    const [targetImage, setTargetImage] = useState<SourceImage | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageCount, setImageCount] = useState(2);
    const [imageSize, setImageSize] = useState<ImageSize>('1K');
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (generatedImages.length > 0 && !selectedImage) {
            setSelectedImage(generatedImages[0]);
        }
    }, [generatedImages, selectedImage]);

    const handleGenerate = async () => {
        if (!referenceImage || !targetImage) return;
        
        setIsGenerating(true);
        setGeneratedImages([]);
        setSelectedImage(null);

        try {
            const results = await syncView(referenceImage, targetImage, imageCount, language, imageSize, aiModel);
            
            if (results.length > 0) {
                setGeneratedImages(results);
                setSelectedImage(results[0]);
                results.forEach(img => addImageToLibrary(img));
                await addHistoryItem({
                    tab: 'utilities',
                    sourceImage: targetImage,
                    sourceImage2: referenceImage,
                    referenceImage: referenceImage,
                    prompt: `[Sync View] Synchronized style and materials from reference to target angle.`,
                    imageCount: results.length,
                    generatedImages: results,
                    generatedPrompts: null,
                });
            }
        } catch (error) {
            console.error("Sync View failed:", error);
            alert(t('alertGenerationFailed'));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleImageClick = (idx: number) => {
        setFullscreenData(generatedImages, idx);
    };

    return (
        <div className={`${theme.panelBg} p-5 rounded-xl border ${theme.border} animate-fade-in`}>
            <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack} 
                        className="p-2.5 rounded-full bg-slate-800 hover:bg-cyan-400/10 text-slate-300 hover:text-cyan-300 transition-all duration-300 border border-slate-700 shadow-lg"
                    >
                        <Icon name="arrow-uturn-left" className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        <Icon name="arrows-pointing-out" className="w-8 h-8 text-cyan-300" />
                        <div>
                            <h2 className={`text-2xl font-bold ${theme.textMain}`}>{t('syncViewTitle')}</h2>
                            <p className={`text-sm ${theme.textSub}`}>{t('syncViewDesc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-6">
                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-1 flex items-center gap-2`}>
                             <span className="w-6 h-6 rounded-full bg-cyan-400/18 text-cyan-100 flex items-center justify-center text-xs">1</span>
                             {t('syncViewStep1')}
                        </h3>
                        <p className="text-[11px] text-slate-400 mb-3 ml-8">{t('syncViewStep1Desc')}</p>
                        {referenceImage ? (
                            <div className='space-y-3 ml-8'>
                                <ImageDropzone onImageUpload={setReferenceImage} className="cursor-pointer rounded-lg">
                                    <div className='bg-black/30 rounded-lg p-2 border border-slate-700'><img src={sourceImageToDataUrl(referenceImage)} alt="Reference View" className="w-full h-auto object-contain rounded" /></div>
                                </ImageDropzone>
                                <button onClick={() => setReferenceImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                            </div>
                        ) : (
                            <div className="ml-8">
                                <ImageDropzone onImageUpload={setReferenceImage} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer hover:border-cyan-300/30 transition-colors`}>
                                    <div><p>{t('dropzoneHint')}</p><p className="text-xs mt-1 opacity-70">{t('dropzoneFormats')}</p></div>
                                </ImageDropzone>
                            </div>
                        )}
                    </section>

                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-1 flex items-center gap-2`}>
                             <span className="w-6 h-6 rounded-full bg-cyan-400/18 text-cyan-100 flex items-center justify-center text-xs">2</span>
                             {t('syncViewStep2')}
                        </h3>
                        <p className="text-[11px] text-slate-400 mb-3 ml-8">{t('syncViewStep2Desc')}</p>
                        {targetImage ? (
                            <div className='space-y-3 ml-8'>
                                <ImageDropzone onImageUpload={setTargetImage} className="cursor-pointer rounded-lg">
                                    <div className='bg-black/30 rounded-lg p-2 border border-slate-700'><img src={sourceImageToDataUrl(targetImage)} alt="Target View" className="w-full h-auto object-contain rounded" /></div>
                                </ImageDropzone>
                                <button onClick={() => setTargetImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                            </div>
                        ) : (
                            <div className="ml-8">
                                <ImageDropzone onImageUpload={setTargetImage} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer hover:border-cyan-300/30 transition-colors`}>
                                    <div><p>{t('dropzoneHint')}</p></div>
                                </ImageDropzone>
                            </div>
                        )}
                    </section>

                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <div className="grid grid-cols-2 gap-4 ml-1">
                            <div>
                                <h3 className={`font-semibold ${theme.textMain} mb-2 text-xs uppercase tracking-wider`}>{t('imageCount')}</h3>
                                <div className={`flex items-center justify-between ${theme.inputBg} rounded-md p-1.5 border ${theme.border}`}>
                                    <button onClick={() => setImageCount(Math.max(1, imageCount - 1))} className={`w-8 h-8 rounded flex items-center justify-center font-bold ${theme.buttonSecondary}`}>-</button>
                                    <span className={`font-semibold ${theme.textMain}`}>{imageCount}</span>
                                    <button onClick={() => setImageCount(Math.min(4, imageCount + 1))} className={`w-8 h-8 rounded flex items-center justify-center font-bold ${theme.buttonSecondary}`}>+</button>
                                </div>
                            </div>
                            <div>
                                <h3 className={`font-semibold ${theme.textMain} mb-2 text-xs uppercase tracking-wider`}>{t('imageSize')}</h3>
                                <div className="grid grid-cols-1 gap-2 text-[10px]">
                                    {['1K', '2K', '4K'].map((size) => (
                                        <button key={size} onClick={() => setImageSize(size as ImageSize)} className={`py-1.5 px-1 text-center rounded border transition-all ${imageSize === size ? 'neva-primary-button border-white/10 text-slate-950' : `${theme.inputBg} ${theme.textSub} ${theme.border}`}`}>{size}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-1 flex items-center gap-2`}>
                             <span className="w-6 h-6 rounded-full bg-cyan-400/18 text-cyan-100 flex items-center justify-center text-xs">3</span>
                             {t('syncViewStep3')}
                        </h3>
                        <p className="text-[11px] text-slate-400 mb-4 ml-8">{t('syncViewStep3Desc')}</p>
                        <div className="ml-8">
                            <button 
                                onClick={handleGenerate} 
                                disabled={isGenerating || !referenceImage || !targetImage} 
                                className="w-full neva-primary-button font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-xl shadow-cyan-950/20"
                            >
                                <Icon name="sparkles" className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                                {isGenerating ? t('generating') : t('createImage')}
                            </button>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-8">
                    <div className={`bg-slate-900/50 rounded-xl border ${theme.border} min-h-[60vh] flex items-center justify-center p-4 relative`}>
                        {isGenerating ? (
                            <div className="text-center">
                                <Icon name="sparkles" className="w-16 h-16 text-cyan-300 animate-spin mx-auto mb-4" />
                                <p className={`text-sm ${theme.textSub}`}>{t('generating')}...</p>
                            </div>
                        ) : generatedImages.length > 0 && selectedImage ? (
                            <div className="w-full h-full flex flex-col">
                                <div className="flex-grow flex items-center justify-center relative group bg-black/30 rounded-lg overflow-hidden max-h-[65vh]">
                                    <img src={selectedImage} alt="Synced View" className="max-w-full max-h-full object-contain cursor-zoom-in" onClick={() => handleImageClick(generatedImages.indexOf(selectedImage))} />
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a href={selectedImage} download={`synced-view-${Date.now()}.png`} className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg">
                                            <Icon name="download" className="w-6 h-6" />
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-6 overflow-x-auto pb-2 justify-center">
                                    {generatedImages.map((img, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === img ? 'border-cyan-300/50 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Result ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-30">
                                <Icon name="sparkles" className="w-24 h-24 text-slate-600 mx-auto mb-4" />
                                <p className={`text-lg font-bold uppercase tracking-widest ${theme.textSub}`}>{t('emptyStateHeader')}</p>
                                <p className="text-sm">{t('emptyStateText')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
