
import React, { useRef, useEffect } from 'react';
import { Icon } from '../icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export const PromptInput: React.FC<{ prompt: string, setPrompt: (value: any) => void, placeholder: string }> = ({ prompt, setPrompt, placeholder }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [prompt]);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setPrompt((p: string) => p ? `${p} ${text}` : text);
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <h3 className={`font-semibold ${theme.textMain}`}>{t('prompt')}</h3>
                <button onClick={handlePaste} title="Paste" className={`${theme.textSub} hover:text-cyan-300`}><Icon name="clipboard" className="w-5 h-5"/></button>
            </div>
            <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholder}
                className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md min-h-[112px] overflow-hidden resize-none text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none border ${theme.border}`}
            />
        </>
    );
};
