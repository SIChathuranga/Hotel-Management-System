// Housekeeping Service
// Manages cleaning tasks and room status updates

import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config';

const COLLECTION_NAME = 'housekeeping_tasks';

// Mock Data
const MOCK_TASKS = [
    {
        id: 'task_1',
        roomNumber: '101',
        roomId: 'room_1',
        type: 'Cleaning',
        status: 'Pending',
        priority: 'High',
        assignedTo: 'Maria Rodriguez',
        assignedToId: 'staff_3',
        dueDate: '2023-10-26T14:00:00',
        notes: 'Guest checking in at 3 PM'
    },
    {
        id: 'task_2',
        roomNumber: '205',
        roomId: 'room_5',
        type: 'Deep Clean',
        status: 'In Progress',
        priority: 'Normal',
        assignedTo: 'Sarah Lee',
        assignedToId: 'staff_5',
        dueDate: '2023-10-26T16:00:00',
        notes: 'Monthly deep clean'
    },
    {
        id: 'task_3',
        roomNumber: '304',
        roomId: 'room_12',
        type: 'Inspection',
        status: 'Completed',
        priority: 'Normal',
        assignedTo: 'Alice Richardson',
        assignedToId: 'staff_1',
        dueDate: '2023-10-25T11:00:00',
        notes: 'Routine inspection'
    },
    {
        id: 'task_4',
        roomNumber: '102',
        roomId: 'room_2',
        type: 'Cleaning',
        status: 'Pending',
        priority: 'Normal',
        assignedTo: 'Unassigned',
        assignedToId: null,
        dueDate: '2023-10-27T10:00:00',
        notes: 'Checkout cleaning'
    }
];

// Helper to get all tasks
export const getHousekeepingTasks = async (filters = {}) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            let data = [...MOCK_TASKS];
            if (filters.status && filters.status !== 'all') {
                data = data.filter(t => t.status === filters.status);
            }
            if (filters.assignee) {
                data = data.filter(t => t.assignedToId === filters.assignee);
            }
            setTimeout(() => resolve({ success: true, data }), 800);
        });
    }

    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('dueDate', 'asc'));
        const snapshot = await getDocs(q);
        let tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Client-side filtering
        if (filters.status && filters.status !== 'all') {
            tasks = tasks.filter(t => t.status === filters.status);
        }

        return { success: true, data: tasks };
    } catch (error) {
        console.error('Error getting tasks:', error);
        return { success: false, error: error.message };
    }
};

// Create Task
export const createTask = async (taskData) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({
                success: true,
                data: { id: `task_${Date.now()}`, ...taskData }
            }), 1000);
        });
    }

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...taskData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
        return { success: true, data: { id: docRef.id, ...taskData } };
    } catch (error) {
        console.error('Error creating task:', error);
        return { success: false, error: error.message };
    }
};

// Update Task Status
export const updateTaskStatus = async (id, status) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 600);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status,
            updatedAt: Timestamp.now()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating task:', error);
        return { success: false, error: error.message };
    }
};

// Delete Task
export const deleteTask = async (id) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 600);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting task:', error);
        return { success: false, error: error.message };
    }
};
