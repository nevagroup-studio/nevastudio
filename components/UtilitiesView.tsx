
import React, { useState, useEffect } from 'react';
import type { Utility } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './icons';
import { LightingCreator } from './LightingCreator';
import { VirtualTourCreator } from './VirtualTourCreator';
import { ExtendViewCreator } from './ExtendViewCreator';
import { ChangeStyleCreator } from './ChangeStyleCreator';
import { InteriorViewCreator } from './InteriorViewCreator';
import { ArchitectureViewCreator } from './ArchitectureViewCreator';
import { ArchToInteriorCreator } from './ArchToInteriorCreator';
import { InteriorDetailCreator } from './InteriorDetailCreator';
import { SyncViewCreator } from './SyncViewCreator';
import { LightingSimulationCreator } from './LightingSimulationCreator';
import { ConstructionProcessCreator } from './ConstructionProcessCreator';
import { TextureMapCreator } from './TextureMapCreator';
import { TrendView } from './TrendView';
import type { FeatureType as TrendFeatureType } from './TrendView';

interface UtilityToolPlaceholderProps {
    utility: string;
    onBack: () => void;
}

const UtilityToolPlaceholder: React.FC<UtilityToolPlaceholderProps> = ({ utility, onBack }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const titles: Record<string, string> = {
        lighting: t('lightingTitle'),
        virtualTour: t('virtualTourTitle'),
        extendView: t('extendViewTitle'),
        changeStyle: t('changeStyleTitle'),
        interiorView: t('interiorViewTitle'),
        architectureView: t('architectureViewTitle'),
        archToInterior: t('archToInteriorTitle'),
        syncView: t('syncViewTitle'),
        lightingSimulation: t('lightingSimulationTitle'),
        constructionProcess: t('constructionProcessTitle'),
        textureMap: t('textureMapTitle'),
        layout: t('trendLayoutTitle'),
        model: t('trendModelTitle'),
        diagram: t('trendDiagramTitle'),
        analyze: "Poster BDS",
        trendMoodboard: t('trendMoodboardTitle')
    };
    return (
        <div className={`${theme.panelBg} p-5 rounded-xl min-h-[70vh] flex flex-col items-center justify-center text-center border ${theme.border} relative`}>
            <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-slate-300 hover:text-cyan-300 transition-colors">
                <Icon name="arrow-uturn-left" className="w-5 h-5" />
                {t('backToUtilities')}
            </button>
            <Icon name="cpu-chip" className="w-16 h-16 text-slate-500 mb-4" />
            <h2 className={`text-4xl font-bold mb-4 ${theme.textMain}`}>{titles[utility] || utility}</h2>
            <p className={`text-2xl ${theme.textSub} bg-slate-800/50 px-4 py-2 rounded-lg`}>{t('comingSoon')}</p>
        </div>
    );
};

interface UtilityThumbnailProps {
    icon: string;
    title: string;
    description: string;
    bgImage: string;
    onClick: () => void;
}

const UtilityThumbnail: React.FC<UtilityThumbnailProps> = ({ icon, title, description, bgImage, onClick }) => {
    const { theme } = useTheme();
    return (
        <div 
            onClick={onClick}
            className={`group relative h-64 rounded-3xl overflow-hidden cursor-pointer border ${theme.border} hover:border-slate-500 transition-all duration-500 shadow-2xl`}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            
            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end items-start">
                <div className="absolute top-6 left-6 bg-slate-800/80 backdrop-blur-md p-2 rounded-full border border-slate-600">
                    <Icon name={icon} className="w-6 h-6 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-cyan-300 transition-colors">{title}</h2>
                <p className="text-slate-300 text-sm max-w-xs leading-relaxed opacity-90 group-hover:text-white">
                    {description}
                </p>
            </div>
        </div>
    );
};

export const UtilitiesView: React.FC<any> = (props) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const { isProMode, externalActiveUtility, sourceImage, prompt, generatedImages, addImageToLibrary, addHistoryItem, aiModel, setFullscreenData } = props;
    const [activeUtility, setActiveUtility] = useState<Utility | 'canva' | null>(null);

    useEffect(() => {
        if (externalActiveUtility) {
            setActiveUtility(externalActiveUtility);
        }
    }, [externalActiveUtility]);

    const utilities: { id: Utility | 'canva'; icon: string; bgImage: string; proOnly?: boolean }[] = [
        { 
            id: 'lighting', 
            icon: 'sparkles', 
            bgImage: 'https://images.unsplash.com/photo-1513507766391-aa3a70359f4a?q=80&w=2000&auto=format&fit=crop' 
        },
        { 
            id: 'virtualTour', 
            icon: 'globe', 
            bgImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop' 
        },
        { 
            id: 'extendView', 
            icon: 'arrows-pointing-out', 
            bgImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2000&auto=format&fit=crop' 
        },
        { 
            id: 'changeStyle', 
            icon: 'cpu-chip', 
            bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop' 
        },
        { 
            id: 'syncView', 
            icon: 'arrows-pointing-out', 
            bgImage: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=2070&auto=format&fit=crop' 
        },
        { 
            id: 'lightingSimulation', 
            icon: 'sparkles', 
            bgImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop' 
        },
        { 
            id: 'constructionProcess', 
            icon: 'cpu-chip', 
            bgImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop' 
        },
        { 
            id: 'textureMap', 
            icon: 'cpu-chip', 
            bgImage: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2000&auto=format&fit=crop' 
        },
        {
            id: 'layout',
            icon: 'arrow-up-tray',
            bgImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop',
            proOnly: true
        },
        {
            id: 'model',
            icon: 'cpu-chip',
            bgImage: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2000&auto=format&fit=crop',
            proOnly: true
        },
        {
            id: 'diagram',
            icon: 'arrows-pointing-out',
            bgImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop',
            proOnly: true
        },
        {
            id: 'analyze',
            icon: 'sparkles',
            bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop',
            proOnly: true
        },
        {
            id: 'trendMoodboard',
            icon: 'clipboard',
            bgImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
            proOnly: true
        },
    ];

    const getUtilityDisplayInfo = (id: string) => {
        switch(id) {
            case 'lighting': return { title: t('lightingTitle'), desc: t('lightingDesc') };
            case 'virtualTour': return { title: t('virtualTourTitle'), desc: t('virtualTourDesc') };
            case 'extendView': return { title: t('extendViewTitle'), desc: t('extendViewDesc') };
            case 'changeStyle': return { title: t('changeStyleTitle'), desc: t('changeStyleDesc') };
            case 'interiorView': return { title: t('interiorViewTitle'), desc: t('interiorViewDesc') };
            case 'architectureView': return { title: t('architectureViewTitle'), desc: t('architectureViewDesc') };
            case 'archToInterior': return { title: t('archToInteriorTitle'), desc: t('archToInteriorDesc') };
            case 'interiorDetailView': return { title: t('interiorDetailTitle'), desc: t('interiorDetailDesc') };
            case 'syncView': return { title: t('syncViewTitle'), desc: t('syncViewDesc') };
            case 'lightingSimulation': return { title: t('lightingSimulationTitle'), desc: t('lightingSimulationDesc') };
            case 'constructionProcess': return { title: t('constructionProcessTitle'), desc: t('constructionProcessDesc') };
            case 'textureMap': return { title: t('textureMapTitle'), desc: t('textureMapDesc') };
            case 'layout': return { title: t('trendLayoutTitle'), desc: t('trendLayoutDesc') };
            case 'model': return { title: t('trendModelTitle'), desc: t('trendModelDesc') };
            case 'diagram': return { title: t('trendDiagramTitle'), desc: t('trendDiagramDesc') };
            case 'analyze': return { title: "Poster BDS", desc: "Tạo poster quảng cáo bất động sản chuyên nghiệp." };
            case 'trendMoodboard': return { title: t('trendMoodboardTitle'), desc: t('trendMoodboardDesc') };
            default: return { title: id, desc: "" };
        }
    };

    if (activeUtility) {
        let utilityComponent;
        switch(activeUtility) {
            case 'lighting':
                utilityComponent = <LightingCreator onBack={() => setActiveUtility(null)} {...props} />;
                break;
            case 'virtualTour':
                utilityComponent = <VirtualTourCreator onBack={() => setActiveUtility(null)} {...props} />;
                break;
            case 'extendView':
                utilityComponent = <ExtendViewCreator onBack={() => setActiveUtility(null)} {...props} />;
                break;
            case 'changeStyle':
                utilityComponent = <ChangeStyleCreator onBack={() => setActiveUtility(null)} {...props} />;
                break;
            case 'interiorView':
                utilityComponent = <InteriorViewCreator onBack={() => setActiveUtility(null)} addImageToLibrary={addImageToLibrary} addHistoryItem={addHistoryItem} aiModel={aiModel} setFullscreenData={setFullscreenData} />;
                break;
            case 'architectureView':
                utilityComponent = <ArchitectureViewCreator onBack={() => setActiveUtility(null)} addImageToLibrary={addImageToLibrary} addHistoryItem={addHistoryItem} aiModel={aiModel} setFullscreenData={setFullscreenData} />;
                break;
            case 'archToInterior':
                utilityComponent = <ArchToInteriorCreator onBack={() => setActiveUtility(null)} addImageToLibrary={addImageToLibrary} addHistoryItem={addHistoryItem} aiModel={aiModel} setFullscreenData={setFullscreenData} />;
                break;
            case 'interiorDetailView':
                utilityComponent = <InteriorDetailCreator onBack={() => setActiveUtility(null)} addImageToLibrary={addImageToLibrary} addHistoryItem={addHistoryItem} aiModel={aiModel} setFullscreenData={setFullscreenData} />;
                break;
            case 'syncView':
                utilityComponent = <SyncViewCreator onBack={() => setActiveUtility(null)} addImageToLibrary={addImageToLibrary} addHistoryItem={addHistoryItem} aiModel={aiModel} setFullscreenData={setFullscreenData} />;
                break;
            case 'lightingSimulation':
                utilityComponent = <LightingSimulationCreator onBack={() => setActiveUtility(null)} addImageToLibrary={addImageToLibrary} addHistoryItem={addHistoryItem} aiModel={aiModel} setFullscreenData={setFullscreenData} />;
                break;
            case 'constructionProcess':
                utilityComponent = <ConstructionProcessCreator onBack={() => setActiveUtility(null)} addImageToLibrary={addImageToLibrary} addHistoryItem={addHistoryItem} aiModel={aiModel} setFullscreenData={setFullscreenData} />;
                break;
            case 'textureMap':
                utilityComponent = <TextureMapCreator onBack={() => setActiveUtility(null)} addImageToLibrary={addImageToLibrary} addHistoryItem={addHistoryItem} aiModel={aiModel} setFullscreenData={setFullscreenData} />;
                break;
            case 'layout':
            case 'model':
            case 'diagram':
            case 'analyze':
            case 'trendMoodboard':
                utilityComponent = (
                    <TrendView 
                        onBack={() => setActiveUtility(null)} 
                        initialFeature={activeUtility === 'trendMoodboard' ? 'moodboard' : activeUtility as TrendFeatureType}
                        {...props}
                        restoredSourceImage={sourceImage}
                        restoredPrompt={prompt}
                        restoredImages={generatedImages}
                    />
                );
                break;
            default:
                utilityComponent = <UtilityToolPlaceholder utility={activeUtility} onBack={() => setActiveUtility(null)} />;
                break;
        }
        return (
            <div className="lg:col-span-12">
                {utilityComponent}
            </div>
        );
    }

    return (
        <div className="lg:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {utilities.filter(u => !u.proOnly || isProMode).map(util => {
                    const info = getUtilityDisplayInfo(util.id);
                    return (
                        <UtilityThumbnail 
                            key={util.id}
                            icon={util.icon}
                            title={info.title}
                            description={info.desc}
                            bgImage={util.bgImage}
                            onClick={() => setActiveUtility(util.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};
