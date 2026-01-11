// Guest Form Page
// Create or edit a guest profile

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    FiSave,
    FiX,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiFileText
} from 'react-icons/fi';
import {
    Button,
    Input,
    Card,
    Spinner
} from '../../shared/components/ui';
import { createGuest, getGuestById, updateGuest } from '../../firebase/services/guestService';
import toast from 'react-hot-toast';
import './GuestForm.css';

const GuestForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            nationality: '',
            passportNumber: '',
            address: '',
            notes: ''
        }
    });

    useEffect(() => {
        if (isEditMode) {
            loadGuest();
        }
    }, [isEditMode, id]);

    const loadGuest = async () => {
        setInitialLoading(true);
        try {
            const res = await getGuestById(id);
            if (res.success) {
                const guest = res.data;
                Object.keys(guest).forEach(key => {
                    setValue(key, guest[key]);
                });
            } else {
                toast.error('Guest not found');
                navigate('/admin/guests');
            }
        } catch (error) {
            console.error('Error loading guest:', error);
            toast.error('Failed to load guest data');
        } finally {
            setInitialLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isEditMode) {
                const res = await updateGuest(id, data);
                if (res.success) {
                    toast.success('Guest updated successfully');
                    navigate('/admin/guests');
                } else {
                    toast.error(res.error || 'Failed to update guest');
                }
            } else {
                const res = await createGuest(data);
                if (res.success) {
                    toast.success('Guest created successfully');
                    navigate('/admin/guests');
                } else {
                    toast.error(res.error || 'Failed to create guest');
                }
            }
        } catch (error) {
            console.error('Error saving guest:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="guest-form-page loading">
                <Spinner size="large" />
            </div>
        );
    }

    return (
        <div className="guest-form-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{isEditMode ? 'Edit Guest' : 'New Guest'}</h1>
                    <p className="page-subtitle">Fill in the details to {isEditMode ? 'update' : 'create'} a guest profile</p>
                </div>
                <div className="header-actions">
                    <Button
                        variant="secondary"
                        icon={<FiX />}
                        onClick={() => navigate('/admin/guests')}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        icon={<FiSave />}
                        onClick={handleSubmit(onSubmit)}
                        loading={loading}
                    >
                        Save Guest
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
                <div className="form-column">
                    <Card title="Personal Information" icon={<FiUser />}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <Input
                                placeholder="Enter full name"
                                {...register('fullName', { required: 'Full name is required' })}
                                error={errors.fullName?.message}
                            />
                        </div>
                        <div className="row-2-col">
                            <div className="input-group">
                                <label>Nationality</label>
                                <Input
                                    placeholder="e.g. USA"
                                    {...register('nationality')}
                                />
                            </div>
                            <div className="input-group">
                                <label>Passport / ID Number</label>
                                <Input
                                    placeholder="Enter ID number"
                                    {...register('passportNumber')}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card title="Notes & Preferences" icon={<FiFileText />} className="mt-6">
                        <div className="input-group">
                            <label>Internal Notes</label>
                            <textarea
                                className="textarea-input"
                                rows="4"
                                placeholder="Dietary restrictions, preferences, VIP status, etc."
                                {...register('notes')}
                            />
                        </div>
                    </Card>
                </div>

                <div className="form-column">
                    <Card title="Contact Details" icon={<FiMail />}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <Input
                                type="email"
                                placeholder="email@example.com"
                                icon={<FiMail />}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                error={errors.email?.message}
                            />
                        </div>
                        <div className="input-group">
                            <label>Phone Number</label>
                            <Input
                                placeholder="+1 (555) 000-0000"
                                icon={<FiPhone />}
                                {...register('phone', { required: 'Phone number is required' })}
                                error={errors.phone?.message}
                            />
                        </div>
                        <div className="input-group">
                            <label>Address</label>
                            <textarea
                                className="textarea-input"
                                rows="3"
                                placeholder="Full address"
                                {...register('address')}
                            />
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default GuestForm;
