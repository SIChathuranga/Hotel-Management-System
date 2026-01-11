// Invoice Form
// Create or Edit Invoice

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button, Input, Card, Spinner } from '../../shared/components/ui';
import { createInvoice, getInvoiceById, updateInvoice } from '../../firebase/services/billingService';
import toast from 'react-hot-toast';
import './InvoiceForm.css';

const InvoiceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            guestName: '',
            dueDate: '',
            items: [{ description: '', amount: 0, category: 'Room' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    // Watch items to calculate total
    const items = watch("items");
    const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    useEffect(() => {
        if (isEdit) {
            loadInvoice();
        }
    }, [id]);

    const loadInvoice = async () => {
        const res = await getInvoiceById(id);
        if (res.success) {
            const inv = res.data;
            setValue('guestName', inv.guestName);
            setValue('dueDate', inv.dueDate);
            setValue('items', inv.items);
            setFetching(false);
        } else {
            toast.error('Invoice not found');
            navigate('/admin/billing');
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const payload = {
            ...data,
            total,
            items: data.items.map(i => ({
                description: i.description,
                amount: Number(i.amount),
                category: i.category || 'Other'
            }))
        };

        try {
            let res;
            if (isEdit) {
                res = await updateInvoice(id, payload);
            } else {
                res = await createInvoice(payload);
            }

            if (res.success) {
                toast.success(isEdit ? 'Invoice updated' : 'Invoice created');
                navigate('/admin/billing');
            } else {
                toast.error('Operation failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving invoice');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="loading-container"><Spinner /></div>;

    return (
        <div className="invoice-form-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{isEdit ? 'Edit Invoice' : 'New Invoice'}</h1>
                    <p className="page-subtitle">Billing details</p>
                </div>
                <div className="header-actions">
                    <Button variant="secondary" icon={<FiX />} onClick={() => navigate('/admin/billing')}>
                        Cancel
                    </Button>
                    <Button variant="primary" icon={<FiSave />} onClick={handleSubmit(onSubmit)} loading={loading}>
                        Save Invoice
                    </Button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="invoice-form">
                        <div className="row-2-col">
                            <div className="input-group">
                                <label>Guest Name</label>
                                <Input
                                    {...register('guestName', { required: 'Guest name is required' })}
                                    error={errors.guestName?.message}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="input-group">
                                <label>Due Date</label>
                                <Input
                                    type="date"
                                    {...register('dueDate', { required: 'Due date is required' })}
                                    error={errors.dueDate?.message}
                                />
                            </div>
                        </div>

                        <div className="items-section">
                            <h3 className="section-title">Line Items</h3>
                            <div className="items-list">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="item-row">
                                        <div className="input-group flex-1">
                                            <Input
                                                placeholder="Description"
                                                {...register(`items.${index}.description`, { required: true })}
                                            />
                                        </div>
                                        <div className="input-group w-32">
                                            <select
                                                className="select-input h-10" // h-10 to match Input height roughly
                                                {...register(`items.${index}.category`)}
                                            >
                                                <option value="Room">Room</option>
                                                <option value="Food">Food</option>
                                                <option value="Service">Service</option>
                                                <option value="Tax">Tax</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="input-group w-32">
                                            <Input
                                                type="number"
                                                placeholder="Amount"
                                                {...register(`items.${index}.amount`, { required: true, min: 0 })}
                                            />
                                        </div>
                                        <button type="button" className="delete-btn" onClick={() => remove(index)}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="small"
                                icon={<FiPlus />}
                                onClick={() => append({ description: '', amount: 0, category: 'Other' })}
                            >
                                Add Item
                            </Button>
                        </div>

                        <div className="total-section">
                            <span>Total Amount:</span>
                            <span className="total-value">${total.toFixed(2)}</span>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default InvoiceForm;
