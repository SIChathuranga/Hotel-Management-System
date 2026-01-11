// Booking Form Page
// Create or edit a booking

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
    FiSave,
    FiX,
    FiCalendar,
    FiUser,
    FiCreditCard,
    FiHome,
    FiCheck
} from 'react-icons/fi';
import {
    Button,
    Input,
    Card,
    Spinner
} from '../../shared/components/ui';
import {
    createBooking,
    getBookingById,
    updateBooking
} from '../../firebase/services/bookingService';
import { getRooms, getRoomTypes } from '../../firebase/services/roomService';
import toast from 'react-hot-toast';
import { differenceInDays, addDays, format } from 'date-fns';
import './BookingForm.css';

const BookingForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);

    // Form setup
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            guestName: '',
            email: '',
            phone: '',
            checkInDate: format(new Date(), 'yyyy-MM-dd'),
            checkOutDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
            guests: 1,
            roomId: '',
            status: 'confirmed',
            paymentStatus: 'pending',
            notes: ''
        }
    });

    const checkInDate = watch('checkInDate');
    const checkOutDate = watch('checkOutDate');
    const selectedRoomId = watch('roomId');

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                setInitialLoading(true);
                const [roomsRes, roomTypesRes] = await Promise.all([
                    getRooms(),
                    getRoomTypes()
                ]);

                if (roomsRes.success) setRooms(roomsRes.data);
                if (roomTypesRes.success) setRoomTypes(roomTypesRes.data);

                if (isEditMode) {
                    const res = await getBookingById(id);
                    if (res.success) {
                        const booking = res.data;
                        // Format dates for input fields
                        const formattedBooking = {
                            ...booking,
                            checkInDate: booking.checkInDate.split('T')[0],
                            checkOutDate: booking.checkOutDate.split('T')[0]
                        };

                        Object.keys(formattedBooking).forEach(key => {
                            setValue(key, formattedBooking[key]);
                        });
                    } else {
                        toast.error('Booking not found');
                        navigate('/admin/bookings');
                    }
                }
            } catch (error) {
                console.error('Error loading booking data:', error);
                toast.error('Failed to load data');
                navigate('/admin/bookings');
            } finally {
                setInitialLoading(false);
            }
        };

        loadData();
    }, [id, isEditMode, navigate, setValue]);

    // Calculate nights and total price
    const nights = differenceInDays(new Date(checkOutDate), new Date(checkInDate));
    const selectedRoom = rooms.find(r => r.id === selectedRoomId);

    // Auto-calculate amount when room or dates change
    const totalAmount = selectedRoom && nights > 0
        ? selectedRoom.price * nights
        : 0;

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // Validate dates
            if (nights <= 0) {
                toast.error('Check-out date must be after check-in date');
                return;
            }

            const room = rooms.find(r => r.id === data.roomId);
            const roomType = roomTypes.find(t => t.id === room?.roomTypeId);

            const bookingData = {
                ...data,
                checkInDate: new Date(data.checkInDate).toISOString(),
                checkOutDate: new Date(data.checkOutDate).toISOString(),
                roomNumber: room?.roomNumber || 'Unknown',
                roomType: roomType?.name || 'Standard',
                totalAmount: totalAmount, // Recalculate to ensure accuracy
                guests: parseInt(data.guests)
            };

            if (isEditMode) {
                const res = await updateBooking(id, bookingData);
                if (res.success) {
                    toast.success('Booking updated successfully');
                    navigate('/admin/bookings');
                } else {
                    toast.error(res.error || 'Failed to update booking');
                }
            } else {
                const res = await createBooking(bookingData);
                if (res.success) {
                    toast.success('Booking created successfully');
                    navigate('/admin/bookings');
                } else {
                    toast.error(res.error || 'Failed to create booking');
                }
            }
        } catch (error) {
            console.error('Error saving booking:', error);
            toast.error('Failed to save booking');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="booking-form-page loading">
                <Spinner size="large" />
            </div>
        );
    }

    return (
        <div className="booking-form-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{isEditMode ? 'Edit Booking' : 'New Booking'}</h1>
                    <p className="page-subtitle">Fill in the details to create a reservation</p>
                </div>
                <div className="header-actions">
                    <Button
                        variant="secondary"
                        icon={<FiX />}
                        onClick={() => navigate('/admin/bookings')}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        icon={<FiSave />}
                        onClick={handleSubmit(onSubmit)}
                        loading={loading}
                    >
                        Save Booking
                    </Button>
                </div>
            </div>

            <div className="form-grid">
                {/* Guest & Stay Details */}
                <div className="form-column">
                    <Card title="Guest Information" icon={<FiUser />}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <Input
                                placeholder="Enter guest name"
                                {...register('guestName', { required: 'Guest name is required' })}
                                error={errors.guestName?.message}
                            />
                        </div>
                        <div className="row-2-col">
                            <div className="input-group">
                                <label>Email</label>
                                <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    {...register('email', { required: 'Email is required' })}
                                    error={errors.email?.message}
                                />
                            </div>
                            <div className="input-group">
                                <label>Phone</label>
                                <Input
                                    placeholder="+1 (555) 000-0000"
                                    {...register('phone', { required: 'Phone is required' })}
                                    error={errors.phone?.message}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card title="Stay Details" icon={<FiCalendar />} className="mt-6">
                        <div className="row-2-col">
                            <div className="input-group">
                                <label>Check-in Date</label>
                                <Input
                                    type="date"
                                    {...register('checkInDate', { required: 'Check-in date is required' })}
                                    error={errors.checkInDate?.message}
                                />
                            </div>
                            <div className="input-group">
                                <label>Check-out Date</label>
                                <Input
                                    type="date"
                                    {...register('checkOutDate', { required: 'Check-out date is required' })}
                                    error={errors.checkOutDate?.message}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Number of Guests</label>
                            <Input
                                type="number"
                                min="1"
                                {...register('guests', { required: 'Number of guests is required', min: 1 })}
                                error={errors.guests?.message}
                            />
                        </div>
                    </Card>

                    <Card title="Notes" className="mt-6">
                        <div className="input-group">
                            <label>Internal Notes</label>
                            <textarea
                                className="textarea-input"
                                rows="3"
                                placeholder="Special requests, flight details, etc."
                                {...register('notes')}
                            />
                        </div>
                    </Card>
                </div>

                {/* Room & Payment */}
                <div className="form-column">
                    <Card title="Room Selection" icon={<FiHome />}>
                        <div className="input-group">
                            <label>Select Room</label>
                            <select
                                className="select-input"
                                {...register('roomId', { required: 'Please select a room' })}
                            >
                                <option value="">-- Choose a Room --</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        Room {room.roomNumber} - {room.roomTypeName} (${room.price}/night)
                                    </option>
                                ))}
                            </select>
                            {errors.roomId && <span className="error-text">{errors.roomId.message}</span>}
                        </div>

                        {selectedRoom && (
                            <div className="room-summary">
                                <div className="summary-row">
                                    <span>Rate per night:</span>
                                    <span>${selectedRoom.price}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Nights:</span>
                                    <span>{nights > 0 ? nights : 0}</span>
                                </div>
                                <div className="summary-divider" />
                                <div className="summary-total">
                                    <span>Total Amount:</span>
                                    <span>${totalAmount}</span>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card title="Payment & Status" icon={<FiCreditCard />} className="mt-6">
                        <div className="input-group">
                            <label>Booking Status</label>
                            <select
                                className="select-input"
                                {...register('status')}
                            >
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="checked_in">Checked In</option>
                                <option value="checked_out">Checked Out</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Payment Status</label>
                            <select
                                className="select-input"
                                {...register('paymentStatus')}
                            >
                                <option value="pending">Pending</option>
                                <option value="deposit_paid">Deposit Paid</option>
                                <option value="paid">Fully Paid</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
