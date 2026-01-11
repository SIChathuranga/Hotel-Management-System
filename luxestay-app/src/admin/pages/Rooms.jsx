// Rooms List Page
// Displays all rooms with filtering and management options

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiGrid, FiList, FiRefreshCw } from 'react-icons/fi';
import { Button, Card, SkeletonCard } from '../../shared/components/ui';
import RoomCard from '../components/RoomCard';
import RoomFilters from '../components/RoomFilters';
import { getMockRooms, getMockRoomTypes } from '../../firebase/services/roomService';
import { isFirebaseConfigured } from '../../firebase/config';
import toast from 'react-hot-toast';
import './Rooms.css';

const Rooms = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        roomType: '',
        floor: ''
    });

    // Load rooms and room types
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Use mock data in development mode
            if (!isFirebaseConfigured()) {
                setRooms(getMockRooms());
                setRoomTypes(getMockRoomTypes());
            } else {
                // TODO: Load from Firebase when configured
                // const roomsResult = await getRooms();
                // const typesResult = await getRoomTypes();
                setRooms(getMockRooms());
                setRoomTypes(getMockRoomTypes());
            }
        } catch (error) {
            console.error('Error loading rooms:', error);
            toast.error('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    // Filter rooms based on current filters
    const filteredRooms = useMemo(() => {
        return rooms.filter(room => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    room.roomNumber.toLowerCase().includes(searchLower) ||
                    room.roomTypeName.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Status filter
            if (filters.status && room.status !== filters.status) {
                return false;
            }

            // Room type filter
            if (filters.roomType && room.roomTypeId !== filters.roomType) {
                return false;
            }

            // Floor filter
            if (filters.floor && room.floor !== parseInt(filters.floor)) {
                return false;
            }

            return true;
        });
    }, [rooms, filters]);

    // Room statistics
    const roomStats = useMemo(() => {
        return {
            total: rooms.length,
            available: rooms.filter(r => r.status === 'available').length,
            occupied: rooms.filter(r => r.status === 'occupied').length,
            reserved: rooms.filter(r => r.status === 'reserved').length,
            maintenance: rooms.filter(r => r.status === 'maintenance').length
        };
    }, [rooms]);

    const handleEdit = (room) => {
        navigate(`/admin/rooms/edit/${room.id}`);
    };

    const handleDelete = (room) => {
        if (window.confirm(`Are you sure you want to delete room ${room.roomNumber}?`)) {
            // TODO: Implement delete functionality
            toast.success(`Room ${room.roomNumber} deleted`);
            setRooms(prev => prev.filter(r => r.id !== room.id));
        }
    };

    const handleViewDetails = (room) => {
        navigate(`/admin/rooms/${room.id}`);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: '',
            roomType: '',
            floor: ''
        });
    };

    return (
        <div className="rooms-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">Rooms</h1>
                    <p className="page-subtitle">
                        Manage all hotel rooms and their status
                    </p>
                </div>
                <div className="page-header-actions">
                    <Button
                        variant="outline"
                        icon={<FiRefreshCw />}
                        onClick={loadData}
                    >
                        Refresh
                    </Button>
                    <Link to="/admin/rooms/add">
                        <Button variant="primary" icon={<FiPlus />}>
                            Add Room
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Room Stats */}
            <div className="room-stats">
                <Card className="room-stat-card">
                    <div className="room-stat-value">{roomStats.total}</div>
                    <div className="room-stat-label">Total Rooms</div>
                </Card>
                <Card className="room-stat-card room-stat-available">
                    <div className="room-stat-value">{roomStats.available}</div>
                    <div className="room-stat-label">Available</div>
                </Card>
                <Card className="room-stat-card room-stat-occupied">
                    <div className="room-stat-value">{roomStats.occupied}</div>
                    <div className="room-stat-label">Occupied</div>
                </Card>
                <Card className="room-stat-card room-stat-reserved">
                    <div className="room-stat-value">{roomStats.reserved}</div>
                    <div className="room-stat-label">Reserved</div>
                </Card>
                <Card className="room-stat-card room-stat-maintenance">
                    <div className="room-stat-value">{roomStats.maintenance}</div>
                    <div className="room-stat-label">Maintenance</div>
                </Card>
            </div>

            {/* Filters */}
            <RoomFilters
                filters={filters}
                onFilterChange={setFilters}
                roomTypes={roomTypes}
                onClearFilters={clearFilters}
            />

            {/* View Toggle & Results Count */}
            <div className="rooms-toolbar">
                <span className="rooms-count">
                    Showing {filteredRooms.length} of {rooms.length} rooms
                </span>
                <div className="view-toggle">
                    <button
                        className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                    >
                        <FiGrid />
                    </button>
                    <button
                        className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                    >
                        <FiList />
                    </button>
                </div>
            </div>

            {/* Rooms Grid/List */}
            {loading ? (
                <div className={`rooms-${viewMode}`}>
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : filteredRooms.length > 0 ? (
                <motion.div
                    className={`rooms-${viewMode}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {filteredRooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </motion.div>
            ) : (
                <Card className="rooms-empty">
                    <div className="empty-state">
                        <FiGrid className="empty-icon" />
                        <h3>No rooms found</h3>
                        <p>Try adjusting your filters or add a new room</p>
                        <Link to="/admin/rooms/add">
                            <Button variant="primary" icon={<FiPlus />}>
                                Add First Room
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Rooms;
