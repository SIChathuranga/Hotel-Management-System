// Loyalty Game (Spin the Wheel)
// A fun feature to award random perks to guests

import React, { useState, useRef } from 'react';
import { FiGift, FiRotateCw, FiAward, FiCheck } from 'react-icons/fi';
import { Button, Card, Input } from '../../shared/components/ui';
import toast from 'react-hot-toast';
import './LoyaltyGame.css';

const PRIZES = [
    { label: 'Free Breakfast', color: '#FF6B6B', icon: '🍳', value: 'breakfast' },
    { label: 'Room Upgrade', color: '#4ECDC4', icon: '⬆️', value: 'upgrade' },
    { label: 'Late Checkout', color: '#45B7D1', icon: '🕒', value: 'late_checkout' },
    { label: 'Spa Voucher', color: '#96CEB4', icon: '💆', value: 'spa' },
    { label: 'Welcome Drink', color: '#FFEEAD', icon: '🍹', value: 'drink' },
    { label: '500 Points', color: '#D4AF37', icon: '🪙', value: 'points' },
    { label: 'Free Parking', color: '#FFD93D', icon: '🚗', value: 'parking' },
    { label: 'Dinner 10% Off', color: '#FF9F1C', icon: '🍽️', value: 'dinner_discount' }
];

const LoyaltyGame = () => {
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [guestName, setGuestName] = useState('');
    const wheelRef = useRef(null);

    const spinWheel = () => {
        if (spinning) return;
        if (!guestName.trim()) {
            toast.error('Please enter a guest name first!');
            return;
        }

        setSpinning(true);
        setWinner(null);

        // Random rotation: at least 5 full spins (1800 deg) + random segment
        const newRotation = rotation + 1800 + Math.floor(Math.random() * 360);
        setRotation(newRotation);

        // Calculate winner based on final rotation
        // The wheel is fixed, pointer is usually at top (0 deg) or right (90 deg)
        // Let's assume pointer is at TOP (0 degrees)
        // Adjust for CSS rotation (positive is clockwise)

        setTimeout(() => {
            setSpinning(false);

            // Normalize rotation to 0-360
            const actualRotation = newRotation % 360;
            // The segment at the top is the one that passed 0 degrees? 
            // If we rotate 10 degrees clockwise, the segment at 350 is now at 0.
            // So default position 0 is at top. Clockwise spin moves index 0 to right.
            // Angle per segment = 360 / 8 = 45 deg.

            // Formula to find index at top arrow:
            // (Total Segments - (Rotation / SegmentAngle) % Total Segments) % Total Segments
            // This is roughly correct for standard wheels.

            const segmentAngle = 360 / PRIZES.length;
            // Use (360 - actualRotation) because we want the point that ended up at 0
            // But we also need to account for initial offset if index 0 starts at top

            const winningIndex = Math.floor(((360 - actualRotation + (segmentAngle / 2)) % 360) / segmentAngle);
            const prize = PRIZES[winningIndex];

            setWinner(prize);
            shootConfetti();
        }, 3000); // 3 seconds spin duration
    };

    const shootConfetti = () => {
        // Simple confetti effect could go here
        toast.success(`🎉 Winner! ${PRIZES[winner]?.label || 'Prize'}`);
    };

    const handleApplyPrize = () => {
        toast.success(`Applied "${winner.label}" to ${guestName}'s profile!`);
        setWinner(null);
        setGuestName('');
    };

    // Generate conic gradient string
    const gradient = PRIZES.map((p, i) => {
        const start = i * (360 / PRIZES.length);
        const end = (i + 1) * (360 / PRIZES.length);
        return `${p.color} ${start}deg ${end}deg`;
    }).join(', ');

    return (
        <div className="loyalty-game-page">
            <div className="game-header">
                <div>
                    <h1 className="page-title">Lucky Spin Rewards</h1>
                    <p className="page-subtitle">Spin to win random perks for loyal guests</p>
                </div>
            </div>

            <div className="game-container">
                <div className="game-controls">
                    <Card title="Guest Selection">
                        <div className="control-group">
                            <label>Guest Name</label>
                            <Input
                                placeholder="Enter guest name..."
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                            />
                        </div>
                        <div className="instructions">
                            <p>1. Enter the guest's name.</p>
                            <p>2. Spin the wheel to award a prize.</p>
                            <p>3. Apply the reward to their profile.</p>
                        </div>
                        {winner && (
                            <div className="winner-card">
                                <h3>🎉 Winner!</h3>
                                <div className="winner-prize">
                                    <span className="winner-icon">{winner.icon}</span>
                                    <span className="winner-label">{winner.label}</span>
                                </div>
                                <Button
                                    variant="primary"
                                    className="w-full mt-4"
                                    icon={<FiCheck />}
                                    onClick={handleApplyPrize}
                                >
                                    Apply Reward
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="wheel-section">
                    <div className="wheel-pointer">▼</div>
                    <div
                        className="wheel-container"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            background: `conic-gradient(${gradient})`
                        }}
                    >
                        {PRIZES.map((prize, index) => (
                            <div
                                key={index}
                                className="wheel-segment"
                                style={{
                                    transform: `rotate(${index * (360 / PRIZES.length) + (360 / PRIZES.length / 2)}deg) translateY(-120px)`
                                }}
                            >
                                <span
                                    className="segment-text"
                                    style={{ transform: `rotate(90deg)` }} // Rotate text to be readable?
                                >
                                    {prize.icon}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="wheel-center">
                        <button
                            className="spin-button"
                            onClick={spinWheel}
                            disabled={spinning}
                        >
                            {spinning ? '...' : 'SPIN'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoyaltyGame;
