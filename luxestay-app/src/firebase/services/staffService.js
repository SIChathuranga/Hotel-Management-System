// Staff Service
// Handles staff profiles, roles, departments, and attendance

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

const COLLECTION_NAME = 'staff';
const DEPARTMENTS_COLLECTION = 'departments';

// Mock Data for Development
const MOCK_STAFF = [
    {
        id: 'staff_1',
        fullName: 'Alice Richardson',
        email: 'alice.r@luxestay.com',
        phone: '+1 (555) 111-2222',
        role: 'General Manager',
        department: 'Management',
        status: 'Active',
        joinDate: '2020-03-15',
        salary: 85000,
        shift: 'Day',
        avatar: null
    },
    {
        id: 'staff_2',
        fullName: 'David Chen',
        email: 'david.c@luxestay.com',
        phone: '+1 (555) 333-4444',
        role: 'Receptionist',
        department: 'Front Desk',
        status: 'Active',
        joinDate: '2022-06-10',
        salary: 45000,
        shift: 'Morning',
        avatar: null
    },
    {
        id: 'staff_3',
        fullName: 'Maria Rodriguez',
        email: 'maria.r@luxestay.com',
        phone: '+1 (555) 555-6666',
        role: 'Housekeeping Supervisor',
        department: 'Housekeeping',
        status: 'Active',
        joinDate: '2021-01-20',
        salary: 48000,
        shift: 'Day',
        avatar: null
    },
    {
        id: 'staff_4',
        fullName: 'James Wilson',
        email: 'james.w@luxestay.com',
        phone: '+1 (555) 777-8888',
        role: 'Chef de Cuisine',
        department: 'Kitchen',
        status: 'Active',
        joinDate: '2021-11-05',
        salary: 65000,
        shift: 'Evening',
        avatar: null
    },
    {
        id: 'staff_5',
        fullName: 'Sarah Lee',
        email: 'sarah.l@luxestay.com',
        phone: '+1 (555) 999-0000',
        role: 'Concierge',
        department: 'Front Desk',
        status: 'On Leave',
        joinDate: '2023-02-14',
        salary: 42000,
        shift: 'Day',
        avatar: null
    },
    {
        id: 'staff_6',
        fullName: 'Robert Taylor',
        email: 'robert.t@luxestay.com',
        phone: '+1 (555) 123-0987',
        role: 'Maintenance Tech',
        department: 'Maintenance',
        status: 'Active',
        joinDate: '2022-08-30',
        salary: 50000,
        shift: 'Night',
        avatar: null
    }
];

const MOCK_DEPARTMENTS = [
    { id: 'dept_1', name: 'Management', head: 'Alice Richardson', staffCount: 2 },
    { id: 'dept_2', name: 'Front Desk', head: 'David Chen', staffCount: 4 },
    { id: 'dept_3', name: 'Housekeeping', head: 'Maria Rodriguez', staffCount: 8 },
    { id: 'dept_4', name: 'Kitchen', head: 'James Wilson', staffCount: 5 },
    { id: 'dept_5', name: 'Maintenance', head: 'Robert Taylor', staffCount: 3 },
    { id: 'dept_6', name: 'Security', head: 'Michael Guard', staffCount: 4 }
];

// Get All Staff
export const getStaff = async (filters = {}) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            let data = [...MOCK_STAFF];
            if (filters.department && filters.department !== 'all') {
                data = data.filter(s => s.department === filters.department);
            }
            if (filters.search) {
                const search = filters.search.toLowerCase();
                data = data.filter(s =>
                    s.fullName.toLowerCase().includes(search) ||
                    s.role.toLowerCase().includes(search)
                );
            }
            setTimeout(() => resolve({ success: true, data }), 800);
        });
    }

    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('fullName', 'asc'));
        const snapshot = await getDocs(q);
        let staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Client-side filtering
        if (filters.department && filters.department !== 'all') {
            staff = staff.filter(s => s.department === filters.department);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            staff = staff.filter(s =>
                s.fullName.toLowerCase().includes(search) ||
                s.role.toLowerCase().includes(search)
            );
        }

        return { success: true, data: staff };
    } catch (error) {
        console.error('Error getting staff:', error);
        return { success: false, error: error.message };
    }
};

// Get Staff by ID
export const getStaffById = async (id) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const staff = MOCK_STAFF.find(s => s.id === id);
            setTimeout(() => resolve(staff ? { success: true, data: staff } : { success: false, error: 'Staff not found' }), 500);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, error: 'Staff not found' };
    } catch (error) {
        console.error('Error getting staff details:', error);
        return { success: false, error: error.message };
    }
};

// Create Staff
export const createStaff = async (staffData) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({
                success: true,
                data: { id: `staff_${Date.now()}`, ...staffData }
            }), 1000);
        });
    }

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...staffData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
        return { success: true, data: { id: docRef.id, ...staffData } };
    } catch (error) {
        console.error('Error creating staff:', error);
        return { success: false, error: error.message };
    }
};

// Update Staff
export const updateStaff = async (id, staffData) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 800);
        });
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...staffData,
            updatedAt: Timestamp.now()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating staff:', error);
        return { success: false, error: error.message };
    }
};

// Delete Staff
export const deleteStaff = async (id) => {
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
        console.error('Error deleting staff:', error);
        return { success: false, error: error.message };
    }
};

// Get Departments
export const getDepartments = async () => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true, data: MOCK_DEPARTMENTS }), 600);
        });
    }

    // Departments logic would be similar to staff...
    return { success: true, data: MOCK_DEPARTMENTS }; // Fallback to mock for now even with Firebase as we might not have seeded it
};

export const getMockStaff = () => MOCK_STAFF;
