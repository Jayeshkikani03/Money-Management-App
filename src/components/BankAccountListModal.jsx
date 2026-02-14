import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from './ui/Modal';
import AddBankAccountForm from './AddBankAccountForm';
import { getActiveBankAccounts } from '../services/accountService';
import './BankAccountListModal.css';

const BankAccountListModal = ({ isOpen, onClose, onSelectAccount }) => {
    const { bankAccounts } = useApp();
    const [showAddForm, setShowAddForm] = useState(false);

    const activeBankAccounts = getActiveBankAccounts();

    const handleSelectAccount = (account) => {
        if (onSelectAccount) {
            onSelectAccount(account);
        }
        onClose();
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (showAddForm) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={() => setShowAddForm(false)}
                title="Add Bank Account"
            >
                <AddBankAccountForm
                    onClose={() => setShowAddForm(false)}
                    onSuccess={handleAddSuccess}
                />
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Select Bank Account"
        >
            <div className="bank-account-list">
                {activeBankAccounts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🏦</div>
                        <p>No bank accounts yet</p>
                        <p className="empty-subtitle">Add your first bank account to get started</p>
                    </div>
                ) : (
                    <div className="account-cards">
                        {activeBankAccounts.map(account => (
                            <div
                                key={account.id}
                                className="account-card"
                                onClick={() => handleSelectAccount(account)}
                            >
                                <div className="account-info">
                                    <div className="account-icon">🏦</div>
                                    <div className="account-details">
                                        <div className="account-name">{account.accountName}</div>
                                        <div className="bank-name">{account.bankName}</div>
                                        <div className="account-type-badge">
                                            {account.accountType === 'savings' ? 'Savings' : 'Current'}
                                        </div>
                                    </div>
                                </div>
                                <div className="account-balance">
                                    <div className="balance-label">Balance</div>
                                    <div className="balance-amount">{formatCurrency(account.balance)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    className="add-account-btn"
                    onClick={() => setShowAddForm(true)}
                >
                    <span className="add-icon">+</span>
                    Add Bank Account
                </button>
            </div>
        </Modal>
    );
};

export default BankAccountListModal;
