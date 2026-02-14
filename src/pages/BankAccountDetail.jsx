import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Edit2, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import EnhancedTransactionList from '../components/EnhancedTransactionList';
import Modal from '../components/ui/Modal';
import AddBankAccountForm from '../components/AddBankAccountForm';
import { getTransactionsByAccount, getAccountTotals } from '../services/accountTransactionService';
import { maskAccountNumber } from '../services/accountService';
import { formatCurrency } from '../utils/helpers';
import { ACCOUNT_TYPES } from '../constants/accountTypes';
import './BankAccountDetail.css';

const BankAccountDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { bankAccounts, transactions, deleteBankAccount, settings } = useApp();
    const [showEditModal, setShowEditModal] = useState(false);

    const account = bankAccounts.find(acc => acc.id === id);

    const accountTransactions = useMemo(() => {
        if (!account) return [];
        return getTransactionsByAccount(transactions, ACCOUNT_TYPES.BANK, id);
    }, [transactions, account, id]);

    const stats = useMemo(() => {
        return getAccountTotals(accountTransactions, ACCOUNT_TYPES.BANK, id);
    }, [accountTransactions, id]);

    if (!account) {
        return (
            <div className="error-state">
                <p>Account not found</p>
                <button onClick={() => navigate('/accounts')}>Go Back</button>
            </div>
        );
    }

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${account.bankName}? This action cannot be undone.`)) {
            try {
                await deleteBankAccount(id);
                navigate('/accounts');
            } catch (error) {
                alert('Failed to delete account');
            }
        }
    };

    return (
        <div className="bank-account-detail">
            <button className="header-back-btn" onClick={() => navigate('/accounts')}>
                <ArrowLeft size={20} />
                Back to Accounts
            </button>

            <div className="account-header-card">
                <div className="account-header-top">
                    <div className="bank-info">
                        <h2>{account.bankName}</h2>
                        <div className="account-info">
                            {account.accountName} • {maskAccountNumber(account.accountNumber)}
                        </div>
                    </div>
                    <div className="account-header-actions">
                        <button className="header-action-btn" onClick={() => setShowEditModal(true)}>
                            <Edit2 size={18} />
                        </button>
                        <button className="header-action-btn" onClick={handleDelete}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="account-balance-section">
                    <div className="balance-label">Current Balance</div>
                    <div className="balance-amount">
                        {formatCurrency(account.balance, settings.currency)}
                    </div>
                </div>
            </div>

            <div className="account-stats">
                <div className="stat-card">
                    <div className="stat-label">Total Income</div>
                    <div className="stat-value income">
                        +{formatCurrency(stats.totalIncome, settings.currency)}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Expense</div>
                    <div className="stat-value expense">
                        -{formatCurrency(stats.totalExpense, settings.currency)}
                    </div>
                </div>
            </div>

            <div className="transactions-section">
                <div className="section-header">
                    Transactions
                </div>
                <EnhancedTransactionList
                    transactions={accountTransactions}
                    onTransactionClick={(t) => {
                        // Handle transaction click - maybe open details or edit?
                        // For now strictly list
                        console.log('Clicked transaction', t);
                    }}
                />
            </div>

            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Bank Account"
            >
                <AddBankAccountForm
                    accountToEdit={account}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => setShowEditModal(false)}
                />
            </Modal>
        </div>
    );
};

export default BankAccountDetail;
