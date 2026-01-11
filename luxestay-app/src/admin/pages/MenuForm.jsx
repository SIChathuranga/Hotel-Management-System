// Menu Item Form
// Add or edit restaurant menu items

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiSave, FiX, FiImage } from 'react-icons/fi';
import { Button, Input, Card, Spinner } from '../../shared/components/ui';
import { getMenuItems } from '../../firebase/services/restaurantService';
// We need create/update functions in restaurantService. I will update service later.
import toast from 'react-hot-toast';
import './MenuForm.css';

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks'];

const MenuForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);

    // Mock submit for now until service is updated
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (isEditMode) {
            // Fetch item data logic would go here
            // For now, prompt user it's mock
        }
    }, [id]);

    const onSubmit = async (data) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success(isEditMode ? 'Item updated' : 'Item added to menu');
            navigate('/admin/restaurant/menu');
        }, 1000);
    };

    return (
        <div className="menu-form-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{isEditMode ? 'Edit Item' : 'Add Menu Item'}</h1>
                    <p className="page-subtitle">Configure food or drink details</p>
                </div>
                <div className="header-actions">
                    <Button variant="secondary" icon={<FiX />} onClick={() => navigate('/admin/restaurant/menu')}>
                        Cancel
                    </Button>
                    <Button variant="primary" icon={<FiSave />} onClick={handleSubmit(onSubmit)} loading={loading}>
                        Save Item
                    </Button>
                </div>
            </div>

            <div className="form-container">
                <Card>
                    <form onSubmit={handleSubmit(onSubmit)} className="menu-form">
                        <div className="input-group">
                            <label>Item Name</label>
                            <Input
                                placeholder="e.g. Truffle Fries"
                                {...register('name', { required: 'Name is required' })}
                                error={errors.name?.message}
                            />
                        </div>

                        <div className="row-2-col">
                            <div className="input-group">
                                <label>Category</label>
                                <select className="select-input" {...register('category', { required: true })}>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Price ($)</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register('price', { required: 'Price is required' })}
                                    error={errors.price?.message}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Description</label>
                            <textarea
                                className="textarea-input"
                                rows="3"
                                placeholder="Ingredients and details..."
                                {...register('description')}
                            />
                        </div>

                        <div className="input-group">
                            <label>Image URL (Optional)</label>
                            <Input
                                placeholder="https://..."
                                icon={<FiImage />}
                                {...register('image')}
                            />
                        </div>

                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="isAvailable"
                                defaultChecked={true}
                                {...register('isAvailable')}
                            />
                            <label htmlFor="isAvailable">Available for ordering</label>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default MenuForm;
