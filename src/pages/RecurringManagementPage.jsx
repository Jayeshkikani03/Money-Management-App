import React, { useState, useEffect } from 'react';
import { Edit2, Pause, Play, Trash2, SkipForward } from 'lucide-react';
import { useApp } from '../context/AppContext';
import recurringManagement from '../services/recurringManagement';
import recurringEngine from '../services/recurringEngine';
import RecurringEditModal from '../components/RecurringEditModal';
import Button from '../components/ui/Button';
import './RecurringManagementPage.css';

const RecurringManagementPage = () => {
    const { transactions } = useApp();
    const [recurring, setRecurring] = useState([]);
    const [selectedRecurring, setSelectedRecurring] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        loadRecurring();
    }, [transactions]);

    const loadRecurring = () => {
        const allRecurring = recurringEngine.getAllRecurring();
        setRecurring(allRecurring);
    };

    const handleEdit = (item) => {
        setSelectedRecurring(item);
        setShowEditModal(true);
    };

    const handlePauseResume = (item) => {
        if (item.isPaused) {
            recurringManagement.resumeRecurring(item.id);
        } else {
            recurringManagement.pauseRecurring(item.id);
        }
        loadRecurring();
    };

    const handleDelete = (item) => {
        if (window.confirm(`Delete recurring transaction "${item.description}"?`)) {
            recurringManagement.deleteRecurring(item.id);
            loadRecurring();
        }
    };

    const handleSkip = (item) => {
        if (window.confirm('Skip next occurrence?')) {
            recurringManagement.skipNextRecurring(item.id);
            loadRecurring();
        }
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    const getFrequencyLabel = (frequency) => {
        const labels = {
            daily: 'Daily',
            weekly: 'Weekly',
            biweekly: 'Bi-Weekly',
            monthly: 'Monthly',
            quarterly: 'Quarterly',
            yearly: 'Yearly'
        };
        return labels[frequency] || frequency;
    };

    return (
        <div className="recurring-management-page">
            <header className="page-header">
                <h1>Recurring Transactions</h1>
                <p className="page-subtitle">{recurring.length} active schedules</p>
            </header>

            <div className="recurring-list">
                {recurring.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔄</div>
                        <p>No recurring transactions</p>
                        <p className="empty-hint">Create recurring transactions from the transaction form</p>
                    </div>
                ) : (
                    recurring.map((item) => (
                        <div
                            key={item.id}
                            className={`recurring-card ${item.isPaused ? 'paused' : ''}`}
                        >
                            <div className="recurring-header">
                                <div className="recurring-info">
                                    <h3 className="recurring-description">{item.description}</h3>
                                    <div className="recurring-meta">
                                        <span className="recurring-frequency">
                                            {getFrequencyLabel(item.frequency)}
                                        </span>
                                        {item.isPaused && (
                                            <span className="recurring-status paused">Paused</span>
                                        )}
                                    </div>
                                </div>
                                <div className="recurring-amount">
                                    {formatCurrency(item.amount)}
                                </div>
                            </div>

                            <div className="recurring-details">
                                <div className="detail-item">
                                    <span className="detail-label">Next Due:</span>
                                    <span className="detail-value">
                                        {formatDate(item.nextExecutionDate)}
                                    </span>
                                </div>
                                {item.endDate && (
                                    <div className="detail-item">
                                        <span className="detail-label">Ends:</span>
                                        <span className="detail-value">{formatDate(item.endDate)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="recurring-actions">
                                <button
                                    className="action-btn"
                                    onClick={() => handleEdit(item)}
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={() => handlePauseResume(item)}
                                    title={item.isPaused ? 'Resume' : 'Pause'}
                                >
                                    {item.isPaused ? <Play size={16} /> : <Pause size={16} />}
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={() => handleSkip(item)}
                                    title="Skip Next"
                                >
                                    <SkipForward size={16} />
                                </button>
                                <button
                                    className="action-btn danger"
                                    onClick={() => handleDelete(item)}
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showEditModal && selectedRecurring && (
                <RecurringEditModal
                    recurring={selectedRecurring}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedRecurring(null);
                    }}
                    onSave={() => {
                        loadRecurring();
                        setShowEditModal(false);
                        setSelectedRecurring(null);
                    }}
                />
            )}
        </div>
    );
};

export default RecurringManagementPage;
