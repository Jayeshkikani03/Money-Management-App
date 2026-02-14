/**
 * Cash Account Detail Page
 * Shows transaction history for cash account
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCurrency } from '../hooks/useCurrency';
import './CashAccountDetail.css';

const CashAccountDetail = () => {
    const navigate = useNavigate();
    const { transactions, cashAccount } = useApp();
    const { format } = useCurrency();
    const [cashTransactions, setCashTransactions] = useState([]);

    useEffect(() => {
        // Filter transactions for cash account
        const filtered = transactions.filter(t =>
            t.accountId === 'cash' ||
            t.accountType === 'cash' ||
            t.account === 'Cash'
        ).sort((a, b) => new Date(b.date) - new Date(a.date));

        setCashTransactions(filtered);
    }, [transactions]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="cash-account-detail">
            {/* Header */}
            <header className="account-header">
                <button className="back-btn" onClick={() => navigate('/accounts')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="account-info">
                    <h1>Cash Account</h1>
                    <div className="account-balance">
                        <span className="balance-label">Current Balance</span>
                        <span className="balance-amount">{format(cashAccount?.balance || 0)}</span>
                    </div>
                </div>
            </header>

            {/* Transaction History */}
            <section className="transactions-section">
                <h2>Transaction History</h2>

                {cashTransactions.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">💰</div>
                        <p>No cash transactions yet</p>
                        <p className="empty-hint">Transactions made with cash will appear here</p>
                    </div>
                ) : (
                    <div className="transaction-list">
                        {cashTransactions.map((txn) => (
                            <div key={txn.id} className={`transaction-card ${txn.type}`}>
                                <div className="transaction-icon">
                                    {txn.type === 'income' ? (
                                        <TrendingUp size={20} className="income-icon" />
                                    ) : (
                                        <TrendingDown size={20} className="expense-icon" />
                                    )}
                                </div>

                                <div className="transaction-details">
                                    <div className="transaction-description">{txn.description || txn.category}</div>
                                    <div className="transaction-meta">
                                        <span className="transaction-category">{txn.category}</span>
                                        <span className="transaction-date">{formatDate(txn.date)}</span>
                                    </div>
                                </div>

                                <div className={`transaction-amount ${txn.type}`}>
                                    {txn.type === 'income' ? '+' : '-'}{format(txn.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Summary Stats */}
            {cashTransactions.length > 0 && (
                <section className="stats-section">
                    <div className="stat-card">
                        <span className="stat-label">Total Transactions</span>
                        <span className="stat-value">{cashTransactions.length}</span>
                    </div>
                    <div className="stat-card income">
                        <span className="stat-label">Total Income</span>
                        <span className="stat-value">
                            {format(cashTransactions
                                .filter(t => t.type === 'income')
                                .reduce((sum, t) => sum + (t.amount || 0), 0)
                            )}
                        </span>
                    </div>
                    <div className="stat-card expense">
                        <span className="stat-label">Total Expense</span>
                        <span className="stat-value">
                            {format(cashTransactions
                                .filter(t => t.type === 'expense')
                                .reduce((sum, t) => sum + (t.amount || 0), 0)
                            )}
                        </span>
                    </div>
                </section>
            )}
        </div>
    );
};

export default CashAccountDetail;
