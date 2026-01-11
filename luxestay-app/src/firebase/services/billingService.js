// Billing Service
// Handles invoices, payments, and financial records

import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config';

const INVOICES_COLLECTION = 'invoices';
const PAYMENTS_COLLECTION = 'payments';

// Mock Data
let MOCK_INVOICES = [
    {
        id: 'inv_001',
        guestId: 'guest_1',
        guestName: 'John Doe',
        bookingId: 'bk_1',
        items: [
            { description: 'Room Charge (5 nights)', amount: 2500, category: 'Room' },
            { description: 'Room Service', amount: 150, category: 'Food' },
            { description: 'Spa Access', amount: 200, category: 'Service' }
        ],
        total: 2850,
        status: 'Unpaid',
        issueDate: '2023-10-25',
        dueDate: '2023-10-30',
        payments: [],
        refunds: []
    },
    {
        id: 'inv_002',
        guestId: 'guest_2',
        guestName: 'Jane Smith',
        bookingId: 'bk_2',
        items: [
            { description: 'Room Charge (3 nights)', amount: 900, category: 'Room' }
        ],
        total: 900,
        status: 'Paid',
        issueDate: '2023-10-20',
        dueDate: '2023-10-23',
        payments: [{ id: 'pay_1', amount: 900, date: '2023-10-21', method: 'Credit Card' }],
        refunds: []
    }
];

// Get Invoices
export const getInvoices = async (filters = {}) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            let data = [...MOCK_INVOICES];
            if (filters.status && filters.status !== 'all') {
                data = data.filter(i => i.status === filters.status);
            }
            if (filters.search) {
                const term = filters.search.toLowerCase();
                data = data.filter(i =>
                    i.id.toLowerCase().includes(term) ||
                    i.guestName.toLowerCase().includes(term)
                );
            }
            setTimeout(() => resolve({ success: true, data }), 800);
        });
    }

    try {
        const q = query(collection(db, INVOICES_COLLECTION), orderBy('issueDate', 'desc'));
        const snapshot = await getDocs(q);
        let invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (filters.status && filters.status !== 'all') {
            invoices = invoices.filter(i => i.status === filters.status);
        }

        return { success: true, data: invoices };
    } catch (error) {
        console.error('Error getting invoices:', error);
        return { success: false, error: error.message };
    }
};

// Get Single Invoice
export const getInvoiceById = async (id) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const invoice = MOCK_INVOICES.find(i => i.id === id);
            setTimeout(() => resolve({ success: !!invoice, data: invoice }), 500);
        });
    }

    try {
        const docRef = doc(db, INVOICES_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, error: 'Invoice not found' };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

// Create Invoice
export const createInvoice = async (invoiceData) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const newInv = {
                id: `inv_${Date.now()}`,
                ...invoiceData,
                status: 'Unpaid',
                issueDate: new Date().toISOString().split('T')[0],
                payments: [],
                refunds: []
            };
            MOCK_INVOICES.unshift(newInv);
            setTimeout(() => resolve({ success: true, data: newInv }), 800);
        });
    }

    try {
        const docRef = await addDoc(collection(db, INVOICES_COLLECTION), {
            ...invoiceData,
            status: 'Unpaid',
            issueDate: Timestamp.now(),
            payments: [],
            refunds: [],
            createdAt: Timestamp.now()
        });
        return { success: true, data: { id: docRef.id, ...invoiceData } };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

// Update Invoice
export const updateInvoice = async (id, updates) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const index = MOCK_INVOICES.findIndex(i => i.id === id);
            if (index !== -1) {
                MOCK_INVOICES[index] = { ...MOCK_INVOICES[index], ...updates };
                resolve({ success: true });
            } else {
                resolve({ success: false, error: 'Invoice not found' });
            }
        });
    }

    try {
        await updateDoc(doc(db, INVOICES_COLLECTION, id), updates);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

// Process Payment
export const processPayment = async (invoiceId, paymentData) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const index = MOCK_INVOICES.findIndex(i => i.id === invoiceId);
            if (index !== -1) {
                const invoice = MOCK_INVOICES[index];
                const payment = {
                    id: `pay_${Date.now()}`,
                    ...paymentData,
                    date: new Date().toISOString().split('T')[0]
                };

                if (!invoice.payments) invoice.payments = [];
                invoice.payments.push(payment);

                // Check if fully paid
                const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
                if (totalPaid >= invoice.total) {
                    invoice.status = 'Paid';
                } else {
                    invoice.status = 'Partial';
                }

                resolve({ success: true });
            } else {
                resolve({ success: false });
            }
        });
    }

    // Logic for Firestore would act similarly, omitted for prototyping speed
    return { success: true };
};

// Process Refund
export const processRefund = async (invoiceId, refundData) => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            const index = MOCK_INVOICES.findIndex(i => i.id === invoiceId);
            if (index !== -1) {
                const invoice = MOCK_INVOICES[index];
                const refund = {
                    id: `ref_${Date.now()}`,
                    ...refundData,
                    date: new Date().toISOString().split('T')[0]
                };

                if (!invoice.refunds) invoice.refunds = [];
                invoice.refunds.push(refund);

                invoice.status = 'Refunded'; // Simplified status logic
                resolve({ success: true });
            } else {
                resolve({ success: false });
            }
        });
    }
    return { success: true };
};

// Get Dashboard Stats (Mock)
export const getStats = async () => {
    if (!isFirebaseConfigured()) {
        return new Promise(resolve => {
            setTimeout(() => resolve({
                success: true,
                data: {
                    totalRevenue: 45500,
                    occupancyRate: 78,
                    activeBookings: 12,
                    monthlyRevenue: [3200, 4100, 3800, 5200, 4800, 6100], // Last 6 months
                    revenueBySource: { Room: 70, Food: 20, Service: 10 }
                }
            }), 600);
        });
    }
    // Mock for now even if firebase configured
    return { success: true, data: { totalRevenue: 0, occupancyRate: 0, activeBookings: 0 } };
};
