// Room Filters Component
// Filter controls for room list

import React from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import './RoomFilters.css';

const RoomFilters = ({
    filters,
    onFilterChange,
    roomTypes = [],
    onClearFilters
}) => {
    const handleChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    const hasActiveFilters = filters.search || filters.status || filters.roomType || filters.floor;

    return (
        <div className="room-filters">
            {/* Search */}
            <div className="room-filter-search">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search rooms..."
                    value={filters.search || ''}
                    onChange={(e) => handleChange('search', e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Status Filter */}
            <div className="room-filter-group">
                <select
                    value={filters.status || ''}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                </select>
            </div>

            {/* Room Type Filter */}
            <div className="room-filter-group">
                <select
                    value={filters.roomType || ''}
                    onChange={(e) => handleChange('roomType', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Types</option>
                    {roomTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Floor Filter */}
            <div className="room-filter-group">
                <select
                    value={filters.floor || ''}
                    onChange={(e) => handleChange('floor', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Floors</option>
                    <option value="1">Floor 1</option>
                    <option value="2">Floor 2</option>
                    <option value="3">Floor 3</option>
                    <option value="4">Floor 4</option>
                    <option value="5">Floor 5</option>
                </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    className="filter-clear-btn"
                    onClick={onClearFilters}
                    type="button"
                >
                    <FiX />
                    <span>Clear</span>
                </button>
            )}
        </div>
    );
};

export default RoomFilters;
