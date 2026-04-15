
import React, { useEffect } from 'react';
import type { SourceImage, AspectRatio } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './icons';
import { ImageDropzone } from './ImageDropzone';
import { sourceImageToDataUrl } from '../utils';
import { translations } from '../locales/translations';

interface ExtendViewCreatorProps {
    onBack: () => void;
    extendViewSourceImage: SourceImage | null;
    setExtendViewSourceImage: (image: SourceImage | null) => void;
    extendViewAspectRatio: AspectRatio;
    setExtendViewAspectRatio: (ratio: AspectRatio) => void;
    extendViewImageCount: number;
    setExtendViewImageCount: (count: number) => void;
    extendViewGeneratedImages: string[];
    extendViewSelectedImage: string | null;
    setExtendViewSelectedImage: (image: string | null) => void;
    handleExtendViewGeneration: () => void;
    isLoading: boolean;
    setFullscreenImage: (url: string | null) => void;
}

export const ExtendViewCreator: React.FC<ExtendViewCreatorProps> = ({
    onBack,
    extendViewSourceImage: sourceImage,
    setExtendViewSourceImage: setSourceImage,
    extendViewAspectRatio: aspectRatio,
    setExtendViewAspectRatio: setAspectRatio,
    extendViewImageCount: imageCount,
    setExtendViewImageCount: setImageCount,
    extendViewGeneratedImages: generatedImages,
    extendViewSelectedImage: selectedImage,
    setExtendViewSelectedImage: setSelectedImage,
    handleExtendViewGeneration: handleGenerate,
    isLoading,
    setFullscreenImage,
}) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    // FIX: Cast to any to resolve Property 'constants' does not exist error
    const { ASPECT_RATIO_LABELS } = (translations[language] as any).constants;

    // Tỷ lệ khung hình đặc thù cho chức năng Mở rộng View
    const EXTEND_RATIO_OPTIONS: AspectRatio[] = ['auto', '1:1', '4:3', '3:4', '16:9', '9:16', '2:3', '3:2'];

    useEffect(() => {
        if (generatedImages.length > 0 && !selectedImage) {
            setSelectedImage(generatedImages[0]);
        }
    }, [generatedImages, selectedImage, setSelectedImage]);

    return (
        <div className={`${theme.panelBg} p-5 rounded-xl border ${theme.border} animate-fade-in`}>
            <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-4">
                <button 
                    onClick={onBack} 
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-cyan-400/10 text-slate-300 hover:text-cyan-300 transition-all duration-300 border border-slate-700 hover:border-cyan-300/30 shadow-lg"
                    title={t('backToUtilities')}
                >
                    <Icon name="arrow-uturn-left" className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-slate-700 mx-1"></div>
                <div className="flex items-center gap-4">
                     <Icon name="arrows-pointing-out" className="w-8 h-8 text-cyan-300" />
                    <div>
                        <h2 className={`text-2xl font-bold ${theme.textMain}`}>{t('extendViewTitle')}</h2>
                        <p className={`text-sm ${theme.textSub}`}>{t('extendViewDesc')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-6">
                    <section>
                        <h3 className={`font-semibold ${theme.textMain} mb-3`}>{t('uploadImageToExtend')}</h3>
                        {sourceImage ? (
                          <div className='space-y-3'>
                              <ImageDropzone onImageUpload={setSourceImage} className="cursor-pointer rounded-lg">
                                <div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(sourceImage)} alt="Source for extending" className="w-full h-auto object-contain rounded" /></div>
                              </ImageDropzone>
                              <button onClick={() => setSourceImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                          </div>
                        ) : (
                          <ImageDropzone onImageUpload={setSourceImage} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}>
                              <div><p>{t('dropzoneHint')}</p><p className="text-xs mt-1 opacity-70">{t('dropzoneFormats')}</p></div>
                          </ImageDropzone>
                        )}
                    </section>
                    <section>
                        <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('chooseAspectRatio')}</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            {EXTEND_RATIO_OPTIONS.map(ratio => (
                                <button 
                                    key={ratio} 
                                    onClick={() => setAspectRatio(ratio)} 
                                    className={`py-2 px-2 text-center rounded-md border transition-all ${
                                        aspectRatio === ratio 
                                        ? 'neva-primary-button border-white/10 text-slate-950 shadow-lg shadow-cyan-500/20' 
                                        : `${theme.inputBg} ${theme.textMain} hover:bg-white/10 ${theme.border}`
                                    }`}
                                >
                                    {ASPECT_RATIO_LABELS[ratio]}
                                </button>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('imageCount')}</h3>
                        <div className={`flex items-center justify-between ${theme.inputBg} rounded-md p-2 border ${theme.border}`}>
                            <button onClick={() => setImageCount(Math.max(1, imageCount - 1))} className={`px-4 py-2 rounded text-xl font-bold ${theme.buttonSecondary} ${theme.textMain}`}>-</button>
                            <span className={`text-lg font-semibold ${theme.textMain}`}>{imageCount}</span>
                            <button onClick={() => setImageCount(Math.min(4, imageCount + 1))} className={`px-4 py-2 rounded text-xl font-bold ${theme.buttonSecondary} ${theme.textMain}`}>+</button>
                        </div>
                    </section>
                    <button onClick={handleGenerate} disabled={isLoading || !sourceImage} className="w-full neva-primary-button font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed text-base">
                        <Icon name="sparkles" className="w-5 h-5" />
                        {isLoading ? t('generating') : t('generateExtendedView')}
                    </button>
                </div>
                <div className={`lg:col-span-8 ${theme.inputBg} rounded-lg min-h-[60vh] flex items-center justify-center p-4 border ${theme.border}`}>
                    {isLoading ? (
                        <div className={`text-center ${theme.textSub}`}>
                            <Icon name="sparkles" className="w-12 h-12 animate-spin text-cyan-300 mx-auto mb-4" />
                            <p>{t('generatingExtendedView')}...</p>
                        </div>
                    ) : generatedImages.length > 0 && selectedImage ? (
                       <div className="flex flex-col h-full w-full">
                            <div className="flex-grow flex items-center justify-center relative group bg-black/30 rounded-lg overflow-hidden">
                                <img src={selectedImage} alt="Selected Extended View" className="max-w-full max-h-[65vh] object-contain" />
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button onClick={() => selectedImage && setFullscreenImage(selectedImage)} className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-2.5 rounded-full" title={t('fullscreen')}>
                                        <Icon name="arrows-pointing-out" className="w-5 h-5" />
                                    </button>
                                    <a href={selectedImage} download={`neva-studio-extended-${Date.now()}.png`} className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-2.5 rounded-full inline-flex" title={t('downloadImage')}>
                                        <Icon name="download" className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                            {generatedImages.length > 1 && (
                                <div className={`flex-shrink-0 mt-4 grid grid-cols-${Math.min(generatedImages.length, 4)} gap-2`}>
                                    {generatedImages.map((image, index) => (
                                        <div key={index} className={`relative cursor-pointer rounded-md overflow-hidden transition-all duration-200 h-28 ${selectedImage === image ? 'ring-2 ring-cyan-300/70' : 'opacity-60 hover:opacity-100'}`} onClick={() => setSelectedImage(image)}>
                                            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`text-center ${theme.textSub}`}>
                            <Icon name="arrows-pointing-out" className="w-16 h-16 mx-auto mb-4" />
                            <h3 className={`text-xl font-semibold ${theme.textMain}`}>{t('extendViewEmptyHeader')}</h3>
                            <p className="mt-2">{t('extendViewEmptyText')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
