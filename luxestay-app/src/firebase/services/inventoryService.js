// Inventory Service
// Manage restaurant stock and supplies

import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config';

const COLLECTION_NAME = 'inventory';

const MOCK_INVENTORY = [
    { id: 'inv_1', name: 'Burger Buns', quantity: 45, unit: 'pcs', status: 'OK', minThreshold: 20 },
    { id: 'inv_2', name: 'Beef Patties', quantity: 12, unit: 'pcs', status: 'Low', minThreshold: 20 },
    { id: 'inv_3', name: 'Lettuce', quantity: 5, unit: 'kg', status: 'OK', minThreshold: 2 },
    { id: 'inv_4', name: 'Coffee Beans', quantity: 2, unit: 'kg', status: 'Low', minThreshold: 5 },
    { id: 'inv_5', name: 'Milk', quantity: 10, unit: 'L', status: 'OK', minThreshold: 5 }
];

export const getInventory = async () => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true, data: [...MOCK_INVENTORY] }), 600);
        });
    }

    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, data };
    } catch (error) {
        console.error('Error getting inventory:', error);
        return { success: false, error: error.message };
    }
};

export const addItem = async (item) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const newItem = {
                id: `inv_${Date.now()}`,
                ...item,
                status: item.quantity <= item.minThreshold ? 'Low' : 'OK'
            };
            MOCK_INVENTORY.push(newItem);
            setTimeout(() => resolve({ success: true, data: newItem }), 800);
        });
    }

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...item,
            status: item.quantity <= item.minThreshold ? 'Low' : 'OK',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
        return { success: true, data: { id: docRef.id, ...item } };
    } catch (error) {
        console.error('Error adding item:', error);
        return { success: false, error: error.message };
    }
};

export const updateItem = async (id, updates) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const index = MOCK_INVENTORY.findIndex(i => i.id === id);
            if (index !== -1) {
                const updatedItem = { ...MOCK_INVENTORY[index], ...updates };
                // Recalculate status
                if (updatedItem.quantity !== undefined && updatedItem.minThreshold !== undefined) {
                    updatedItem.status = updatedItem.quantity <= updatedItem.minThreshold ? 'Low' : 'OK';
                }
                MOCK_INVENTORY[index] = updatedItem;
            }
            setTimeout(() => resolve({ success: true }), 500);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        // Calculate status logic could be here or client side, better on server/function but client for now
        let finalUpdates = { ...updates, updatedAt: Timestamp.now() };

        // Simple client status logic
        if (updates.quantity !== undefined && updates.minThreshold) {
            finalUpdates.status = updates.quantity <= updates.minThreshold ? 'Low' : 'OK';
        }

        await updateDoc(docRef, finalUpdates);
        return { success: true };
    } catch (error) {
        console.error('Error updating item:', error);
        return { success: false, error: error.message };
    }
};

export const deleteItem = async (id) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const index = MOCK_INVENTORY.findIndex(i => i.id === id);
            if (index !== -1) MOCK_INVENTORY.splice(index, 1);
            setTimeout(() => resolve({ success: true }), 500);
        });
    }

    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting item:', error);
        return { success: false, error: error.message };
    }
};
