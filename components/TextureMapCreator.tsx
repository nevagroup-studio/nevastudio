
import React, { useState, useEffect, useRef } from 'react';
import type { SourceImage, HistoryItem, ImageSize, TextureMapType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './icons';
import { ImageDropzone } from './ImageDropzone';
import { sourceImageToDataUrl } from '../utils';
import { generateTextureMapSet } from '../services/geminiService';
import { AreaSelector } from './ArrowEditor';

interface TextureMapCreatorProps {
    onBack: () => void;
    addImageToLibrary: (imageDataUrl: string, prompt?: string) => Promise<void>;
    addHistoryItem: (item: Omit<HistoryItem, 'id'>) => Promise<void>;
    aiModel: string;
    setFullscreenData: (images: string[], index: number) => void;
}

interface MapResult {
    type: TextureMapType;
    url: string | null;
    isLoading: boolean;
}

export const TextureMapCreator: React.FC<TextureMapCreatorProps> = ({ 
    onBack, addImageToLibrary, addHistoryItem, aiModel, setFullscreenData 
}) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
    const [croppedTexture, setCroppedTexture] = useState<SourceImage | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageSize, setImageSize] = useState<ImageSize>('1K');
    const areaSelectorRef = useRef<{ clear: () => void }>(null);

    const mapTypes: TextureMapType[] = ['Diffuse', 'Normal', 'Displacement', 'Roughness', 'AO'];
    const [selectedMapTypes, setSelectedMapTypes] = useState<TextureMapType[]>(['Diffuse', 'Normal']);
    const [results, setResults] = useState<MapResult[]>(
        mapTypes.map(type => ({ type, url: null, isLoading: false }))
    );

    const handleAreaSelected = (cropped: SourceImage | null) => {
        setCroppedTexture(cropped);
        // Reset kết quả cũ khi có vùng chọn mới
        setResults(mapTypes.map(type => ({ type, url: null, isLoading: false })));
    };

    const toggleMapType = (type: TextureMapType) => {
        setSelectedMapTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleGenerate = async () => {
        const textureToUse = croppedTexture || sourceImage;
        if (!textureToUse || selectedMapTypes.length === 0) return;
        
        setIsGenerating(true);
        // Đặt trạng thái loading cho các map đã chọn
        setResults(mapTypes.map(type => ({ 
            type, 
            url: null, 
            isLoading: selectedMapTypes.includes(type) 
        })));

        const generatedUrls: string[] = [];

        try {
            await generateTextureMapSet(textureToUse, selectedMapTypes, language, imageSize, aiModel, (mapType, imageUrl) => {
                setResults(prev => prev.map(r => 
                    r.type === mapType ? { ...r, url: imageUrl, isLoading: false } : r
                ));
                generatedUrls.push(imageUrl);
                addImageToLibrary(imageUrl, `Material Map: ${mapType}`);
            });

            if (generatedUrls.length > 0) {
                 await addHistoryItem({
                    tab: 'utilities',
                    sourceImage: textureToUse,
                    referenceImage: null,
                    prompt: `[Texture Map Creator] Generated PBR maps: ${selectedMapTypes.join(', ')} with size ${imageSize}`,
                    imageCount: generatedUrls.length,
                    generatedImages: generatedUrls,
                    generatedPrompts: null,
                });
            }
        } catch (error) {
            console.error("Texture Map Generation failed:", error);
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
                        <Icon name="cpu-chip" className="w-8 h-8 text-cyan-300" />
                        <div>
                            <h2 className={`text-2xl font-bold ${theme.textMain}`}>{t('textureMapTitle')}</h2>
                            <p className={`text-sm ${theme.textSub}`}>{t('textureMapDesc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-1 flex items-center gap-2`}>
                             <span className="w-6 h-6 rounded-full bg-cyan-400/18 text-cyan-100 flex items-center justify-center text-xs">1</span>
                             {t('textureMapStep1')}
                        </h3>
                        {sourceImage ? (
                            <div className='space-y-3 ml-8 mt-2'>
                                <ImageDropzone onImageUpload={setSourceImage} className="cursor-pointer rounded-lg">
                                    <div className='bg-black/30 rounded-lg p-2 border border-slate-700'>
                                        <img src={sourceImageToDataUrl(sourceImage)} alt="Material" className="w-full h-auto object-contain rounded" />
                                    </div>
                                </ImageDropzone>
                                <div className="flex gap-2">
                                    <button onClick={() => { setSourceImage(null); setCroppedTexture(null); }} className='flex-1 text-red-400 hover:text-red-500 text-xs px-3 py-2 rounded-md hover:bg-red-500/10 border border-red-500/20'>{t('delete')}</button>
                                    <button onClick={() => setCroppedTexture(null)} className='flex-1 text-cyan-300 hover:text-cyan-200 text-xs px-3 py-2 rounded-md hover:bg-cyan-400/10 border border-cyan-300/20'>Vẽ lại vùng chọn</button>
                                </div>
                            </div>
                        ) : (
                            <div className="ml-8 mt-2">
                                <ImageDropzone onImageUpload={setSourceImage} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer hover:border-cyan-300/30 transition-colors`}>
                                    <div><p>{t('dropzoneHint')}</p><p className="text-xs mt-1 opacity-70">{t('dropzoneFormats')}</p></div>
                                </ImageDropzone>
                            </div>
                        )}
                    </section>

                    {/* Hiển thị vùng đã chọn (Cập nhật tức thì) */}
                    {croppedTexture && (
                        <section className="bg-slate-900/30 p-4 rounded-xl border border-green-500/30 animate-fade-in">
                            <h3 className={`font-semibold text-green-400 mb-2 flex items-center gap-2`}>
                                <Icon name="check" className="w-4 h-4" />
                                Vùng vật liệu đã chọn
                            </h3>
                            <div className="ml-8 bg-black/50 rounded-lg p-2 border border-slate-700 inline-block">
                                <img src={sourceImageToDataUrl(croppedTexture)} alt="Cropped preview" className="w-32 h-auto rounded shadow-lg" />
                            </div>
                        </section>
                    )}

                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-2 flex items-center gap-2`}>
                             <span className="w-6 h-6 rounded-full bg-cyan-400/18 text-cyan-100 flex items-center justify-center text-xs">2</span>
                             {t('textureMapStep3')}
                        </h3>
                        <div className="ml-8 flex flex-wrap gap-2">
                            {mapTypes.map(type => (
                                <button 
                                    key={type} 
                                    onClick={() => toggleMapType(type)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                        selectedMapTypes.includes(type)
                                        ? 'neva-primary-button border-white/10 text-slate-950 shadow-lg shadow-cyan-500/20'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                        <h3 className={`font-semibold ${theme.textMain} mb-2 flex items-center gap-2`}>
                             <span className="w-6 h-6 rounded-full bg-cyan-400/18 text-cyan-100 flex items-center justify-center text-xs">3</span>
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

                    <div className="ml-8 space-y-4">
                        {sourceImage && (
                            <p className={`text-[10px] italic ${croppedTexture ? 'text-green-400 font-bold' : 'text-slate-500'}`}>
                                {croppedTexture ? "✓ Vùng chọn đã sẵn sàng." : "💡 Mẹo: Dùng chuột khoanh vùng trực tiếp trên ảnh bên phải để lấy phần vật liệu đẹp nhất."}
                            </p>
                        )}
                        <button 
                            onClick={handleGenerate} 
                            disabled={isGenerating || !sourceImage || selectedMapTypes.length === 0} 
                            className="w-full neva-primary-button font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-xl shadow-cyan-950/20"
                        >
                            <Icon name="sparkles" className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                            {isGenerating ? t('generating') : t('generateMaps')}
                        </button>
                    </div>
                </div>

                {/* Main Workspace / Results View */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Luồng 1: Tải ảnh xong tự hiện giao diện crop */}
                    {sourceImage && !isGenerating && !results.some(r => r.url) && (
                        <div className={`relative bg-black/40 rounded-xl border ${theme.border} flex items-center justify-center overflow-hidden p-2 shadow-inner`} style={{ minHeight: '50vh' }}>
                            <img src={sourceImageToDataUrl(sourceImage)} alt="Material workspace" className="max-w-full max-h-[60vh] object-contain opacity-90" />
                            {/* Giao diện crop tự động hiện khi !croppedTexture */}
                            {!croppedTexture ? (
                                <div className="absolute inset-0 z-10">
                                    <AreaSelector ref={areaSelectorRef} sourceImage={sourceImage} onAreaSelected={handleAreaSelected} />
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-400/90 text-slate-950 text-xs font-bold px-4 py-2 rounded-full shadow-2xl animate-bounce flex items-center gap-2 pointer-events-none">
                                        <Icon name="pencil" className="w-4 h-4" />
                                        Hãy khoanh vùng vật liệu cần lấy map
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-600/90 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
                                    <span>Đã chọn vùng xong</span>
                                    <div className="w-px h-3 bg-white/30"></div>
                                    <button onClick={() => setCroppedTexture(null)} className="hover:text-red-200 underline uppercase tracking-tighter">Chọn lại</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Luồng 2: Hiển thị kết quả Map sau khi tạo */}
                    {(isGenerating || results.some(r => r.url)) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                            {results.filter(r => selectedMapTypes.includes(r.type) || r.url).map((map, idx) => (
                                <div key={idx} className={`relative rounded-xl overflow-hidden border ${theme.border} ${theme.inputBg} group shadow-lg aspect-square`}>
                                    {map.url ? (
                                        <>
                                            <img 
                                                src={map.url} 
                                                alt={map.type} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in" 
                                                onClick={() => handleImageClick(idx)}
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pointer-events-none">
                                                <p className="text-xs font-bold text-white uppercase tracking-widest">{map.type}</p>
                                            </div>
                                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a 
                                                    href={map.url} 
                                                    download={`material-${map.type.toLowerCase()}-${Date.now()}.png`} 
                                                    className="neva-primary-button p-2.5 rounded-lg flex items-center justify-center"
                                                >
                                                    <Icon name="download" className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </>
                                    ) : map.isLoading ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-black/20">
                                            <Icon name="sparkles" className="w-8 h-8 text-cyan-300 animate-spin" />
                                            <p className="text-[10px] text-slate-400 font-bold animate-pulse uppercase">{map.type}</p>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!sourceImage && (
                        <div className={`bg-slate-900/50 rounded-xl border ${theme.border} min-h-[60vh] flex items-center justify-center p-4 relative`}>
                            <div className="text-center opacity-30">
                                <Icon name="cpu-chip" className="w-24 h-24 text-slate-600 mx-auto mb-4" />
                                <p className={`text-lg font-bold uppercase tracking-widest ${theme.textSub}`}>{t('textureMapEmptyHeader')}</p>
                                <p className="text-sm">{t('textureMapEmptyText')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
