// Restaurant Service
// Manages menu, tables, and restaurant orders

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

const MENU_COLLECTION = 'menu_items';
const TABLES_COLLECTION = 'restaurant_tables';
const ORDERS_COLLECTION = 'restaurant_orders';

// Mock Data
const MOCK_MENU = [
    {
        id: 'item_1',
        name: 'Classic Burger',
        category: 'Mains',
        price: 18.00,
        description: 'Beef patty, lettuce, tomato, cheese, house sauce',
        image: null,
        isAvailable: true
    },
    {
        id: 'item_2',
        name: 'Caesar Salad',
        category: 'Starters',
        price: 12.00,
        description: 'Romaine hearts, parmesan, croutons, caesar dressing',
        image: null,
        isAvailable: true
    },
    {
        id: 'item_3',
        name: 'Grilled Salmon',
        category: 'Mains',
        price: 26.00,
        description: 'Fresh atlantic salmon with seasonal vegetables',
        image: null,
        isAvailable: true
    },
    {
        id: 'item_4',
        name: 'Chocolate Lava Cake',
        category: 'Desserts',
        price: 10.00,
        description: 'Warm chocolate cake with vanilla ice cream',
        image: null,
        isAvailable: true
    },
    {
        id: 'item_5',
        name: 'Signature Cocktail',
        category: 'Drinks',
        price: 14.00,
        description: 'House special blend',
        image: null,
        isAvailable: true
    },
    {
        id: 'item_6',
        name: 'Espresso',
        category: 'Drinks',
        price: 4.00,
        description: 'Single shot espresso',
        image: null,
        isAvailable: true
    }
];

const MOCK_TABLES = [
    { id: 't1', number: '1', capacity: 2, status: 'Available' },
    { id: 't2', number: '2', capacity: 2, status: 'Occupied' },
    { id: 't3', number: '3', capacity: 4, status: 'Available' },
    { id: 't4', number: '4', capacity: 4, status: 'Reserved' },
    { id: 't5', number: '5', capacity: 6, status: 'Available' },
    { id: 't6', number: '6', capacity: 8, status: 'Available' }
];

const MOCK_ORDERS = [
    {
        id: 'ord_1',
        tableId: 't2',
        tableNumber: '2',
        items: [
            { id: 'item_1', name: 'Classic Burger', price: 18, qty: 2 }
        ],
        total: 36.00,
        status: 'Preparing',
        timestamp: '2023-10-26T12:30:00'
    }
];

// --- Menu Operations ---

export const getMenuItems = async (category = 'all') => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            let data = [...MOCK_MENU];
            if (category !== 'all') {
                data = data.filter(i => i.category === category);
            }
            setTimeout(() => resolve({ success: true, data }), 600);
        });
    }

    try {
        let q = query(collection(db, MENU_COLLECTION));
        if (category !== 'all') {
            q = query(collection(db, MENU_COLLECTION), where('category', '==', category));
        }
        const snapshot = await getDocs(q);
        return {
            success: true,
            data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        };
    } catch (error) {
        console.error('Error getting menu:', error);
        return { success: false, error: error.message };
    }
};

// --- Table Operations ---

export const getTables = async () => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true, data: MOCK_TABLES }), 500);
        });
    }

    // Simplification for prototype
    return { success: true, data: MOCK_TABLES };
};

export const updateTableStatus = async (tableId, status) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            // Find in mock and update (in memory for session)
            const table = MOCK_TABLES.find(t => t.id === tableId);
            if (table) table.status = status;
            setTimeout(() => resolve({ success: true }), 400);
        });
    }
    return { success: true };
};

// --- Order Operations ---

export const getOrders = async () => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true, data: MOCK_ORDERS }), 600);
        });
    }
    return { success: true, data: MOCK_ORDERS };
};

export const createOrder = async (orderData) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const newOrder = {
                id: `ord_${Date.now()}`,
                ...orderData,
                timestamp: new Date().toISOString(),
                status: 'Pending'
            };
            MOCK_ORDERS.push(newOrder); // Update mock state

            // Also update table status
            const table = MOCK_TABLES.find(t => t.id === orderData.tableId);
            if (table) table.status = 'Occupied';

            setTimeout(() => resolve({ success: true, data: newOrder }), 800);
        });
    }
    return { success: false, error: 'Not implemented' };
};

export const updateOrderStatus = async (orderId, status) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const order = MOCK_ORDERS.find(o => o.id === orderId);
            if (order) order.status = status;
            setTimeout(() => resolve({ success: true }), 400);
        });
    }
    return { success: false, error: 'Not implemented' };
};
