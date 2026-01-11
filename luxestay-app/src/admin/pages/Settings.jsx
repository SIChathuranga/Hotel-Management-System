// Settings Page
// Manage system configuration and user profile

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiUser, FiSettings } from 'react-icons/fi';
import { Card, Button, Input, Spinner } from '../../shared/components/ui';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);

    // Mock initial data load
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    const tabs = [
        { id: 'general', label: 'General Settings', icon: <FiSettings /> },
        { id: 'profile', label: 'Profile Settings', icon: <FiUser /> }
    ];

    if (loading) return <div className="loading-container"><Spinner /></div>;

    return (
        <div className="settings-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage application preferences</p>
                </div>
            </div>

            <div className="settings-layout">
                <div className="settings-sidebar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
                <div className="settings-content">
                    {activeTab === 'general' && <GeneralSettings />}
                    {activeTab === 'profile' && <ProfileSettings />}
                </div>
            </div>
        </div>
    );
};

const GeneralSettings = () => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            hotelName: 'LuxeStay Hotel',
            contactEmail: 'admin@luxestay.com',
            currency: 'USD',
            address: '123 Luxury Ave, Beverly Hills, CA'
        }
    });
    const [saving, setSaving] = useState(false);

    const onSubmit = (data) => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Saved Settings:', data);
            toast.success('Settings saved successfully');
            setSaving(false);
        }, 800);
    };

    return (
        <Card title="General Configuration">
            <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
                <div className="input-group">
                    <label>Hotel Name</label>
                    <Input {...register('hotelName')} />
                </div>
                <div className="input-group">
                    <label>Address</label>
                    <Input {...register('address')} />
                </div>
                <div className="row-2-col">
                    <div className="input-group">
                        <label>Contact Email</label>
                        <Input type="email" {...register('contactEmail')} />
                    </div>
                    <div className="input-group">
                        <label>Currency</label>
                        <select className="select-input" {...register('currency')}>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                </div>
                <div className="form-actions">
                    <Button variant="primary" icon={<FiSave />} loading={saving}>Save Changes</Button>
                </div>
            </form>
        </Card>
    );
};

const ProfileSettings = () => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            displayName: 'Admin User',
            email: 'admin@luxestay.com',
            role: 'Administrator'
        }
    });
    const [saving, setSaving] = useState(false);

    const onSubmit = (data) => {
        setSaving(true);
        setTimeout(() => {
            toast.success('Profile updated');
            setSaving(false);
        }, 800);
    };

    return (
        <Card title="Profile Information">
            <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
                <div className="input-group">
                    <label>Display Name</label>
                    <Input {...register('displayName')} />
                </div>
                <div className="input-group">
                    <label>Email Address</label>
                    <Input type="email" {...register('email')} disabled />
                    <span className="text-xs text-secondary mt-1">Email cannot be changed</span>
                </div>
                <div className="input-group">
                    <label>Role</label>
                    <Input {...register('role')} disabled />
                </div>
                <div className="form-actions">
                    <Button variant="primary" icon={<FiSave />} loading={saving}>Update Profile</Button>
                </div>
            </form>
        </Card>
    );
};

export default Settings;
