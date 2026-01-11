// Booking Service
// Handles all booking-related operations (Firestore + Mock Data)

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
import { db } from '../config';
import { isFirebaseConfigured } from '../config';

const COLLECTION_NAME = 'bookings';

// Mock Data for Development
const MOCK_BOOKINGS = [
    {
        id: 'bk_1',
        bookingNumber: 'BK-20231025-001',
        guestId: 'guest_1',
        guestName: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        roomId: 'room_101',
        roomNumber: '101',
        roomType: 'Deluxe Ocean View',
        checkInDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days later
        status: 'checked_in',
        totalAmount: 1250.00,
        paymentStatus: 'paid',
        guests: 2,
        notes: 'Late arrival',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'bk_2',
        bookingNumber: 'BK-20231026-003',
        guestId: 'guest_2',
        guestName: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 987-6543',
        roomId: 'room_205',
        roomNumber: '205',
        roomType: 'Executive Suite',
        checkInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days later
        checkOutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        totalAmount: 2500.00,
        paymentStatus: 'deposit_paid',
        guests: 2,
        notes: 'Anniversary celebration',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'bk_3',
        bookingNumber: 'BK-20231024-002',
        guestId: 'guest_3',
        guestName: 'Michael Brown',
        email: 'mbrown@example.com',
        phone: '+1 (555) 456-7890',
        roomId: 'room_302',
        roomNumber: '302',
        roomType: 'Standard King',
        checkInDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        checkOutDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'checked_out',
        totalAmount: 600.00,
        paymentStatus: 'paid',
        guests: 1,
        notes: '',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'bk_4',
        bookingNumber: 'BK-20231028-005',
        guestId: 'guest_4',
        guestName: 'Emily Davis',
        email: 'emily.d@example.com',
        phone: '+1 (555) 789-0123',
        roomId: 'room_401',
        roomNumber: '401',
        roomType: 'Presidential Suite',
        checkInDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        checkOutDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        totalAmount: 5000.00,
        paymentStatus: 'pending',
        guests: 4,
        notes: 'VIP guest',
        createdAt: new Date().toISOString()
    },
    {
        id: 'bk_5',
        bookingNumber: 'BK-20231023-001',
        guestId: 'guest_5',
        guestName: 'Robert Wilson',
        email: 'rwilson@example.com',
        phone: '+1 (555) 321-6547',
        roomId: 'room_102',
        roomNumber: '102',
        roomType: 'Standard Double',
        checkInDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        checkOutDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'cancelled',
        totalAmount: 450.00,
        paymentStatus: 'refunded',
        guests: 2,
        notes: 'Cancelled due to flight delay',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Helper to get all bookings
export const getAllBookings = async () => {
    if (!isFirebaseConfigured()) {
        // Return mock data with delay simulation
        return new Promise(resolve => {
            setTimeout(() => resolve(MOCK_BOOKINGS), 800);
        });
    }

    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

// Helper to get a single booking
export const getBookingById = async (id) => {
    if (!isFirebaseConfigured()) {
        return new Promise((resolve, reject) => {
            const booking = MOCK_BOOKINGS.find(b => b.id === id);
            setTimeout(() => {
                if (booking) resolve(booking);
                else reject(new Error('Booking not found'));
            }, 500);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('Booking not found');
        }
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
};

// Helper to create a new booking
export const createBooking = async (bookingData) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const newBooking = {
                id: `bk_${Date.now()}`,
                bookingNumber: `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
                ...bookingData,
                createdAt: new Date().toISOString()
            };
            // In a real app we would update the mock array, but here we just return the new object
            // MOCK_BOOKINGS.unshift(newBooking); 
            setTimeout(() => resolve(newBooking), 1000);
        });
    }

    try {
        const enrichedData = {
            ...bookingData,
            bookingNumber: `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };
        const docRef = await addDoc(collection(db, COLLECTION_NAME), enrichedData);
        return { id: docRef.id, ...enrichedData };
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

// Helper to update a booking
export const updateBooking = async (id, bookingData) => {
    if (!isFirebaseConfigured()) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve({ id, ...bookingData }), 800);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...bookingData,
            updatedAt: Timestamp.now()
        });
        return { id, ...bookingData };
    } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
    }
};

// Helper to update booking status
export const updateBookingStatus = async (id, status) => {
    return updateBooking(id, { status });
};

// Helper to delete a booking
export const deleteBooking = async (id) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve(true), 800);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
    }
};

export const getMockBookings = () => MOCK_BOOKINGS;
