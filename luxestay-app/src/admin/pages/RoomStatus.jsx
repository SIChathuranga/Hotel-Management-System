// Room Status Page
// Visual grid of room cleaning statuses

import React, { useState, useEffect } from 'react';
import {
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiRefreshCw,
    FiFilter
} from 'react-icons/fi';
import { Card, Spinner, Button } from '../../shared/components/ui';
import { getRooms, updateRoom } from '../../firebase/services/roomService';
import toast from 'react-hot-toast';
import './RoomStatus.css';

const RoomStatus = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        setLoading(true);
        try {
            const res = await getRooms();
            if (res.success) {
                // Determine mock cleaning status if not present
                // In a real app, this would be a field in the DB.
                // We'll deterministically map it based on room ID for consistency in mocks
                const roomsWithStatus = res.data.map(room => ({
                    ...room,
                    cleaningStatus: room.cleaningStatus ||
                        (parseInt(room.number) % 3 === 0 ? 'Dirty' :
                            parseInt(room.number) % 3 === 1 ? 'Clean' : 'Inspecting')
                }));
                setRooms(roomsWithStatus);
            }
        } catch (error) {
            console.error('Error loading rooms:', error);
            toast.error('Failed to load room status');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (roomId, newStatus) => {
        // Optimistic update
        setRooms(prev => prev.map(r =>
            r.id === roomId ? { ...r, cleaningStatus: newStatus } : r
        ));

        toast.success(`Room marked as ${newStatus}`);

        // In real app: await updateRoom(roomId, { cleaningStatus: newStatus });
    };

    const filteredRooms = rooms.filter(r =>
        filter === 'all' || r.cleaningStatus === filter
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Clean': return 'status-clean';
            case 'Dirty': return 'status-dirty';
            case 'Inspecting': return 'status-inspecting';
            case 'Out of Order': return 'status-out';
            default: return '';
        }
    };

    return (
        <div className="room-status-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Room Status</h1>
                    <p className="page-subtitle">Monitor housekeeping status</p>
                </div>
                <div className="status-legend">
                    <span className="legend-item"><span className="dot clean"></span>Clean</span>
                    <span className="legend-item"><span className="dot dirty"></span>Dirty</span>
                    <span className="legend-item"><span className="dot inspecting"></span>Insp.</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <Button
                    variant={filter === 'all' ? 'primary' : 'outline'}
                    onClick={() => setFilter('all')}
                    size="small"
                >
                    All Rooms
                </Button>
                <Button
                    variant={filter === 'Dirty' ? 'primary' : 'outline'}
                    onClick={() => setFilter('Dirty')}
                    size="small"
                    className="dirty-btn"
                >
                    Dirty
                </Button>
                <Button
                    variant={filter === 'Clean' ? 'primary' : 'outline'}
                    onClick={() => setFilter('Clean')}
                    size="small"
                    className="clean-btn"
                >
                    Clean
                </Button>
            </div>

            {loading ? (
                <div className="loading-container"><Spinner size="large" /></div>
            ) : (
                <div className="room-status-grid">
                    {filteredRooms.map(room => (
                        <Card key={room.id} className={`room-status-card ${getStatusColor(room.cleaningStatus)}`}>
                            <div className="room-number">
                                {room.number}
                            </div>
                            <div className="room-type">{room.type}</div>

                            <div className="status-badge">
                                {room.cleaningStatus}
                            </div>

                            <div className="quick-actions">
                                {room.cleaningStatus === 'Dirty' && (
                                    <button
                                        className="action-btn clean"
                                        onClick={() => handleStatusChange(room.id, 'Clean')}
                                        title="Mark as Clean"
                                    >
                                        <FiCheckCircle />
                                    </button>
                                )}
                                {room.cleaningStatus === 'Clean' && (
                                    <button
                                        className="action-btn dirty"
                                        onClick={() => handleStatusChange(room.id, 'Dirty')}
                                        title="Mark as Dirty"
                                    >
                                        <FiXCircle />
                                    </button>
                                )}
                                <button
                                    className="action-btn inspect"
                                    onClick={() => handleStatusChange(room.id, 'Inspecting')}
                                    title="Mark for Inspection"
                                >
                                    <FiAlertCircle />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoomStatus;
