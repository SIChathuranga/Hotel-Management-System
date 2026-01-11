// Booking Process Page

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiCalendar, FiUser, FiCreditCard, FiCheck } from 'react-icons/fi';
import { getRooms } from '../../firebase/services/roomService';
import { createBooking } from '../../firebase/services/bookingService';
import { Button, Input, Spinner, Card } from '../../shared/components/ui';
import toast from 'react-hot-toast';
import './BookingProcess.css';

const BookingProcess = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({});

    // Forms
    const { register: registerDates, handleSubmit: handleDates, watch: watchDates } = useForm();
    const { register: registerGuest, handleSubmit: handleGuest, formState: { errors: guestErrors } } = useForm();

    useEffect(() => {
        loadRoom();
    }, [roomId]);

    const loadRoom = async () => {
        const res = await getRooms(); // Should implement specific getRoomById public/private
        if (res.success) {
            const r = res.data.find(item => item.id.toString() === roomId || item.id === roomId);
            if (r) setRoom(r);
        }
        setLoading(false);
    };

    const onSubmitDates = (data) => {
        if (new Date(data.checkOut) <= new Date(data.checkIn)) {
            toast.error('Check-out must be after check-in');
            return;
        }
        setBookingData(prev => ({ ...prev, ...data }));
        setStep(2);
    };

    const onSubmitGuest = (data) => {
        setBookingData(prev => ({ ...prev, ...data }));
        setStep(3);
    };

    const handlePayment = async () => {
        setLoading(true);
        // Calculate nights
        const nights = Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24));
        const total = nights * room.price;

        const payload = {
            roomId: room.id,
            roomNumber: room.roomNumber, // In real app, might select specific room instance
            guestName: bookingData.firstName + ' ' + bookingData.lastName,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            guests: 2, // simplified
            totalPrice: total,
            status: 'Confirmed'
        };

        const res = await createBooking(payload);
        if (res.success) {
            toast.success('Booking Confirmed!');
            navigate('/profile'); // or success page
        } else {
            toast.error('Booking failed');
        }
        setLoading(false);
    };

    if (loading && !bookingData.checkIn && !room) return <div className="loading-container"><Spinner /></div>;
    if (!room) return <div className="p-8 text-center">Room not found</div>;

    return (
        <div className="booking-page container">
            <div className="booking-progress">
                <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-icon"><FiCalendar /></div>
                    <span>Dates</span>
                </div>
                <div className="step-line"></div>
                <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-icon"><FiUser /></div>
                    <span>Guest</span>
                </div>
                <div className="step-line"></div>
                <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-icon"><FiCreditCard /></div>
                    <span>Payment</span>
                </div>
            </div>

            <div className="booking-content-grid">
                {/* Main Form Area */}
                <div className="booking-form-area">
                    {step === 1 && (
                        <Card className="form-card">
                            <h2>Select Dates</h2>
                            <form onSubmit={handleDates(onSubmitDates)} className="step-form">
                                <div className="row-2-col">
                                    <div className="input-group">
                                        <label>Check-In Date</label>
                                        <Input type="date" {...registerDates('checkIn', { required: true })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Check-Out Date</label>
                                        <Input type="date" {...registerDates('checkOut', { required: true })} />
                                    </div>
                                </div>
                                <div className="form-actions-right">
                                    <Button variant="primary" type="submit">Continue</Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {step === 2 && (
                        <Card className="form-card">
                            <h2>Guest Details</h2>
                            <form onSubmit={handleGuest(onSubmitGuest)} className="step-form">
                                <div className="row-2-col">
                                    <div className="input-group">
                                        <label>First Name</label>
                                        <Input {...registerGuest('firstName', { required: true })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Last Name</label>
                                        <Input {...registerGuest('lastName', { required: true })} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <Input type="email" {...registerGuest('email', { required: true })} />
                                </div>
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <Input {...registerGuest('phone', { required: true })} />
                                </div>
                                <div className="form-actions-split">
                                    <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                                    <Button variant="primary" type="submit">Continue</Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {step === 3 && (
                        <Card className="form-card">
                            <h2>Payment & Confirm</h2>
                            <div className="payment-preview">
                                <p className="text-sm text-gray-500 mb-4">
                                    Enter your payment details to secure this booking.
                                    (This is a mock payment form).
                                </p>
                                <div className="input-group mb-4">
                                    <label>Card Number</label>
                                    <Input placeholder="0000 0000 0000 0000" />
                                </div>
                                <div className="row-2-col mb-4">
                                    <div className="input-group">
                                        <label>Expiry</label>
                                        <Input placeholder="MM/YY" />
                                    </div>
                                    <div className="input-group">
                                        <label>CVC</label>
                                        <Input placeholder="123" />
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions-split">
                                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                                <Button variant="primary" onClick={handlePayment} loading={loading}>
                                    Pay & Book
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Summary Sidebar */}
                <div className="booking-summary">
                    <Card className="summary-card">
                        <h3>Booking Summary</h3>
                        <div className="summary-room">
                            <span className="text-xl font-bold">{room.roomTypeName}</span>
                            <span className="text-sm text-gray-500">Room {room.roomNumber}</span>
                        </div>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Check-In</span>
                                <span>{bookingData.checkIn || '-'}</span>
                            </div>
                            <div className="summary-row">
                                <span>Check-Out</span>
                                <span>{bookingData.checkOut || '-'}</span>
                            </div>
                            <div className="summary-row">
                                <span>Guests</span>
                                <span>2 Adults</span>
                            </div>
                        </div>
                        <div className="summary-total">
                            <span>Total (Approx)</span>
                            <span className="total-price">
                                ${bookingData.checkIn && bookingData.checkOut
                                    ? (Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24)) * room.price).toFixed(2)
                                    : room.price
                                }
                            </span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BookingProcess;
