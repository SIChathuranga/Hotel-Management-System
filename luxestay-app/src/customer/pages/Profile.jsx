// Customer Profile Page

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { getBookings } from '../../firebase/services/bookingService';
import { Card, Spinner, Button } from '../../shared/components/ui';
import { FiLogOut } from 'react-icons/fi';
import { logOut } from '../../firebase/auth'; // Ensure this is exported
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadHistory();
        }
    }, [user]);

    const loadHistory = async () => {
        const res = await getBookings();
        if (res.success) {
            // Filter by guest name or ID (Mock filtering simply by assuming user match if we had IDs)
            // For mock, just show all or filter by 'Guest' if feasible.
            // We'll just show all mock bookings for demo as mock user names vary.
            setBookings(res.data);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await logOut();
        navigate('/');
    };

    if (loading) return <div className="loading-container"><Spinner /></div>;
    // Basic protection
    if (!user) return <div className="p-8 text-center">Please login to view profile.</div>;

    return (
        <div className="profile-page container">
            <div className="profile-header">
                <div>
                    <h1>My Account</h1>
                    <p>Welcome back, {user.displayName || 'Guest'}</p>
                </div>
                <Button variant="outline" icon={<FiLogOut />} onClick={handleLogout}>Logout</Button>
            </div>

            <div className="profile-grid">
                <div className="profile-sidebar">
                    <Card className="user-card">
                        <div className="user-avatar text-4xl mb-4">
                            {user.photoURL ? <img src={user.photoURL} className="w-16 h-16 rounded-full" /> : '👤'}
                        </div>
                        <h3>{user.displayName || 'Guest User'}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </Card>
                </div>

                <div className="profile-content">
                    <h2 className="section-title">Booking History</h2>
                    {bookings.length > 0 ? (
                        <div className="bookings-list">
                            {bookings.map(b => (
                                <Card key={b.id} className="booking-item-card">
                                    <div className="booking-header">
                                        <span className="booking-id">#{b.id}</span>
                                        <span className={`status-pill pill-${b.status?.toLowerCase()}`}>{b.status}</span>
                                    </div>
                                    <div className="booking-body">
                                        <div className="info-col">
                                            <span className="label">Room</span>
                                            <span className="value">Room {b.roomNumber}</span>
                                        </div>
                                        <div className="info-col">
                                            <span className="label">Check-In</span>
                                            <span className="value">{b.checkIn}</span>
                                        </div>
                                        <div className="info-col">
                                            <span className="label">Check-Out</span>
                                            <span className="value">{b.checkOut}</span>
                                        </div>
                                        <div className="info-col text-right">
                                            <span className="label">Total</span>
                                            <span className="value price">${b.totalPrice}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No booking history found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
