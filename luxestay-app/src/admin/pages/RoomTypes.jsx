// Room Types Page
// Manage room types and their configurations

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiX,
    FiUsers,
    FiMaximize,
    FiDollarSign
} from 'react-icons/fi';
import { Button, Card, Input } from '../../shared/components/ui';
import { getMockRoomTypes } from '../../firebase/services/roomService';
import { isFirebaseConfigured } from '../../firebase/config';
import toast from 'react-hot-toast';
import './RoomTypes.css';

const amenitiesList = [
    'WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker',
    'Safe', 'Hair Dryer', 'Iron', 'Balcony', 'Ocean View',
    'City View', 'Living Room', 'Jacuzzi', 'Kitchen', 'Workspace',
    'Butler Service', 'Private Terrace', 'Pool Access', 'Gym Access'
];

const RoomTypes = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm();

    // Load room types
    useEffect(() => {
        loadRoomTypes();
    }, []);

    const loadRoomTypes = async () => {
        setLoading(true);
        try {
            if (!isFirebaseConfigured()) {
                setRoomTypes(getMockRoomTypes());
            } else {
                // TODO: Load from Firebase
                setRoomTypes(getMockRoomTypes());
            }
        } catch (error) {
            console.error('Error loading room types:', error);
            toast.error('Failed to load room types');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingType(null);
        reset({
            name: '',
            description: '',
            basePrice: '',
            maxOccupancy: '',
            bedType: '',
            size: ''
        });
        setSelectedAmenities([]);
        setShowModal(true);
    };

    const openEditModal = (roomType) => {
        setEditingType(roomType);
        reset({
            name: roomType.name,
            description: roomType.description,
            basePrice: roomType.basePrice,
            maxOccupancy: roomType.maxOccupancy,
            bedType: roomType.bedType,
            size: roomType.size
        });
        setSelectedAmenities(roomType.amenities || []);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingType(null);
    };

    const onSubmit = async (data) => {
        try {
            const roomTypeData = {
                ...data,
                basePrice: parseFloat(data.basePrice),
                maxOccupancy: parseInt(data.maxOccupancy),
                size: parseInt(data.size),
                amenities: selectedAmenities
            };

            if (editingType) {
                // Update existing
                setRoomTypes(prev =>
                    prev.map(t => t.id === editingType.id ? { ...t, ...roomTypeData } : t)
                );
                toast.success('Room type updated successfully!');
            } else {
                // Create new
                const newType = {
                    id: `type-${Date.now()}`,
                    ...roomTypeData
                };
                setRoomTypes(prev => [...prev, newType]);
                toast.success('Room type created successfully!');
            }

            closeModal();
        } catch (error) {
            console.error('Error saving room type:', error);
            toast.error('Failed to save room type');
        }
    };

    const handleDelete = (roomType) => {
        if (window.confirm(`Are you sure you want to delete "${roomType.name}"?`)) {
            setRoomTypes(prev => prev.filter(t => t.id !== roomType.id));
            toast.success('Room type deleted successfully!');
        }
    };

    const toggleAmenity = (amenity) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    return (
        <div className="room-types-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">Room Types</h1>
                    <p className="page-subtitle">
                        Manage room categories and their configurations
                    </p>
                </div>
                <div className="page-header-actions">
                    <Button variant="primary" icon={<FiPlus />} onClick={openAddModal}>
                        Add Room Type
                    </Button>
                </div>
            </div>

            {/* Room Types Grid */}
            {loading ? (
                <div className="room-types-grid">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="room-type-card skeleton-card">
                            <div className="skeleton-content" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="room-types-grid">
                    {roomTypes.map((roomType) => (
                        <motion.div
                            key={roomType.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="room-type-card" hoverable>
                                <div className="room-type-header">
                                    <h3 className="room-type-name">{roomType.name}</h3>
                                    <div className="room-type-actions">
                                        <button
                                            className="room-type-action-btn"
                                            onClick={() => openEditModal(roomType)}
                                            title="Edit"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="room-type-action-btn delete"
                                            onClick={() => handleDelete(roomType)}
                                            title="Delete"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>

                                <p className="room-type-description">{roomType.description}</p>

                                <div className="room-type-details">
                                    <div className="room-type-detail">
                                        <FiDollarSign />
                                        <span>${roomType.basePrice}/night</span>
                                    </div>
                                    <div className="room-type-detail">
                                        <FiUsers />
                                        <span>{roomType.maxOccupancy} guests</span>
                                    </div>
                                    <div className="room-type-detail">
                                        <FiMaximize />
                                        <span>{roomType.size} m²</span>
                                    </div>
                                </div>

                                <div className="room-type-amenities">
                                    {roomType.amenities?.slice(0, 4).map((amenity) => (
                                        <span key={amenity} className="amenity-tag">
                                            {amenity}
                                        </span>
                                    ))}
                                    {roomType.amenities?.length > 4 && (
                                        <span className="amenity-more">
                                            +{roomType.amenities.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                        />
                        <motion.div
                            className="modal"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        >
                            <div className="modal-header">
                                <h2>{editingType ? 'Edit Room Type' : 'Add Room Type'}</h2>
                                <button className="modal-close" onClick={closeModal}>
                                    <FiX />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
                                <div className="form-grid">
                                    <Input
                                        label="Type Name"
                                        placeholder="e.g., Deluxe Room"
                                        error={errors.name?.message}
                                        {...register('name', { required: 'Name is required' })}
                                    />

                                    <Input
                                        label="Base Price ($)"
                                        type="number"
                                        placeholder="0.00"
                                        error={errors.basePrice?.message}
                                        {...register('basePrice', { required: 'Price is required' })}
                                    />

                                    <Input
                                        label="Max Occupancy"
                                        type="number"
                                        placeholder="2"
                                        error={errors.maxOccupancy?.message}
                                        {...register('maxOccupancy', { required: 'Required' })}
                                    />

                                    <Input
                                        label="Room Size (m²)"
                                        type="number"
                                        placeholder="30"
                                        error={errors.size?.message}
                                        {...register('size', { required: 'Required' })}
                                    />

                                    <div className="form-group">
                                        <label className="form-label">Bed Type</label>
                                        <select
                                            className="form-select"
                                            {...register('bedType', { required: 'Required' })}
                                        >
                                            <option value="">Select bed type</option>
                                            <option value="Single">Single</option>
                                            <option value="Double">Double</option>
                                            <option value="Queen">Queen</option>
                                            <option value="King">King</option>
                                            <option value="Twin">Twin</option>
                                            <option value="King + Twin">King + Twin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Describe this room type..."
                                        rows={3}
                                        {...register('description')}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Amenities</label>
                                    <div className="amenities-grid">
                                        {amenitiesList.map(amenity => (
                                            <label
                                                key={amenity}
                                                className={`amenity-chip ${selectedAmenities.includes(amenity) ? 'selected' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAmenities.includes(amenity)}
                                                    onChange={() => toggleAmenity(amenity)}
                                                />
                                                <span>{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <Button type="button" variant="outline" onClick={closeModal}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary">
                                        {editingType ? 'Update' : 'Create'} Room Type
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoomTypes;
