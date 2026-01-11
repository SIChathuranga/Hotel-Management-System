// Theme Context
// Manages dark/light theme state across the application

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    // Check for saved theme or system preference
    const getInitialTheme = () => {
        // Check localStorage first
        const savedTheme = localStorage.getItem('luxestay-theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;

        // Remove existing theme
        root.removeAttribute('data-theme');

        // Apply new theme
        root.setAttribute('data-theme', theme);

        // Save to localStorage
        localStorage.setItem('luxestay-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content',
                theme === 'dark' ? '#1A1A2E' : '#FFFFFF'
            );
        }
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Only auto-switch if no theme is saved
            if (!localStorage.getItem('luxestay-theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Toggle between light and dark
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // Set specific theme
    const setSpecificTheme = (newTheme) => {
        if (newTheme === 'light' || newTheme === 'dark') {
            setTheme(newTheme);
        }
    };

    // Check if dark mode
    const isDark = theme === 'dark';

    const value = {
        theme,
        isDark,
        toggleTheme,
        setTheme: setSpecificTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};

export default ThemeContext;
