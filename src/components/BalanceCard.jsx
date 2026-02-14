import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getCurrentMonthYear } from '../utils/helpers';
import Card from './ui/Card';
import './BalanceCard.css';

const BalanceCard = ({ month, year }) => {
    const { getMonthlyTotals, settings } = useApp();

    const { month: currentMonth, year: currentYear } = getCurrentMonthYear();
    const displayMonth = month ?? currentMonth;
    const displayYear = year ?? currentYear;

    const { balance, totalIncome, totalExpense } = getMonthlyTotals(displayMonth, displayYear);

    return (
        <Card className="balance-card">
            <div className="balance-header">
                <h3>Current Balance</h3>
            </div>
            <div className={`balance-amount ${balance >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(balance, settings.currency)}
            </div>
            <div className="balance-breakdown">
                <div className="breakdown-item income">
                    <span className="breakdown-label">Income</span>
                    <span className="breakdown-value">
                        {formatCurrency(totalIncome, settings.currency)}
                    </span>
                </div>
                <div className="breakdown-item expense">
                    <span className="breakdown-label">Expense</span>
                    <span className="breakdown-value">
                        {formatCurrency(totalExpense, settings.currency)}
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default BalanceCard;
