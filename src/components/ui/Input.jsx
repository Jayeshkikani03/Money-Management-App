import React from 'react';
import './Input.css';

const Input = ({
    label,
    error,
    type = 'text',
    ...props
}) => {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <input
                type={type}
                className={`input ${error ? 'input-error' : ''}`.trim()}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Input;
