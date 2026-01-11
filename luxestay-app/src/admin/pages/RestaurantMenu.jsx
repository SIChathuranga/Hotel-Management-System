// Restaurant Menu Page
// View and manage food and drink items

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiGrid, FiList, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Button, Card, Spinner, Input } from '../../shared/components/ui';
import { getMenuItems } from '../../firebase/services/restaurantService';
import toast from 'react-hot-toast';
import './RestaurantMenu.css';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

const RestaurantMenu = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');

    useEffect(() => {
        loadMenu();
    }, [category]);

    const loadMenu = async () => {
        setLoading(true);
        try {
            const res = await getMenuItems(category === 'All' ? 'all' : category);
            if (res.success) {
                setItems(res.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load menu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="restaurant-menu-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Restaurant Menu</h1>
                    <p className="page-subtitle">Manage food and beverage offerings</p>
                </div>
                <Link to="/admin/restaurant/menu/add">
                    <Button icon={<FiPlus />} variant="primary">
                        Add Item
                    </Button>
                </Link>
            </div>

            {/* Category Tabs */}
            <div className="category-tabs">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`tab-btn ${category === cat ? 'active' : ''}`}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-container"><Spinner /></div>
            ) : (
                <div className="menu-grid">
                    {items.map(item => (
                        <Card key={item.id} className="menu-card">
                            <div className="menu-image-placeholder">
                                {item.category === 'Drinks' ? '🍹' :
                                    item.category === 'Desserts' ? '🍰' : '🍽️'}
                            </div>
                            <div className="menu-details">
                                <div className="menu-header">
                                    <h3 className="menu-title">{item.name}</h3>
                                    <span className="menu-price">${item.price.toFixed(2)}</span>
                                </div>
                                <p className="menu-desc">{item.description}</p>
                                <div className="menu-footer">
                                    <span className="category-tag">{item.category}</span>
                                    <div className="menu-actions">
                                        <button className="icon-btn-xs edit"><FiEdit2 /></button>
                                        <button className="icon-btn-xs delete"><FiTrash2 /></button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantMenu;
