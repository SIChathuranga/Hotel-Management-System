// Admin Layout Component
// Main layout wrapper for admin pages

import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import { PageLoader } from '../../shared/components/ui';
import { isFirebaseConfigured } from '../../firebase/config';
import Sidebar from './Sidebar';
import Header from './Header';
import './AdminLayout.css';

// Development mode - allows dashboard access without Firebase for UI preview
const DEV_MODE = !isFirebaseConfigured();

const AdminLayout = () => {
    const { user, userData, loading, isStaff, firebaseReady } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Show loading while checking auth (only if Firebase is configured)
    if (loading && firebaseReady) {
        return <PageLoader text="Loading..." />;
    }

    // In development mode without Firebase, allow access for UI preview
    if (DEV_MODE) {
        // Show a warning banner but allow access
        return (
            <div className="admin-layout">
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

                <div className="admin-main">
                    <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

                    {/* Development Mode Banner */}
                    <div className="dev-mode-banner">
                        ⚠️ Development Mode - Firebase not configured. <a href="/.agent/firebase-setup-guide.md" target="_blank">Setup Firebase</a>
                    </div>

                    <main className="admin-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to customer portal if not staff
    if (userData && !isStaff()) {
        return <Navigate to="/" replace />;
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="admin-layout">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            <div className="admin-main">
                <Header onMenuToggle={toggleSidebar} />

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
