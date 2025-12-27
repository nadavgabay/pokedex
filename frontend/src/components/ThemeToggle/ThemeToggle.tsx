import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import styles from './ThemeToggle.module.css';

export const ThemeToggle: React.FC = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }
    };

    const getIcon = () => {
        if (theme === 'system') {
            return '🖥️';
        }
        return theme === 'light' ? '☀️' : '🌙';
    };

    return (
        <button
            onClick={toggleTheme}
            aria-label={`Current theme: ${theme}. Click to change.`}
            title={`Current theme: ${theme} (Resolved: ${resolvedTheme})`}
            className={styles.button}
        >
            {getIcon()}
        </button>
    );
};
