// Staff Form Page
// Add or edit staff members

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    FiSave,
    FiX,
    FiUser,
    FiBriefcase,
    FiDollarSign,
    FiCalendar
} from 'react-icons/fi';
import {
    Button,
    Input,
    Card,
    Spinner
} from '../../shared/components/ui';
import { createStaff, getStaffById, updateStaff, getDepartments } from '../../firebase/services/staffService';
import toast from 'react-hot-toast';
import './StaffForm.css';

const StaffForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [departments, setDepartments] = useState([]);

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
            role: '',
            department: '',
            status: 'Active',
            shift: 'Day',
            salary: '',
            joinDate: new Date().toISOString().split('T')[0]
        }
    });

    useEffect(() => {
        loadInitialData();
    }, [id]);

    const loadInitialData = async () => {
        setInitialLoading(true);
        try {
            // Load departments first
            const deptRes = await getDepartments();
            if (deptRes.success) {
                setDepartments(deptRes.data);
                if (deptRes.data.length > 0 && !isEditMode) {
                    setValue('department', deptRes.data[0].name);
                }
            }

            // Load staff if edit mode
            if (isEditMode) {
                const res = await getStaffById(id);
                if (res.success) {
                    const staff = res.data;
                    Object.keys(staff).forEach(key => {
                        setValue(key, staff[key]);
                    });
                } else {
                    toast.error('Staff not found');
                    navigate('/admin/staff');
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        } finally {
            setInitialLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isEditMode) {
                const res = await updateStaff(id, data);
                if (res.success) {
                    toast.success('Staff updated successfully');
                    navigate('/admin/staff');
                } else {
                    toast.error(res.error || 'Failed to update staff');
                }
            } else {
                const res = await createStaff(data);
                if (res.success) {
                    toast.success('Staff added successfully');
                    navigate('/admin/staff');
                } else {
                    toast.error(res.error || 'Failed to add staff');
                }
            }
        } catch (error) {
            console.error('Error saving staff:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="staff-form-page loading">
                <Spinner size="large" />
            </div>
        );
    }

    return (
        <div className="staff-form-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{isEditMode ? 'Edit Staff' : 'Add Staff'}</h1>
                    <p className="page-subtitle">Enter employee details and assignment</p>
                </div>
                <div className="header-actions">
                    <Button
                        variant="secondary"
                        icon={<FiX />}
                        onClick={() => navigate('/admin/staff')}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        icon={<FiSave />}
                        onClick={handleSubmit(onSubmit)}
                        loading={loading}
                    >
                        Save Staff
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
                <div className="form-column">
                    <Card title="Personal Details" icon={<FiUser />}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <Input
                                placeholder="Employee Full Name"
                                {...register('fullName', { required: 'Name is required' })}
                                error={errors.fullName?.message}
                            />
                        </div>
                        <div className="row-2-col">
                            <div className="input-group">
                                <label>Email</label>
                                <Input
                                    type="email"
                                    placeholder="email@company.com"
                                    {...register('email', { required: 'Email is required' })}
                                    error={errors.email?.message}
                                />
                            </div>
                            <div className="input-group">
                                <label>Phone</label>
                                <Input
                                    placeholder="Phone number"
                                    {...register('phone')}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card title="Employment Details" icon={<FiBriefcase />} className="mt-6">
                        <div className="row-2-col">
                            <div className="input-group">
                                <label>Department</label>
                                <select
                                    className="select-input"
                                    {...register('department', { required: 'Department is required' })}
                                >
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Role / Job Title</label>
                                <Input
                                    placeholder="e.g. Manager"
                                    {...register('role', { required: 'Role is required' })}
                                    error={errors.role?.message}
                                />
                            </div>
                        </div>

                        <div className="row-3-col">
                            <div className="input-group">
                                <label>Status</label>
                                <select
                                    className="select-input"
                                    {...register('status')}
                                >
                                    <option value="Active">Active</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Shift</label>
                                <select
                                    className="select-input"
                                    {...register('shift')}
                                >
                                    <option value="Morning">Morning</option>
                                    <option value="Day">Day</option>
                                    <option value="Evening">Evening</option>
                                    <option value="Night">Night</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Join Date</label>
                                <Input
                                    type="date"
                                    {...register('joinDate')}
                                />
                            </div>
                        </div>

                        <div className="input-group mt-4">
                            <label>Annual Salary ($)</label>
                            <Input
                                type="number"
                                placeholder="e.g. 50000"
                                icon={<FiDollarSign />}
                                {...register('salary')}
                            />
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default StaffForm;
