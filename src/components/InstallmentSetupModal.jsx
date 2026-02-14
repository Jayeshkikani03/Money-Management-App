import React, { useState } from 'react';
import { INSTALLMENT_TYPES, INSTALLMENT_TYPE_LABELS } from '../constants/accountTypes';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import './InstallmentSetupModal.css';

/**
 * InstallmentSetupModal Component
 * Modal for setting up installment-based transactions (SIP, EMI, etc.)
 */
const InstallmentSetupModal = ({ isOpen, onClose, transactionData, onSave }) => {
    const [installmentData, setInstallmentData] = useState({
        linkedType: INSTALLMENT_TYPES.SIP,
        totalInstallments: 12,
        nextExecutionDate: new Date().toISOString().split('T')[0],
        description: transactionData?.notes || ''
    });

    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInstallmentData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!installmentData.totalInstallments || installmentData.totalInstallments < 1) {
            newErrors.totalInstallments = 'Total installments must be at least 1';
        }
        if (!installmentData.nextExecutionDate) {
            newErrors.nextExecutionDate = 'Start date is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave({
            ...transactionData,
            ...installmentData,
            isInstallment: true
        });
        onClose();
    };

    const totalAmount = transactionData?.amount ? parseFloat(transactionData.amount) * parseInt(installmentData.totalInstallments) : 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content installment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📊 Set Up Installment Plan</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="installment-form">
                    <div className="form-section">
                        <label className="input-label">Description</label>
                        <input
                            type="text"
                            name="description"
                            className="input"
                            value={installmentData.description}
                            onChange={handleChange}
                            placeholder="e.g., Mutual Fund SIP, Car EMI..."
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label className="input-label">Installment Type</label>
                        <select
                            name="linkedType"
                            className="input select"
                            value={installmentData.linkedType}
                            onChange={handleChange}
                        >
                            {Object.entries(INSTALLMENT_TYPE_LABELS).map(([key, label]) => (
                                <option key={key} value={INSTALLMENT_TYPES[key]}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <Input
                            label="Total Installments"
                            type="number"
                            name="totalInstallments"
                            value={installmentData.totalInstallments}
                            onChange={handleChange}
                            error={errors.totalInstallments}
                            min="1"
                            max="600"
                            required
                        />

                        <Input
                            label="Start Date"
                            type="date"
                            name="nextExecutionDate"
                            value={installmentData.nextExecutionDate}
                            onChange={handleChange}
                            error={errors.nextExecutionDate}
                            required
                        />
                    </div>

                    <div className="installment-summary">
                        <div className="summary-row">
                            <span className="summary-label">Amount per installment:</span>
                            <span className="summary-value">₹{transactionData?.amount || 0}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Total installments:</span>
                            <span className="summary-value">{installmentData.totalInstallments}</span>
                        </div>
                        <div className="summary-row total">
                            <span className="summary-label">Total amount:</span>
                            <span className="summary-value">₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="installment-preview">
                        <p className="preview-label">Preview:</p>
                        <p className="preview-text">
                            {installmentData.description || 'Installment'} of{' '}
                            <strong>₹{transactionData?.amount || 0}</strong> will be executed{' '}
                            <strong>monthly</strong> for{' '}
                            <strong>{installmentData.totalInstallments} months</strong>
                        </p>
                    </div>

                    <div className="modal-actions">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="success">
                            Set Up Installment
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InstallmentSetupModal;
