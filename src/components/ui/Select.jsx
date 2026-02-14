import React from 'react';
import './Select.css';

const Select = ({
    label,
    error,
    options = [],
    ...props
}) => {
    return (
        <div className="select-group">
            {label && <label className="select-label">{label}</label>}
            <select
                className={`select ${error ? 'select-error' : ''}`.trim()}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="select-error-message">{error}</span>}
        </div>
    );
};

export default Select;
