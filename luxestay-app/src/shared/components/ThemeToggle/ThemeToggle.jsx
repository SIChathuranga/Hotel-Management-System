// Theme Toggle Component
// A reusable dark/light mode toggle button

import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ variant = 'default' }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            className={`theme-toggle ${variant}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <span className={`toggle-icon ${isDark ? 'hidden' : ''}`}>
                <FiMoon />
            </span>
            <span className={`toggle-icon ${isDark ? '' : 'hidden'}`}>
                <FiSun />
            </span>
            <span className="toggle-bg"></span>
        </button>
    );
};

export default ThemeToggle;
