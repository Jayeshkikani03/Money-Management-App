import React from 'react';
import { Plus } from 'lucide-react';
import './FloatingActionButton.css';

const FloatingActionButton = ({ onClick }) => {
    return (
        <button className="fab" onClick={onClick} aria-label="Add Transaction">
            <Plus size={24} />
        </button>
    );
};

export default FloatingActionButton;
