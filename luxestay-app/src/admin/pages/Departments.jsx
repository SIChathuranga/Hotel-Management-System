// Departments Page
// View hotel departments and hierarchy

import React, { useState, useEffect } from 'react';
import {
    FiLoader,
    FiBriefcase,
    FiUsers,
    FiLayers
} from 'react-icons/fi';
import { Card, Spinner } from '../../shared/components/ui';
import { getDepartments } from '../../firebase/services/staffService';
import './Departments.css';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getDepartments();
            if (res.success) {
                setDepartments(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-container"><Spinner size="large" /></div>;

    return (
        <div className="departments-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Departments</h1>
                    <p className="page-subtitle">Organizational structure overview</p>
                </div>
            </div>

            <div className="departments-grid">
                {departments.map((dept, index) => (
                    <Card key={dept.id} className="dept-card">
                        <div className="dept-icon-wrapper" style={{ '--delay': index }}>
                            <FiBriefcase className="dept-icon" />
                        </div>
                        <h3 className="dept-name">{dept.name}</h3>

                        <div className="dept-details">
                            <div className="dept-row">
                                <span className="label">Head of Dept</span>
                                <span className="value head">{dept.head}</span>
                            </div>
                            <div className="dept-row">
                                <span className="label">Total Staff</span>
                                <span className="value">
                                    <FiUsers className="inline-icon" /> {dept.staffCount}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Departments;
