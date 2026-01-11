// Authentication Context
// Provides authentication state and methods throughout the app

import React, { createContext, useContext, useState, useEffect } from 'react';
import { isFirebaseConfigured } from '../../firebase/config';

// Create the context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [firebaseReady, setFirebaseReady] = useState(false);

    useEffect(() => {
        // Check if Firebase is configured
        if (!isFirebaseConfigured()) {
            console.warn('Firebase not configured - authentication disabled');
            setLoading(false);
            setFirebaseReady(false);
            return;
        }

        setFirebaseReady(true);

        // Dynamically import auth functions only when Firebase is configured
        import('../../firebase/auth').then(({ subscribeToAuthChanges }) => {
            // Subscribe to auth state changes
            const unsubscribe = subscribeToAuthChanges(async ({ user, userData }) => {
                setUser(user);
                setUserData(userData);
                setLoading(false);
            });

            // Return unsubscribe for cleanup
            return () => unsubscribe();
        }).catch(err => {
            console.error('Error loading auth module:', err);
            setLoading(false);
        });
    }, []);

    // Check if user has a specific role
    const hasRole = (role) => {
        if (!userData) return false;
        if (Array.isArray(role)) {
            return role.includes(userData.role);
        }
        return userData.role === role;
    };

    // Check if user is admin
    const isAdmin = () => hasRole('admin');

    // Check if user is staff (any staff role)
    const isStaff = () => hasRole(['admin', 'manager', 'receptionist', 'staff']);

    // Check if user is manager or above
    const isManager = () => hasRole(['admin', 'manager']);

    // Refresh user data from Firestore
    const refreshUserData = async () => {
        if (!firebaseReady) return null;

        if (user) {
            try {
                const { getUserDocument } = await import('../../firebase/auth');
                const freshUserData = await getUserDocument(user.uid);
                setUserData(freshUserData);
                return freshUserData;
            } catch (err) {
                console.error('Error refreshing user data:', err);
                setError(err.message);
            }
        }
        return null;
    };

    // Clear any errors
    const clearError = () => setError(null);

    // Context value
    const value = {
        user,
        userData,
        loading,
        error,
        isAuthenticated: !!user,
        firebaseReady,
        hasRole,
        isAdmin,
        isStaff,
        isManager,
        refreshUserData,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;
