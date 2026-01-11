// Router Configuration
// Defines all application routes

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './admin/layouts/AdminLayout';

// Admin Pages
import Dashboard from './admin/pages/Dashboard';
import Login from './admin/pages/Login';
import Register from './admin/pages/Register';
import ForgotPassword from './admin/pages/ForgotPassword';

// Room Pages
import Rooms from './admin/pages/Rooms';
import RoomForm from './admin/pages/RoomForm';
import RoomTypes from './admin/pages/RoomTypes';
import RoomDetails from './admin/pages/RoomDetails';

// Booking Pages
import Bookings from './admin/pages/Bookings';
import BookingForm from './admin/pages/BookingForm';
import Availability from './admin/pages/Availability';
// Guest Pages
import Guests from './admin/pages/Guests';
import GuestForm from './admin/pages/GuestForm';
import LoyaltyGame from './admin/pages/LoyaltyGame';

// Staff Pages
import Staff from './admin/pages/Staff';
import StaffForm from './admin/pages/StaffForm';
import Departments from './admin/pages/Departments';

// Housekeeping Pages
import Housekeeping from './admin/pages/Housekeeping';
import CreateTask from './admin/pages/CreateTask';
import RoomStatus from './admin/pages/RoomStatus';

// Restaurant Pages
import RestaurantOrders from './admin/pages/RestaurantOrders';
import RestaurantMenu from './admin/pages/RestaurantMenu';
import RestaurantTables from './admin/pages/RestaurantTables';
import MenuForm from './admin/pages/MenuForm';
import CreateOrder from './admin/pages/CreateOrder';
import TableForm from './admin/pages/TableForm';
import Inventory from './admin/pages/Inventory';

// Billing & Reports Pages
import Billing from './admin/pages/Billing';
import InvoiceForm from './admin/pages/InvoiceForm';
import InvoiceDetails from './admin/pages/InvoiceDetails';
import Reports from './admin/pages/Reports';
import Settings from './admin/pages/Settings';

// Customer Pages
import CustomerLayout from './customer/layouts/CustomerLayout';
import Home from './customer/pages/Home';
import RoomsList from './customer/pages/Rooms';
import BookingProcess from './customer/pages/BookingProcess';
import Profile from './customer/pages/Profile';

// Placeholder component for pages not yet implemented
const PlaceholderPage = ({ title }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center'
    }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>This page is coming soon...</p>
    </div>
);

const router = createBrowserRouter([
    // Public Routes
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />
    },

    // Admin Routes
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            // Rooms
            {
                path: 'rooms',
                element: <Rooms />
            },
            {
                path: 'rooms/types',
                element: <RoomTypes />
            },
            {
                path: 'rooms/add',
                element: <RoomForm />
            },
            {
                path: 'rooms/edit/:id',
                element: <RoomForm />
            },
            {
                path: 'rooms/:id',
                element: <RoomDetails />
            },
            // Bookings
            {
                path: 'bookings',
                element: <Bookings />
            },
            {
                path: 'bookings/new',
                element: <BookingForm />
            },
            {
                path: 'bookings/edit/:id',
                element: <BookingForm />
            },
            {
                path: 'bookings/:id',
                element: <PlaceholderPage title="Booking Details" />
            },
            {
                path: 'availability', // New availability route
                element: <Availability />
            },
            // Settings (Phase 9)
            {
                path: 'settings',
                element: <Settings />
            },
            {
                path: 'profile',
                element: <Settings /> // Reuse settings page
            },
            {
                path: 'bookings/checkin',
                element: <PlaceholderPage title="Check In" />
            },
            {
                path: 'bookings/checkout',
                element: <PlaceholderPage title="Check-Out" />
            },
            // Guests
            {
                path: 'guests',
                element: <Guests />
            },
            {
                path: 'guests/add',
                element: <GuestForm />
            },
            {
                path: 'guests/edit/:id',
                element: <GuestForm />
            },
            {
                path: 'guests/:id',
                element: <PlaceholderPage title="Guest Details" />
            },
            {
                path: 'guests/loyalty',
                element: <LoyaltyGame />
            },
            // Staff
            {
                path: 'staff',
                element: <Staff />
            },
            {
                path: 'staff/add',
                element: <StaffForm />
            },
            {
                path: 'staff/edit/:id',
                element: <StaffForm />
            },
            {
                path: 'staff/departments',
                element: <Departments />
            },
            {
                path: 'staff/attendance',
                element: <PlaceholderPage title="Attendance" />
            },
            // Housekeeping
            {
                path: 'housekeeping',
                element: <Housekeeping />
            },
            {
                path: 'housekeeping/create',
                element: <CreateTask />
            },
            {
                path: 'housekeeping/status',
                element: <RoomStatus />
            },
            // Restaurant
            {
                path: 'restaurant/orders',
                element: <RestaurantOrders />
            },
            {
                path: 'restaurant/orders/create',
                element: <CreateOrder />
            },
            {
                path: 'restaurant/menu',
                element: <RestaurantMenu />
            },
            {
                path: 'restaurant/menu/add',
                element: <MenuForm />
            },
            {
                path: 'restaurant/tables',
                element: <RestaurantTables />
            },
            {
                path: 'restaurant/tables/add',
                element: <TableForm />
            },
            {
                path: 'restaurant/inventory',
                element: <Inventory />
            },
            // Billing
            {
                path: 'billing',
                element: <Billing />
            },
            {
                path: 'billing/create',
                element: <InvoiceForm />
            },
            {
                path: 'billing/edit/:id',
                element: <InvoiceForm />
            },
            {
                path: 'billing/:id',
                element: <InvoiceDetails />
            },
            {
                path: 'billing/invoices',
                element: <Billing />
            },
            // Reports
            {
                path: 'reports',
                element: <Reports />
            },
            {
                path: 'reports/occupancy',
                element: <PlaceholderPage title="Occupancy Report" />
            },
            {
                path: 'reports/revenue',
                element: <PlaceholderPage title="Revenue Report" />
            },
            {
                path: 'reports/guests',
                element: <PlaceholderPage title="Guest Report" />
            },
            // Settings

        ]
    },

    // Customer Portal Routes
    {
        path: '/',
        element: <CustomerLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'rooms',
                element: <RoomsList />
            },
            {
                path: 'book/:roomId',
                element: <BookingProcess />
            },
            {
                path: 'profile',
                element: <Profile />
            }
        ]
    },

    // Catch all - redirect to home
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
]);

export default router;
