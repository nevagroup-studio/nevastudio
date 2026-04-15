
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import type { HistoryItem } from '../types';
import { Icon } from './icons';

export const WelcomeScreen: React.FC<{ onStart: (mode: 'free' | 'pro') => void; history: HistoryItem[] }> = ({ onStart, history }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setThemeType } = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

    const handleStart = async (mode: 'free' | 'pro') => {
        if (mode === 'pro') {
            const aistudio = (window as any).aistudio;
            if (aistudio) {
                const hasKey = await aistudio.hasSelectedApiKey();
                if (!hasKey) {
                    await aistudio.openSelectKey();
                }
            }
        }
        onStart(mode);
    };

    return (
        <div className={`min-h-screen w-full ${theme.appBg} ${theme.textMain} flex flex-col relative overflow-hidden transition-colors duration-300`}>
            {/* Top Navigation */}
            <div className="w-full max-w-[1800px] mx-auto p-6 flex justify-between items-center z-20 relative">
                {/* Left: Navigation Links */}
                <div className={`flex space-x-8 text-[10px] md:text-xs font-bold tracking-widest ${theme.textSub} uppercase`}>
                    <button onClick={() => {setShowHistory(false); setShowSettings(false)}} className={`hover:${theme.textMain} border-b-2 border-transparent hover:border-current pb-1 transition-colors`}>{t('navHome')}</button>
                    <button onClick={() => {setShowHistory(true); setShowSettings(false)}} className={`hover:${theme.textMain} border-b-2 ${showHistory ? 'border-current text-white' : 'border-transparent'} pb-1 transition-colors`}>{t('navHistory')}</button>
                    <button onClick={() => {setShowSettings(true); setShowHistory(false)}} className={`hover:${theme.textMain} border-b-2 ${showSettings ? 'border-current text-white' : 'border-transparent'} pb-1 transition-colors`}>{t('navSettings')}</button>
                </div>

                {/* Right: Language Switcher */}
                <div className="flex space-x-1">
                    <button
                        onClick={() => setLanguage('vi')}
                        className={`px-2 py-1 text-xs font-bold rounded ${language === 'vi' ? 'bg-red-600 text-white' : `${theme.panelBg} ${theme.textSub} border ${theme.border}`}`}
                    >
                        VN
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-2 py-1 text-xs font-bold rounded ${language === 'en' ? 'neva-primary-button border-white/10 text-slate-950' : `${theme.panelBg} ${theme.textSub} border ${theme.border}`}`}
                    >
                        EN
                    </button>
                </div>
            </div>

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className={`absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] transition-opacity duration-1000 ${theme.id === 'light' ? 'opacity-30' : 'opacity-100'}`}></div>
                <div className={`absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] transition-opacity duration-1000 ${theme.id === 'light' ? 'opacity-30' : 'opacity-100'}`}></div>
            </div>

            {/* History Modal / View */}
            {showHistory && (
                <div className={`fixed inset-0 z-50 ${theme.appBg}/95 backdrop-blur-sm flex flex-col pt-20 px-4 md:px-20 pb-10 overflow-hidden`}>
                     <div className={`flex items-center justify-between mb-6 border-b ${theme.border} pb-4`}>
                        <h2 className="text-2xl font-light tracking-[0.2em] uppercase">{t('history')}</h2>
                        <button onClick={() => setShowHistory(false)} className={`${theme.textSub} hover:${theme.textMain} transition-colors`}>
                            <Icon name="x-circle" className="w-8 h-8" />
                        </button>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto thin-scrollbar">
                         {history.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {history.map((item) => (
                                    item.generatedImages.map((img, idx) => (
                                        <div key={`${item.id}-${idx}`} className={`group relative aspect-square ${theme.panelBg} rounded-xl overflow-hidden border ${theme.border} hover:border-cyan-300/50 transition-all shadow-lg`}>
                                            <img src={img} alt="History item" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center">
                                                <p className="text-xs text-slate-300 line-clamp-3 mb-2">{item.prompt}</p>
                                                <a 
                                                    href={img} 
                                                    download={`history-${item.id}-${idx}.png`}
                                                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                                    title={t('downloadImage')}
                                                >
                                                    <Icon name="download" className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ))}
                            </div>
                         ) : (
                            <div className={`h-full flex flex-col items-center justify-center ${theme.textSub} opacity-50`}>
                                <Icon name="clock" className="w-20 h-20 mb-4" />
                                <p className="text-lg font-light">{t('historyEmpty')}</p>
                            </div>
                         )}
                    </div>
                </div>
            )}

            {/* Settings Modal / View */}
            {showSettings && (
                <div className={`fixed inset-0 z-50 ${theme.appBg}/95 backdrop-blur-sm flex flex-col pt-20 px-4 md:px-20 pb-10 overflow-hidden`}>
                     <div className={`flex items-center justify-between mb-6 border-b ${theme.border} pb-4`}>
                        <h2 className="text-2xl font-light tracking-[0.2em] uppercase">{t('settingsTitle')}</h2>
                        <button onClick={() => setShowSettings(false)} className={`${theme.textSub} hover:${theme.textMain} transition-colors`}>
                            <Icon name="x-circle" className="w-8 h-8" />
                        </button>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto thin-scrollbar max-w-4xl mx-auto w-full">
                        <div className="mb-10">
                            <h3 className={`text-xl font-medium mb-4 flex items-center gap-2 ${theme.textMain}`}>
                                <Icon name="sparkles" className="w-5 h-5" />
                                {t('appearance')}
                            </h3>
                            
                            <div className={`p-6 rounded-xl border ${theme.border} ${theme.panelBg}`}>
                                <label className={`block text-sm font-semibold mb-4 ${theme.textSub}`}>{t('theme')}</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <button 
                                        onClick={() => setThemeType('dark')}
                                        className={`relative h-24 rounded-lg border-2 transition-all overflow-hidden ${theme.id === 'dark' ? 'border-cyan-300/50 ring-2 ring-cyan-300/70/20' : 'border-transparent hover:border-slate-500'}`}
                                    >
                                        <div className="absolute inset-0 bg-[#0f172a]"></div>
                                        <div className="absolute bottom-0 left-0 w-full p-2 bg-black/50 text-white text-xs font-bold text-center">
                                            {t('themeDark')}
                                        </div>
                                        {theme.id === 'dark' && <div className="absolute top-2 right-2 text-cyan-300"><Icon name="heart" className="w-4 h-4 fill-current"/></div>}
                                    </button>

                                    <button 
                                        onClick={() => setThemeType('light')}
                                        className={`relative h-24 rounded-lg border-2 transition-all overflow-hidden ${theme.id === 'light' ? 'border-cyan-300/50 ring-2 ring-cyan-300/70/20' : 'border-transparent hover:border-slate-400'}`}
                                    >
                                        <div className="absolute inset-0 bg-[#f1f5f9]"></div>
                                        <div className="absolute bottom-0 left-0 w-full p-2 bg-white/80 text-slate-900 text-xs font-bold text-center border-t border-slate-200">
                                            {t('themeLight')}
                                        </div>
                                        {theme.id === 'light' && <div className="absolute top-2 right-2 text-cyan-300"><Icon name="heart" className="w-4 h-4 fill-current"/></div>}
                                    </button>

                                    <button 
                                        onClick={() => setThemeType('warm')}
                                        className={`relative h-24 rounded-lg border-2 transition-all overflow-hidden ${theme.id === 'warm' ? 'border-cyan-300/50 ring-2 ring-cyan-300/70/20' : 'border-transparent hover:border-stone-500'}`}
                                    >
                                        <div className="absolute inset-0 bg-[#1c1917]"></div>
                                        <div className="absolute bottom-0 left-0 w-full p-2 bg-stone-900/80 text-stone-200 text-xs font-bold text-center border-t border-stone-700">
                                            {t('themeWarm')}
                                        </div>
                                        {theme.id === 'warm' && <div className="absolute top-2 right-2 text-cyan-300"><Icon name="heart" className="w-4 h-4 fill-current"/></div>}
                                    </button>

                                    <button 
                                        onClick={() => setThemeType('cold')}
                                        className={`relative h-24 rounded-lg border-2 transition-all overflow-hidden ${theme.id === 'cold' ? 'border-cyan-300/50 ring-2 ring-cyan-300/70/20' : 'border-transparent hover:border-blue-500'}`}
                                    >
                                        <div className="absolute inset-0 bg-[#020617]"></div>
                                        <div className="absolute bottom-0 left-0 w-full p-2 bg-blue-950/80 text-blue-200 text-xs font-bold text-center border-t border-blue-900">
                                            {t('themeCold')}
                                        </div>
                                        {theme.id === 'cold' && <div className="absolute top-2 right-2 text-cyan-300"><Icon name="heart" className="w-4 h-4 fill-current"/></div>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={`flex-grow flex flex-col items-center justify-center px-4 pb-20 z-10 transition-opacity duration-300 ${showHistory || showSettings ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="text-center mb-20">
                    <h1 className={`text-5xl md:text-7xl font-light tracking-[0.2em] ${theme.textMain} mb-6 drop-shadow-2xl`}>
                        {t('welcomeHeader')}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
                    {/* Free Tool Card */}
                    <div 
                        onClick={() => handleStart('free')}
                        className={`group relative h-64 rounded-3xl overflow-hidden cursor-pointer border ${theme.border} hover:border-slate-500 transition-all duration-500 shadow-2xl`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"></div>
                        
                        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end items-start">
                            <div className="absolute top-6 left-6">
                                <span className="bg-amber-400 text-black text-[10px] font-bold px-3 py-1.5 rounded shadow-lg tracking-wide uppercase">
                                    {t('toolLabel')}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">{t('freeGenTitle')}</h2>
                            <p className="text-slate-300 text-sm max-w-xs leading-relaxed opacity-90">
                                {t('freeGenDesc')}
                            </p>
                        </div>
                    </div>

                    {/* Pro Tool Card */}
                    <div 
                        onClick={() => handleStart('pro')}
                        className={`group relative h-64 rounded-3xl overflow-hidden cursor-pointer border ${theme.border} hover:border-slate-500 transition-all duration-500 shadow-2xl`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"></div>
                        
                        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end items-start">
                            <div className="absolute top-6 left-6">
                                <span className="bg-amber-400 text-black text-[10px] font-bold px-3 py-1.5 rounded shadow-lg tracking-wide uppercase">
                                    {t('toolLabel')}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">{t('proGenTitle')}</h2>
                            <p className="text-slate-300 text-sm max-w-xs leading-relaxed opacity-90">
                                {t('proGenDesc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
