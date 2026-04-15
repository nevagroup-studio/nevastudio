
import React, { useState } from 'react';
import type { LibraryItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './icons';

interface LibraryViewProps {
  images: LibraryItem[];
  onDelete: (id: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
  onClearAll: () => void;
  onUseAsSource: (imageData: string) => void;
  onFullscreen: (index: number) => void;
  justSavedId: string | null;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ 
    images, 
    onDelete, 
    onDeleteMultiple, 
    onClearAll, 
    onUseAsSource, 
    onFullscreen, 
    justSavedId 
}) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === images.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(images.map(img => img.id));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(t('deleteSelected') + '?')) {
            onDeleteMultiple(selectedIds);
            setSelectedIds([]);
            setIsSelectionMode(false);
        }
    };

    const handleClearAll = () => {
        if (window.confirm(t('confirmClearLibrary'))) {
            onClearAll();
            setSelectedIds([]);
            setIsSelectionMode(false);
        }
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        if (isSelectionMode) {
            setSelectedIds([]);
        }
    };

    if (images.length === 0) {
        return (
            <div className={`lg:col-span-12 ${theme.panelBg} p-6 rounded-xl border ${theme.border} min-h-[70vh] flex flex-col items-center justify-center text-center text-slate-500`}>
                <Icon name="heart" className="w-16 h-16 mb-4 text-slate-600" />
                <h3 className={`text-xl font-semibold ${theme.textSub}`}>
                    {t('libraryEmptyHeader')}
                </h3>
                <p className="mt-2">
                    {t('libraryEmptyText')}
                </p>
            </div>
        );
    }

    return (
        <div className="lg:col-span-12 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleSelectionMode}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                            isSelectionMode 
                            ? 'neva-primary-button border-white/10 text-slate-950 shadow-lg shadow-cyan-500/20' 
                            : `${theme.panelBg} ${theme.border} ${theme.textSub} hover:border-cyan-300/30`
                        }`}
                    >
                        <Icon name={isSelectionMode ? "x-mark" : "check-circle"} className="w-5 h-5" />
                        <span className="font-medium">{isSelectionMode ? t('cancelSelection') : t('selectMultiple')}</span>
                    </button>

                    {isSelectionMode && (
                        <button 
                            onClick={handleSelectAll}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.panelBg} ${theme.border} ${theme.textSub} hover:border-cyan-300/30 transition-all`}
                        >
                            <Icon name="squares-plus" className="w-5 h-5" />
                            <span className="font-medium">
                                {selectedIds.length === images.length ? t('deselectAll') || 'Bỏ chọn tất cả' : t('selectAll') || 'Chọn tất cả'}
                            </span>
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {isSelectionMode && selectedIds.length > 0 && (
                        <button 
                            onClick={handleDeleteSelected}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all animate-in fade-in slide-in-from-right-4"
                        >
                            <Icon name="trash" className="w-5 h-5" />
                            <span className="font-medium">{t('deleteSelected')} ({selectedIds.length})</span>
                        </button>
                    )}
                    
                    <button 
                        onClick={handleClearAll}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all`}
                    >
                        <Icon name="trash" className="w-5 h-5" />
                        <span className="font-medium">{t('deleteAll')}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {images.map((item, index) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                        <div 
                            key={item.id} 
                            className={`flex flex-col group aspect-square ${theme.panelBg} rounded-xl overflow-hidden shadow-xl border ${
                                isSelected ? 'border-cyan-300/50 ring-2 ring-cyan-300/30' : theme.border
                            } transition-all duration-300 hover:border-cyan-300/30 relative cursor-pointer`}
                            onClick={() => isSelectionMode && toggleSelection(item.id)}
                        >
                            <div className="relative flex-grow overflow-hidden">
                                <img src={item.imageData} alt="Saved in library" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                
                                {isSelectionMode && (
                                    <div className={`absolute top-3 left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center z-20 transition-all ${
                                        isSelected ? 'bg-cyan-400 border-cyan-200' : 'bg-black/40 border-white/50'
                                    }`}>
                                        {isSelected && <Icon name="check" className="w-4 h-4 text-white" />}
                                    </div>
                                )}

                                {justSavedId === item.id && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center animate-pulse-once z-10">
                                        <p className="text-white font-bold text-lg">{t('saved')}</p>
                                    </div>
                                )}
                                
                                {!isSelectionMode && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <div className="flex justify-center items-center gap-3">
                                            <button onClick={(e) => { e.stopPropagation(); onFullscreen(index); }} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white p-2.5 rounded-full transition-all hover:scale-110" title={t('fullscreen')}>
                                                <Icon name="arrows-pointing-out" className="w-5 h-5" />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); onUseAsSource(item.imageData); }} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white p-2.5 rounded-full transition-all hover:scale-110" title={t('useAsSource')}>
                                                <Icon name="arrow-up-tray" className="w-5 h-5" />
                                            </button>
                                            <a href={item.imageData} download={`library-image-${item.id}.png`} onClick={(e) => e.stopPropagation()} className="neva-primary-button p-2.5 rounded-full transition-all hover:scale-110" title={t('downloadImage')}>
                                                <Icon name="download" className="w-5 h-5" />
                                            </a>
                                            <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="bg-red-600/80 backdrop-blur-md border border-red-500 hover:bg-red-600 text-white p-2.5 rounded-full transition-all hover:scale-110" title={t('deleteFromLibrary')}>
                                                <Icon name="trash" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {item.prompt && (
                                <div className="p-3 bg-black/20 border-t border-slate-700/30">
                                    <p className="text-[10px] text-slate-400 line-clamp-2 italic leading-tight" title={item.prompt}>
                                        {item.prompt}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
