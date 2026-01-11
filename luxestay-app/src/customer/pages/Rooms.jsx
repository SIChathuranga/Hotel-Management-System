// Customer Rooms Page

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiWifi, FiTv, FiCoffee, FiUser, FiMaximize2 } from 'react-icons/fi';
import { getRooms } from '../../firebase/services/roomService';
import { Spinner, Input } from '../../shared/components/ui';
import './Rooms.css';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        const res = await getRooms();
        if (res.success) setRooms(res.data);
        setLoading(false);
    };

    const filteredRooms = filterType === 'All'
        ? rooms
        : rooms.filter(r => r.roomTypeName === filterType);

    const roomTypes = ['All', ...new Set(rooms.map(r => r.roomTypeName))];

    if (loading) return <div className="loading-container"><Spinner /></div>;

    return (
        <div className="customer-rooms-page">
            <div className="rooms-header">
                <div className="container">
                    <h1>Our Rooms & Suites</h1>
                    <p>Find your perfect space for relaxation</p>
                </div>
            </div>

            <div className="container rooms-content">
                {/* Filters */}
                <div className="filters-row">
                    <span>Filter by:</span>
                    <div className="type-buttons">
                        {roomTypes.map(type => (
                            <button
                                key={type}
                                className={`filter-btn ${filterType === type ? 'active' : ''}`}
                                onClick={() => setFilterType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="rooms-list-grid">
                    {filteredRooms.map(room => (
                        <div key={room.id} className="room-card-large">
                            <div className="card-image">
                                <div className="placeholder-content">
                                    {room.roomTypeName?.includes('Suite') ? '🏰' : '🛏️'}
                                </div>
                                <div className="price-tag">
                                    ${room.price}<span>/night</span>
                                </div>
                            </div>
                            <div className="card-details">
                                <div className="details-header">
                                    <h2>{room.roomTypeName}</h2>
                                    <span className={`status-pill ${room.status?.toLowerCase() || 'available'}`}>
                                        {room.status || 'Available'}
                                    </span>
                                </div>
                                <div className="room-features">
                                    <span><FiUser /> 2 Adults</span>
                                    <span><FiMaximize2 /> 35m²</span>
                                    <span><FiWifi /> Free Wifi</span>
                                </div>
                                <p className="room-desc">
                                    Experience comfort in our {room.roomTypeName?.toLowerCase() || 'room'}.
                                    Featuring modern amenities and a stunning view.
                                </p>
                                <div className="card-actions">
                                    <Link to={`/book/${room.id}`} className="book-btn">
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Rooms;
