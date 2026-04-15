import React from 'react';
import type { HistoryItem } from '../types';
import { Icon } from './icons';
import { sourceImageToDataUrl } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryPanelProps {
    history: HistoryItem[];
    onRestore: (item: HistoryItem) => void;
    onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onRestore, onClear }) => {
    const { t } = useLanguage();

    const handleClear = () => {
        if (window.confirm(t('clearHistoryConfirm'))) {
            onClear();
        }
    };

    return (
        <section className="mx-auto mt-8 max-w-[1800px]">
            <div className="mb-4 flex items-end justify-between px-1">
                <div>
                    <h2 className="flex items-center gap-2 font-['Space_Grotesk'] text-sm uppercase tracking-[0.28em] text-slate-200">
                        <Icon name="clock" className="h-5 w-5 text-cyan-300" />
                        {t('history')}
                    </h2>
                    <p className="neva-text-sub mt-2 text-xs">{t('historyPerformanceTip')}</p>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="neva-btn-secondary flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-medium transition-all hover:text-red-300"
                        title={t('clearHistoryConfirm')}
                    >
                        <Icon name="trash" className="h-4 w-4" />
                        <span>{t('clearAll')}</span>
                    </button>
                )}
            </div>
            {history.length > 0 ? (
                <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                    {history.map(item => {
                        const thumbnailUrl = item.generatedImages.length > 0
                            ? item.generatedImages[0]
                            : item.sourceImage
                            ? sourceImageToDataUrl(item.sourceImage)
                            : '';
                        
                        return (
                            <div
                                key={item.id}
                                className="neva-panel group flex w-56 flex-shrink-0 cursor-pointer overflow-hidden rounded-[24px] transition-all duration-200 hover:-translate-y-1 hover:border-cyan-300/30"
                                onClick={() => onRestore(item)}
                            >
                                <div className="w-full">
                                    <div className="relative">
                                        <img
                                            src={thumbnailUrl}
                                            alt="History thumbnail"
                                            className="h-36 w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/25 to-transparent"></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                            <p className="font-['Space_Grotesk'] text-xs uppercase tracking-[0.24em] text-white">{t('review')}</p>
                                        </div>
                                        <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-[#020617]/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md">
                                            {item.tab === 'prompt' ? t('prompts') : `${item.imageCount} ${t('images')}`}
                                        </span>
                                    </div>
                                    <div className="p-3">
                                        <p className="neva-text-sub line-clamp-2 text-xs" title={item.prompt}>{item.prompt}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="neva-panel rounded-[24px] p-6 text-center">
                    <p className="neva-text-sub">{t('historyEmpty')}</p>
                </div>
            )}
        </section>
    );
};
