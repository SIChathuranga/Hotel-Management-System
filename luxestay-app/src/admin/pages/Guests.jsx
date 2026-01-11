// Guest Management Page
// View and manage guest profiles

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiUser,
    FiPhone,
    FiMail,
    FiMapPin,
    FiStar,
    FiMoreVertical,
    FiEye,
    FiEdit2,
    FiTrash2
} from 'react-icons/fi';
import {
    Button,
    Input,
    Card,
    Spinner
} from '../../shared/components/ui';
import { getGuests, deleteGuest } from '../../firebase/services/guestService';
import toast from 'react-hot-toast';
import './Guests.css';

const Guests = () => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [loyaltyFilter, setLoyaltyFilter] = useState('all');

    useEffect(() => {
        loadGuests();
    }, []);

    const loadGuests = async () => {
        setLoading(true);
        try {
            const res = await getGuests();
            if (res.success) {
                setGuests(res.data);
            } else {
                toast.error(res.error || 'Failed to load guests');
            }
        } catch (error) {
            console.error('Error loading guests:', error);
            toast.error('Failed to load guests');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete guest ${name}? This action cannot be undone.`)) {
            const res = await deleteGuest(id);
            if (res.success) {
                toast.success(`Guest ${name} deleted successfully`);
                loadGuests();
            } else {
                toast.error('Failed to delete guest');
            }
        }
    };

    // Filter Logic
    const filteredGuests = guests.filter(guest => {
        const matchesSearch =
            guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.phone.includes(searchTerm);

        const matchesLoyalty = loyaltyFilter === 'all' || guest.loyaltyTier === loyaltyFilter;

        return matchesSearch && matchesLoyalty;
    });

    const getLoyaltyBadge = (tier) => {
        const tiers = {
            Bronze: 'badge-bronze',
            Silver: 'badge-silver',
            Gold: 'badge-gold',
            Platinum: 'badge-platinum'
        };
        return (
            <span className={`loyalty-badge ${tiers[tier] || 'badge-default'}`}>
                <FiStar className="w-3 h-3 mr-1" />
                {tier}
            </span>
        );
    };

    return (
        <div className="guests-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Guests</h1>
                    <p className="page-subtitle">Manage guest profiles and loyalty</p>
                </div>
                <Link to="/admin/guests/add">
                    <Button icon={<FiPlus />} variant="primary">Add Guest</Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="filters-card">
                <div className="filters-grid">
                    <div className="search-wrapper">
                        <Input
                            placeholder="Search name, email, or phone..."
                            icon={<FiSearch />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-wrapper">
                        <select
                            className="select-input"
                            value={loyaltyFilter}
                            onChange={(e) => setLoyaltyFilter(e.target.value)}
                        >
                            <option value="all">All Tiers</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Guests List */}
            {loading ? (
                <div className="loading-container">
                    <Spinner size="large" />
                </div>
            ) : filteredGuests.length > 0 ? (
                <div className="guests-grid">
                    {filteredGuests.map(guest => (
                        <Card key={guest.id} className="guest-card">
                            <div className="guest-card-header">
                                <div className="guest-avatar">
                                    {guest.avatar ? (
                                        <img src={guest.avatar} alt={guest.fullName} />
                                    ) : (
                                        <span className="avatar-initial">
                                            {guest.fullName.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div className="guest-header-info">
                                    <h3 className="guest-name">{guest.fullName}</h3>
                                    <span className="guest-nationality">{guest.nationality}</span>
                                </div>
                                <div className="guest-actions-menu">
                                    {getLoyaltyBadge(guest.loyaltyTier)}
                                </div>
                            </div>

                            <div className="guest-card-body">
                                <div className="info-row">
                                    <FiMail className="info-icon" />
                                    <span title={guest.email}>{guest.email}</span>
                                </div>
                                <div className="info-row">
                                    <FiPhone className="info-icon" />
                                    <span>{guest.phone}</span>
                                </div>
                                <div className="info-row">
                                    <FiMapPin className="info-icon" />
                                    <span className="truncate">{guest.address}</span>
                                </div>
                            </div>

                            <div className="guest-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{guest.totalStays}</span>
                                    <span className="stat-label">Stays</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">${guest.totalSpent}</span>
                                    <span className="stat-label">Spent</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{guest.loyaltyPoints}</span>
                                    <span className="stat-label">Points</span>
                                </div>
                            </div>

                            <div className="guest-card-actions">
                                <Link to={`/admin/guests/${guest.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full">View</Button>
                                </Link>
                                <Link to={`/admin/guests/edit/${guest.id}`}>
                                    <button className="icon-btn edit">
                                        <FiEdit2 />
                                    </button>
                                </Link>
                                <button
                                    className="icon-btn delete"
                                    onClick={() => handleDelete(guest.id, guest.fullName)}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon-bg">
                        <FiUser />
                    </div>
                    <h3>No Guests Found</h3>
                    <p>Try adjusting your search criteria or add a new guest.</p>
                </div>
            )}
        </div>
    );
};

export default Guests;
