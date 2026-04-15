
import React, { useEffect } from 'react';
import type { SourceImage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Icon } from './icons';
import { ImageDropzone } from './ImageDropzone';
import { sourceImageToDataUrl } from '../utils';

interface ChangeStyleCreatorProps {
    onBack: () => void;
    changeStyleSourceImage: SourceImage | null;
    setChangeStyleSourceImage: (image: SourceImage | null) => void;
    changeStyleUserPrompt: string;
    setChangeStyleUserPrompt: (prompt: string) => void;
    changeStyleGeneratedPrompt: string | null;
    setChangeStyleGeneratedPrompt: (prompt: string | null) => void;
    changeStyleImageCount: number;
    setChangeStyleImageCount: (count: number) => void;
    changeStyleGeneratedImages: string[];
    changeStyleSelectedImage: string | null;
    setChangeStyleSelectedImage: (image: string | null) => void;
    handleStylePromptGeneration: () => void;
    handleStyleImageGeneration: () => void;
    isLoading: boolean;
    loadingMessage: string;
    setFullscreenImage: (url: string | null) => void;
}

export const ChangeStyleCreator: React.FC<ChangeStyleCreatorProps> = ({
    onBack,
    changeStyleSourceImage: sourceImage,
    setChangeStyleSourceImage: setSourceImage,
    changeStyleUserPrompt: userPrompt,
    setChangeStyleUserPrompt: setUserPrompt,
    changeStyleGeneratedPrompt: generatedPrompt,
    setChangeStyleGeneratedPrompt: setGeneratedPrompt,
    changeStyleImageCount: imageCount,
    setChangeStyleImageCount: setImageCount,
    changeStyleGeneratedImages: generatedImages,
    changeStyleSelectedImage: selectedImage,
    setChangeStyleSelectedImage: setSelectedImage,
    handleStylePromptGeneration,
    handleStyleImageGeneration,
    isLoading,
    loadingMessage,
    setFullscreenImage,
}) => {
    const { t } = useLanguage();

    useEffect(() => {
        if (generatedImages.length > 0 && !selectedImage) {
            setSelectedImage(generatedImages[0]);
        }
    }, [generatedImages, selectedImage, setSelectedImage]);

    return (
        <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/50 animate-fade-in">
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
                     <Icon name="cpu-chip" className="w-8 h-8 text-cyan-300" />
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">{t('changeStyleTitle')}</h2>
                        <p className="text-sm text-slate-400">{t('changeStyleDesc')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-6">
                    <section>
                        <h3 className="font-semibold text-slate-300 mb-3">{t('uploadImageForStyleChange')}</h3>
                        {sourceImage ? (
                          <div className='space-y-3'>
                              <ImageDropzone onImageUpload={setSourceImage} className="cursor-pointer rounded-lg">
                                <div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(sourceImage)} alt="Source for style change" className="w-full h-auto object-contain rounded" /></div>
                              </ImageDropzone>
                              <button onClick={() => setSourceImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                          </div>
                        ) : (
                          <ImageDropzone onImageUpload={setSourceImage} className='w-full h-40 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-center text-slate-400 text-sm cursor-pointer'>
                              <div><p>{t('dropzoneHint')}</p><p className="text-xs mt-1 text-slate-500">{t('dropzoneFormats')}</p></div>
                          </ImageDropzone>
                        )}
                    </section>
                    
                    <section>
                         <h3 className="font-semibold text-slate-300 mb-2">{t('enterStyleRequest')}</h3>
                         <textarea
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                            placeholder={t('styleRequestPlaceholder')}
                            className="w-full bg-slate-900/70 p-3 rounded-md h-24 resize-none text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none border border-slate-700"
                        />
                        <button onClick={handleStylePromptGeneration} disabled={isLoading || !sourceImage || !userPrompt} className="mt-2 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-sm">
                            <Icon name="sparkles" className="w-4 h-4" />
                            {isLoading && loadingMessage === t('generatingStylePrompt') ? t('generating') : t('generateNewPromptButton')}
                        </button>
                    </section>

                    <section>
                        <h3 className="font-semibold text-slate-300 mb-2">{t('generatedPromptReady')}</h3>
                         <textarea
                            value={generatedPrompt || ''}
                            onChange={(e) => setGeneratedPrompt(e.target.value)}
                            placeholder="..."
                            className="w-full bg-slate-900/70 p-3 rounded-md h-28 resize-none text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none border border-slate-700"
                        />
                    </section>

                    <section>
                        <h3 className="font-semibold text-slate-300 mb-2">{t('imageCount')}</h3>
                        <div className="flex items-center justify-between bg-slate-900/70 rounded-md p-2">
                            <button onClick={() => setImageCount(Math.max(1, imageCount - 1))} className="px-4 py-2 rounded text-xl font-bold hover:bg-slate-700">-</button>
                            <span className="text-lg font-semibold">{imageCount}</span>
                            <button onClick={() => setImageCount(Math.min(4, imageCount + 1))} className="px-4 py-2 rounded text-xl font-bold hover:bg-slate-700">+</button>
                        </div>
                    </section>
                   
                    <button onClick={handleStyleImageGeneration} disabled={isLoading || !sourceImage || !generatedPrompt} className="w-full neva-primary-button font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed text-base">
                        <Icon name="camera" className="w-5 h-5" />
                        {isLoading && loadingMessage === t('generatingStyledImages') ? t('generating') : t('generateStyledImageButton')}
                    </button>
                </div>
                <div className="lg:col-span-8 bg-slate-900/50 rounded-lg min-h-[60vh] flex items-center justify-center p-4 border border-slate-700">
                    {isLoading ? (
                        <div className="text-center text-slate-400">
                            <Icon name="sparkles" className="w-12 h-12 animate-spin text-cyan-300 mx-auto mb-4" />
                            <p>{loadingMessage || t('generating')}...</p>
                        </div>
                    ) : generatedImages.length > 0 && selectedImage ? (
                       <div className="flex flex-col h-full w-full">
                            <div className="flex-grow flex items-center justify-center relative group bg-black/30 rounded-lg overflow-hidden">
                                <img src={selectedImage} alt="Selected Styled Image" className="max-w-full max-h-[65vh] object-contain" />
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button onClick={() => selectedImage && setFullscreenImage(selectedImage)} className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-2.5 rounded-full" title={t('fullscreen')}>
                                        <Icon name="arrows-pointing-out" className="w-5 h-5" />
                                    </button>
                                    <a href={selectedImage} download={`neva-studio-styled-${Date.now()}.png`} className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-2.5 rounded-full inline-flex" title={t('downloadImage')}>
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
                        <div className="text-center text-slate-500">
                            <Icon name="cpu-chip" className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-400">{t('changeStyleTitle')}</h3>
                            <p className="mt-2">{t('changeStyleDesc')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
