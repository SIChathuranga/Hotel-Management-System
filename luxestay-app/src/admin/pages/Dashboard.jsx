// Admin Dashboard Page
// Main dashboard with statistics and overview

import React from 'react';
import { motion } from 'framer-motion';
import {
    FiHome,
    FiUsers,
    FiCalendar,
    FiDollarSign,
    FiTrendingUp,
    FiTrendingDown,
    FiArrowRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Card } from '../../shared/components/ui';
import { useAuth } from '../../shared/context/AuthContext';
import './Dashboard.css';

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
    >
        <Card className={`stat-card stat-card-${color}`} hoverable>
            <div className="stat-card-content">
                <div className="stat-card-info">
                    <span className="stat-card-title">{title}</span>
                    <span className="stat-card-value">{value}</span>
                    {change && (
                        <div className={`stat-card-change ${changeType}`}>
                            {changeType === 'increase' ? <FiTrendingUp /> : <FiTrendingDown />}
                            <span>{change}% from last month</span>
                        </div>
                    )}
                </div>
                <div className={`stat-card-icon stat-card-icon-${color}`}>
                    <Icon />
                </div>
            </div>
        </Card>
    </motion.div>
);

// Quick Action Card
const QuickAction = ({ title, description, icon: Icon, to, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
    >
        <Link to={to} className="quick-action-link">
            <Card className="quick-action-card" hoverable>
                <div className="quick-action-icon">
                    <Icon />
                </div>
                <div className="quick-action-content">
                    <h4 className="quick-action-title">{title}</h4>
                    <p className="quick-action-desc">{description}</p>
                </div>
                <FiArrowRight className="quick-action-arrow" />
            </Card>
        </Link>
    </motion.div>
);

// Recent Activity Item
const ActivityItem = ({ type, message, time, user }) => (
    <div className="activity-item">
        <div className={`activity-dot activity-dot-${type}`} />
        <div className="activity-content">
            <p className="activity-message">
                <strong>{user}</strong> {message}
            </p>
            <span className="activity-time">{time}</span>
        </div>
    </div>
);

const Dashboard = () => {
    const { userData } = useAuth();
    const firstName = userData?.displayName?.split(' ')[0] || 'User';

    // Mock data - replace with real data from Firebase
    const stats = [
        { title: 'Total Rooms', value: '120', change: 5, changeType: 'increase', icon: FiHome, color: 'gold' },
        { title: 'Occupied', value: '87', change: 12, changeType: 'increase', icon: FiUsers, color: 'green' },
        { title: 'Bookings Today', value: '24', change: 3, changeType: 'decrease', icon: FiCalendar, color: 'blue' },
        { title: 'Revenue', value: '$48,250', change: 18, changeType: 'increase', icon: FiDollarSign, color: 'purple' }
    ];

    const quickActions = [
        { title: 'New Booking', description: 'Create a new reservation', icon: FiCalendar, to: '/admin/bookings/new' },
        { title: 'Check-In Guest', description: 'Process guest arrival', icon: FiUsers, to: '/admin/bookings/checkin' },
        { title: 'Room Status', description: 'Update room availability', icon: FiHome, to: '/admin/housekeeping/status' }
    ];

    const recentActivity = [
        { type: 'success', user: 'John Smith', message: 'checked in to Room 305', time: '5 min ago' },
        { type: 'info', user: 'Sarah Johnson', message: 'made a reservation for Dec 20-25', time: '15 min ago' },
        { type: 'warning', user: 'Housekeeping', message: 'reported maintenance issue in Room 412', time: '30 min ago' },
        { type: 'success', user: 'Mike Wilson', message: 'checked out from Room 208', time: '1 hour ago' },
        { type: 'info', user: 'Emma Davis', message: 'requested late checkout', time: '2 hours ago' }
    ];

    return (
        <div className="dashboard">
            {/* Welcome Section */}
            <motion.div
                className="dashboard-welcome"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="welcome-content">
                    <h1 className="welcome-title">Good {getGreeting()}, {firstName}! 👋</h1>
                    <p className="welcome-subtitle">
                        Here's what's happening at LuxeStay today
                    </p>
                </div>
                <div className="welcome-date">
                    <span className="welcome-day">{formatDate()}</span>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="dashboard-stats">
                {stats.map((stat, index) => (
                    <StatCard key={stat.title} {...stat} delay={0.1 * index} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Quick Actions */}
                <section className="dashboard-section">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="quick-actions-grid">
                        {quickActions.map((action, index) => (
                            <QuickAction key={action.title} {...action} delay={0.2 + 0.1 * index} />
                        ))}
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Recent Activity</h2>
                        <Link to="/admin/activity" className="section-link">View all</Link>
                    </div>
                    <Card>
                        <div className="activity-list">
                            {recentActivity.map((activity, index) => (
                                <ActivityItem key={index} {...activity} />
                            ))}
                        </div>
                    </Card>
                </section>

                {/* Today's Overview */}
                <section className="dashboard-section dashboard-section-wide">
                    <h2 className="section-title">Today's Overview</h2>
                    <div className="overview-grid">
                        <Card className="overview-card">
                            <div className="overview-header">
                                <FiCalendar className="overview-icon" />
                                <h3>Arrivals</h3>
                            </div>
                            <div className="overview-value">12</div>
                            <p className="overview-desc">Expected check-ins today</p>
                        </Card>
                        <Card className="overview-card">
                            <div className="overview-header">
                                <FiUsers className="overview-icon" />
                                <h3>Departures</h3>
                            </div>
                            <div className="overview-value">8</div>
                            <p className="overview-desc">Expected check-outs today</p>
                        </Card>
                        <Card className="overview-card">
                            <div className="overview-header">
                                <FiHome className="overview-icon" />
                                <h3>Available</h3>
                            </div>
                            <div className="overview-value">33</div>
                            <p className="overview-desc">Rooms available tonight</p>
                        </Card>
                        <Card className="overview-card">
                            <div className="overview-header">
                                <FiDollarSign className="overview-icon" />
                                <h3>Occupancy</h3>
                            </div>
                            <div className="overview-value">72.5%</div>
                            <p className="overview-desc">Current occupancy rate</p>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
};

// Helper functions
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
};

const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default Dashboard;
