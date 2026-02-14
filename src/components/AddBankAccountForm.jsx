import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BANK_ACCOUNT_TYPES } from '../constants/accountTypes';
import './AddBankAccountForm.css';

const AddBankAccountForm = ({ onClose, onSuccess, accountToEdit = null }) => {
    const { addBankAccount, updateBankAccount } = useApp();
    const [formData, setFormData] = useState({
        bankName: accountToEdit?.bankName || '',
        accountName: accountToEdit?.accountName || '',
        accountNumber: accountToEdit?.accountNumber || '',
        initialBalance: accountToEdit?.initialBalance || '',
        accountType: accountToEdit?.accountType || 'savings',
        ifsc: accountToEdit?.ifsc || ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const isEditMode = !!accountToEdit;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.bankName.trim()) {
            newErrors.bankName = 'Bank name is required';
        }

        if (!formData.accountName.trim()) {
            newErrors.accountName = 'Account name is required';
        }

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = 'Account number is required';
        } else if (!/^\d+$/.test(formData.accountNumber)) {
            newErrors.accountNumber = 'Account number must contain only digits';
        } else if (formData.accountNumber.length !== 4) {
            newErrors.accountNumber = 'Please enter only the last 4 digits';
        }

        if (!isEditMode) {
            if (!formData.initialBalance) {
                newErrors.initialBalance = 'Initial balance is required';
            } else if (parseFloat(formData.initialBalance) < 0) {
                newErrors.initialBalance = 'Balance cannot be negative';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                await updateBankAccount(accountToEdit.id, {
                    bankName: formData.bankName,
                    accountName: formData.accountName,
                    accountNumber: formData.accountNumber,
                    accountType: formData.accountType,
                    ifsc: formData.ifsc
                });
            } else {
                await addBankAccount(formData);
            }
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            setErrors({ submit: error.message || `Failed to ${isEditMode ? 'update' : 'add'} bank account` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="add-bank-account-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="bankName">Bank Name *</label>
                <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g., HDFC Bank"
                    className={errors.bankName ? 'error' : ''}
                />
                {errors.bankName && <span className="error-message">{errors.bankName}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="accountName">Account Name *</label>
                <input
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="e.g., My Savings Account"
                    className={errors.accountName ? 'error' : ''}
                />
                {errors.accountName && <span className="error-message">{errors.accountName}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="accountNumber">Account Number *</label>
                <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter last 4 digits"
                    className={errors.accountNumber ? 'error' : ''}
                />
                {errors.accountNumber && <span className="error-message">{errors.accountNumber}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="accountType">Account Type *</label>
                <select
                    id="accountType"
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                >
                    <option value={BANK_ACCOUNT_TYPES.SAVINGS}>Savings</option>
                    <option value={BANK_ACCOUNT_TYPES.CURRENT}>Current</option>
                </select>
            </div>

            {!isEditMode && (
                <div className="form-group">
                    <label htmlFor="initialBalance">Initial Balance *</label>
                    <input
                        type="number"
                        id="initialBalance"
                        name="initialBalance"
                        value={formData.initialBalance}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        className={errors.initialBalance ? 'error' : ''}
                    />
                    {errors.initialBalance && <span className="error-message">{errors.initialBalance}</span>}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="ifsc">IFSC Code (Optional)</label>
                <input
                    type="text"
                    id="ifsc"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleChange}
                    placeholder="e.g., HDFC0001234"
                />
            </div>

            {errors.submit && (
                <div className="error-message submit-error">{errors.submit}</div>
            )}

            <div className="form-actions">
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : (isEditMode ? 'Update Account' : 'Add Bank Account')}
                </button>
            </div>
        </form>
    );
};

export default AddBankAccountForm;
