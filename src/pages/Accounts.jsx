import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_ICONS } from '../constants/accountTypes';
import * as accountService from '../services/accountService';
import * as cardService from '../services/cardService';
import AddBankAccountForm from '../components/AddBankAccountForm';
import AddCreditCardForm from '../components/AddCreditCardForm';
import TransferForm from '../components/TransferForm';
import Modal from '../components/ui/Modal';
import './Accounts.css';

const Accounts = () => {
    const navigate = useNavigate();
    const { bankAccounts, creditCards, transactions } = useApp();
    const [activeTab, setActiveTab] = useState(ACCOUNT_TYPES.CASH);
    const [showAddBankModal, setShowAddBankModal] = useState(false);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    // Calculate Cash Balance
    const calculateCashBalance = () => {
        return transactions
            .filter(t => !t.accountType || t.accountType === ACCOUNT_TYPES.CASH)
            .reduce((acc, t) => {
                return t.type === 'income' ? acc + t.amount : acc - t.amount;
            }, 0);
    };

    const cashBalance = calculateCashBalance();

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const renderCashTab = () => (
        <div className="account-list">
            <div className="account-card cash-card">
                <div className="account-info">
                    <div className="account-icon cash-icon">
                        {ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.CASH]}
                    </div>
                    <div className="account-details">
                        <div className="account-name">Cash on Hand</div>
                        <div className="account-sub">Default Account</div>
                    </div>
                </div>
                <div className="account-balance">
                    <div className="balance-label">Current Balance</div>
                    <div className="balance-amount">{formatCurrency(cashBalance)}</div>
                </div>
            </div>
            <div className="info-box">
                <p>Cash transactions are tracked here. This is your default account for daily expenses.</p>
            </div>
        </div>
    );

    const renderBankTab = () => {
        const activeAccounts = accountService.getActiveBankAccounts ? accountService.getActiveBankAccounts() :
            (bankAccounts.filter(a => a.isActive !== false));

        return (
            <div className="account-list">
                {activeAccounts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🏦</div>
                        <p>No bank accounts added</p>
                        <button className="add-btn-small" onClick={() => setShowAddBankModal(true)}>
                            Add Bank Account
                        </button>
                    </div>
                ) : (
                    <>
                        {activeAccounts.map(account => (
                            <div
                                key={account.id}
                                className="account-card"
                                onClick={() => navigate(`/accounts/bank/${account.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="account-info">
                                    <div className="account-icon bank-icon">
                                        {ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.BANK]}
                                    </div>
                                    <div className="account-details">
                                        <div className="account-name">{account.accountName}</div>
                                        <div className="account-sub">{account.bankName} • {account.accountType}</div>
                                    </div>
                                </div>
                                <div className="account-balance">
                                    <div className="balance-label">Balance</div>
                                    <div className="balance-amount">{formatCurrency(account.balance)}</div>
                                </div>
                            </div>
                        ))}
                        <button className="fab-add" onClick={() => setShowAddBankModal(true)}>
                            +
                        </button>
                    </>
                )}
            </div>
        );
    };

    const renderCardTab = () => {
        const activeCards = cardService.getActiveCreditCards ? cardService.getActiveCreditCards() :
            (creditCards.filter(c => c.isActive !== false));

        return (
            <div className="account-list">
                {activeCards.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">💳</div>
                        <p>No credit cards added</p>
                        <button className="add-btn-small" onClick={() => setShowAddCardModal(true)}>
                            Add Credit Card
                        </button>
                    </div>
                ) : (
                    <>
                        {activeCards.map(card => {
                            const remainingCredit = card.creditLimit - card.usedAmount;
                            const usagePercent = (card.usedAmount / card.creditLimit) * 100;

                            return (
                                <div
                                    key={card.id}
                                    className="account-card card-card"
                                    onClick={() => navigate(`/accounts/credit/${card.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-header">
                                        <div className="account-info">
                                            <div className="account-icon card-icon">
                                                {ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.CREDIT]}
                                            </div>
                                            <div className="account-details">
                                                <div className="account-name">{card.cardName}</div>
                                                <div className="account-sub">{card.cardNumberMasked}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-usage-section">
                                        <div className="usage-bar-container">
                                            <div
                                                className="usage-fill"
                                                style={{
                                                    width: `${usagePercent}%`,
                                                    backgroundColor: usagePercent > 80 ? '#ef4444' : usagePercent > 50 ? '#f97316' : '#10b981'
                                                }}
                                            ></div>
                                        </div>
                                        <div className="usage-stats">
                                            <div className="stat-item">
                                                <span className="stat-label">Used</span>
                                                <span className="stat-value">{formatCurrency(card.usedAmount)}</span>
                                            </div>
                                            <div className="stat-item right">
                                                <span className="stat-label">Limit</span>
                                                <span className="stat-value">{formatCurrency(card.creditLimit)}</span>
                                            </div>
                                        </div>
                                        <div className="available-credit">
                                            Available: {formatCurrency(remainingCredit)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <button className="fab-add" onClick={() => setShowAddCardModal(true)}>
                            +
                        </button>
                    </>
                )}
            </div>
        );
    };

    // Helper to switch imports if I messed up the service imports above
    // I noticed I imported getActiveBankAccounts from accountService but used accountService.getActive...
    // Let me fix the imports and usage in the actual code I write.

    // Correction for the render functions to use the context data or service helpers correctly

    return (
        <div className="accounts-page">
            <header className="page-header">
                <h1>Accounts</h1>
            </header>

            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === ACCOUNT_TYPES.CASH ? 'active' : ''}`}
                    onClick={() => setActiveTab(ACCOUNT_TYPES.CASH)}
                >
                    Cash
                </button>
                <button
                    className={`tab-btn ${activeTab === ACCOUNT_TYPES.BANK ? 'active' : ''}`}
                    onClick={() => setActiveTab(ACCOUNT_TYPES.BANK)}
                >
                    Banks
                </button>
                <button
                    className={`tab-btn ${activeTab === ACCOUNT_TYPES.CREDIT ? 'active' : ''}`}
                    onClick={() => setActiveTab(ACCOUNT_TYPES.CREDIT)}
                >
                    Cards
                </button>
            </div>

            <div className="tab-content">
                {activeTab === ACCOUNT_TYPES.CASH && renderCashTab()}
                {activeTab === ACCOUNT_TYPES.BANK && renderBankTab()}
                {activeTab === ACCOUNT_TYPES.CREDIT && renderCardTab()}
            </div>

            {/* Floating Transfer Button */}
            <button className="fab-transfer" onClick={() => setShowTransferModal(true)} title="Transfer Funds">
                <ArrowLeftRight size={24} />
            </button>

            {/* Modals */}
            <Modal
                isOpen={showAddBankModal}
                onClose={() => setShowAddBankModal(false)}
                title="Add Bank Account"
            >
                <AddBankAccountForm
                    onClose={() => setShowAddBankModal(false)}
                />
            </Modal>

            <Modal
                isOpen={showAddCardModal}
                onClose={() => setShowAddCardModal(false)}
                title="Add Credit Card"
            >
                <AddCreditCardForm
                    onClose={() => setShowAddCardModal(false)}
                />
            </Modal>

            <Modal
                isOpen={showTransferModal}
                onClose={() => setShowTransferModal(false)}
                title="Transfer Funds"
            >
                <TransferForm
                    onClose={() => setShowTransferModal(false)}
                />
            </Modal>
        </div>
    );
};



export default Accounts;
