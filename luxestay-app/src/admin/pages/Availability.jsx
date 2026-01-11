// Availability Calendar (Room Scheduler)
// Visualizes room bookings on a timeline

import React, { useState, useEffect } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isWithinInterval,
    addMonths,
    subMonths,
    parseISO
} from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { Button, Card, Spinner } from '../../shared/components/ui';
import { getRooms } from '../../firebase/services/roomService';
import { getAllBookings } from '../../firebase/services/bookingService';
import './Availability.css';

const Availability = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [roomsRes, bookingsRes] = await Promise.all([
                getRooms(),
                getAllBookings()
            ]);

            if (roomsRes.success) setRooms(roomsRes.data);
            if (bookingsRes.success) setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error loading availability data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calendar Logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    // Helper to check if a room is booked on a specific day
    const getBookingForRoomAndDay = (roomId, day) => {
        return bookings.find(booking => {
            if (booking.roomId !== roomId && booking.roomNumber !== roomId && booking.roomNumber !== rooms.find(r => r.id === roomId)?.roomNumber) return false;

            // Handle different ID mismatch if needed, usually mock data has specific IDs
            // Mock Booking has roomId like 'room_101', but Mock Rooms have IDs '1', '2'...
            // We should match loosely or fix data. 
            // In mock data: Room '1' has roomNumber '101'. Booking has roomId 'room_101' OR roomNumber '101'.
            // Let's match by roomNumber which is safer across mocks

            const room = rooms.find(r => r.id === roomId);
            if (!room) return false;

            // Loose matching for mock data compatibility
            const bookingRoomMatch =
                booking.roomId === roomId ||
                booking.roomId === `room_${room.roomNumber}` ||
                booking.roomNumber === room.roomNumber;

            if (!bookingRoomMatch) return false;

            const start = parseISO(booking.checkInDate);
            const end = parseISO(booking.checkOutDate);

            // Fix: parseISO might be needed if dates are strings
            return isWithinInterval(day, { start, end });
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-blue-500';
            case 'checked_in': return 'bg-green-500';
            case 'checked_out': return 'bg-gray-400';
            case 'pending': return 'bg-yellow-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-indigo-500';
        }
    };

    if (loading) {
        return (
            <div className="availability-page loading">
                <Spinner size="large" />
            </div>
        );
    }

    return (
        <div className="availability-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Availability</h1>
                    <p className="page-subtitle">Room schedule and occupancy</p>
                </div>
                <div className="calendar-controls">
                    <Button variant="outline" icon={<FiChevronLeft />} onClick={handlePrevMonth} />
                    <span className="current-month">
                        <FiCalendar className="mr-2" />
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <Button variant="outline" icon={<FiChevronRight />} onClick={handleNextMonth} />
                </div>
            </div>

            <Card className="calendar-card">
                <div className="scheduler-container">
                    {/* Header Row (Days) */}
                    <div className="scheduler-header">
                        <div className="room-col-header">Room</div>
                        {daysInMonth.map(day => (
                            <div key={day.toISOString()} className={`day-col-header ${isSameDay(day, new Date()) ? 'today' : ''}`}>
                                <div className="day-name">{format(day, 'EEE')}</div>
                                <div className="day-number">{format(day, 'd')}</div>
                            </div>
                        ))}
                    </div>

                    {/* Room Rows */}
                    <div className="scheduler-body">
                        {rooms.map(room => (
                            <div key={room.id} className="scheduler-row">
                                <div className="room-col-cell">
                                    <span className="room-number">{room.roomNumber}</span>
                                    <span className="room-type">{room.roomTypeName || 'Standard'}</span>
                                </div>
                                {daysInMonth.map(day => {
                                    const booking = getBookingForRoomAndDay(room.id, day);

                                    // Optimization: Only render booking details on the first day of booking or if it's the first visible day
                                    // For simple grid, just filling the cell is easiest.

                                    // To make it look like a bar, we need to know if previous day matches same booking
                                    const prevDay = new Date(day);
                                    prevDay.setDate(day.getDate() - 1);
                                    const prevBooking = getBookingForRoomAndDay(room.id, prevDay);
                                    const isStart = !prevBooking || prevBooking.id !== booking?.id;

                                    return (
                                        <div
                                            key={day.toISOString()}
                                            className={`day-cell ${booking ? 'booked' : ''} ${isSameDay(day, new Date()) ? 'today' : ''}`}
                                        >
                                            {booking && (
                                                <div
                                                    className={`booking-bar ${getStatusColor(booking.status)} ${isStart ? 'start' : ''}`}
                                                    title={`${booking.guestName} (${booking.status})`}
                                                >
                                                    {isStart && <span className="booking-name">{booking.guestName}</span>}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="legend">
                <div className="legend-item"><span className="dot bg-green-500"></span> Checked In</div>
                <div className="legend-item"><span className="dot bg-blue-500"></span> Confirmed</div>
                <div className="legend-item"><span className="dot bg-yellow-500"></span> Pending</div>
                <div className="legend-item"><span className="dot bg-gray-400"></span> Checked Out</div>
            </div>
        </div>
    );
};

export default Availability;
