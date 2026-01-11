// Reports & Analytics Page
// Displays hotel performance analytics

import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiUsers, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { Card, Spinner } from '../../shared/components/ui';
import { getStats } from '../../firebase/services/billingService';
import './Reports.css';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const res = await getStats();
            if (res.success) setStats(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-container"><Spinner /></div>;
    if (!stats) return <div className="p-8 text-center">Failed to load reports</div>;

    // Simple CSS Bar Chart Logic
    const maxRev = Math.max(...stats.monthlyRevenue);

    return (
        <div className="reports-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Hotel performance overview</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-icon bg-green-100 text-green-600"><FiDollarSign /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">${stats.totalRevenue.toLocaleString()}</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon bg-blue-100 text-blue-600"><FiTrendingUp /></div>
                    <div className="stat-info">
                        <span className="stat-label">Occupancy Rate</span>
                        <span className="stat-value">{stats.occupancyRate}%</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon bg-purple-100 text-purple-600"><FiUsers /></div>
                    <div className="stat-info">
                        <span className="stat-label">Active Bookings</span>
                        <span className="stat-value">{stats.activeBookings}</span>
                    </div>
                </Card>
            </div>

            <div className="charts-section">
                {/* Revenue Chart */}
                <Card className="chart-card">
                    <h3>Monthly Revenue (Last 6 Months)</h3>
                    <div className="bar-chart">
                        {stats.monthlyRevenue.map((val, idx) => {
                            const height = (val / maxRev) * 100;
                            return (
                                <div key={idx} className="bar-container">
                                    <div className="bar" style={{ height: `${height}%` }}>
                                        <span className="tooltip">${val}</span>
                                    </div>
                                    <span className="bar-label">{['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][idx]}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Source Breakdown */}
                <Card className="chart-card">
                    <h3>Revenue by Source</h3>
                    <div className="source-list">
                        {Object.entries(stats.revenueBySource).map(([source, pct]) => (
                            <div key={source} className="source-item">
                                <div className="source-header">
                                    <span>{source}</span>
                                    <span>{pct}%</span>
                                </div>
                                <div className="progress-bg">
                                    <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Reports;
