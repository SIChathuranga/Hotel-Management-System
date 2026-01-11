// Admin Header Component
// Top header for the admin dashboard

import React from 'react';
import { FiMenu, FiBell, FiSearch, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../shared/context/ThemeContext';
import { useAuth } from '../../shared/context/AuthContext';
import './Header.css';

const Header = ({ onMenuToggle, title }) => {
    const { theme, toggleTheme } = useTheme();
    const { userData } = useAuth();

    return (
        <header className="admin-header">
            <div className="header-left">
                <button
                    className="header-menu-btn"
                    onClick={onMenuToggle}
                    aria-label="Toggle menu"
                >
                    <FiMenu />
                </button>

                {title && <h1 className="header-title">{title}</h1>}
            </div>

            <div className="header-right">
                {/* Search */}
                <div className="header-search">
                    <FiSearch className="header-search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="header-search-input"
                    />
                </div>

                {/* Theme Toggle */}
                <button
                    className="header-icon-btn"
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {theme === 'dark' ? <FiSun /> : <FiMoon />}
                </button>

                {/* Notifications */}
                <button className="header-icon-btn header-notification-btn" aria-label="Notifications">
                    <FiBell />
                    <span className="header-notification-badge">3</span>
                </button>

                {/* User Avatar */}
                <div className="header-user">
                    <div className="header-user-avatar">
                        {userData?.photoURL ? (
                            <img src={userData.photoURL} alt={userData.displayName} />
                        ) : (
                            <span>{userData?.displayName?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
