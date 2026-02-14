import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import './Dropdown.css';

/**
 * Unified Dropdown Component
 * Features: Portal rendering, auto-reposition, max-height scroll, mobile bottom sheet
 */
const Dropdown = ({
    trigger,
    children,
    options = [],
    value,
    onChange,
    placeholder = 'Select option',
    disabled = false,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);

    // Calculate position
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = 280; // max-height

            let top = rect.bottom + window.scrollY;
            let openUpward = false;

            // If not enough space below, open upward
            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                top = rect.top + window.scrollY - dropdownHeight;
                openUpward = true;
            }

            setPosition({
                top,
                left: rect.left + window.scrollX,
                width: rect.width,
                openUpward,
            });
        }
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleSelect = (option) => {
        onChange?.(option);
        setIsOpen(false);
    };

    const selectedOption = options.find((opt) => opt.value === value);

    const dropdownContent = (
        <div
            ref={dropdownRef}
            className={`dropdown-menu ${position.openUpward ? 'dropdown-upward' : ''}`}
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
            }}
        >
            <div className="dropdown-list">
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={`dropdown-item ${option.value === value ? 'dropdown-item-selected' : ''}`}
                        onClick={() => handleSelect(option)}
                    >
                        {option.icon && <span className="dropdown-item-icon">{option.icon}</span>}
                        <span className="dropdown-item-label">{option.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={`dropdown ${className}`}>
            <div
                ref={triggerRef}
                className={`dropdown-trigger ${isOpen ? 'dropdown-trigger-open' : ''} ${disabled ? 'dropdown-trigger-disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                {trigger || (
                    <>
                        <span className="dropdown-trigger-text">
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <ChevronDown className={`dropdown-trigger-icon ${isOpen ? 'dropdown-trigger-icon-open' : ''}`} size={16} />
                    </>
                )}
            </div>

            {isOpen && createPortal(dropdownContent, document.body)}
        </div>
    );
};

export default Dropdown;
