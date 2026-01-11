// Forgot Password Page
// Password reset request page

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { resetPassword } from '../../firebase/auth';
import { Button, Input, Card } from '../../shared/components/ui';
import './Auth.css';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [sentEmail, setSentEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const result = await resetPassword(data.email);

            if (result.success) {
                setEmailSent(true);
                setSentEmail(data.email);
                toast.success('Password reset email sent!');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Background Decoration */}
            <div className="auth-bg-decoration">
                <div className="auth-bg-circle auth-bg-circle-1"></div>
                <div className="auth-bg-circle auth-bg-circle-2"></div>
                <div className="auth-bg-circle auth-bg-circle-3"></div>
            </div>

            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo & Branding */}
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <span className="auth-logo-icon">🏨</span>
                        <span className="auth-logo-text">LuxeStay</span>
                    </Link>

                    {emailSent ? (
                        <>
                            <div className="auth-success-icon">
                                <FiCheck size={40} />
                            </div>
                            <h1 className="auth-title">Check Your Email</h1>
                            <p className="auth-subtitle">
                                We've sent a password reset link to<br />
                                <strong>{sentEmail}</strong>
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="auth-title">Forgot Password?</h1>
                            <p className="auth-subtitle">
                                No worries, we'll send you reset instructions.
                            </p>
                        </>
                    )}
                </div>

                {/* Form or Success Message */}
                <Card variant="glass" className="auth-card">
                    {emailSent ? (
                        <div className="auth-success-content">
                            <p className="auth-success-text">
                                Click the link in your email to reset your password.
                                If you don't see it, check your spam folder.
                            </p>

                            <Button
                                variant="outline"
                                size="large"
                                fullWidth
                                onClick={() => {
                                    setEmailSent(false);
                                    setSentEmail('');
                                }}
                            >
                                Send Another Email
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                icon={<FiMail />}
                                error={errors.email?.message}
                                fullWidth
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="large"
                                fullWidth
                                loading={loading}
                            >
                                Reset Password
                            </Button>
                        </form>
                    )}
                </Card>

                {/* Back to Login */}
                <Link to="/login" className="auth-back-link">
                    <FiArrowLeft />
                    <span>Back to login</span>
                </Link>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
