import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import './SummaryBar.css';

const SummaryBar = ({ income, expense, currency = 'INR' }) => {
    return (
        <div className="summary-bar">
            <div className="summary-item income">
                <div className="summary-icon">
                    <TrendingUp size={18} />
                </div>
                <div className="summary-details">
                    <span className="summary-label">Income</span>
                    <span className="summary-amount">{formatCurrency(income, currency)}</span>
                </div>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item expense">
                <div className="summary-icon">
                    <TrendingDown size={18} />
                </div>
                <div className="summary-details">
                    <span className="summary-label">Expense</span>
                    <span className="summary-amount">{formatCurrency(expense, currency)}</span>
                </div>
            </div>
        </div>
    );
};

export default SummaryBar;
