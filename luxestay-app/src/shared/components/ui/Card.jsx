// Card Component
// A versatile card component with header, body and footer sections

import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
    children,
    title,
    subtitle,
    headerAction,
    footer,
    variant = 'default',
    padding = 'medium',
    hoverable = false,
    clickable = false,
    onClick,
    className = '',
    ...props
}) => {
    const cardClasses = [
        'card',
        `card-${variant}`,
        `card-padding-${padding}`,
        hoverable ? 'card-hoverable' : '',
        clickable ? 'card-clickable' : '',
        className
    ].filter(Boolean).join(' ');

    const CardWrapper = clickable ? motion.div : 'div';
    const cardProps = clickable ? {
        whileHover: { scale: 1.01 },
        whileTap: { scale: 0.99 },
        transition: { duration: 0.15 },
        onClick
    } : {};

    return (
        <CardWrapper className={cardClasses} {...cardProps} {...props}>
            {(title || subtitle || headerAction) && (
                <div className="card-header">
                    <div className="card-header-content">
                        {title && <h3 className="card-title">{title}</h3>}
                        {subtitle && <p className="card-subtitle">{subtitle}</p>}
                    </div>
                    {headerAction && (
                        <div className="card-header-action">{headerAction}</div>
                    )}
                </div>
            )}

            <div className="card-body">
                {children}
            </div>

            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </CardWrapper>
    );
};

// Card subcomponents for flexibility
Card.Header = ({ children, className = '' }) => (
    <div className={`card-header ${className}`}>{children}</div>
);

Card.Body = ({ children, className = '' }) => (
    <div className={`card-body ${className}`}>{children}</div>
);

Card.Footer = ({ children, className = '' }) => (
    <div className={`card-footer ${className}`}>{children}</div>
);

export default Card;
