// Login Page
// User authentication login page

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { signInWithEmail, signInWithGoogle } from '../../firebase/auth';
import { Button, Input, Card } from '../../shared/components/ui';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const from = location.state?.from?.pathname || '/admin';

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const result = await signInWithEmail(data.email, data.password);

            if (result.success) {
                toast.success('Welcome back!');
                // Redirect based on role
                const role = result.userData?.role;
                if (role === 'customer') {
                    navigate('/');
                } else {
                    navigate(from, { replace: true });
                }
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
            const result = await signInWithGoogle();

            if (result.success) {
                if (result.isNewUser) {
                    toast.success('Account created successfully!');
                } else {
                    toast.success('Welcome back!');
                }

                const role = result.userData?.role;
                if (role === 'customer') {
                    navigate('/');
                } else {
                    navigate(from, { replace: true });
                }
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
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to continue to your account</p>
                </div>

                {/* Login Form */}
                <Card variant="glass" className="auth-card">
                    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            icon={<FiLock />}
                            error={errors.password?.message}
                            fullWidth
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            })}
                        />

                        <div className="auth-options">
                            <label className="auth-checkbox">
                                <input type="checkbox" {...register('rememberMe')} />
                                <span className="auth-checkbox-label">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="auth-link">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={loading}
                        >
                            Sign In
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

                {/* Sign Up Link */}
                <p className="auth-footer-text">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
