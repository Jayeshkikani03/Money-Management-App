import React, { useState } from 'react';
import { RECURRING_FREQUENCIES, RECURRING_FREQUENCY_LABELS } from '../constants/accountTypes';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import './RecurringSetupModal.css';

/**
 * RecurringSetupModal Component
 * Modal for setting up recurring transactions
 */
const RecurringSetupModal = ({ isOpen, onClose, transactionData, onSave }) => {
    const [recurringData, setRecurringData] = useState({
        frequency: RECURRING_FREQUENCIES.MONTHLY,
        interval: 1,
        nextExecutionDate: new Date().toISOString().split('T')[0],
        endDate: '',
        description: transactionData?.notes || ''
    });

    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecurringData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!recurringData.nextExecutionDate) {
            newErrors.nextExecutionDate = 'Start date is required';
        }
        if (recurringData.endDate && new Date(recurringData.endDate) <= new Date(recurringData.nextExecutionDate)) {
            newErrors.endDate = 'End date must be after start date';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave({
            ...transactionData,
            ...recurringData,
            isRecurring: true
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content recurring-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🔄 Set Up Recurring Transaction</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="recurring-form">
                    <div className="form-section">
                        <label className="input-label">Description</label>
                        <input
                            type="text"
                            name="description"
                            className="input"
                            value={recurringData.description}
                            onChange={handleChange}
                            placeholder="e.g., Monthly rent, Netflix subscription..."
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-section">
                            <label className="input-label">Frequency</label>
                            <select
                                name="frequency"
                                className="input select"
                                value={recurringData.frequency}
                                onChange={handleChange}
                            >
                                {Object.entries(RECURRING_FREQUENCY_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {[RECURRING_FREQUENCIES.DAILY, RECURRING_FREQUENCIES.WEEKLY, RECURRING_FREQUENCIES.MONTHLY, RECURRING_FREQUENCIES.YEARLY].includes(recurringData.frequency) && (
                            <div className="form-section">
                                <label className="input-label">Every</label>
                                <input
                                    type="number"
                                    name="interval"
                                    className="input"
                                    value={recurringData.interval}
                                    onChange={handleChange}
                                    min="1"
                                    max="365"
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-row">
                        <Input
                            label="Start Date"
                            type="date"
                            name="nextExecutionDate"
                            value={recurringData.nextExecutionDate}
                            onChange={handleChange}
                            error={errors.nextExecutionDate}
                            required
                        />

                        <Input
                            label="End Date (Optional)"
                            type="date"
                            name="endDate"
                            value={recurringData.endDate}
                            onChange={handleChange}
                            error={errors.endDate}
                        />
                    </div>

                    <div className="recurring-preview">
                        <p className="preview-label">Preview:</p>
                        <p className="preview-text">
                            {recurringData.description || 'Transaction'} will occur{' '}
                            <strong>{RECURRING_FREQUENCY_LABELS[recurringData.frequency].toLowerCase()}</strong>
                            {recurringData.interval > 1 && ` (every ${recurringData.interval})`}
                            {recurringData.endDate ? ` until ${new Date(recurringData.endDate).toLocaleDateString()}` : ' indefinitely'}
                        </p>
                    </div>

                    <div className="modal-actions">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="success">
                            Set Up Recurring
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecurringSetupModal;
