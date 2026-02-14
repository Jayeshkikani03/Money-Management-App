import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    onClick,
    type = 'button',
    ...props
}) => {
    const className = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`.trim();

    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
