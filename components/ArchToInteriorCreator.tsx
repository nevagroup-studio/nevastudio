
import React, { useState, useEffect } from 'react';
import type { SourceImage, HistoryItem, AspectRatio, ImageSize } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './icons';
import { ImageDropzone } from './ImageDropzone';
import { sourceImageToDataUrl } from '../utils';
import { generateArchToInteriorSet } from '../services/geminiService';
import { translations } from '../locales/translations';

interface ArchToInteriorCreatorProps {
    onBack: () => void;
    addImageToLibrary: (imageDataUrl: string, prompt?: string) => Promise<void>;
    addHistoryItem: (item: Omit<HistoryItem, 'id'>) => Promise<void>;
    aiModel: string;
    setFullscreenData: (images: string[], index: number) => void;
}

interface RoomResult {
    name: string;
    url: string | null;
    isLoading: boolean;
}

export const ArchToInteriorCreator: React.FC<ArchToInteriorCreatorProps> = ({ onBack, addImageToLibrary, addHistoryItem, aiModel, setFullscreenData }) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
    const [characterImage, setCharacterImage] = useState<SourceImage | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('auto');
    const [imageSize, setImageSize] = useState<ImageSize>('1K');
    const [sourceRatio, setSourceRatio] = useState<string>('16/9');
    
    const { ASPECT_RATIO_LABELS } = (translations[language] as any).constants;
    const EXTEND_RATIO_OPTIONS: AspectRatio[] = ['auto', '1:1', '4:3', '3:4', '16:9', '9:16', '2:3', '3:2'];

    const roomNames = [
        t('roomLiving'), t('roomBedroom'), t('roomKitchen'),
        t('roomDining'), t('roomStudy'), t('roomBath'),
        t('roomHall'), t('roomDetail'), t('roomOutdoor')
    ];

    const [results, setResults] = useState<RoomResult[]>(
        roomNames.map(name => ({ name, url: null, isLoading: false }))
    );

    useEffect(() => {
        if (sourceImage) {
            const img = new Image();
            img.src = sourceImageToDataUrl(sourceImage);
            img.onload = () => {
                setSourceRatio(`${img.naturalWidth}/${img.naturalHeight}`);
            };
        } else {
            setSourceRatio('16/9');
        }
    }, [sourceImage]);

    const handleGenerate = async () => {
        if (!sourceImage) return;
        
        setIsGenerating(true);
        setResults(roomNames.map(name => ({ name, url: null, isLoading: true })));

        try {
            await generateArchToInteriorSet(sourceImage, language, aspectRatio, imageSize, characterImage, aiModel, (roomName, imageUrl) => {
                setResults(prev => prev.map(r => 
                    r.name === roomName ? { ...r, url: imageUrl, isLoading: false } : r
                ));
                addImageToLibrary(imageUrl, roomName);
            });

            const finalImages = results.map(r => r.url).filter((url): url is string => url !== null);
            if (finalImages.length > 0) {
                 await addHistoryItem({
                    tab: 'utilities',
                    sourceImage,
                    sourceImage2: characterImage || null,
                    referenceImage: null,
                    prompt: `[Interior from Architecture] Generated 9 interior spaces matching the exterior building style and window system.`,
                    imageCount: finalImages.length,
                    generatedImages: finalImages,
                    generatedPrompts: null,
                });
            }
        } catch (error) {
            console.error("Architecture to Interior failed:", error);
            alert(t('alertGenerationFailed'));
            setResults(prev => prev.map(r => ({ ...r, isLoading: false })));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleImageClick = (index: number) => {
        const imageUrls = results.map(r => r.url).filter((url): url is string => url !== null);
        if (imageUrls.length > 0) {
            const currentUrl = results[index].url;
            if (currentUrl) {
                const urlIndex = imageUrls.indexOf(currentUrl);
                setFullscreenData(imageUrls, urlIndex);
            }
        }
    };

    const downloadAll = () => {
        results.forEach((r) => {
            if (r.url) {
                const link = document.createElement('a');
                link.href = r.url;
                link.download = `arch-interior-${r.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
                link.click();
            }
        });
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
                        <Icon name="sparkles" className="w-8 h-8 text-cyan-300" />
                        <div>
                            <h2 className={`text-2xl font-bold ${theme.textMain}`}>{t('archToInteriorTitle')}</h2>
                            <p className={`text-sm ${theme.textSub}`}>{t('archToInteriorDesc')}</p>
                        </div>
                    </div>
                </div>
                {results.some(r => r.url) && !isGenerating && (
                    <button onClick={downloadAll} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-slate-700 transition-colors">
                        <Icon name="download" className="w-4 h-4" />
                        {t('downloadAll')}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-6">
                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-1 flex items-center gap-2`}>
                             <span className="w-6 h-6 rounded-full bg-cyan-400/18 text-cyan-100 flex items-center justify-center text-xs">1</span>
                             {t('archToInteriorStep1')}
                        </h3>
                        <p className="text-[11px] text-slate-400 mb-3 ml-8">{t('archToInteriorStep1Desc')}</p>
                        {sourceImage ? (
                            <div className='space-y-3 ml-8'>
                                <ImageDropzone onImageUpload={setSourceImage} className="cursor-pointer rounded-lg">
                                    <div className='bg-black/30 rounded-lg p-2 border border-slate-700'><img src={sourceImageToDataUrl(sourceImage)} alt="Architecture Source" className="w-full h-auto object-contain rounded" /></div>
                                </ImageDropzone>
                                <button onClick={() => { setSourceImage(null); setResults(roomNames.map(name => ({ name, url: null, isLoading: false }))); }} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                            </div>
                        ) : (
                            <div className="ml-8">
                                <ImageDropzone onImageUpload={setSourceImage} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer hover:border-cyan-300/30 transition-colors`}>
                                    <div><p>{t('dropzoneHint')}</p><p className="text-xs mt-1 opacity-70">{t('dropzoneFormats')}</p></div>
                                </ImageDropzone>
                            </div>
                        )}
                    </section>

                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-1 flex items-center gap-2`}>
                             <span className="w-6 h-6 rounded-full bg-cyan-400/18 text-cyan-100 flex items-center justify-center text-xs">2</span>
                             {t('archToInteriorStep2')}
                        </h3>
                        <p className="text-[11px] text-slate-400 mb-3 ml-8">{t('archToInteriorStep2Desc')}</p>
                        {characterImage ? (
                            <div className='space-y-3 ml-8'>
                                <ImageDropzone onImageUpload={setCharacterImage} className="cursor-pointer rounded-lg">
                                    <div className='bg-black/30 rounded-lg p-2 border border-slate-700'><img src={sourceImageToDataUrl(characterImage)} alt="Character" className="w-full h-auto object-contain rounded" /></div>
                                </ImageDropzone>
                                <button onClick={() => setCharacterImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                            </div>
                        ) : (
                            <div className="ml-8">
                                <ImageDropzone onImageUpload={setCharacterImage} className={`w-full h-32 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer hover:border-cyan-300/30 transition-colors`}>
                                    <div><p>{t('dropzoneHint')}</p></div>
                                </ImageDropzone>
                            </div>
                        )}
                    </section>

                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-2 flex items-center gap-2 ml-1`}>
                            <Icon name="arrows-pointing-out" className="w-4 h-4 text-cyan-300" />
                            {t('aspectRatio')}
                        </h3>
                        <div className="grid grid-cols-3 gap-2 text-xs ml-8">
                            {EXTEND_RATIO_OPTIONS.map(ratio => (
                                <button 
                                    key={ratio} 
                                    onClick={() => setAspectRatio(ratio)} 
                                    className={`py-2 px-1 text-center rounded-md border transition-all ${
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

                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-2 flex items-center gap-2 ml-1`}>
                            <Icon name="cpu-chip" className="w-4 h-4 text-cyan-300" />
                            {t('imageSize')}
                        </h3>
                        <div className="grid grid-cols-3 gap-2 text-xs ml-8">
                            {['1K', '2K', '4K'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setImageSize(size as ImageSize)}
                                    className={`py-2 px-1 text-center rounded-md border transition-all ${
                                        imageSize === size
                                            ? 'neva-primary-button border-white/10 text-slate-950 shadow-lg shadow-cyan-500/20'
                                            : `${theme.inputBg} ${theme.textMain} hover:bg-white/10 ${theme.border}`
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-1 flex items-center gap-2`}>
                             <span className="w-6 h-6 rounded-full bg-cyan-400/18 text-cyan-100 flex items-center justify-center text-xs">3</span>
                             {t('archToInteriorStep3')}
                        </h3>
                        <p className="text-[11px] text-slate-400 mb-4 ml-8">{t('archToInteriorStep3Desc')}</p>
                        <div className="ml-8">
                            <button 
                                onClick={handleGenerate} 
                                disabled={isGenerating || !sourceImage} 
                                className="w-full neva-primary-button font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-xl shadow-cyan-950/20"
                            >
                                <Icon name="sparkles" className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                                {isGenerating ? t('generating') : t('createImage')}
                            </button>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((room, idx) => (
                            <div key={idx} className={`relative rounded-xl overflow-hidden border ${theme.border} ${theme.inputBg} group shadow-lg`} style={{ aspectRatio: sourceRatio }}>
                                {room.url ? (
                                    <>
                                        <img 
                                            src={room.url} 
                                            alt={room.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in" 
                                            onClick={() => handleImageClick(idx)}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pointer-events-none">
                                            <p className="text-xs font-semibold text-white">{room.name}</p>
                                        </div>
                                        <div className="absolute top-2 right-2 z-10">
                                            <a 
                                                href={room.url} 
                                                download={`arch-interior-${room.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`} 
                                                className="neva-primary-button p-2 rounded-lg flex items-center justify-center gap-1.5"
                                            >
                                                <Icon name="download" className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase pr-0.5">Tải</span>
                                            </a>
                                        </div>
                                    </>
                                ) : room.isLoading ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                        <Icon name="sparkles" className="w-8 h-8 text-cyan-300 animate-spin" />
                                        <p className="text-[10px] text-slate-400 animate-pulse">{room.name}</p>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                                        <Icon name="camera" className="w-10 h-10 text-slate-600 mb-2" />
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{room.name}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
