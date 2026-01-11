// Invoice Details
// View, Print, Pay, Refund

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiPrinter, FiEdit, FiArrowLeft, FiDollarSign, FiRefreshCcw } from 'react-icons/fi';
import { Button, Card, Spinner, Input } from '../../shared/components/ui';
import { getInvoiceById, processPayment, processRefund } from '../../firebase/services/billingService';
import toast from 'react-hot-toast';
import './InvoiceDetails.css';

const InvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    // Payment/Refund Modal State (Simplified as inline logic or prompt for MVP)
    // We will use window.prompt for amount for simplicity in this iteration

    useEffect(() => {
        loadInvoice();
    }, [id]);

    const loadInvoice = async () => {
        setLoading(true);
        const res = await getInvoiceById(id);
        if (res.success) {
            setInvoice(res.data);
        } else {
            toast.error('Invoice not found');
            navigate('/admin/billing');
        }
        setLoading(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handlePayment = async () => {
        const amountStr = window.prompt(`Enter payment amount (Balance: $${(invoice.total - (invoice.payments?.reduce((s, p) => s + p.amount, 0) || 0)).toFixed(2)})`,
            (invoice.total - (invoice.payments?.reduce((s, p) => s + p.amount, 0) || 0)).toFixed(2));
        if (!amountStr) return;

        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Invalid amount');
            return;
        }

        const res = await processPayment(id, { amount, method: 'Manual' });
        if (res.success) {
            toast.success('Payment recorded');
            loadInvoice();
        } else {
            toast.error('Payment failed');
        }
    };

    const handleRefund = async () => {
        const amountStr = window.prompt('Enter refund amount', invoice.total.toFixed(2));
        if (!amountStr) return;

        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Invalid amount');
            return;
        }

        const res = await processRefund(id, { amount, reason: 'Manual Refund' });
        if (res.success) {
            toast.success('Refund processed');
            loadInvoice();
        } else {
            toast.error('Refund failed');
        }
    };

    if (loading) return <div className="loading-container"><Spinner /></div>;
    if (!invoice) return null;

    const totalPaid = invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const balance = invoice.total - totalPaid;

    return (
        <div className="invoice-details-page">
            <div className="page-header no-print">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" icon={<FiArrowLeft />} onClick={() => navigate('/admin/billing')}>
                        Back
                    </Button>
                    <h1 className="page-title">Invoice #{invoice.id}</h1>
                </div>
                <div className="header-actions">
                    <Button variant="secondary" icon={<FiPrinter />} onClick={handlePrint}>Print / Download</Button>
                    <Link to={`/admin/billing/edit/${id}`}>
                        <Button variant="secondary" icon={<FiEdit />}>Edit</Button>
                    </Link>
                    {balance > 0 && (
                        <Button variant="primary" icon={<FiDollarSign />} onClick={handlePayment}>Record Payment</Button>
                    )}
                    {(invoice.status === 'Paid' || totalPaid > 0) && (
                        <Button variant="outline" className="btn-danger-outline" icon={<FiRefreshCcw />} onClick={handleRefund}>
                            Refund
                        </Button>
                    )}
                </div>
            </div>

            <Card className="invoice-paper">
                <div className="invoice-header">
                    <div className="brand">
                        <h2>LuxeStay Hotel</h2>
                        <p>123 Luxury Ave, Beverly Hills, CA</p>
                    </div>
                    <div className="meta">
                        <h3>INVOICE</h3>
                        <p><strong>Date:</strong> {invoice.issueDate}</p>
                        <p><strong>Due:</strong> {invoice.dueDate}</p>
                        <p><strong>Status:</strong> <span className={`status-text ${invoice.status.toLowerCase()}`}>{invoice.status}</span></p>
                    </div>
                </div>

                <div className="bill-to">
                    <h4>Bill To:</h4>
                    <p className="guest-name">{invoice.guestName}</p>
                    <p>Guest ID: {invoice.guestId || 'N/A'}</p>
                </div>

                <table className="invoice-items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th className="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.description}</td>
                                <td className="text-right">${item.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="text-right font-bold">Total</td>
                            <td className="text-right font-bold">${invoice.total.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className="text-right">Paid</td>
                            <td className="text-right text-green-600">-${totalPaid.toFixed(2)}</td>
                        </tr>
                        <tr className="grand-total">
                            <td className="text-right">Balance Due</td>
                            <td className="text-right">${balance.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                {invoice.payments?.length > 0 && (
                    <div className="payments-history">
                        <h4>Payment History</h4>
                        <ul>
                            {invoice.payments.map((p, idx) => (
                                <li key={idx} className="flex justify-between text-sm py-1 border-b border-gray-100">
                                    <span>{p.date} - {p.method}</span>
                                    <span>${p.amount.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="invoice-footer">
                    <p>Thank you for your business!</p>
                </div>
            </Card>
        </div>
    );
};

export default InvoiceDetails;
