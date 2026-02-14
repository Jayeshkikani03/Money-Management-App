import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthName } from '../utils/helpers';
import './MonthSelector.css';

const MonthSelector = ({ month, year, onMonthChange }) => {
    const handlePrevMonth = () => {
        const newMonth = month === 0 ? 11 : month - 1;
        const newYear = month === 0 ? year - 1 : year;
        onMonthChange(newMonth, newYear);
    };

    const handleNextMonth = () => {
        const newMonth = month === 11 ? 0 : month + 1;
        const newYear = month === 11 ? year + 1 : year;
        onMonthChange(newMonth, newYear);
    };

    return (
        <div className="month-selector">
            <button className="month-nav-btn" onClick={handlePrevMonth}>
                <ChevronLeft size={20} />
            </button>
            <div className="month-display">
                <span className="month-name">{getMonthName(month)}</span>
                <span className="year-name">{year}</span>
            </div>
            <button className="month-nav-btn" onClick={handleNextMonth}>
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default MonthSelector;
