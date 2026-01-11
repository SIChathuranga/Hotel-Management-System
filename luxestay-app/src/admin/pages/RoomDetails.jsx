// Room Details Page
// View detailed information about a single room

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiEdit2,
    FiTrash2,
    FiUsers,
    FiMaximize,
    FiHome,
    FiMapPin,
    FiDollarSign,
    FiCalendar,
    FiClock,
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi';
import { Button, Card } from '../../shared/components/ui';
import { getMockRooms, getMockRoomTypes } from '../../firebase/services/roomService';
import { isFirebaseConfigured } from '../../firebase/config';
import toast from 'react-hot-toast';
import './RoomDetails.css';

const statusConfig = {
    available: { label: 'Available', color: 'status-available', icon: FiCheckCircle },
    occupied: { label: 'Occupied', color: 'status-occupied', icon: FiXCircle },
    reserved: { label: 'Reserved', color: 'status-reserved', icon: FiCalendar },
    maintenance: { label: 'Maintenance', color: 'status-maintenance', icon: FiClock },
    cleaning: { label: 'Cleaning', color: 'status-cleaning', icon: FiClock }
};

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [roomType, setRoomType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoom();
    }, [id]);

    const loadRoom = async () => {
        setLoading(true);
        try {
            // For development, use mock data
            const mockRooms = getMockRooms();
            const mockTypes = getMockRoomTypes();

            const foundRoom = mockRooms.find(r => r.id === id);
            if (foundRoom) {
                setRoom(foundRoom);
                const type = mockTypes.find(t => t.id === foundRoom.roomTypeId);
                setRoomType(type || null);
            } else {
                toast.error('Room not found');
                navigate('/admin/rooms');
            }
        } catch (error) {
            console.error('Error loading room:', error);
            toast.error('Failed to load room details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete room ${room.roomNumber}?`)) {
            toast.success(`Room ${room.roomNumber} deleted`);
            navigate('/admin/rooms');
        }
    };

    const handleStatusChange = (newStatus) => {
        setRoom(prev => ({ ...prev, status: newStatus }));
        toast.success(`Room status updated to ${statusConfig[newStatus].label}`);
    };

    if (loading) {
        return (
            <div className="room-details-page loading">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!room) {
        return null;
    }

    const status = statusConfig[room.status] || statusConfig.available;
    const StatusIcon = status.icon;
    const coverImage = room.images?.[0] || '/images/room-placeholder.jpg';

    return (
        <div className="room-details-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-content">
                    <Button
                        variant="ghost"
                        icon={<FiArrowLeft />}
                        onClick={() => navigate('/admin/rooms')}
                    >
                        Back to Rooms
                    </Button>
                    <div className="room-header-info">
                        <h1 className="page-title">Room {room.roomNumber}</h1>
                        <span className={`room-status-badge ${status.color}`}>
                            <StatusIcon />
                            {status.label}
                        </span>
                    </div>
                </div>
                <div className="page-header-actions">
                    <Link to={`/admin/rooms/edit/${room.id}`}>
                        <Button variant="outline" icon={<FiEdit2 />}>
                            Edit Room
                        </Button>
                    </Link>
                    <Button variant="danger" icon={<FiTrash2 />} onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </div>

            <div className="room-details-grid">
                {/* Main Content */}
                <div className="room-details-main">
                    {/* Room Image Gallery */}
                    <Card className="room-gallery-card">
                        <div className="room-gallery">
                            <img src={coverImage} alt={`Room ${room.roomNumber}`} className="room-main-image" />
                            {room.images?.length > 1 && (
                                <div className="room-thumbnails">
                                    {room.images.slice(0, 4).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Room ${room.roomNumber} - ${index + 1}`}
                                            className="room-thumbnail"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Room Information */}
                    <Card title="Room Information" className="room-info-card">
                        <div className="room-info-grid">
                            <div className="room-info-item">
                                <div className="info-icon">
                                    <FiHome />
                                </div>
                                <div className="info-content">
                                    <span className="info-label">Room Type</span>
                                    <span className="info-value">{room.roomTypeName}</span>
                                </div>
                            </div>
                            <div className="room-info-item">
                                <div className="info-icon">
                                    <FiMapPin />
                                </div>
                                <div className="info-content">
                                    <span className="info-label">Floor</span>
                                    <span className="info-value">Floor {room.floor}</span>
                                </div>
                            </div>
                            <div className="room-info-item">
                                <div className="info-icon">
                                    <FiDollarSign />
                                </div>
                                <div className="info-content">
                                    <span className="info-label">Price per Night</span>
                                    <span className="info-value">${room.price}</span>
                                </div>
                            </div>
                            {roomType && (
                                <>
                                    <div className="room-info-item">
                                        <div className="info-icon">
                                            <FiUsers />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Max Occupancy</span>
                                            <span className="info-value">{roomType.maxOccupancy} guests</span>
                                        </div>
                                    </div>
                                    <div className="room-info-item">
                                        <div className="info-icon">
                                            <FiMaximize />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Room Size</span>
                                            <span className="info-value">{roomType.size} m²</span>
                                        </div>
                                    </div>
                                    <div className="room-info-item">
                                        <div className="info-icon">
                                            <FiHome />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Bed Type</span>
                                            <span className="info-value">{roomType.bedType}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>

                    {/* Amenities */}
                    {roomType?.amenities && (
                        <Card title="Amenities" className="room-amenities-card">
                            <div className="amenities-list">
                                {roomType.amenities.map((amenity) => (
                                    <span key={amenity} className="amenity-item">
                                        <FiCheckCircle />
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Description */}
                    {roomType?.description && (
                        <Card title="Description" className="room-description-card">
                            <p className="room-description">{roomType.description}</p>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="room-details-sidebar">
                    {/* Quick Status Change */}
                    <Card title="Quick Actions" className="quick-actions-card">
                        <div className="status-actions">
                            <p className="status-label">Change Status:</p>
                            <div className="status-buttons">
                                {Object.entries(statusConfig).map(([key, config]) => (
                                    <button
                                        key={key}
                                        className={`status-btn ${config.color} ${room.status === key ? 'active' : ''}`}
                                        onClick={() => handleStatusChange(key)}
                                        disabled={room.status === key}
                                    >
                                        {config.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Booking History */}
                    <Card title="Recent Bookings" className="bookings-card">
                        <div className="empty-state">
                            <FiCalendar className="empty-icon" />
                            <p>No recent bookings</p>
                        </div>
                    </Card>

                    {/* Notes */}
                    {room.notes && (
                        <Card title="Internal Notes" className="notes-card">
                            <p className="room-notes">{room.notes}</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
