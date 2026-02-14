import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_ICONS } from '../constants/accountTypes';
import { getAccountDetails } from '../services/accountTransactionService';
import Modal from '../components/ui/Modal';
import TransferForm from '../components/TransferForm';
import { Edit2 } from 'lucide-react';
import './TransfersPage.css';

/**
 * TransfersPage Component
 * Displays transfer history with filtering and details
 */
const TransfersPage = () => {
    const { transactions } = useApp();
    const [filter, setFilter] = useState('all');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTransfer, setEditingTransfer] = useState(null);

    const handleEditClick = (transfer) => {
        setEditingTransfer(transfer);
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setEditingTransfer(null);
    };

    // Get all transfer transactions
    const transfers = transactions.filter(t => t.type === 'transfer');

    // Filter transfers
    const filteredTransfers = transfers.filter(t => {
        if (filter === 'all') return true;

        // Filter by source account type
        if (filter === 'cash') return t.fromAccountType === ACCOUNT_TYPES.CASH;
        if (filter === 'bank') return t.fromAccountType === ACCOUNT_TYPES.BANK;
        if (filter === 'credit') return t.fromAccountType === ACCOUNT_TYPES.CREDIT;

        return true;
    });

    const getTransferLabel = (transfer) => {
        const from = transfer.fromAccountType || 'Unknown';
        const to = transfer.toAccountType || 'Unknown';

        if (from === ACCOUNT_TYPES.BANK && to === ACCOUNT_TYPES.CASH) return 'ATM Withdrawal';
        if (from === ACCOUNT_TYPES.CASH && to === ACCOUNT_TYPES.BANK) return 'Cash Deposit';
        if (from === ACCOUNT_TYPES.BANK && to === ACCOUNT_TYPES.CREDIT) return 'Bill Payment';
        if (from === ACCOUNT_TYPES.CREDIT && to === ACCOUNT_TYPES.CASH) return 'Cash Advance';
        if (from === ACCOUNT_TYPES.BANK && to === ACCOUNT_TYPES.BANK) return 'Bank Transfer';

        return 'Transfer';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="transfers-page">
            <div className="page-header">
                <h1>💸 Transfers</h1>
                <p className="page-subtitle">View all account-to-account transfers</p>
            </div>

            <div className="filter-tabs">
                <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Transfers
                </button>
                <button
                    className={`filter-tab ${filter === 'cash' ? 'active' : ''}`}
                    onClick={() => setFilter('cash')}
                >
                    {ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.CASH]} Cash
                </button>
                <button
                    className={`filter-tab ${filter === 'bank' ? 'active' : ''}`}
                    onClick={() => setFilter('bank')}
                >
                    {ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.BANK]} Bank
                </button>
                <button
                    className={`filter-tab ${filter === 'credit' ? 'active' : ''}`}
                    onClick={() => setFilter('credit')}
                >
                    {ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.CREDIT]} Card
                </button>
            </div>

            {filteredTransfers.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">💸</div>
                    <h3>No Transfers Found</h3>
                    <p>Transfer history will appear here</p>
                </div>
            ) : (
                <div className="transfers-list">
                    {filteredTransfers.map(transfer => {
                        const fromDetails = getAccountDetails(transfer.fromAccountType, transfer.fromAccountId);
                        const toDetails = getAccountDetails(transfer.toAccountType, transfer.toAccountId);

                        return (
                            <div key={transfer.id} className="transfer-card">
                                <div className="transfer-header">
                                    <div className="transfer-type">
                                        {getTransferLabel(transfer)}
                                    </div>
                                    <div className="transfer-amount">
                                        ₹{transfer.amount.toFixed(2)}
                                        <button
                                            className="edit-transfer-btn"
                                            onClick={() => handleEditClick(transfer)}
                                            title="Edit Transfer"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="transfer-flow">
                                    <div className="transfer-account from">
                                        <span className="account-icon">{fromDetails?.icon || '💰'}</span>
                                        <div className="account-details">
                                            <div className="account-name">{fromDetails?.name || 'Cash'}</div>
                                            {fromDetails?.bankName && (
                                                <div className="account-sub">{fromDetails.bankName}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="transfer-arrow">→</div>

                                    <div className="transfer-account to">
                                        <span className="account-icon">{toDetails?.icon || '💰'}</span>
                                        <div className="account-details">
                                            <div className="account-name">{toDetails?.name || 'Cash'}</div>
                                            {toDetails?.bankName && (
                                                <div className="account-sub">{toDetails.bankName}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="transfer-footer">
                                    <div className="transfer-date">{formatDate(transfer.date)}</div>
                                    {transfer.notes && (
                                        <div className="transfer-notes">{transfer.notes}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={showEditModal}
                onClose={handleCloseModal}
                title="Edit Transfer"
            >
                <TransferForm
                    editingTransfer={editingTransfer}
                    onClose={handleCloseModal}
                    onSuccess={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default TransfersPage;
