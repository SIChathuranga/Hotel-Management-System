// Table Form
// Manage restaurant table configuration

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiSave, FiX } from 'react-icons/fi';
import { Button, Input, Card } from '../../shared/components/ui';
import toast from 'react-hot-toast';

const TableForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoading(false);
            toast.success('Table saved');
            navigate('/admin/restaurant/tables');
        }, 800);
    };

    return (
        <div className="table-form-page">
            <div className="page-header flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add Table</h1>
                    <p className="text-gray-500">Configure seating arrangement</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={<FiX />} onClick={() => navigate('/admin/restaurant/tables')}>
                        Cancel
                    </Button>
                    <Button variant="primary" icon={<FiSave />} onClick={handleSubmit(onSubmit)} loading={loading}>
                        Save Table
                    </Button>
                </div>
            </div>

            <div className="max-w-md mx-auto">
                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="input-group flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Table Number</label>
                            <Input
                                placeholder="e.g. 12"
                                {...register('number', { required: 'Table number is required' })}
                                error={errors.number?.message}
                            />
                        </div>
                        <div className="input-group flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Capacity (Seats)</label>
                            <Input
                                type="number"
                                placeholder="4"
                                {...register('capacity', { required: 'Capacity is required', min: 1 })}
                                error={errors.capacity?.message}
                            />
                        </div>
                        <div className="input-group flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Zone / Area</label>
                            <select className="p-2 border rounded-md bg-white" {...register('zone')}>
                                <option value="Main Hall">Main Hall</option>
                                <option value="Terrace">Terrace</option>
                                <option value="Private Room">Private Room</option>
                            </select>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default TableForm;
