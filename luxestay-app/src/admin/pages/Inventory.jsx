// Inventory Management Page
// Track restaurant ingredients and stock

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiAlertTriangle, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { Button, Card, Spinner, Input } from '../../shared/components/ui';
import { getInventory, addItem, updateItem, deleteItem } from '../../firebase/services/inventoryService';
import toast from 'react-hot-toast';
import './Inventory.css';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getInventory();
            if (res.success) setItems(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this item?')) {
            const res = await deleteItem(id);
            if (res.success) {
                toast.success('Item deleted');
                loadData();
            } else {
                toast.error('Failed to delete item');
            }
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleSave = async (data) => {
        // Validation handled by form
        // But we need to call service
        // Since useForm is inside modal, we'll pass handler
        // Actually, better to extract Form component or put logic here?
        // I will make a sub-component InventoryForm for cleanliness.
    };

    return (
        <div className="inventory-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Inventory</h1>
                    <p className="page-subtitle">Track stock levels</p>
                </div>
                <Button icon={<FiPlus />} variant="primary" onClick={handleAdd}>Add Item</Button>
            </div>

            {loading ? (
                <div className="loading-container"><Spinner /></div>
            ) : (
                <Card className="inventory-card">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Threshold</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? items.map(item => (
                                <tr key={item.id}>
                                    <td className="font-bold">{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unit}</td>
                                    <td className="text-gray-500">{item.minThreshold}</td>
                                    <td>
                                        <span className={`status-badge ${item.status?.toLowerCase()}`}>
                                            {item.status === 'Low' && <FiAlertTriangle className="inline-icon" />}
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="icon-btn-sm edit" onClick={() => handleEdit(item)}>
                                                <FiEdit2 />
                                            </button>
                                            <button className="icon-btn-sm delete" onClick={() => handleDelete(item.id)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-400">Inventory is empty</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            )}

            {modalOpen && (
                <InventoryModal
                    item={editingItem}
                    onClose={handleModalClose}
                    onConvertSuccess={() => { loadData(); handleModalClose(); }}
                />
            )}
        </div>
    );
};

// Modal Component
const InventoryModal = ({ item, onClose, onConvertSuccess }) => {
    const isEdit = !!item;
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: item || {
            name: '',
            quantity: 0,
            unit: 'pcs',
            minThreshold: 10
        }
    });
    const [saving, setSaving] = useState(false);

    const onSubmit = async (data) => {
        setSaving(true);
        // Ensure numbers
        const payload = {
            ...data,
            quantity: Number(data.quantity),
            minThreshold: Number(data.minThreshold)
        };

        try {
            let res;
            if (isEdit) {
                res = await updateItem(item.id, payload);
            } else {
                res = await addItem(payload);
            }

            if (res.success) {
                toast.success(isEdit ? 'Item updated' : 'Item added');
                onConvertSuccess();
            } else {
                toast.error('Operation failed');
            }
        } catch (e) {
            console.error(e);
            toast.error('Error saving item');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEdit ? 'Edit Item' : 'New Item'}</h2>
                    <button onClick={onClose} className="close-btn"><FiX /></button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
                    <div className="input-group">
                        <label>Item Name</label>
                        <Input
                            {...register('name', { required: 'Name is required' })}
                            error={errors.name?.message}
                            placeholder="e.g. Tomatoes"
                        />
                    </div>
                    <div className="row-2-col">
                        <div className="input-group">
                            <label>Quantity</label>
                            <Input
                                type="number"
                                {...register('quantity', { required: true, min: 0 })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Unit</label>
                            <select className="select-input" {...register('unit')}>
                                <option value="pcs">pcs</option>
                                <option value="kg">kg</option>
                                <option value="L">L</option>
                                <option value="packs">packs</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Low Stock Threshold</label>
                        <Input
                            type="number"
                            {...register('minThreshold', { required: true, min: 0 })}
                            placeholder="Alert when below..."
                        />
                    </div>

                    <div className="modal-actions">
                        <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                        <Button variant="primary" type="submit" loading={saving} icon={<FiSave />}>
                            {isEdit ? 'Update' : 'Add'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Inventory;
