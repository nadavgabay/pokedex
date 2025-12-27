import React, { createContext, useEffect, useState } from 'react';
import type { Theme } from '../types/pokemon';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 1. Initial theme state from localStorage, defaulting to 'system'
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            return (saved as Theme) || 'system';
        }
        return 'system';
    });

    // 2. Computed initial resolved theme to prevent flashes
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark' || saved === 'light') return saved;

            // If system or no saved preference, check platform settings
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);

        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = () => {
            let target: 'light' | 'dark' = 'light';

            if (theme === 'system') {
                target = mediaQuery.matches ? 'dark' : 'light';
            } else {
                target = theme as 'light' | 'dark';
            }

            root.setAttribute('data-theme', target);
            setResolvedTheme(target);
        };

        updateTheme();

        // Listen for system preference changes
        mediaQuery.addEventListener('change', updateTheme);
        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


