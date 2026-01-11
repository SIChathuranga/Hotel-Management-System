// Restaurant Orders Page (POS)
// View active orders and manage status

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiClock, FiCheck, FiDollarSign } from 'react-icons/fi';
import { Button, Card, Spinner } from '../../shared/components/ui';
import { getOrders, updateOrderStatus } from '../../firebase/services/restaurantService';
import toast from 'react-hot-toast';
import './RestaurantOrders.css';

const RestaurantOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await getOrders();
            if (res.success) {
                setOrders(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const res = await updateOrderStatus(orderId, newStatus);
        if (res.success) {
            toast.success(`Order marked as ${newStatus}`);
            loadOrders();
        } else {
            toast.error('Failed to update order');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Preparing': return 'bg-blue-100 text-blue-800';
            case 'Served': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="orders-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Orders (POS)</h1>
                    <p className="page-subtitle">Track active restaurant orders</p>
                </div>
                <Link to="/admin/restaurant/orders/create">
                    <Button icon={<FiPlus />} variant="primary">
                        New Order
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="loading-container"><Spinner /></div>
            ) : (
                <div className="orders-grid">
                    {orders.map(order => (
                        <Card key={order.id} className="order-card">
                            <div className="order-header">
                                <span className="table-badge">Table {order.tableNumber}</span>
                                <span className={`order-status ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span className="qty">{item.qty}x</span>
                                        <span className="name">{item.name}</span>
                                        <span className="price">${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="total-row">
                                    <span>Total</span>
                                    <span className="total-amount">${order.total.toFixed(2)}</span>
                                </div>
                                <div className="order-actions">
                                    {order.status === 'Pending' && (
                                        <Button size="small" onClick={() => handleStatusChange(order.id, 'Preparing')}>
                                            Start Prep
                                        </Button>
                                    )}
                                    {order.status === 'Preparing' && (
                                        <Button size="small" onClick={() => handleStatusChange(order.id, 'Served')}>
                                            Serve
                                        </Button>
                                    )}
                                    {order.status === 'Served' && (
                                        <Button size="small" variant="outline" onClick={() => handleStatusChange(order.id, 'Paid')}>
                                            <FiDollarSign /> Pay
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantOrders;
