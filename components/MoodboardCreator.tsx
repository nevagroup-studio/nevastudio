
import React, { useEffect } from 'react';
import type { SourceImage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './icons';
import { ImageDropzone } from './ImageDropzone';
import { sourceImageToDataUrl } from '../utils';

interface MoodboardCreatorProps {
    onBack: () => void;
    moodboardSourceImage: SourceImage | null;
    setMoodboardSourceImage: (image: SourceImage | null) => void;
    moodboardReferenceImage: SourceImage | null;
    setMoodboardReferenceImage: (image: SourceImage | null) => void;
    moodboardPrompt: string;
    setMoodboardPrompt: (prompt: string) => void;
    moodboardImageCount: number;
    setMoodboardImageCount: (count: number) => void;
    moodboardGeneratedImages: string[];
    moodboardSelectedImage: string | null;
    setMoodboardSelectedImage: (image: string | null) => void;
    handleMoodboardGeneration: () => void;
    isLoading: boolean;
}

export const MoodboardCreator: React.FC<MoodboardCreatorProps> = ({
    onBack,
    moodboardSourceImage: sourceImage,
    setMoodboardSourceImage: setSourceImage,
    moodboardReferenceImage: referenceImage,
    setMoodboardReferenceImage: setReferenceImage,
    moodboardPrompt: prompt,
    setMoodboardPrompt: setPrompt,
    moodboardImageCount: imageCount,
    setMoodboardImageCount: setImageCount,
    moodboardGeneratedImages: generatedMoodboards,
    moodboardSelectedImage: selectedMoodboard,
    setMoodboardSelectedImage: setSelectedMoodboard,
    handleMoodboardGeneration: handleGenerate,
    isLoading
}) => {
    const { t } = useLanguage();
    const { theme } = useTheme();

    useEffect(() => {
        if (generatedMoodboards.length > 0 && !selectedMoodboard) {
            setSelectedMoodboard(generatedMoodboards[0]);
        }
    }, [generatedMoodboards, selectedMoodboard, setSelectedMoodboard]);

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
                     <Icon name="clipboard" className="w-8 h-8 text-cyan-300" />
                    <div>
                        <h2 className={`text-2xl font-bold ${theme.textMain}`}>{t('moodboardTitle')}</h2>
                        <p className={`text-sm ${theme.textSub}`}>{t('moodboardDesc')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-6">
                    <section>
                        <h3 className={`font-semibold ${theme.textMain} mb-3`}>{t('uploadInspirationImage')}</h3>
                        {sourceImage ? (
                          <div className='space-y-3'>
                              <ImageDropzone onImageUpload={setSourceImage} className="cursor-pointer rounded-lg">
                                <div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(sourceImage)} alt="Source" className="w-full h-auto object-contain rounded" /></div>
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
                        <h3 className={`font-semibold ${theme.textMain} mb-3`}>{t('uploadReferenceImage')}</h3>
                        <p className={`text-xs ${theme.textSub} -mt-2 mb-3`}>{t('moodboardReferenceHelp')}</p>
                        {referenceImage ? (
                          <div className='space-y-3'>
                              <ImageDropzone onImageUpload={setReferenceImage} className="cursor-pointer rounded-lg">
                                <div className='bg-black/30 rounded-lg p-2'><img src={sourceImageToDataUrl(referenceImage)} alt="Reference" className="w-full h-auto object-contain rounded" /></div>
                              </ImageDropzone>
                              <button onClick={() => setReferenceImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                          </div>
                        ) : (
                          <ImageDropzone onImageUpload={setReferenceImage} className={`w-full h-32 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}>
                              <div><p>{t('dropzoneHint')}</p></div>
                          </ImageDropzone>
                        )}
                    </section>
                    <section>
                         <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('moodboardPromptHelp')}</h3>
                         <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t('promptPlaceholder.create')}
                            className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md h-28 resize-none text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none border ${theme.border}`}
                        />
                        <button 
                            onClick={() => setPrompt(t('moodboardSamplePromptText'))}
                            className="mt-2 text-sm text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 transition-colors"
                        >
                            <Icon name="sparkles" className="w-4 h-4" />
                            <span>{t('moodboardSamplePrompt')}</span>
                        </button>
                    </section>
                     <section>
                        <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('moodboardImageCount')}</h3>
                        <div className={`flex items-center justify-between ${theme.inputBg} rounded-md p-2 border ${theme.border}`}>
                            <button onClick={() => setImageCount(Math.max(1, imageCount - 1))} className={`px-4 py-2 rounded text-xl font-bold ${theme.buttonSecondary} ${theme.textMain}`}>-</button>
                            <span className={`text-lg font-semibold ${theme.textMain}`}>{imageCount}</span>
                            <button onClick={() => setImageCount(Math.min(4, imageCount + 1))} className={`px-4 py-2 rounded text-xl font-bold ${theme.buttonSecondary} ${theme.textMain}`}>+</button>
                        </div>
                    </section>
                    <button onClick={handleGenerate} disabled={isLoading || !sourceImage || !prompt} className="w-full neva-primary-button font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed text-base">
                        <Icon name="sparkles" className="w-5 h-5" />
                        {isLoading ? t('generating') : t('generateMoodboardButton')}
                    </button>
                </div>
                <div className={`lg:col-span-8 ${theme.inputBg} rounded-lg min-h-[60vh] flex items-center justify-center p-4 border ${theme.border}`}>
                    {isLoading ? (
                        <div className={`text-center ${theme.textSub}`}>
                            <Icon name="sparkles" className="w-12 h-12 animate-spin text-cyan-300 mx-auto mb-4" />
                            <p>{t('generating')}...</p>
                        </div>
                    ) : generatedMoodboards.length > 0 && selectedMoodboard ? (
                       <div className="flex flex-col h-full w-full">
                            <div className="flex-grow flex items-center justify-center relative group bg-black/30 rounded-lg overflow-hidden">
                                <img src={selectedMoodboard} alt="Selected Moodboard" className="max-w-full max-h-[65vh] object-contain" />
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a href={selectedMoodboard} download={`neva-studio-moodboard-${Date.now()}.png`} className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-2.5 rounded-full inline-flex" title={t('downloadImage')}>
                                        <Icon name="download" className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                            {generatedMoodboards.length > 1 && (
                                <div className={`flex-shrink-0 mt-4 grid grid-cols-${Math.min(generatedMoodboards.length, 4)} gap-2`}>
                                    {generatedMoodboards.map((image, index) => (
                                        <div key={index} className={`relative cursor-pointer rounded-md overflow-hidden transition-all duration-200 h-28 ${selectedMoodboard === image ? 'ring-2 ring-cyan-300/70' : 'opacity-60 hover:opacity-100'}`} onClick={() => setSelectedMoodboard(image)}>
                                            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`text-center ${theme.textSub}`}>
                            <Icon name="clipboard" className="w-16 h-16 mx-auto mb-4" />
                            <h3 className={`text-xl font-semibold ${theme.textMain}`}>{t('moodboardEmptyHeader')}</h3>
                            <p className="mt-2">{t('moodboardEmptyText')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
