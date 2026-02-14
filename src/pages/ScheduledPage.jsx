import React from 'react';
import { useApp } from '../context/AppContext';
import recurringEngine from '../services/recurringEngine';
import installmentEngine from '../services/installmentEngine';
import { RECURRING_FREQUENCY_LABELS, INSTALLMENT_TYPE_LABELS } from '../constants/accountTypes';
import './ScheduledPage.css';

/**
 * ScheduledPage Component
 * Displays recurring transactions and installments
 */
const ScheduledPage = () => {
    const { transactions } = useApp();

    const recurringTransactions = recurringEngine.getActiveRecurring();
    const activeInstallments = installmentEngine.getActiveInstallments();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="scheduled-page">
            <div className="page-header">
                <h1>📅 Scheduled Transactions</h1>
                <p className="page-subtitle">Manage recurring transactions and installments</p>
            </div>

            {/* Recurring Transactions Section */}
            <section className="scheduled-section">
                <h2 className="section-title">🔄 Recurring Transactions</h2>

                {recurringTransactions.length === 0 ? (
                    <div className="empty-state-small">
                        <p>No recurring transactions set up</p>
                    </div>
                ) : (
                    <div className="scheduled-list">
                        {recurringTransactions.map(recurring => (
                            <div key={recurring.id} className="scheduled-card recurring">
                                <div className="card-header">
                                    <div className="card-title">
                                        <span className="type-badge recurring-badge">Recurring</span>
                                        <span className="description">{recurring.description}</span>
                                    </div>
                                    <div className="amount">₹{recurring.amount.toFixed(2)}</div>
                                </div>

                                <div className="card-details">
                                    <div className="detail-row">
                                        <span className="label">Frequency:</span>
                                        <span className="value">
                                            {RECURRING_FREQUENCY_LABELS[recurring.frequency]}
                                            {recurring.interval > 1 && ` (every ${recurring.interval})`}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Next:</span>
                                        <span className="value">{formatDate(recurring.nextExecutionDate)}</span>
                                    </div>
                                    {recurring.endDate && (
                                        <div className="detail-row">
                                            <span className="label">Until:</span>
                                            <span className="value">{formatDate(recurring.endDate)}</span>
                                        </div>
                                    )}
                                    <div className="detail-row">
                                        <span className="label">Completed:</span>
                                        <span className="value">{recurring.completedCount || 0} times</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Installments Section */}
            <section className="scheduled-section">
                <h2 className="section-title">📊 Installments</h2>

                {activeInstallments.length === 0 ? (
                    <div className="empty-state-small">
                        <p>No active installments</p>
                    </div>
                ) : (
                    <div className="scheduled-list">
                        {activeInstallments.map(installment => {
                            const progress = installmentEngine.getInstallmentProgress(installment.id);

                            return (
                                <div key={installment.id} className="scheduled-card installment">
                                    <div className="card-header">
                                        <div className="card-title">
                                            <span className="type-badge installment-badge">
                                                {INSTALLMENT_TYPE_LABELS[installment.linkedType] || installment.linkedType}
                                            </span>
                                            <span className="description">{installment.description}</span>
                                        </div>
                                        <div className="amount">₹{installment.amount.toFixed(2)}</div>
                                    </div>

                                    <div className="card-details">
                                        <div className="detail-row">
                                            <span className="label">Progress:</span>
                                            <span className="value">
                                                {progress.completed} / {progress.total} installments
                                            </span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Next:</span>
                                            <span className="value">{formatDate(installment.nextExecutionDate)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Total Amount:</span>
                                            <span className="value">₹{progress.totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Paid:</span>
                                            <span className="value">₹{progress.amountPaid.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ScheduledPage;
