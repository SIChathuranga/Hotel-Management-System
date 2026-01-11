// Create Order (POS)
// Interface to take new restaurant orders

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { Button, Card, Spinner } from '../../shared/components/ui';
import { getMenuItems, getTables, createOrder } from '../../firebase/services/restaurantService';
import toast from 'react-hot-toast';
import './CreateOrder.css';

const CreateOrder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Data
    const [menu, setMenu] = useState([]);
    const [tables, setTables] = useState([]);

    // Form State
    const [selectedTableId, setSelectedTableId] = useState('');
    const [cart, setCart] = useState({}); // { itemId: qty }
    const [categoryFilter, setCategoryFilter] = useState('All');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [menuRes, tablesRes] = await Promise.all([
                getMenuItems(),
                getTables()
            ]);
            if (menuRes.success) setMenu(menuRes.data);
            if (tablesRes.success) setTables(tablesRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setInitialLoading(false);
        }
    };

    const addToCart = (item) => {
        setCart(prev => ({
            ...prev,
            [item.id]: (prev[item.id] || 0) + 1
        }));
    };

    const removeFromCart = (item) => {
        setCart(prev => {
            const newQty = (prev[item.id] || 0) - 1;
            const newCart = { ...prev };
            if (newQty <= 0) delete newCart[item.id];
            else newCart[item.id] = newQty;
            return newCart;
        });
    };

    const calculateTotal = () => {
        return Object.entries(cart).reduce((total, [itemId, qty]) => {
            const item = menu.find(i => i.id === itemId);
            return total + (item ? item.price * qty : 0);
        }, 0);
    };

    const handleSubmit = async () => {
        if (!selectedTableId) {
            toast.error('Please select a table');
            return;
        }
        if (Object.keys(cart).length === 0) {
            toast.error('Cart is empty');
            return;
        }

        setLoading(true);
        try {
            const selectedTable = tables.find(t => t.id === selectedTableId);
            const orderItems = Object.entries(cart).map(([itemId, qty]) => {
                const item = menu.find(i => i.id === itemId);
                return {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    qty
                };
            });

            const orderData = {
                tableId: selectedTableId,
                tableNumber: selectedTable?.number || '?',
                items: orderItems,
                total: calculateTotal()
            };

            const res = await createOrder(orderData);
            if (res.success) {
                toast.success('Order created successfully');
                navigate('/admin/restaurant/orders');
            } else {
                toast.error('Failed to create order');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error processing order');
        } finally {
            setLoading(false);
        }
    };

    // Derived
    const categories = ['All', ...new Set(menu.map(i => i.category))];
    const filteredMenu = categoryFilter === 'All'
        ? menu
        : menu.filter(i => i.category === categoryFilter);

    if (initialLoading) return <div className="loading-container"><Spinner /></div>;

    return (
        <div className="create-order-page">
            <div className="order-layout">
                {/* Left: Menu Selection */}
                <div className="menu-selection">
                    <div className="selection-header">
                        <select
                            className="table-select"
                            value={selectedTableId}
                            onChange={(e) => setSelectedTableId(e.target.value)}
                        >
                            <option value="">Select Table</option>
                            {tables.map(t => (
                                <option key={t.id} value={t.id}>
                                    Table {t.number} ({t.status})
                                </option>
                            ))}
                        </select>

                        <div className="cat-scroll">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`cat-pill ${categoryFilter === cat ? 'active' : ''}`}
                                    onClick={() => setCategoryFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="menu-items-grid">
                        {filteredMenu.map(item => (
                            <Card key={item.id} className="pos-item-card" onClick={() => addToCart(item)}>
                                <div className="pos-item-info">
                                    <h4 className="font-bold">{item.name}</h4>
                                    <span className="text-secondary text-sm">${item.price.toFixed(2)}</span>
                                </div>
                                {cart[item.id] > 0 && (
                                    <div className="qty-badge">{cart[item.id]}</div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right: Cart Summary */}
                <Card className="order-summary">
                    <h2 className="text-xl font-bold mb-4">Current Order</h2>

                    <div className="cart-items">
                        {Object.entries(cart).map(([itemId, qty]) => {
                            const item = menu.find(i => i.id === itemId);
                            if (!item) return null;
                            return (
                                <div key={itemId} className="cart-row">
                                    <div className="cart-info">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-sm text-secondary">${item.price.toFixed(2)} x {qty}</span>
                                    </div>
                                    <div className="qty-controls">
                                        <button className="qty-btn" onClick={() => removeFromCart(item)}><FiMinus /></button>
                                        <span>{qty}</span>
                                        <button className="qty-btn" onClick={() => addToCart(item)}><FiPlus /></button>
                                    </div>
                                </div>
                            );
                        })}
                        {Object.keys(cart).length === 0 && (
                            <div className="empty-cart">
                                <FiShoppingCart className="cart-icon-bg" />
                                <p>Select items to add</p>
                            </div>
                        )}
                    </div>

                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="cart-actions">
                            <Button variant="secondary" onClick={() => navigate('/admin/restaurant/orders')}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSubmit} disabled={loading || !selectedTableId}>
                                {loading ? 'Placing...' : 'Place Order'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CreateOrder;
