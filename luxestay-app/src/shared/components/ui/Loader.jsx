// Loader Component
// Various loading indicators for the application

import React from 'react';
import './Loader.css';

// Spinner Loader
export const Spinner = ({ size = 'medium', className = '' }) => {
    const sizeClasses = {
        small: 'loader-spinner-sm',
        medium: 'loader-spinner-md',
        large: 'loader-spinner-lg'
    };

    return (
        <div className={`loader-spinner ${sizeClasses[size]} ${className}`}>
            <div className="loader-spinner-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

// Dots Loader
export const DotsLoader = ({ className = '' }) => (
    <div className={`loader-dots ${className}`}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

// Full Page Loader
export const PageLoader = ({ text = 'Loading...' }) => (
    <div className="loader-page">
        <div className="loader-page-content">
            <div className="loader-logo">
                <span className="loader-logo-text">LuxeStay</span>
            </div>
            <Spinner size="large" />
            {text && <p className="loader-page-text">{text}</p>}
        </div>
    </div>
);

// Skeleton Loader
export const Skeleton = ({
    width = '100%',
    height = '20px',
    borderRadius = 'var(--radius-md)',
    className = ''
}) => (
    <div
        className={`loader-skeleton ${className}`}
        style={{ width, height, borderRadius }}
    />
);

// Skeleton Text Lines
export const SkeletonText = ({ lines = 3, className = '' }) => (
    <div className={`loader-skeleton-text ${className}`}>
        {Array.from({ length: lines }, (_, i) => (
            <Skeleton
                key={i}
                width={i === lines - 1 ? '60%' : '100%'}
                height="14px"
            />
        ))}
    </div>
);

// Skeleton Card
export const SkeletonCard = ({ className = '' }) => (
    <div className={`loader-skeleton-card ${className}`}>
        <Skeleton height="180px" borderRadius="var(--radius-xl) var(--radius-xl) 0 0" />
        <div className="loader-skeleton-card-body">
            <Skeleton width="70%" height="24px" />
            <SkeletonText lines={2} />
            <div className="loader-skeleton-card-footer">
                <Skeleton width="100px" height="36px" borderRadius="var(--radius-lg)" />
            </div>
        </div>
    </div>
);

// Default export
const Loader = {
    Spinner,
    DotsLoader,
    PageLoader,
    Skeleton,
    SkeletonText,
    SkeletonCard
};

export default Loader;
