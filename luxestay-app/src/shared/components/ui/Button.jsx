// Button Component
// A versatile button component with multiple variants and sizes

import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon = null,
    iconPosition = 'left',
    onClick,
    className = '',
    ...props
}) => {
    const buttonClasses = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'btn-full-width' : '',
        loading ? 'btn-loading' : '',
        disabled ? 'btn-disabled' : '',
        className
    ].filter(Boolean).join(' ');

    const handleClick = (e) => {
        if (disabled || loading) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    return (
        <motion.button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={handleClick}
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            transition={{ duration: 0.15 }}
            {...props}
        >
            {loading && (
                <span className="btn-spinner">
                    <svg className="animate-spin\" viewBox="0 0 24 24" fill="none">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </span>
            )}

            {icon && iconPosition === 'left' && !loading && (
                <span className="btn-icon btn-icon-left">{icon}</span>
            )}

            <span className="btn-text">{children}</span>

            {icon && iconPosition === 'right' && !loading && (
                <span className="btn-icon btn-icon-right">{icon}</span>
            )}
        </motion.button>
    );
};

export default Button;
