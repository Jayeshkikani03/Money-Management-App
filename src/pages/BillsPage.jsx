import React from 'react';
import billingEngine from '../services/billingEngine';
import './BillsPage.css';

/**
 * BillsPage Component
 * Displays upcoming credit card bills and payment due dates
 */
const BillsPage = () => {
    const upcomingBills = billingEngine.getUpcomingBills(30); // Next 30 days
    const overdueBills = billingEngine.checkOverdueBills();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDaysUntil = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const getUrgencyClass = (daysUntil) => {
        if (daysUntil < 0) return 'overdue';
        if (daysUntil <= 3) return 'urgent';
        if (daysUntil <= 7) return 'warning';
        return 'normal';
    };

    return (
        <div className="bills-page">
            <div className="page-header">
                <h1>📋 Upcoming Bills</h1>
                <p className="page-subtitle">Credit card payment due dates</p>
            </div>

            {/* Overdue Bills */}
            {overdueBills.length > 0 && (
                <section className="bills-section overdue-section">
                    <h2 className="section-title">⚠️ Overdue Bills</h2>
                    <div className="bills-list">
                        {overdueBills.map(bill => {
                            const daysOverdue = Math.abs(getDaysUntil(bill.dueDate));

                            return (
                                <div key={bill.id} className="bill-card overdue">
                                    <div className="bill-header">
                                        <div className="bill-info">
                                            <h3 className="card-name">{bill.cardName}</h3>
                                            <div className="overdue-badge">
                                                {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
                                            </div>
                                        </div>
                                        <div className="bill-amount overdue-amount">
                                            ₹{bill.statementAmount.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="bill-details">
                                        <div className="detail-item">
                                            <span className="label">Due Date:</span>
                                            <span className="value">{formatDate(bill.dueDate)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Minimum Due:</span>
                                            <span className="value">₹{bill.minimumDue.toFixed(2)}</span>
                                        </div>
                                        {bill.paidAmount > 0 && (
                                            <div className="detail-item">
                                                <span className="label">Paid:</span>
                                                <span className="value">₹{bill.paidAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Upcoming Bills */}
            <section className="bills-section">
                <h2 className="section-title">📅 Upcoming Bills</h2>

                {upcomingBills.length === 0 && overdueBills.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No Bills Due</h3>
                        <p>You're all caught up!</p>
                    </div>
                ) : upcomingBills.length === 0 ? (
                    <div className="empty-state-small">
                        <p>No upcoming bills in the next 30 days</p>
                    </div>
                ) : (
                    <div className="bills-list">
                        {upcomingBills.map(bill => {
                            const daysUntil = getDaysUntil(bill.dueDate);
                            const urgency = getUrgencyClass(daysUntil);

                            return (
                                <div key={bill.id} className={`bill-card ${urgency}`}>
                                    <div className="bill-header">
                                        <div className="bill-info">
                                            <h3 className="card-name">{bill.cardName}</h3>
                                            <div className={`due-badge ${urgency}`}>
                                                {daysUntil === 0 ? 'Due today' :
                                                    daysUntil === 1 ? 'Due tomorrow' :
                                                        `Due in ${daysUntil} days`}
                                            </div>
                                        </div>
                                        <div className="bill-amount">
                                            ₹{bill.statementAmount.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="bill-details">
                                        <div className="detail-item">
                                            <span className="label">Due Date:</span>
                                            <span className="value">{formatDate(bill.dueDate)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Statement Date:</span>
                                            <span className="value">{formatDate(bill.statementDate)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Minimum Due:</span>
                                            <span className="value">₹{bill.minimumDue.toFixed(2)}</span>
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

export default BillsPage;
