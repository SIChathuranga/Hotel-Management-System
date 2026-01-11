// Register Page
// User registration page

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { registerWithEmailPassword, signInWithGoogle } from '../../firebase/auth';
import { Button, Input, Card } from '../../shared/components/ui';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const result = await registerWithEmailPassword(
                data.email,
                data.password,
                data.fullName,
                'customer' // Default role for registration
            );

            if (result.success) {
                toast.success('Account created successfully!');
                navigate('/');
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

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);

        try {
            const result = await signInWithGoogle('customer');

            if (result.success) {
                toast.success('Account created successfully!');
                navigate('/');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
            console.error(error);
        } finally {
            setGoogleLoading(false);
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
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join us for an exceptional experience</p>
                </div>

                {/* Registration Form */}
                <Card variant="glass" className="auth-card">
                    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                        <Input
                            label="Full Name"
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            icon={<FiUser />}
                            error={errors.fullName?.message}
                            fullWidth
                            {...register('fullName', {
                                required: 'Full name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters'
                                }
                            })}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
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

                        <Input
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            icon={<FiPhone />}
                            error={errors.phone?.message}
                            fullWidth
                            {...register('phone', {
                                pattern: {
                                    value: /^[\d\s+()-]+$/,
                                    message: 'Invalid phone number'
                                }
                            })}
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            icon={<FiLock />}
                            error={errors.password?.message}
                            fullWidth
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message: 'Password must include uppercase, lowercase, and number'
                                }
                            })}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            icon={<FiLock />}
                            error={errors.confirmPassword?.message}
                            fullWidth
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: value => value === password || 'Passwords do not match'
                            })}
                        />

                        <div className="auth-terms">
                            <label className="auth-checkbox">
                                <input
                                    type="checkbox"
                                    {...register('agreeTerms', {
                                        required: 'You must agree to the terms'
                                    })}
                                />
                                <span className="auth-checkbox-label">
                                    I agree to the{' '}
                                    <Link to="/terms" className="auth-link">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                                </span>
                            </label>
                            {errors.agreeTerms && (
                                <span className="auth-error">{errors.agreeTerms.message}</span>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={loading}
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    <Button
                        variant="outline"
                        size="large"
                        fullWidth
                        loading={googleLoading}
                        icon={<FcGoogle size={20} />}
                        onClick={handleGoogleSignIn}
                    >
                        Google
                    </Button>
                </Card>

                {/* Sign In Link */}
                <p className="auth-footer-text">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
