// Room Card Component
// Displays a single room in a card format

import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiHome, FiEdit2, FiTrash2, FiMaximize } from 'react-icons/fi';
import { Card } from '../../shared/components/ui';
import './RoomCard.css';

const statusColors = {
    available: 'status-available',
    occupied: 'status-occupied',
    reserved: 'status-reserved',
    maintenance: 'status-maintenance',
    cleaning: 'status-cleaning'
};

const statusLabels = {
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',
    maintenance: 'Maintenance',
    cleaning: 'Cleaning'
};

const RoomCard = ({
    room,
    onEdit,
    onDelete,
    onViewDetails,
    showActions = true
}) => {
    const { roomNumber, roomTypeName, floor, status, price, images, maxOccupancy, size } = room;

    // Get first image or placeholder
    const coverImage = images && images.length > 0
        ? images[0]
        : '/images/room-placeholder.jpg';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="room-card-wrapper"
        >
            <Card className="room-card" hoverable>
                {/* Room Image */}
                <div className="room-card-image">
                    <img src={coverImage} alt={`Room ${roomNumber}`} />
                    <div className={`room-card-status ${statusColors[status]}`}>
                        {statusLabels[status]}
                    </div>
                    <div className="room-card-number">#{roomNumber}</div>
                </div>

                {/* Room Info */}
                <div className="room-card-body">
                    <div className="room-card-header">
                        <h3 className="room-card-title">{roomTypeName}</h3>
                        <span className="room-card-floor">Floor {floor}</span>
                    </div>

                    <div className="room-card-details">
                        {maxOccupancy && (
                            <span className="room-card-detail">
                                <FiUsers />
                                <span>{maxOccupancy} guests</span>
                            </span>
                        )}
                        {size && (
                            <span className="room-card-detail">
                                <FiMaximize />
                                <span>{size} m²</span>
                            </span>
                        )}
                    </div>

                    <div className="room-card-footer">
                        <div className="room-card-price">
                            <span className="price-value">${price}</span>
                            <span className="price-period">/night</span>
                        </div>

                        {showActions && (
                            <div className="room-card-actions">
                                {onViewDetails && (
                                    <button
                                        className="room-action-btn room-action-view"
                                        onClick={() => onViewDetails(room)}
                                        title="View Details"
                                    >
                                        <FiMaximize />
                                    </button>
                                )}
                                {onEdit && (
                                    <button
                                        className="room-action-btn room-action-edit"
                                        onClick={() => onEdit(room)}
                                        title="Edit Room"
                                    >
                                        <FiEdit2 />
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        className="room-action-btn room-action-delete"
                                        onClick={() => onDelete(room)}
                                        title="Delete Room"
                                    >
                                        <FiTrash2 />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default RoomCard;
