import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from './ui/Modal';
import AddCreditCardForm from './AddCreditCardForm';
import { getActiveCreditCards } from '../services/cardService';
import './CreditCardListModal.css';

const CreditCardListModal = ({ isOpen, onClose, onSelectCard }) => {
    const { creditCards } = useApp();
    const [showAddForm, setShowAddForm] = useState(false);

    const activeCreditCards = getActiveCreditCards();

    const handleSelectCard = (card) => {
        if (onSelectCard) {
            onSelectCard(card);
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
                title="Add Credit Card"
            >
                <AddCreditCardForm
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
            title="Select Credit Card"
        >
            <div className="credit-card-list">
                {activeCreditCards.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">💳</div>
                        <p>No credit cards yet</p>
                        <p className="empty-subtitle">Add your first credit card to get started</p>
                    </div>
                ) : (
                    <div className="card-cards">
                        {activeCreditCards.map(card => {
                            const remainingCredit = card.creditLimit - card.usedAmount;
                            const usagePercent = (card.usedAmount / card.creditLimit) * 100;

                            return (
                                <div
                                    key={card.id}
                                    className="card-card"
                                    onClick={() => handleSelectCard(card)}
                                >
                                    <div className="card-info">
                                        <div className="card-icon">💳</div>
                                        <div className="card-details">
                                            <div className="card-name">{card.cardName}</div>
                                            <div className="card-number">{card.cardNumberMasked}</div>
                                            <div className="billing-info">
                                                Billing: {card.billingDate} | Due: {card.dueDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-usage">
                                        <div className="usage-bar">
                                            <div
                                                className="usage-fill"
                                                style={{
                                                    width: `${usagePercent}%`,
                                                    background: usagePercent > 80 ? '#ef4444' : usagePercent > 50 ? '#f97316' : '#10b981'
                                                }}
                                            />
                                        </div>
                                        <div className="usage-text">
                                            <span className="used">{formatCurrency(card.usedAmount)}</span>
                                            <span className="separator">/</span>
                                            <span className="limit">{formatCurrency(card.creditLimit)}</span>
                                        </div>
                                        <div className="remaining">
                                            Available: {formatCurrency(remainingCredit)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <button
                    className="add-card-btn"
                    onClick={() => setShowAddForm(true)}
                >
                    <span className="add-icon">+</span>
                    Add Credit Card
                </button>
            </div>
        </Modal>
    );
};

export default CreditCardListModal;
