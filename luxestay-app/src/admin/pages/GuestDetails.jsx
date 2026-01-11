// Guest Details Page
// View detailed guest profile and history

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCreditCard,
    FiClock,
    FiStar,
    FiEdit2,
    FiTrash2,
    FiArrowLeft,
    FiCalendar
} from 'react-icons/fi';
import { Button, Card, Spinner } from '../../shared/components/ui';
import { getGuestById, deleteGuest, getGuestHistory } from '../../firebase/services/guestService';
import toast from 'react-hot-toast';
import './GuestDetails.css';

const GuestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [guest, setGuest] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [guestRes, historyRes] = await Promise.all([
                getGuestById(id),
                getGuestHistory(id)
            ]);

            if (guestRes.success) {
                setGuest(guestRes.data);
            } else {
                toast.error('Guest not found');
                navigate('/admin/guests');
            }

            if (historyRes.success) {
                setHistory(historyRes.data);
            }
        } catch (error) {
            console.error('Error loading details:', error);
            toast.error('Failed to load guest details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this guest profile?')) {
            const res = await deleteGuest(id);
            if (res.success) {
                toast.success('Guest deleted');
                navigate('/admin/guests');
            } else {
                toast.error('Failed to delete guest');
            }
        }
    };

    if (loading) {
        return (
            <div className="guest-details-page loading">
                <Spinner size="large" />
            </div>
        );
    }

    if (!guest) return null;

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Gold': return '#FFD700';
            case 'Platinum': return '#E5E4E2';
            case 'Silver': return '#C0C0C0';
            default: return '#CD7F32';
        }
    };

    return (
        <div className="guest-details-page">
            <div className="page-header">
                <div className="header-left">
                    <Link to="/admin/guests" className="back-link">
                        <FiArrowLeft /> Back to Guests
                    </Link>
                    <h1 className="page-title">{guest.fullName}</h1>
                    <span className="guest-id">ID: {guest.id}</span>
                </div>
                <div className="header-actions">
                    <Link to={`/admin/guests/edit/${id}`}>
                        <Button variant="outline" icon={<FiEdit2 />}>Edit Profile</Button>
                    </Link>
                    <Button
                        variant="death"
                        className="btn-danger"
                        icon={<FiTrash2 />}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <div className="details-grid">
                {/* Left Column: Profile & Stats */}
                <div className="details-left">
                    {/* Loyalty Card */}
                    <Card className="loyalty-card" style={{ borderColor: getTierColor(guest.loyaltyTier) }}>
                        <div className="loyalty-header">
                            <div className="tier-badge" style={{ backgroundColor: getTierColor(guest.loyaltyTier) }}>
                                <FiStar /> {guest.loyaltyTier} Member
                            </div>
                            <div className="points">
                                <span className="points-value">{guest.loyaltyPoints.toLocaleString()}</span>
                                <span className="points-label">Points</span>
                            </div>
                        </div>
                        <div className="loyalty-progress">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: '65%',
                                        backgroundColor: getTierColor(guest.loyaltyTier)
                                    }}
                                />
                            </div>
                            <span className="progress-text">1,500 points to next tier</span>
                        </div>
                    </Card>

                    <Card title="Contact Information" icon={<FiUser />}>
                        <div className="info-list">
                            <div className="info-item">
                                <FiMail className="info-icon" />
                                <div>
                                    <label>Email</label>
                                    <p>{guest.email}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <FiPhone className="info-icon" />
                                <div>
                                    <label>Phone</label>
                                    <p>{guest.phone}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <FiMapPin className="info-icon" />
                                <div>
                                    <label>Address</label>
                                    <p>{guest.address}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <FiCreditCard className="info-icon" />
                                <div>
                                    <label>Passport/ID</label>
                                    <p>{guest.passportNumber || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Guest Statistics" icon={<FiClock />} className="mt-6">
                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="stat-val">{guest.totalStays}</span>
                                <span className="stat-lbl">Total Stays</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-val">${guest.totalSpent.toLocaleString()}</span>
                                <span className="stat-lbl">Total Spent</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-val">{guest.nationality}</span>
                                <span className="stat-lbl">Nationality</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: History & Notes */}
                <div className="details-right">
                    <Card title="Stay History" icon={<FiCalendar />}>
                        {history.length > 0 ? (
                            <div className="history-list">
                                {history.map(item => (
                                    <div key={item.id} className="history-item">
                                        <div className="history-icon">
                                            <FiClock />
                                        </div>
                                        <div className="history-details">
                                            <h4>Room {item.roomNumber}</h4>
                                            <p>{item.checkIn} — {item.checkOut}</p>
                                        </div>
                                        <div className="history-meta">
                                            <span className="history-amount">${item.total}</span>
                                            <span className={`status-tag ${item.status}`}>{item.status.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-history">
                                No previous stays recorded.
                            </div>
                        )}
                        <div className="view-all-link">
                            <Link to={`/admin/bookings?guestId=${guest.id}`}>View all bookings</Link>
                        </div>
                    </Card>

                    <Card title="Notes & Preferences" className="mt-6">
                        <div className="notes-content">
                            {guest.notes ? (
                                <p>{guest.notes}</p>
                            ) : (
                                <p className="no-notes">No notes available.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default GuestDetails;
