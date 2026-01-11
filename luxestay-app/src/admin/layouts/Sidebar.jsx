// Admin Sidebar Component
// Navigation sidebar for the admin dashboard

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome,
    FiGrid,
    FiCalendar,
    FiUsers,
    FiUser,
    FiTool,
    FiCoffee,
    FiDollarSign,
    FiBarChart2,
    FiSettings,
    FiLogOut,
    FiChevronDown,
    FiChevronLeft,
    FiMenu
} from 'react-icons/fi';
import { useAuth } from '../../shared/context/AuthContext';
import { logOut } from '../../firebase/auth';
import toast from 'react-hot-toast';
import './Sidebar.css';

const menuItems = [
    {
        title: 'Dashboard',
        icon: FiHome,
        path: '/admin'
    },
    {
        title: 'Rooms',
        icon: FiGrid,
        submenu: [
            { title: 'All Rooms', path: '/admin/rooms' },
            { title: 'Room Types', path: '/admin/rooms/types' },
            { title: 'Add Room', path: '/admin/rooms/add' }
        ]
    },
    {
        title: 'Bookings',
        icon: FiCalendar,
        submenu: [
            { title: 'All Bookings', path: '/admin/bookings' },
            { title: 'New Booking', path: '/admin/bookings/new' },
            { title: 'Availability', path: '/admin/availability' },
            { title: 'Check-In', path: '/admin/bookings/checkin' },
            { title: 'Check-Out', path: '/admin/bookings/checkout' }
        ]
    },
    {
        title: 'Guests',
        icon: FiUsers,
        submenu: [
            { title: 'All Guests', path: '/admin/guests' },
            { title: 'Add Guest', path: '/admin/guests/add' },
            { title: 'Loyalty Program', path: '/admin/guests/loyalty' }
        ]
    },
    {
        title: 'Staff',
        icon: FiUser,
        submenu: [
            { title: 'All Staff', path: '/admin/staff' },
            { title: 'Add Staff', path: '/admin/staff/add' },
            { title: 'Departments', path: '/admin/staff/departments' },
            { title: 'Attendance', path: '/admin/staff/attendance' }
        ]
    },
    {
        title: 'Housekeeping',
        icon: FiTool,
        submenu: [
            { title: 'Task Board', path: '/admin/housekeeping' },
            { title: 'Create Task', path: '/admin/housekeeping/create' },
            { title: 'Room Status', path: '/admin/housekeeping/status' }
        ]
    },
    {
        title: 'Restaurant',
        icon: FiCoffee,
        submenu: [
            { title: 'Orders', path: '/admin/restaurant/orders' },
            { title: 'Menu Items', path: '/admin/restaurant/menu' },
            { title: 'Tables', path: '/admin/restaurant/tables' },
            { title: 'Inventory', path: '/admin/restaurant/inventory' }
        ]
    },
    {
        title: 'Billing',
        icon: FiDollarSign,
        submenu: [
            { title: 'Invoices', path: '/admin/billing' },
            { title: 'Payments', path: '/admin/billing/payments' },
            { title: 'Refunds', path: '/admin/billing/refunds' }
        ]
    },
    {
        title: 'Reports',
        icon: FiBarChart2,
        submenu: [
            { title: 'Overview', path: '/admin/reports' },
            { title: 'Occupancy', path: '/admin/reports/occupancy' },
            { title: 'Revenue', path: '/admin/reports/revenue' },
            { title: 'Guests', path: '/admin/reports/guests' }
        ]
    },
    {
        title: 'Settings',
        icon: FiSettings,
        path: '/admin/settings'
    }
];

const Sidebar = ({ isOpen, onToggle }) => {
    const { userData } = useAuth();
    const navigate = useNavigate();
    const [expandedItems, setExpandedItems] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleExpanded = (title) => {
        setExpandedItems(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const handleLogout = async () => {
        try {
            await logOut();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    const sidebarClasses = [
        'sidebar',
        isOpen ? 'sidebar-open' : '',
        isCollapsed ? 'sidebar-collapsed' : ''
    ].filter(Boolean).join(' ');

    return (
        <>
            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="sidebar-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onToggle}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={sidebarClasses}>
                {/* Logo */}
                <div className="sidebar-header">
                    <NavLink to="/admin" className="sidebar-logo">
                        <span className="sidebar-logo-icon">🏨</span>
                        {!isCollapsed && (
                            <span className="sidebar-logo-text">LuxeStay</span>
                        )}
                    </NavLink>
                    <button
                        className="sidebar-collapse-btn"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <FiChevronLeft className={isCollapsed ? 'rotated' : ''} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <ul className="sidebar-menu">
                        {menuItems.map((item) => (
                            <li key={item.title} className="sidebar-menu-item">
                                {item.submenu ? (
                                    <>
                                        <button
                                            className={`sidebar-menu-link ${expandedItems[item.title] ? 'active' : ''}`}
                                            onClick={() => toggleExpanded(item.title)}
                                        >
                                            <item.icon className="sidebar-menu-icon" />
                                            {!isCollapsed && (
                                                <>
                                                    <span className="sidebar-menu-text">{item.title}</span>
                                                    <FiChevronDown
                                                        className={`sidebar-menu-arrow ${expandedItems[item.title] ? 'rotated' : ''}`}
                                                    />
                                                </>
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {expandedItems[item.title] && !isCollapsed && (
                                                <motion.ul
                                                    className="sidebar-submenu"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {item.submenu.map((subItem) => (
                                                        <li key={subItem.path}>
                                                            <NavLink
                                                                to={subItem.path}
                                                                className={({ isActive }) =>
                                                                    `sidebar-submenu-link ${isActive ? 'active' : ''}`
                                                                }
                                                                onClick={() => onToggle && window.innerWidth < 1024 && onToggle()}
                                                            >
                                                                {subItem.title}
                                                            </NavLink>
                                                        </li>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `sidebar-menu-link ${isActive ? 'active' : ''}`
                                        }
                                        onClick={() => onToggle && window.innerWidth < 1024 && onToggle()}
                                    >
                                        <item.icon className="sidebar-menu-icon" />
                                        {!isCollapsed && (
                                            <span className="sidebar-menu-text">{item.title}</span>
                                        )}
                                    </NavLink>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Section */}
                <div className="sidebar-footer">
                    {!isCollapsed && (
                        <div className="sidebar-user">
                            <div className="sidebar-user-avatar">
                                {userData?.photoURL ? (
                                    <img src={userData.photoURL} alt={userData.displayName} />
                                ) : (
                                    <span>{userData?.displayName?.charAt(0) || 'U'}</span>
                                )}
                            </div>
                            <div className="sidebar-user-info">
                                <span className="sidebar-user-name">
                                    {userData?.displayName || 'User'}
                                </span>
                                <span className="sidebar-user-role">
                                    {userData?.role || 'Staff'}
                                </span>
                            </div>
                        </div>
                    )}

                    <button className="sidebar-logout-btn" onClick={handleLogout}>
                        <FiLogOut className="sidebar-menu-icon" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
