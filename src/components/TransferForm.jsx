import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_ICONS } from '../constants/accountTypes';
import { getAccountDetails } from '../services/accountTransactionService';
import CalculatorInput from './CalculatorInput';
import Input from './ui/Input';
import Button from './ui/Button';
import BankAccountListModal from './BankAccountListModal';
import CreditCardListModal from './CreditCardListModal';
import { validateBankTransaction } from '../services/accountService';
import './TransferForm.css';

const TransferForm = ({ onClose, onSuccess }) => {
    const { addTransfer } = useApp();
    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        fromType: ACCOUNT_TYPES.CASH,
        fromId: null,
        toType: ACCOUNT_TYPES.BANK,
        toId: null
    });

    // UI state for account selection
    const [showFromBankModal, setShowFromBankModal] = useState(false);
    const [showToBankModal, setShowToBankModal] = useState(false);
    const [showToCardModal, setShowToCardModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Get display details for selected accounts
    const fromAccountDetails = getAccountDetails(formData.fromType, formData.fromId);
    const toAccountDetails = getAccountDetails(formData.toType, formData.toId);

    const handleAmountChange = (value) => {
        setFormData(prev => ({ ...prev, amount: value }));
        if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFromTypeChange = (type) => {
        if (type === formData.toType && formData.toType !== ACCOUNT_TYPES.BANK) {
            // Prevent same type if logical issues (though bank->bank is fine)
            // For now allow, validation will check specific IDs
        }

        setFormData(prev => ({
            ...prev,
            fromType: type,
            fromId: null
        }));

        if (type === ACCOUNT_TYPES.BANK) {
            setShowFromBankModal(true);
        }
    };

    const handleToTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            toType: type,
            toId: null
        }));

        if (type === ACCOUNT_TYPES.BANK) {
            setShowToBankModal(true);
        } else if (type === ACCOUNT_TYPES.CREDIT) {
            setShowToCardModal(true);
        }
    };

    const handleFromAccountSelect = (account) => {
        setFormData(prev => ({ ...prev, fromId: account.id }));
        if (errors.from) setErrors(prev => ({ ...prev, from: '' }));
    };

    const handleToAccountSelect = (account) => {
        setFormData(prev => ({ ...prev, toId: account.id }));
        if (errors.to) setErrors(prev => ({ ...prev, to: '' }));
    };

    const swapAccounts = () => {
        // Only swap if valid (e.g. can't swap to Credit Card as source)
        if (formData.toType === ACCOUNT_TYPES.CREDIT) {
            return; // Credit card can't be source
        }

        setFormData(prev => ({
            ...prev,
            fromType: prev.toType,
            fromId: prev.toId,
            toType: prev.fromType,
            toId: prev.fromId
        }));
    };

    const validate = () => {
        const newErrors = {};
        const amount = parseFloat(formData.amount);

        if (!amount || amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        // Validate Source
        if (formData.fromType === ACCOUNT_TYPES.BANK && !formData.fromId) {
            newErrors.from = 'Select source bank account';
        }

        // Validate Destination
        if (formData.toType === ACCOUNT_TYPES.BANK && !formData.toId) {
            newErrors.to = 'Select destination bank account';
        } else if (formData.toType === ACCOUNT_TYPES.CREDIT && !formData.toId) {
            newErrors.to = 'Select destination credit card';
        }

        // Validate Source != Destination
        if (
            formData.fromType === formData.toType &&
            formData.fromId === formData.toId &&
            formData.fromType !== ACCOUNT_TYPES.CASH // Cash to Cash doesn't make sense but technically same ID (null)
        ) {
            newErrors.to = 'Source and destination cannot be the same';
        }

        if (formData.fromType === ACCOUNT_TYPES.CASH && formData.toType === ACCOUNT_TYPES.CASH) {
            newErrors.to = 'Cannot transfer from Cash to Cash';
        }

        // Validate Balance (if Bank is source)
        if (formData.fromType === ACCOUNT_TYPES.BANK && formData.fromId && amount > 0) {
            const validation = validateBankTransaction(formData.fromId, amount);
            if (!validation.valid) {
                newErrors.amount = validation.error;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await addTransfer(formData);
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            console.error('Transfer failed:', error);
            setErrors({ submit: error.message || 'Transfer failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="transfer-form" onSubmit={handleSubmit}>
            <div className="account-selector">
                <label className="section-label">From</label>
                <div className="account-type-tabs">
                    <button
                        type="button"
                        className={`account-tab ${formData.fromType === ACCOUNT_TYPES.CASH ? 'active' : ''}`}
                        onClick={() => handleFromTypeChange(ACCOUNT_TYPES.CASH)}
                    >
                        <span className="account-icon">{ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.CASH]}</span>
                        Cash
                    </button>
                    <button
                        type="button"
                        className={`account-tab ${formData.fromType === ACCOUNT_TYPES.BANK ? 'active' : ''}`}
                        onClick={() => handleFromTypeChange(ACCOUNT_TYPES.BANK)}
                    >
                        <span className="account-icon">{ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.BANK]}</span>
                        Bank
                    </button>
                </div>

                {formData.fromType !== ACCOUNT_TYPES.CASH && (
                    <div
                        className={`selected-account ${errors.from ? 'error' : ''}`}
                        onClick={() => setShowFromBankModal(true)}
                    >
                        {fromAccountDetails ? (
                            <>
                                <div className="account-icon-small">{fromAccountDetails.icon}</div>
                                <div className="account-details-mini">
                                    <div className="account-name-mini">{fromAccountDetails.name}</div>
                                    <div className="account-balance-mini">Balance: ₹{fromAccountDetails.balance?.toFixed(2)}</div>
                                </div>
                                <div className="change-account">Change</div>
                            </>
                        ) : (
                            <div className="placeholder-text">Select Bank Account</div>
                        )}
                    </div>
                )}
                {errors.from && <div className="error-message">{errors.from}</div>}
            </div>

            <div className="transfer-arrow">
                <div className="transfer-icon" onClick={swapAccounts} style={{ cursor: 'pointer' }}>
                    ↓
                </div>
            </div>

            <div className="account-selector">
                <label className="section-label">To</label>
                <div className="account-type-tabs">
                    <button
                        type="button"
                        className={`account-tab ${formData.toType === ACCOUNT_TYPES.CASH ? 'active' : ''}`}
                        onClick={() => handleToTypeChange(ACCOUNT_TYPES.CASH)}
                    >
                        <span className="account-icon">{ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.CASH]}</span>
                        Cash
                    </button>
                    <button
                        type="button"
                        className={`account-tab ${formData.toType === ACCOUNT_TYPES.BANK ? 'active' : ''}`}
                        onClick={() => handleToTypeChange(ACCOUNT_TYPES.BANK)}
                    >
                        <span className="account-icon">{ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.BANK]}</span>
                        Bank
                    </button>
                    <button
                        type="button"
                        className={`account-tab ${formData.toType === ACCOUNT_TYPES.CREDIT ? 'active' : ''}`}
                        onClick={() => handleToTypeChange(ACCOUNT_TYPES.CREDIT)}
                    >
                        <span className="account-icon">{ACCOUNT_TYPE_ICONS[ACCOUNT_TYPES.CREDIT]}</span>
                        Card
                    </button>
                </div>

                {formData.toType !== ACCOUNT_TYPES.CASH && (
                    <div
                        className={`selected-account ${errors.to ? 'error' : ''}`}
                        onClick={() => formData.toType === ACCOUNT_TYPES.BANK ? setShowToBankModal(true) : setShowToCardModal(true)}
                    >
                        {toAccountDetails ? (
                            <>
                                <div className="account-icon-small">{toAccountDetails.icon}</div>
                                <div className="account-details-mini">
                                    <div className="account-name-mini">{toAccountDetails.name}</div>
                                    <div className="account-balance-mini">
                                        {formData.toType === ACCOUNT_TYPES.CREDIT
                                            ? `Used: ₹${toAccountDetails.usedAmount?.toFixed(2)}`
                                            : `Balance: ₹${toAccountDetails.balance?.toFixed(2)}`
                                        }
                                    </div>
                                </div>
                                <div className="change-account">Change</div>
                            </>
                        ) : (
                            <div className="placeholder-text">
                                Select {formData.toType === ACCOUNT_TYPES.BANK ? 'Bank Account' : 'Credit Card'}
                            </div>
                        )}
                    </div>
                )}
                {errors.to && <div className="error-message">{errors.to}</div>}
            </div>

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
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Processing...' : 'Transfer Money'}
                </Button>
            </div>

            {/* Modals */}
            <BankAccountListModal
                isOpen={showFromBankModal}
                onClose={() => setShowFromBankModal(false)}
                onSelectAccount={handleFromAccountSelect}
            />

            <BankAccountListModal
                isOpen={showToBankModal}
                onClose={() => setShowToBankModal(false)}
                onSelectAccount={handleToAccountSelect}
            />

            <CreditCardListModal
                isOpen={showToCardModal}
                onClose={() => setShowToCardModal(false)}
                onSelectCard={handleToAccountSelect}
            />
        </form>
    );
};

export default TransferForm;
