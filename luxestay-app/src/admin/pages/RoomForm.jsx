// Add/Edit Room Page
// Form for creating or editing a room

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiSave, FiUpload, FiX, FiImage } from 'react-icons/fi';
import { Button, Input, Card } from '../../shared/components/ui';
import { getMockRoomTypes } from '../../firebase/services/roomService';
import { isFirebaseConfigured } from '../../firebase/config';
import toast from 'react-hot-toast';
import './RoomForm.css';

const amenitiesList = [
    'WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker',
    'Safe', 'Hair Dryer', 'Iron', 'Balcony', 'Ocean View',
    'City View', 'Living Room', 'Jacuzzi', 'Kitchen', 'Workspace'
];

const RoomForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm({
        defaultValues: {
            roomNumber: '',
            roomTypeId: '',
            floor: '',
            status: 'available',
            price: '',
            description: '',
            notes: ''
        }
    });

    const selectedRoomType = watch('roomTypeId');

    // Load room types
    useEffect(() => {
        loadRoomTypes();
        if (isEditMode) {
            loadRoom();
        }
    }, [id]);

    // Auto-fill price when room type changes
    useEffect(() => {
        if (selectedRoomType && roomTypes.length > 0) {
            const roomType = roomTypes.find(t => t.id === selectedRoomType);
            if (roomType && !isEditMode) {
                setValue('price', roomType.basePrice);
                setSelectedAmenities(roomType.amenities || []);
            }
        }
    }, [selectedRoomType, roomTypes]);

    const loadRoomTypes = async () => {
        try {
            if (!isFirebaseConfigured()) {
                setRoomTypes(getMockRoomTypes());
            } else {
                // TODO: Load from Firebase
                setRoomTypes(getMockRoomTypes());
            }
        } catch (error) {
            console.error('Error loading room types:', error);
        }
    };

    const loadRoom = async () => {
        try {
            setLoading(true);
            // TODO: Load room data from Firebase
            // For now, mock data
            const mockRoom = {
                roomNumber: '101',
                roomTypeId: 'type-1',
                floor: '1',
                status: 'available',
                price: 99,
                description: 'A comfortable standard room with modern amenities.',
                notes: ''
            };
            reset(mockRoom);
            setSelectedAmenities(['WiFi', 'TV', 'Air Conditioning']);
        } catch (error) {
            console.error('Error loading room:', error);
            toast.error('Failed to load room');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const roomData = {
                ...data,
                floor: parseInt(data.floor),
                price: parseFloat(data.price),
                amenities: selectedAmenities,
                images: images.map(img => img.url),
                roomTypeName: roomTypes.find(t => t.id === data.roomTypeId)?.name || ''
            };

            // TODO: Save to Firebase
            console.log('Room data:', roomData);

            toast.success(isEditMode ? 'Room updated successfully!' : 'Room created successfully!');
            navigate('/admin/rooms');
        } catch (error) {
            console.error('Error saving room:', error);
            toast.error('Failed to save room');
        } finally {
            setLoading(false);
        }
    };

    const toggleAmenity = (amenity) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setImages(prev => [...prev, { file, url: reader.result }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="room-form-page">
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
                    <h1 className="page-title">
                        {isEditMode ? 'Edit Room' : 'Add New Room'}
                    </h1>
                    <p className="page-subtitle">
                        {isEditMode ? 'Update room details and settings' : 'Create a new room in your hotel'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="room-form-grid">
                    {/* Main Form */}
                    <div className="room-form-main">
                        {/* Basic Information */}
                        <Card title="Basic Information" className="form-card">
                            <div className="form-grid">
                                <Input
                                    label="Room Number"
                                    placeholder="e.g., 101"
                                    error={errors.roomNumber?.message}
                                    {...register('roomNumber', {
                                        required: 'Room number is required'
                                    })}
                                />

                                <div className="form-group">
                                    <label className="form-label">Room Type</label>
                                    <select
                                        className={`form-select ${errors.roomTypeId ? 'error' : ''}`}
                                        {...register('roomTypeId', {
                                            required: 'Room type is required'
                                        })}
                                    >
                                        <option value="">Select room type</option>
                                        {roomTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name} - ${type.basePrice}/night
                                            </option>
                                        ))}
                                    </select>
                                    {errors.roomTypeId && (
                                        <span className="form-error">{errors.roomTypeId.message}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Floor</label>
                                    <select
                                        className={`form-select ${errors.floor ? 'error' : ''}`}
                                        {...register('floor', { required: 'Floor is required' })}
                                    >
                                        <option value="">Select floor</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(floor => (
                                            <option key={floor} value={floor}>
                                                Floor {floor}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.floor && (
                                        <span className="form-error">{errors.floor.message}</span>
                                    )}
                                </div>

                                <Input
                                    label="Price per Night ($)"
                                    type="number"
                                    placeholder="0.00"
                                    error={errors.price?.message}
                                    {...register('price', {
                                        required: 'Price is required',
                                        min: { value: 0, message: 'Price must be positive' }
                                    })}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Enter room description..."
                                    rows={4}
                                    {...register('description')}
                                />
                            </div>
                        </Card>

                        {/* Amenities */}
                        <Card title="Amenities" className="form-card">
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
                        </Card>

                        {/* Images */}
                        <Card title="Room Images" className="form-card">
                            <div className="images-upload">
                                <label className="image-upload-btn">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        hidden
                                    />
                                    <FiUpload />
                                    <span>Upload Images</span>
                                </label>
                            </div>

                            {images.length > 0 && (
                                <div className="images-preview">
                                    {images.map((image, index) => (
                                        <div key={index} className="image-preview">
                                            <img src={image.url} alt={`Room ${index + 1}`} />
                                            <button
                                                type="button"
                                                className="image-remove-btn"
                                                onClick={() => removeImage(index)}
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {images.length === 0 && (
                                <div className="images-empty">
                                    <FiImage className="empty-icon" />
                                    <p>No images uploaded</p>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="room-form-sidebar">
                        {/* Status */}
                        <Card title="Status" className="form-card">
                            <div className="form-group">
                                <label className="form-label">Room Status</label>
                                <select className="form-select" {...register('status')}>
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="reserved">Reserved</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="cleaning">Cleaning</option>
                                </select>
                            </div>
                        </Card>

                        {/* Notes */}
                        <Card title="Internal Notes" className="form-card">
                            <div className="form-group">
                                <textarea
                                    className="form-textarea"
                                    placeholder="Add internal notes about this room..."
                                    rows={4}
                                    {...register('notes')}
                                />
                            </div>
                        </Card>

                        {/* Actions */}
                        <div className="form-actions">
                            <Button
                                type="submit"
                                variant="primary"
                                icon={<FiSave />}
                                fullWidth
                                loading={loading}
                            >
                                {isEditMode ? 'Update Room' : 'Create Room'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                fullWidth
                                onClick={() => navigate('/admin/rooms')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RoomForm;
