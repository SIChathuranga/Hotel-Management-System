// Staff Management Page
// View and manage hotel staff

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiUser,
    FiPhone,
    FiMail,
    FiBriefcase,
    FiClock,
    FiMoreVertical,
    FiEdit2,
    FiTrash2
} from 'react-icons/fi';
import {
    Button,
    Input,
    Card,
    Spinner
} from '../../shared/components/ui';
import { getStaff, deleteStaff, getDepartments } from '../../firebase/services/staffService';
import toast from 'react-hot-toast';
import './Staff.css';

const Staff = () => {
    const [staffList, setStaffList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [staffRes, deptRes] = await Promise.all([
                getStaff(),
                getDepartments()
            ]);

            if (staffRes.success) setStaffList(staffRes.data);
            if (deptRes.success) setDepartments(deptRes.data);
        } catch (error) {
            console.error('Error loading staff data:', error);
            toast.error('Failed to load staff data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name} from staff?`)) {
            const res = await deleteStaff(id);
            if (res.success) {
                toast.success(`${name} removed successfully`);
                loadData();
            } else {
                toast.error('Failed to delete staff member');
            }
        }
    };

    // Filter Logic
    const filteredStaff = staffList.filter(staff => {
        const matchesSearch =
            staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = deptFilter === 'all' || staff.department === deptFilter;

        return matchesSearch && matchesDept;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return '#10B981';
            case 'On Leave': return '#F59E0B';
            case 'Terminated': return '#EF4444';
            default: return '#6B7280';
        }
    };

    return (
        <div className="staff-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Staff Management</h1>
                    <p className="page-subtitle">Manage employees and roles</p>
                </div>
                <Link to="/admin/staff/add">
                    <Button icon={<FiPlus />} variant="primary">Add Staff</Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="filters-card">
                <div className="filters-grid">
                    <div className="search-wrapper">
                        <Input
                            placeholder="Search staff..."
                            icon={<FiSearch />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-wrapper">
                        <select
                            className="select-input"
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Staff Grid */}
            {loading ? (
                <div className="loading-container">
                    <Spinner size="large" />
                </div>
            ) : filteredStaff.length > 0 ? (
                <div className="staff-grid">
                    {filteredStaff.map(staff => (
                        <Card key={staff.id} className="staff-card">
                            <div className="staff-card-header">
                                <div className="staff-avatar">
                                    {staff.avatar ? (
                                        <img src={staff.avatar} alt={staff.fullName} />
                                    ) : (
                                        <span className="avatar-initial">
                                            {staff.fullName.charAt(0)}
                                        </span>
                                    )}
                                    <div
                                        className="status-dot-border"
                                        title={staff.status}
                                    >
                                        <div
                                            className="status-dot"
                                            style={{ background: getStatusColor(staff.status) }}
                                        />
                                    </div>
                                </div>
                                <div className="staff-action-menu">
                                    <Link to={`/admin/staff/edit/${staff.id}`}>
                                        <button className="icon-btn xs"><FiEdit2 /></button>
                                    </Link>
                                </div>
                            </div>

                            <div className="staff-info">
                                <h3 className="staff-name">{staff.fullName}</h3>
                                <p className="staff-role">{staff.role}</p>
                                <span className="dept-badge">{staff.department}</span>
                            </div>

                            <div className="staff-details">
                                <div className="detail-row">
                                    <FiMail className="detail-icon" />
                                    <span>{staff.email}</span>
                                </div>
                                <div className="detail-row">
                                    <FiPhone className="detail-icon" />
                                    <span>{staff.phone}</span>
                                </div>
                                <div className="detail-row">
                                    <FiClock className="detail-icon" />
                                    <span>{staff.shift} Shift</span>
                                </div>
                            </div>

                            <div className="staff-footer">
                                <span className="join-date">Joined {new Date(staff.joinDate).toLocaleDateString()}</span>
                                <button
                                    className="delete-text-btn"
                                    onClick={() => handleDelete(staff.id, staff.fullName)}
                                >
                                    Remove
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>No Staff Found</h3>
                    <p>Try adjusting your search filters.</p>
                </div>
            )}
        </div>
    );
};

export default Staff;
