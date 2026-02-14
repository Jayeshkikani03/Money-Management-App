import React, { useMemo } from 'react';
import './TotalView.css';

const TotalView = ({ transactions, month, year }) => {
    const totals = useMemo(() => {
        let totalIncome = 0;
        let totalExpense = 0;
        let cashExpense = 0;
        let cardExpense = 0;
        let transfer = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;
                // You can add logic here to categorize by payment method
                cashExpense += transaction.amount;
            }
        });

        return {
            totalIncome,
            totalExpense,
            total: totalIncome - totalExpense,
            cashExpense,
            cardExpense,
            transfer
        };
    }, [transactions]);

    const formatCurrency = (amount) => {
        return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const comparedExpensePercent = 53; // Placeholder - calculate from previous month

    return (
        <div className="total-view">
            {/* Year Summary */}
            <div className="total-section year-summary">
                <h3 className="year-title">{year} Summary</h3>
                <div className="year-stats">
                    <div className="year-stat-item">
                        <span className="stat-label">Total Income</span>
                        <span className="stat-value income">{formatCurrency(totals.totalIncome)}</span>
                    </div>
                    <div className="year-stat-item">
                        <span className="stat-label">Total Expense</span>
                        <span className="stat-value expense">{formatCurrency(totals.totalExpense)}</span>
                    </div>
                    <div className="year-stat-item">
                        <span className="stat-label">Net Balance</span>
                        <span className={`stat-value ${totals.total >= 0 ? 'income' : 'expense'}`}>
                            {formatCurrency(Math.abs(totals.total))}
                        </span>
                    </div>
                </div>
            </div>

            {/* Budget Section */}
            <div className="total-section budget-section">
                <div className="section-header">
                    <div className="section-icon">📊</div>
                    <h3>Budget</h3>
                </div>
                <button className="budget-setting-btn">
                    Budget Setting →
                </button>
            </div>

            {/* Accounts Section */}
            <div className="total-section accounts-section">
                <div className="section-header">
                    <div className="section-icon">💳</div>
                    <h3>Accounts</h3>
                </div>
                <div className="date-range">
                    Year {year}
                </div>

                <div className="account-items">
                    <div className="account-item">
                        <span className="account-label">Compared Expenses (Last year)</span>
                        <span className="account-value">{comparedExpensePercent}%</span>
                    </div>

                    <div className="account-item">
                        <span className="account-label">Expenses (Cash, Accounts)</span>
                        <span className="account-value">{formatCurrency(totals.cashExpense)}</span>
                    </div>

                    <div className="account-item">
                        <span className="account-label">Expenses (Card)</span>
                        <span className="account-value">{formatCurrency(totals.cardExpense)}</span>
                    </div>

                    <div className="account-item">
                        <span className="account-label">Transfer (Cash, Accounts → )</span>
                        <span className="account-value">{formatCurrency(totals.transfer)}</span>
                    </div>
                </div>

                <button className="export-btn">
                    <span className="excel-icon">📊</span>
                    Export data to Excel
                </button>
            </div>
        </div>
    );
};

export default TotalView;
