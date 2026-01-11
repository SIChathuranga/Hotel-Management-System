// Guest Service
// Handles guest profiles, history, and loyalty program

import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config';

const COLLECTION_NAME = 'guests';

// Mock Data for Development
const MOCK_GUESTS = [
    {
        id: 'guest_1',
        fullName: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY',
        nationality: 'USA',
        passportNumber: 'A12345678',
        loyaltyTier: 'Gold',
        loyaltyPoints: 12500,
        totalStays: 5,
        totalSpent: 4500.00,
        notes: 'Prefers high floor, allergy to peanuts',
        lastStay: '2023-10-25',
        createdAt: '2023-01-15T10:00:00Z',
        avatar: null
    },
    {
        id: 'guest_2',
        fullName: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 987-6543',
        address: '456 Oak Ave, Los Angeles, CA',
        nationality: 'USA',
        passportNumber: 'B87654321',
        loyaltyTier: 'Platinum',
        loyaltyPoints: 25400,
        totalStays: 12,
        totalSpent: 15200.00,
        notes: 'VIP Guest, prefers early check-in',
        lastStay: '2023-11-05',
        createdAt: '2022-05-20T14:30:00Z',
        avatar: null
    },
    {
        id: 'guest_3',
        fullName: 'Michael Brown',
        email: 'mbrown@example.com',
        phone: '+1 (555) 456-7890',
        address: '789 Pine Rd, Chicago, IL',
        nationality: 'USA',
        passportNumber: 'C11223344',
        loyaltyTier: 'Silver',
        loyaltyPoints: 3500,
        totalStays: 2,
        totalSpent: 800.00,
        notes: '',
        lastStay: '2023-09-15',
        createdAt: '2023-08-01T09:15:00Z',
        avatar: null
    },
    {
        id: 'guest_4',
        fullName: 'Emily Davis',
        email: 'emily.d@example.com',
        phone: '+44 20 7123 4567',
        address: '10 Downing St, London, UK',
        nationality: 'UK',
        passportNumber: 'UK99887766',
        loyaltyTier: 'Bronze',
        loyaltyPoints: 1000,
        totalStays: 1,
        totalSpent: 1200.00,
        notes: 'Vegetarian',
        lastStay: '2023-12-10',
        createdAt: '2023-11-15T16:45:00Z',
        avatar: null
    },
    {
        id: 'guest_5',
        fullName: 'Hiroshi Tanaka',
        email: 'h.tanaka@example.jp',
        phone: '+81 3 1234 5678',
        address: '1-1-1 Shibuya, Tokyo, Japan',
        nationality: 'Japan',
        passportNumber: 'JP55443322',
        loyaltyTier: 'Gold',
        loyaltyPoints: 18000,
        totalStays: 8,
        totalSpent: 9500.00,
        notes: 'Requires translator if possible',
        lastStay: '2023-07-20',
        createdAt: '2022-11-10T11:20:00Z',
        avatar: null
    }
];

// Helper to get all guests
export const getGuests = async (filters = {}) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            let data = [...MOCK_GUESTS];

            // Simple logic for development filters
            if (filters.search) {
                const search = filters.search.toLowerCase();
                data = data.filter(g =>
                    g.fullName.toLowerCase().includes(search) ||
                    g.email.toLowerCase().includes(search) ||
                    g.phone.includes(search)
                );
            }
            if (filters.loyaltyTier && filters.loyaltyTier !== 'all') {
                data = data.filter(g => g.loyaltyTier === filters.loyaltyTier);
            }

            setTimeout(() => resolve({ success: true, data }), 800);
        });
    }

    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('fullName', 'asc'));
        // Note: Complex filtering usually requires composite indexes in Firestore
        // We do client-side filtering or simple queries here for basic MVP

        const snapshot = await getDocs(q);
        let guests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Client-side filtering for simplicity in MVP
        if (filters.search) {
            const search = filters.search.toLowerCase();
            guests = guests.filter(g =>
                g.fullName.toLowerCase().includes(search) ||
                g.email.toLowerCase().includes(search)
            );
        }

        return { success: true, data: guests };
    } catch (error) {
        console.error('Error getting guests:', error);
        return { success: false, error: error.message };
    }
};

// Get guest by ID
export const getGuestById = async (id) => {
    if (!isFirebaseConfigured()) {
        return new Promise((resolve, reject) => {
            const guest = MOCK_GUESTS.find(g => g.id === id);
            setTimeout(() => {
                if (guest) resolve({ success: true, data: guest });
                else resolve({ success: false, error: 'Guest not found' });
            }, 500);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        } else {
            return { success: false, error: 'Guest not found' };
        }
    } catch (error) {
        console.error('Error getting guest:', error);
        return { success: false, error: error.message };
    }
};

// Create Guest
export const createGuest = async (guestData) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({
                success: true,
                data: { id: `guest_${Date.now()}`, ...guestData }
            }), 1000);
        });
    }

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...guestData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            totalStays: 0,
            totalSpent: 0,
            loyaltyPoints: 0,
            loyaltyTier: 'Bronze'
        });
        return { success: true, data: { id: docRef.id, ...guestData } };
    } catch (error) {
        console.error('Error creating guest:', error);
        return { success: false, error: error.message };
    }
};

// Update Guest
export const updateGuest = async (id, guestData) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 800);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...guestData,
            updatedAt: Timestamp.now()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating guest:', error);
        return { success: false, error: error.message };
    }
};

// Delete Guest
export const deleteGuest = async (id) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 800);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting guest:', error);
        return { success: false, error: error.message };
    }
};

// Get Guest History (Mocked logic mostly as it links to Booking Service)
export const getGuestHistory = async (guestId) => {
    // In a real app, this would query the 'bookings' collection where guestId == guestId
    // For now, we return mock data or rely on the booking service

    // We can just return a promise with empty array for now or mock data
    return new Promise(resolve => {
        setTimeout(() => resolve({
            success: true,
            data: [
                {
                    id: 'bk_hist_1',
                    roomNumber: '101',
                    checkIn: '2023-10-20',
                    checkOut: '2023-10-25',
                    total: 500,
                    status: 'checked_out'
                },
                {
                    id: 'bk_hist_2',
                    roomNumber: '205',
                    checkIn: '2023-05-15',
                    checkOut: '2023-05-18',
                    total: 750,
                    status: 'checked_out'
                }
            ]
        }), 500);
    });
};

export const getMockGuests = () => MOCK_GUESTS;
