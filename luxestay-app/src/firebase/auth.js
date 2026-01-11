// Firebase Authentication Service
// Handles all authentication-related operations

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';

// Check if Firebase is available
const checkFirebase = () => {
    if (!auth || !isFirebaseConfigured()) {
        return {
            success: false,
            error: 'Firebase is not configured. Please add your Firebase credentials to the .env file.'
        };
    }
    return null;
};

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

/**
 * Register a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} displayName - User's display name
 * @param {string} role - User's role (default: 'customer')
 * @returns {Promise<Object>} - User object
 */
export const registerWithEmailPassword = async (email, password, displayName, role = 'customer') => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with display name
        await updateProfile(user, { displayName });

        // Create user document in Firestore
        await createUserDocument(user, { role, displayName });

        return { success: true, user };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
};

/**
 * Sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User object
 */
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getUserDocument(userCredential.user.uid);

        return {
            success: true,
            user: userCredential.user,
            userData: userDoc
        };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
};

/**
 * Sign in with Google
 * @param {string} defaultRole - Default role for new users
 * @returns {Promise<Object>} - User object
 */
export const signInWithGoogle = async (defaultRole = 'customer') => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user document exists, if not create it
        const userDoc = await getUserDocument(user.uid);

        if (!userDoc) {
            await createUserDocument(user, { role: defaultRole });
        }

        return {
            success: true,
            user,
            userData: userDoc || { role: defaultRole },
            isNewUser: !userDoc
        };
    } catch (error) {
        console.error('Google sign-in error:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
};

/**
 * Sign out the current user
 * @returns {Promise<Object>}
 */
export const logOut = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<Object>}
 */
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        console.error('Password reset error:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
};

/**
 * Update user password (requires reauthentication)
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>}
 */
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const user = auth.currentUser;

        if (!user || !user.email) {
            return { success: false, error: 'No user is currently signed in' };
        }

        // Reauthenticate user
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Update password
        await updatePassword(user, newPassword);

        return { success: true };
    } catch (error) {
        console.error('Change password error:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (profileData) => {
    try {
        const user = auth.currentUser;

        if (!user) {
            return { success: false, error: 'No user is currently signed in' };
        }

        // Update Firebase Auth profile if display name or photo URL provided
        if (profileData.displayName || profileData.photoURL) {
            await updateProfile(user, {
                displayName: profileData.displayName || user.displayName,
                photoURL: profileData.photoURL || user.photoURL
            });
        }

        // Update Firestore user document
        await updateUserDocument(user.uid, profileData);

        return { success: true };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create user document in Firestore
 * @param {Object} user - Firebase user object
 * @param {Object} additionalData - Additional user data
 */
export const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const { displayName, email, photoURL } = user;

        try {
            await setDoc(userRef, {
                uid: user.uid,
                displayName: displayName || additionalData.displayName || '',
                email,
                photoURL: photoURL || '',
                role: additionalData.role || 'customer',
                phone: additionalData.phone || '',
                isActive: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error creating user document:', error);
        }
    }
};

/**
 * Get user document from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>}
 */
export const getUserDocument = async (uid) => {
    if (!uid) return null;

    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        }

        return null;
    } catch (error) {
        console.error('Error getting user document:', error);
        return null;
    }
};

/**
 * Update user document in Firestore
 * @param {string} uid - User ID
 * @param {Object} data - Data to update
 */
export const updateUserDocument = async (uid, data) => {
    if (!uid) return;

    try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating user document:', error);
        throw error;
    }
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userData = await getUserDocument(user.uid);
            callback({ user, userData });
        } else {
            callback({ user: null, userData: null });
        }
    });
};

/**
 * Get current user
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
    return auth.currentUser;
};

/**
 * Convert Firebase error codes to user-friendly messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} - User-friendly error message
 */
const getErrorMessage = (errorCode) => {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
        'auth/weak-password': 'Password should be at least 6 characters long.',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/user-not-found': 'No account found with this email. Please register first.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password. Please try again.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
        'auth/requires-recent-login': 'Please sign in again to complete this action.',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

export default {
    registerWithEmailPassword,
    signInWithEmail,
    signInWithGoogle,
    logOut,
    resetPassword,
    changePassword,
    updateUserProfile,
    getCurrentUser,
    subscribeToAuthChanges
};
