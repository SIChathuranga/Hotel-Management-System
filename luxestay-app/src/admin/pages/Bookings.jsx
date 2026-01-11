// Bookings Management Page
// View and manage all hotel bookings

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiCalendar,
    FiMoreVertical,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiEye,
    FiEdit2
} from 'react-icons/fi';
import {
    Button,
    Input,
    Card,
    Spinner
} from '../../shared/components/ui';
import { getBookings } from '../../firebase/services/bookingService';
import toast from 'react-hot-toast';
import './Bookings.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const res = await getBookings();
            if (res.success) {
                setBookings(res.data);
            } else {
                toast.error(res.error || 'Failed to load bookings');
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const styles = {
            confirmed: 'badge-confirmed',
            checked_in: 'badge-active',
            checked_out: 'badge-completed',
            pending: 'badge-pending',
            cancelled: 'badge-cancelled'
        };

        const labels = {
            confirmed: 'Confirmed',
            checked_in: 'Checked In',
            checked_out: 'Checked Out',
            pending: 'Pending',
            cancelled: 'Cancelled'
        };

        return (
            <span className={`status-badge ${styles[status] || 'badge-default'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="bookings-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Bookings</h1>
                    <p className="page-subtitle">Manage reservations and check-ins</p>
                </div>
                <Link to="/admin/bookings/new">
                    <Button icon={<FiPlus />} variant="primary">New Booking</Button>
                </Link>
            </div>

            {/* Filters Section */}
            <Card className="filters-card">
                <div className="filters-grid">
                    <div className="search-wrapper">
                        <Input
                            placeholder="Search guest, booking #, or room..."
                            icon={<FiSearch />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="status-filter">
                        <select
                            className="select-input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked_in">Checked In</option>
                            <option value="checked_out">Checked Out</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <Button variant="outline" icon={<FiFilter />}>
                        More Filters
                    </Button>
                </div>
            </Card>

            {/* Bookings List */}
            {loading ? (
                <div className="loading-container">
                    <Spinner size="large" />
                </div>
            ) : filteredBookings.length > 0 ? (
                <Card className="bookings-table-card">
                    <div className="table-responsive">
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>Booking Info</th>
                                    <th>Guest</th>
                                    <th>Room</th>
                                    <th>Stay Dates</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>
                                            <div className="booking-info">
                                                <span className="booking-number">{booking.bookingNumber}</span>
                                                <span className="booking-date">
                                                    Created: {new Date(booking.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="guest-info">
                                                <span className="guest-name">{booking.guestName}</span>
                                                <span className="guest-guests">
                                                    {booking.guests} Guest{booking.guests > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="room-info">
                                                <span className="room-number">Room {booking.roomNumber}</span>
                                                <span className="room-type">{booking.roomType}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="dates-info">
                                                <div className="date-row">
                                                    <span className="date-label">In:</span>
                                                    <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="date-row">
                                                    <span className="date-label">Out:</span>
                                                    <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="amount-info">
                                                <span className="total-amount">${booking.totalAmount}</span>
                                                <span className={`payment-status ${booking.paymentStatus}`}>
                                                    {booking.paymentStatus.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(booking.status)}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <Link to={`/admin/bookings/${booking.id}`}>
                                                    <button className="action-btn view" title="View Details">
                                                        <FiEye />
                                                    </button>
                                                </Link>
                                                <Link to={`/admin/bookings/edit/${booking.id}`}>
                                                    <button className="action-btn edit" title="Edit Booking">
                                                        <FiEdit2 />
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon-bg">
                        <FiCalendar />
                    </div>
                    <h3>No Bookings Found</h3>
                    <p>Try adjusting your filters or create a new booking.</p>
                </div>
            )}
        </div>
    );
};

export default Bookings;
