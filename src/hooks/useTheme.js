/**
 * Custom hook for theme management
 * Handles light/dark mode switching
 */

import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const useTheme = () => {
    const { settings, updateSettings } = useApp();
    const theme = settings?.theme || 'light';

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);

        // Also set class for compatibility
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    /**
     * Toggle between light and dark mode
     */
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        updateSettings({ theme: newTheme });
    };

    /**
     * Set specific theme
     */
    const setTheme = (newTheme) => {
        if (newTheme === 'light' || newTheme === 'dark') {
            updateSettings({ theme: newTheme });
        }
    };

    /**
     * Check if dark mode is active
     */
    const isDark = theme === 'dark';

    return {
        theme,
        toggleTheme,
        setTheme,
        isDark
    };
};

export default useTheme;
