// Billing & Invoices Page
// Manage financial transactions

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiFileText, FiDollarSign, FiDownload } from 'react-icons/fi';
import { Button, Card, Input, Spinner } from '../../shared/components/ui';
import { getInvoices, processPayment } from '../../firebase/services/billingService';
import toast from 'react-hot-toast';
import './Billing.css';

const Billing = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadData();
    }, [statusFilter, search]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getInvoices({ status: statusFilter, search });
            if (res.success) {
                setInvoices(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (invoiceId, amount) => {
        if (window.confirm(`Process payment of $${amount}?`)) {
            const res = await processPayment(invoiceId, { amount, method: 'Credit Card' });
            if (res.success) {
                toast.success('Payment successful');
                loadData();
            } else {
                toast.error('Payment failed');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="badge success">Paid</span>;
            case 'Unpaid': return <span className="badge warning">Unpaid</span>;
            case 'Overdue': return <span className="badge error">Overdue</span>;
            default: return <span className="badge neutral">{status}</span>;
        }
    };

    return (
        <div className="billing-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Billing & Invoices</h1>
                    <p className="page-subtitle">Manage guest payments</p>
                </div>
                <Link to="/admin/billing/create">
                    <Button icon={<FiPlus />} variant="primary">Create Invoice</Button>
                </Link>
            </div>

            <Card className="invoices-card">
                <div className="filters-bar">
                    <div className="search-box">
                        <Input
                            placeholder="Search by ID or Guest Name..."
                            icon={<FiSearch />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="status-filters">
                        <select
                            className="select-input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 flex justify-center"><Spinner /></div>
                ) : (
                    <div className="table-responsive">
                        <table className="billing-table">
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Guest</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length > 0 ? invoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="font-mono">
                                            <Link to={`/admin/billing/${inv.id}`} className="text-primary hover:underline">
                                                {inv.id}
                                            </Link>
                                        </td>
                                        <td className="font-bold">{inv.guestName}</td>
                                        <td>{inv.issueDate}</td>
                                        <td>{inv.dueDate}</td>
                                        <td className="font-bold text-primary">${inv.total.toFixed(2)}</td>
                                        <td>{getStatusBadge(inv.status)}</td>
                                        <td>
                                            <div className="actions-cell">
                                                {inv.status !== 'Paid' && (
                                                    <button
                                                        className="action-btn-text pay"
                                                        onClick={() => handlePay(inv.id, inv.total)}
                                                    >
                                                        Pay Now
                                                    </button>
                                                )}
                                                <Link to={`/admin/billing/${inv.id}`}>
                                                    <button className="icon-btn-sm" title="View Details">
                                                        <FiFileText />
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-400">No invoices found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Billing;
