import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import CalculatorInput from './CalculatorInput';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { validateTransaction } from '../utils/helpers';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_ICONS } from '../constants/accountTypes';
import BankAccountListModal from './BankAccountListModal';
import CreditCardListModal from './CreditCardListModal';
import { getAccountDetails } from '../services/accountTransactionService';
import { validateBankTransaction } from '../services/accountService';
import { validateCardTransaction } from '../services/cardService';
import './TransactionForm.css';

const TransactionForm = ({ transaction, onClose, onSuccess }) => {
    const { addTransaction, updateTransaction, categories } = useApp();
    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        accountType: ACCOUNT_TYPES.CASH,
        accountId: null
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [selectedAccountDetails, setSelectedAccountDetails] = useState(null);

    useEffect(() => {
        if (transaction) {
            setFormData({
                ...transaction,
                date: transaction.date.split('T')[0],
                accountType: transaction.accountType || ACCOUNT_TYPES.CASH,
                accountId: transaction.accountId || null
            });
        }
    }, [transaction]);

    // Update selected account details when formData changes
    useEffect(() => {
        const details = getAccountDetails(formData.accountType, formData.accountId);
        setSelectedAccountDetails(details);
    }, [formData.accountType, formData.accountId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAmountChange = (value) => {
        setFormData(prev => ({ ...prev, amount: value }));
        if (errors.amount) {
            setErrors(prev => ({ ...prev, amount: '' }));
        }
    };

    const handleAccountTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            accountType: type,
            accountId: null // Reset account ID when type changes
        }));

        if (type === ACCOUNT_TYPES.BANK) {
            setShowBankModal(true);
        } else if (type === ACCOUNT_TYPES.CREDIT) {
            setShowCardModal(true);
        }
    };

    const handleAccountSelect = (account) => {
        setFormData(prev => ({
            ...prev,
            accountId: account.id
        }));
        if (errors.account) {
            setErrors(prev => ({ ...prev, account: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        const validation = validateTransaction({
            ...formData,
            amount: parseFloat(formData.amount)
        });

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Account-specific validation
        if (formData.accountType === ACCOUNT_TYPES.BANK) {
            if (!formData.accountId) {
                setErrors(prev => ({ ...prev, account: 'Please select a bank account' }));
                return;
            }
            if (formData.type === 'expense') {
                const bankValidation = validateBankTransaction(formData.accountId, parseFloat(formData.amount));
                if (!bankValidation.valid) {
                    setErrors(prev => ({ ...prev, account: bankValidation.error }));
                    return;
                }
            }
        } else if (formData.accountType === ACCOUNT_TYPES.CREDIT) {
            if (!formData.accountId) {
                setErrors(prev => ({ ...prev, account: 'Please select a credit card' }));
                return;
            }
            if (formData.type === 'expense') {
                const cardValidation = validateCardTransaction(formData.accountId, parseFloat(formData.amount));
                if (!cardValidation.valid) {
                    setErrors(prev => ({ ...prev, account: cardValidation.error }));
                    return;
                }
            }
        }

        setLoading(true);
        try {
            const transactionData = {
                ...formData,
                amount: parseFloat(formData.amount),
                date: new Date(formData.date).toISOString()
            };

            if (transaction) {
                await updateTransaction({ ...transactionData, id: transaction.id });
            } else {
                await addTransaction(transactionData);
            }

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Failed to save transaction:', error);
            setErrors({ submit: 'Failed to save transaction' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-section">
                <CalculatorInput
                    value={formData.amount}
                    onChange={handleAmountChange}
                    currency="INR"
                    allowNegative={false}
                    placeholder="0.00"
                    error={errors.amount}
                    required
                />
            </div>

            <div className="form-section">
                <div className="type-selector">
                    <label className="type-label">Type</label>
                    <div className="type-buttons">
                        <button
                            type="button"
                            className={`type-button ${formData.type === 'expense' ? 'active expense' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`type-button ${formData.type === 'income' ? 'active income' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                        >
                            Income
                        </button>
                    </div>
                </div>
            </div>

            <div className="form-section account-section">
                <label className="section-label">Account</label>
                <div className="account-type-tabs">
                    <button
                        type="button"
                        className={`account-tab ${formData.accountType === ACCOUNT_TYPES.CASH ? 'active' : ''}`}
                        onClick={() => handleAccountTypeChange(ACCOUNT_TYPES.CASH)}
                    >
                        <span className="account-icon">{ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.CASH]}</span>
                        Cash
                    </button>
                    <button
                        type="button"
                        className={`account-tab ${formData.accountType === ACCOUNT_TYPES.BANK ? 'active' : ''}`}
                        onClick={() => handleAccountTypeChange(ACCOUNT_TYPES.BANK)}
                    >
                        <span className="account-icon">{ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.BANK]}</span>
                        Bank
                    </button>
                    <button
                        type="button"
                        className={`account-tab ${formData.accountType === ACCOUNT_TYPES.CREDIT ? 'active' : ''}`}
                        onClick={() => handleAccountTypeChange(ACCOUNT_TYPES.CREDIT)}
                    >
                        <span className="account-icon">{ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.CREDIT]}</span>
                        Card
                    </button>
                </div>

                {formData.accountType !== ACCOUNT_TYPES.CASH && (
                    <div
                        className={`selected-account-card ${errors.account ? 'error' : ''}`}
                        onClick={() => formData.accountType === ACCOUNT_TYPES.BANK ? setShowBankModal(true) : setShowCardModal(true)}
                    >
                        {selectedAccountDetails ? (
                            <>
                                <div className="account-info">
                                    <div className="account-icon-small">{selectedAccountDetails.icon}</div>
                                    <div className="account-text">
                                        <div className="account-name">{selectedAccountDetails.name}</div>
                                        {selectedAccountDetails.bankName && <div className="account-sub">{selectedAccountDetails.bankName}</div>}
                                        {selectedAccountDetails.cardNumber && <div className="account-sub">{selectedAccountDetails.cardNumber}</div>}
                                    </div>
                                </div>
                                <div className="change-account">Change</div>
                            </>
                        ) : (
                            <div className="select-placeholder">
                                <span>Select {formData.accountType === ACCOUNT_TYPES.BANK ? 'Bank Account' : 'Credit Card'}</span>
                                <span className="chevron">›</span>
                            </div>
                        )}
                    </div>
                )}
                {errors.account && <div className="error-message">{errors.account}</div>}
            </div>

            <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={[
                    { value: '', label: 'Select category' },
                    ...(categories
                        .filter(c => c.type === formData.type || c.type === 'both')
                        .map(c => ({ value: c.name, label: c.name })))
                ]}
                error={errors.category}
                required
            />

            <Input
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                required
            />

            <div className="input-group">
                <label className="input-label">Notes (Optional)</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add notes..."
                    rows="3"
                    className="input"
                />
            </div>

            {errors.submit && (
                <div className="error-message submit-error">{errors.submit}</div>
            )}

            <div className="form-actions">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="success" disabled={loading}>
                    {loading ? 'Saving...' : (transaction ? 'Update' : 'Add')} Transaction
                </Button>
            </div>

            {/* Account Selection Modals */}
            <BankAccountListModal
                isOpen={showBankModal}
                onClose={() => setShowBankModal(false)}
                onSelectAccount={handleAccountSelect}
            />

            <CreditCardListModal
                isOpen={showCardModal}
                onClose={() => setShowCardModal(false)}
                onSelectCard={handleAccountSelect}
            />
        </form>
    );
};

export default TransactionForm;
