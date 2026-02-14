import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import EnhancedTransactionList from '../components/EnhancedTransactionList';
import Modal from '../components/ui/Modal';
import AddCreditCardForm from '../components/AddCreditCardForm';
import { getTransactionsByAccount, getAccountTotals } from '../services/accountTransactionService';
import { maskCardNumber } from '../services/cardService';
import { formatCurrency } from '../utils/helpers';
import { ACCOUNT_TYPES } from '../constants/accountTypes';
import './CreditCardDetail.css';

const CreditCardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { creditCards, transactions, deleteCreditCard, settings } = useApp();
    const [showEditModal, setShowEditModal] = useState(false);

    const card = creditCards.find(c => c.id === id);

    const accountTransactions = useMemo(() => {
        if (!card) return [];
        return getTransactionsByAccount(transactions, ACCOUNT_TYPES.CREDIT, id);
    }, [transactions, card, id]);

    // For cards, income/expense stats might be confusing since "Expense" increases used amount.
    // But we can show total spent in current period?
    // Let's rely on standard stats.
    const stats = useMemo(() => {
        return getAccountTotals(accountTransactions, ACCOUNT_TYPES.CREDIT, id);
    }, [accountTransactions, id]);

    if (!card) {
        return (
            <div className="error-state">
                <p>Card not found</p>
                <button onClick={() => navigate('/accounts')}>Go Back</button>
            </div>
        );
    }

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${card.cardName}? This action cannot be undone.`)) {
            try {
                await deleteCreditCard(id);
                navigate('/accounts');
            } catch (error) {
                alert('Failed to delete card');
            }
        }
    };

    const usagePercent = Math.min((card.usedAmount / card.creditLimit) * 100, 100);
    const availableCredit = card.creditLimit - card.usedAmount;

    return (
        <div className="credit-card-detail">
            <button className="header-back-btn" onClick={() => navigate('/accounts')}>
                <ArrowLeft size={20} />
                Back to Accounts
            </button>

            <div className="account-header-card credit">
                <div className="account-header-top">
                    <div className="bank-info">
                        <h2>{card.cardName}</h2>
                        <div className="account-info">
                            {maskCardNumber(card.cardNumber)}
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
                    <div className="balance-label">Available Credit</div>
                    <div className="balance-amount">
                        {formatCurrency(availableCredit, settings.currency)}
                    </div>
                </div>

                <div className="usage-section">
                    <div className="usage-bar-container">
                        <div
                            className="usage-fill"
                            style={{ width: `${usagePercent}%` }}
                        ></div>
                    </div>
                    <div className="usage-stats">
                        <div className="stat-item">
                            <span className="usage-label">Used: </span>
                            <span className="usage-amount">{formatCurrency(card.usedAmount, settings.currency)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="usage-label">Limit: </span>
                            <span className="usage-amount">{formatCurrency(card.creditLimit, settings.currency)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="account-stats">
                <div className="stat-card">
                    <div className="stat-label">Total Spent</div>
                    <div className="stat-value expense">
                        -{formatCurrency(stats.expense, settings.currency)}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Payments Made</div>
                    <div className="stat-value income">
                        +{formatCurrency(stats.income, settings.currency)}
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
                        console.log('Clicked transaction', t);
                    }}
                />
            </div>

            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Credit Card"
            >
                <AddCreditCardForm
                    accountToEdit={card}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => setShowEditModal(false)}
                />
            </Modal>
        </div>
    );
};

export default CreditCardDetail;
