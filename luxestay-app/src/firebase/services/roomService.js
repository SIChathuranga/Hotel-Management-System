// Room Service
// Handles all room-related Firestore operations

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
    limit,
    serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../config';

const ROOMS_COLLECTION = 'rooms';
const ROOM_TYPES_COLLECTION = 'roomTypes';

// Check if Firebase is available
const checkFirebase = () => {
    if (!db || !isFirebaseConfigured()) {
        return {
            success: false,
            error: 'Firebase is not configured'
        };
    }
    return null;
};

// ========== Room Types ==========

/**
 * Get all room types
 * @returns {Promise<Array>} - Array of room types
 */
export const getRoomTypes = async () => {
    // Mock data fallback
    if (!isFirebaseConfigured()) {
        return { success: true, data: getMockRoomTypes() };
    }

    try {
        const roomTypesRef = collection(db, ROOM_TYPES_COLLECTION);
        const q = query(roomTypesRef, orderBy('name', 'asc'));
        const snapshot = await getDocs(q);

        const roomTypes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, data: roomTypes };
    } catch (error) {
        console.error('Error getting room types:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get a single room type by ID
 * @param {string} id - Room type ID
 * @returns {Promise<Object>} - Room type data
 */
export const getRoomTypeById = async (id) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const docRef = doc(db, ROOM_TYPES_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, error: 'Room type not found' };
    } catch (error) {
        console.error('Error getting room type:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create a new room type
 * @param {Object} roomTypeData - Room type data
 * @returns {Promise<Object>} - Created room type
 */
export const createRoomType = async (roomTypeData) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const roomTypesRef = collection(db, ROOM_TYPES_COLLECTION);
        const docRef = await addDoc(roomTypesRef, {
            ...roomTypeData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { success: true, data: { id: docRef.id, ...roomTypeData } };
    } catch (error) {
        console.error('Error creating room type:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update a room type
 * @param {string} id - Room type ID
 * @param {Object} roomTypeData - Room type data to update
 * @returns {Promise<Object>}
 */
export const updateRoomType = async (id, roomTypeData) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const docRef = doc(db, ROOM_TYPES_COLLECTION, id);
        await updateDoc(docRef, {
            ...roomTypeData,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating room type:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a room type
 * @param {string} id - Room type ID
 * @returns {Promise<Object>}
 */
export const deleteRoomType = async (id) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const docRef = doc(db, ROOM_TYPES_COLLECTION, id);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting room type:', error);
        return { success: false, error: error.message };
    }
};

// ========== Rooms ==========

/**
 * Get all rooms with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} - Array of rooms
 */
export const getRooms = async (filters = {}) => {
    // Mock data fallback
    if (!isFirebaseConfigured()) {
        let mockRooms = getMockRooms();
        // Apply filters
        if (filters.status) mockRooms = mockRooms.filter(r => r.status === filters.status);
        if (filters.roomType) mockRooms = mockRooms.filter(r => r.roomTypeId === filters.roomType);
        if (filters.floor) mockRooms = mockRooms.filter(r => r.floor === filters.floor);
        return { success: true, data: mockRooms };
    }

    try {
        const roomsRef = collection(db, ROOMS_COLLECTION);
        let q = query(roomsRef, orderBy('roomNumber', 'asc'));

        // Apply filters
        if (filters.status) {
            q = query(roomsRef, where('status', '==', filters.status), orderBy('roomNumber', 'asc'));
        }
        if (filters.roomType) {
            q = query(roomsRef, where('roomTypeId', '==', filters.roomType), orderBy('roomNumber', 'asc'));
        }
        if (filters.floor) {
            q = query(roomsRef, where('floor', '==', filters.floor), orderBy('roomNumber', 'asc'));
        }

        const snapshot = await getDocs(q);

        const rooms = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, data: rooms };
    } catch (error) {
        console.error('Error getting rooms:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get a single room by ID
 * @param {string} id - Room ID
 * @returns {Promise<Object>} - Room data
 */
export const getRoomById = async (id) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const docRef = doc(db, ROOMS_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, error: 'Room not found' };
    } catch (error) {
        console.error('Error getting room:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get room by room number
 * @param {string} roomNumber - Room number
 * @returns {Promise<Object>} - Room data
 */
export const getRoomByNumber = async (roomNumber) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const roomsRef = collection(db, ROOMS_COLLECTION);
        const q = query(roomsRef, where('roomNumber', '==', roomNumber), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { success: true, data: { id: doc.id, ...doc.data() } };
        }
        return { success: false, error: 'Room not found' };
    } catch (error) {
        console.error('Error getting room by number:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create a new room
 * @param {Object} roomData - Room data
 * @returns {Promise<Object>} - Created room
 */
export const createRoom = async (roomData) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        // Check if room number already exists
        const existing = await getRoomByNumber(roomData.roomNumber);
        if (existing.success) {
            return { success: false, error: 'Room number already exists' };
        }

        const roomsRef = collection(db, ROOMS_COLLECTION);
        const docRef = await addDoc(roomsRef, {
            ...roomData,
            status: roomData.status || 'available',
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { success: true, data: { id: docRef.id, ...roomData } };
    } catch (error) {
        console.error('Error creating room:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update a room
 * @param {string} id - Room ID
 * @param {Object} roomData - Room data to update
 * @returns {Promise<Object>}
 */
export const updateRoom = async (id, roomData) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const docRef = doc(db, ROOMS_COLLECTION, id);
        await updateDoc(docRef, {
            ...roomData,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating room:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update room status
 * @param {string} id - Room ID
 * @param {string} status - New status
 * @returns {Promise<Object>}
 */
export const updateRoomStatus = async (id, status) => {
    return updateRoom(id, { status });
};

/**
 * Delete a room
 * @param {string} id - Room ID
 * @returns {Promise<Object>}
 */
export const deleteRoom = async (id) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const docRef = doc(db, ROOMS_COLLECTION, id);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting room:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Upload room image
 * @param {string} roomId - Room ID
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Image URL
 */
export const uploadRoomImage = async (roomId, file) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `rooms/${roomId}/${fileName}`);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        return { success: true, data: { url: downloadURL, path: `rooms/${roomId}/${fileName}` } };
    } catch (error) {
        console.error('Error uploading room image:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete room image
 * @param {string} imagePath - Image storage path
 * @returns {Promise<Object>}
 */
export const deleteRoomImage = async (imagePath) => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const storageRef = ref(storage, imagePath);
        await deleteObject(storageRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting room image:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get room statistics
 * @returns {Promise<Object>} - Room statistics
 */
export const getRoomStats = async () => {
    const firebaseCheck = checkFirebase();
    if (firebaseCheck) return firebaseCheck;

    try {
        const roomsRef = collection(db, ROOMS_COLLECTION);
        const snapshot = await getDocs(roomsRef);

        const stats = {
            total: 0,
            available: 0,
            occupied: 0,
            reserved: 0,
            maintenance: 0,
            cleaning: 0
        };

        snapshot.docs.forEach(doc => {
            const room = doc.data();
            stats.total++;
            if (room.status) {
                stats[room.status] = (stats[room.status] || 0) + 1;
            }
        });

        stats.occupancyRate = stats.total > 0
            ? Math.round((stats.occupied / stats.total) * 100)
            : 0;

        return { success: true, data: stats };
    } catch (error) {
        console.error('Error getting room stats:', error);
        return { success: false, error: error.message };
    }
};

// ========== Mock Data for Development ==========

/**
 * Get mock room types for development
 * @returns {Array} - Mock room types
 */
export const getMockRoomTypes = () => [
    {
        id: 'type-1',
        name: 'Standard Room',
        description: 'Comfortable room with essential amenities for a pleasant stay.',
        basePrice: 99,
        maxOccupancy: 2,
        bedType: 'Queen',
        size: 28,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar']
    },
    {
        id: 'type-2',
        name: 'Deluxe Room',
        description: 'Spacious room with premium amenities and city view.',
        basePrice: 149,
        maxOccupancy: 2,
        bedType: 'King',
        size: 35,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker', 'Balcony']
    },
    {
        id: 'type-3',
        name: 'Executive Suite',
        description: 'Luxurious suite with separate living area and premium services.',
        basePrice: 249,
        maxOccupancy: 3,
        bedType: 'King',
        size: 55,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker', 'Living Room', 'Jacuzzi', 'Ocean View']
    },
    {
        id: 'type-4',
        name: 'Presidential Suite',
        description: 'The ultimate luxury experience with exclusive amenities and services.',
        basePrice: 499,
        maxOccupancy: 4,
        bedType: 'King + Twin',
        size: 100,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker', 'Living Room', 'Jacuzzi', 'Ocean View', 'Butler Service', 'Private Terrace']
    }
];

/**
 * Get mock rooms for development
 * @returns {Array} - Mock rooms
 */
export const getMockRooms = () => [
    { id: '1', roomNumber: '101', roomTypeId: 'type-1', roomTypeName: 'Standard Room', floor: 1, status: 'available', price: 99, images: [] },
    { id: '2', roomNumber: '102', roomTypeId: 'type-1', roomTypeName: 'Standard Room', floor: 1, status: 'occupied', price: 99, images: [] },
    { id: '3', roomNumber: '103', roomTypeId: 'type-2', roomTypeName: 'Deluxe Room', floor: 1, status: 'available', price: 149, images: [] },
    { id: '4', roomNumber: '104', roomTypeId: 'type-2', roomTypeName: 'Deluxe Room', floor: 1, status: 'cleaning', price: 149, images: [] },
    { id: '5', roomNumber: '201', roomTypeId: 'type-1', roomTypeName: 'Standard Room', floor: 2, status: 'available', price: 99, images: [] },
    { id: '6', roomNumber: '202', roomTypeId: 'type-2', roomTypeName: 'Deluxe Room', floor: 2, status: 'reserved', price: 149, images: [] },
    { id: '7', roomNumber: '203', roomTypeId: 'type-3', roomTypeName: 'Executive Suite', floor: 2, status: 'occupied', price: 249, images: [] },
    { id: '8', roomNumber: '204', roomTypeId: 'type-3', roomTypeName: 'Executive Suite', floor: 2, status: 'maintenance', price: 249, images: [] },
    { id: '9', roomNumber: '301', roomTypeId: 'type-2', roomTypeName: 'Deluxe Room', floor: 3, status: 'available', price: 149, images: [] },
    { id: '10', roomNumber: '302', roomTypeId: 'type-3', roomTypeName: 'Executive Suite', floor: 3, status: 'available', price: 249, images: [] },
    { id: '11', roomNumber: '303', roomTypeId: 'type-4', roomTypeName: 'Presidential Suite', floor: 3, status: 'occupied', price: 499, images: [] },
    { id: '12', roomNumber: '304', roomTypeId: 'type-4', roomTypeName: 'Presidential Suite', floor: 3, status: 'available', price: 499, images: [] }
];

export default {
    // Room Types
    getRoomTypes,
    getRoomTypeById,
    createRoomType,
    updateRoomType,
    deleteRoomType,

    // Rooms
    getRooms,
    getRoomById,
    getRoomByNumber,
    createRoom,
    updateRoom,
    updateRoomStatus,
    deleteRoom,

    // Images
    uploadRoomImage,
    deleteRoomImage,

    // Stats
    getRoomStats,

    // Mock Data
    getMockRoomTypes,
    getMockRooms
};
