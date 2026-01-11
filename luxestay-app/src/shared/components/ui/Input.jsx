// Input Component
// A styled input component with label, error state, and icon support

import React, { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Input.css';

const Input = forwardRef(({
    type = 'text',
    label,
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    helperText,
    disabled = false,
    required = false,
    readOnly = false,
    icon = null,
    iconPosition = 'left',
    fullWidth = false,
    className = '',
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const containerClasses = [
        'input-container',
        fullWidth ? 'input-full-width' : '',
        className
    ].filter(Boolean).join(' ');

    const inputWrapperClasses = [
        'input-wrapper',
        isFocused ? 'input-focused' : '',
        error ? 'input-error' : '',
        disabled ? 'input-disabled' : '',
        icon ? `input-with-icon-${iconPosition}` : ''
    ].filter(Boolean).join(' ');

    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <div className={containerClasses}>
            {label && (
                <label htmlFor={name} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}

            <div className={inputWrapperClasses}>
                {icon && iconPosition === 'left' && (
                    <span className="input-icon input-icon-left">{icon}</span>
                )}

                <input
                    ref={ref}
                    id={name}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    className="input-field"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    {...props}
                />

                {icon && iconPosition === 'right' && !isPassword && (
                    <span className="input-icon input-icon-right">{icon}</span>
                )}

                {isPassword && (
                    <button
                        type="button"
                        className="input-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                )}
            </div>

            {(error || helperText) && (
                <span
                    id={`${name}-error`}
                    className={`input-helper ${error ? 'input-helper-error' : ''}`}
                >
                    {error || helperText}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
