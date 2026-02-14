import React, { useState } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import recurringManagement from '../services/recurringManagement';
import { RECURRING_FREQUENCIES, RECURRING_FREQUENCY_LABELS } from '../constants/accountTypes';
import './RecurringEditModal.css';

const RecurringEditModal = ({ recurring, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        description: recurring.description || '',
        amount: recurring.amount || '',
        frequency: recurring.frequency || 'monthly',
        interval: recurring.interval || 1,
        nextExecutionDate: recurring.nextExecutionDate || '',
        endDate: recurring.endDate || '',
        isPaused: recurring.isPaused || false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!formData.nextExecutionDate) {
            newErrors.nextExecutionDate = 'Next execution date is required';
        }

        // Check if next execution date is in the past
        const nextDate = new Date(formData.nextExecutionDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (nextDate < today) {
            newErrors.nextExecutionDate = 'Next execution date cannot be in the past';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            recurringManagement.updateRecurring(recurring.id, {
                description: formData.description,
                amount: parseFloat(formData.amount),
                frequency: formData.frequency,
                interval: parseInt(formData.interval),
                nextExecutionDate: formData.nextExecutionDate,
                endDate: formData.endDate || null,
                isPaused: formData.isPaused,
            });

            onSave();
        } catch (error) {
            console.error('Failed to update recurring:', error);
            setErrors({ submit: error.message });
        }
    };

    const frequencyOptions = Object.keys(RECURRING_FREQUENCIES).map(key => ({
        value: RECURRING_FREQUENCIES[key],
        label: RECURRING_FREQUENCY_LABELS[RECURRING_FREQUENCIES[key]]
    }));

    return (
        <Modal isOpen={true} onClose={onClose} title="Edit Recurring Transaction">
            <form onSubmit={handleSubmit} className="recurring-edit-form">
                <Input
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    error={errors.description}
                    required
                />

                <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    error={errors.amount}
                    required
                />

                <Select
                    label="Frequency"
                    value={formData.frequency}
                    onChange={(e) => handleChange('frequency', e.target.value)}
                    options={frequencyOptions}
                />

                <Input
                    label="Interval"
                    type="number"
                    min="1"
                    value={formData.interval}
                    onChange={(e) => handleChange('interval', e.target.value)}
                    helperText="Execute every X periods (e.g., every 2 months)"
                />

                <Input
                    label="Next Execution Date"
                    type="date"
                    value={formData.nextExecutionDate}
                    onChange={(e) => handleChange('nextExecutionDate', e.target.value)}
                    error={errors.nextExecutionDate}
                    required
                />

                <Input
                    label="End Date (Optional)"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    helperText="Leave empty for no end date"
                />

                <div className="checkbox-field">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={formData.isPaused}
                            onChange={(e) => handleChange('isPaused', e.target.checked)}
                        />
                        <span>Pause this recurring transaction</span>
                    </label>
                </div>

                {errors.submit && (
                    <div className="error-message">{errors.submit}</div>
                )}

                <div className="modal-actions">
                    <Button variant="ghost" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default RecurringEditModal;
