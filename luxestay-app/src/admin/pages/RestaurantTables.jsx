// Restaurant Tables Page
// Visual layout of restaurant tables

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiClock, FiPlus } from 'react-icons/fi';
import { Card, Spinner, Button } from '../../shared/components/ui';
import { getTables, updateTableStatus } from '../../firebase/services/restaurantService';
import toast from 'react-hot-toast';
import './RestaurantTables.css';

const RestaurantTables = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        setLoading(true);
        try {
            const res = await getTables();
            if (res.success) {
                setTables(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableClick = async (table) => {
        // Simple toggle status logic for MVP
        const newStatus = table.status === 'Available' ? 'Occupied' : 'Available';
        const res = await updateTableStatus(table.id, newStatus);

        if (res.success) {
            setTables(prev => prev.map(t =>
                t.id === table.id ? { ...t, status: newStatus } : t
            ));
            toast.success(`Table ${table.number} is now ${newStatus}`);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Available': return 'status-available';
            case 'Occupied': return 'status-occupied';
            case 'Reserved': return 'status-reserved';
            default: return '';
        }
    };

    return (
        <div className="tables-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Tables</h1>
                    <p className="page-subtitle">Restaurant floor plan status</p>
                </div>
                <div className="header-actions">
                    <div className="legend">
                        <span className="legend-item"><span className="dot available"></span>Available</span>
                        <span className="legend-item"><span className="dot occupied"></span>Occupied</span>
                        <span className="legend-item"><span className="dot reserved"></span>Reserved</span>
                    </div>
                    <Link to="/admin/restaurant/tables/add">
                        <Button icon={<FiPlus />} variant="primary">Add Table</Button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="loading-container"><Spinner /></div>
            ) : (
                <div className="tables-grid">
                    {tables.map(table => (
                        <div
                            key={table.id}
                            className={`table-node ${getStatusClass(table.status)}`}
                            onClick={() => handleTableClick(table)}
                        >
                            <span className="table-num">{table.number}</span>
                            <div className="table-info">
                                <FiUsers size={12} /> {table.capacity}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantTables;
