import React from 'react';
import './Card.css';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div className={`card ${className}`.trim()} {...props}>
            {children}
        </div>
    );
};

export default Card;
