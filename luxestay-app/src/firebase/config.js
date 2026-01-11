// Firebase Configuration
// This file initializes Firebase with your project credentials

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
// Using fallback values for development mode
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo'
};

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
    return (
        import.meta.env.VITE_FIREBASE_API_KEY &&
        import.meta.env.VITE_FIREBASE_PROJECT_ID &&
        import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key'
    );
};

// Validate configuration and log warnings
const validateConfig = () => {
    if (!isFirebaseConfigured()) {
        console.warn(
            '%c⚠️ Firebase Not Configured',
            'color: #F59E0B; font-weight: bold; font-size: 14px;',
            '\n\nThe application is running without Firebase configuration.',
            '\nAuthentication features will not work until you add your Firebase credentials.',
            '\n\nTo configure Firebase:',
            '\n1. Create a Firebase project at https://console.firebase.google.com',
            '\n2. Copy the .env.example file to .env',
            '\n3. Add your Firebase credentials to the .env file',
            '\n4. Restart the development server',
            '\n'
        );
    }
};

validateConfig();

// Initialize Firebase
let app = null;
let auth = null;
let db = null;
let storage = null;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
} catch (error) {
    console.error('Firebase initialization error:', error.message);
}

export { auth, db, storage };
export default app;
