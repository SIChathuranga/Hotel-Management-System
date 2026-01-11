// Customer Portal Layout

import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../shared/context/AuthContext';
import ThemeToggle from '../../shared/components/ThemeToggle';
import './CustomerLayout.css';

const CustomerLayout = () => {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <div className="customer-layout">
            <nav className="customer-navbar">
                <div className="container nav-container">
                    <Link to="/" className="nav-logo">
                        <span className="logo-icon">🏨</span>
                        LuxeStay
                    </Link>

                    <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>

                    <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                        <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</NavLink>
                        <NavLink to="/rooms" className="nav-link" onClick={() => setMenuOpen(false)}>Rooms</NavLink>
                        {user ? (
                            <NavLink to="/profile" className="nav-link profile-link" onClick={() => setMenuOpen(false)}>
                                <FiUser /> Account
                            </NavLink>
                        ) : (
                            <NavLink to="/login" className="nav-link btn-login" onClick={() => setMenuOpen(false)}>
                                Login
                            </NavLink>
                        )}
                        <ThemeToggle variant="compact" />
                    </div>
                </div>
            </nav>

            <main className="customer-main">
                <Outlet />
            </main>

            <footer className="customer-footer">
                <div className="container footer-content">
                    <div className="footer-section">
                        <h3>LuxeStay</h3>
                        <p>Experience luxury and comfort in the heart of the city.</p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <Link to="/">Home</Link>
                        <Link to="/rooms">Rooms</Link>
                        <Link to="/login">Admin Login</Link>
                    </div>
                    <div className="footer-section">
                        <h3>Contact</h3>
                        <p>123 Luxury Ave, CA</p>
                        <p>+1-234-555-5555</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} LuxeStay Hotel. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default CustomerLayout;
