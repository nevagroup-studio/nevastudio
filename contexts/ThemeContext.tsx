import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type ThemeType = 'dark' | 'light' | 'warm' | 'cold';

export interface ThemeClasses {
    id: ThemeType;
    appBg: string;
    panelBg: string;
    navBg: string;
    textMain: string;
    textSub: string;
    border: string;
    accent: string;
    buttonSecondary: string;
    inputBg: string;
}

const themes: Record<ThemeType, ThemeClasses> = {
    dark: {
        id: 'dark',
        appBg: 'neva-theme neva-theme-dark neva-app-bg',
        panelBg: 'neva-panel',
        navBg: 'neva-nav',
        textMain: 'neva-text-main',
        textSub: 'neva-text-sub',
        border: 'neva-border',
        accent: 'neva-accent-text',
        buttonSecondary: 'neva-btn-secondary',
        inputBg: 'neva-input',
    },
    light: {
        id: 'light',
        appBg: 'neva-theme neva-theme-light neva-app-bg',
        panelBg: 'neva-panel',
        navBg: 'neva-nav',
        textMain: 'neva-text-main',
        textSub: 'neva-text-sub',
        border: 'neva-border',
        accent: 'neva-accent-text',
        buttonSecondary: 'neva-btn-secondary',
        inputBg: 'neva-input',
    },
    warm: {
        id: 'warm',
        appBg: 'neva-theme neva-theme-warm neva-app-bg',
        panelBg: 'neva-panel',
        navBg: 'neva-nav',
        textMain: 'neva-text-main',
        textSub: 'neva-text-sub',
        border: 'neva-border',
        accent: 'neva-accent-text',
        buttonSecondary: 'neva-btn-secondary',
        inputBg: 'neva-input',
    },
    cold: {
        id: 'cold',
        appBg: 'neva-theme neva-theme-cold neva-app-bg',
        panelBg: 'neva-panel',
        navBg: 'neva-nav',
        textMain: 'neva-text-main',
        textSub: 'neva-text-sub',
        border: 'neva-border',
        accent: 'neva-accent-text',
        buttonSecondary: 'neva-btn-secondary',
        inputBg: 'neva-input',
    }
};

interface ThemeContextType {
    theme: ThemeClasses;
    setThemeType: (type: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [themeType, setThemeType] = useState<ThemeType>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('app_theme') as ThemeType;
        if (savedTheme && themes[savedTheme]) {
            setThemeType(savedTheme);
        }
    }, []);

    const handleSetTheme = (type: ThemeType) => {
        setThemeType(type);
        localStorage.setItem('app_theme', type);
    };

    return (
        <ThemeContext.Provider value={{ theme: themes[themeType], setThemeType: handleSetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
