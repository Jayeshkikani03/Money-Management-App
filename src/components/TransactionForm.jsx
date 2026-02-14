import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { validateTransaction } from '../utils/helpers';
import './TransactionForm.css';

const TransactionForm = ({ transaction, onClose, onSuccess }) => {
    const { addTransaction, updateTransaction, categories } = useApp();
    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (transaction) {
            setFormData({
                ...transaction,
                date: transaction.date.split('T')[0]
            });
        }
    }, [transaction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateTransaction({
            ...formData,
            amount: parseFloat(formData.amount)
        });

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
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

    const filteredCategories = categories.filter(c =>
        c.type === formData.type || c.type === 'both'
    );

    const categoryOptions = filteredCategories.map(c => ({
        value: c.name,
        label: c.name
    }));

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <Input
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                error={errors.amount}
                required
            />

            <div className="form-row">
                <div className="type-selector">
                    <label className="type-label">Type</label>
                    <div className="type-buttons">
                        <button
                            type="button"
                            className={`type-button ${formData.type === 'income' ? 'active income' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            className={`type-button ${formData.type === 'expense' ? 'active expense' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                        >
                            Expense
                        </button>
                    </div>
                </div>
            </div>

            <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={[
                    { value: '', label: 'Select category' },
                    ...categoryOptions
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
                <div className="error-message">{errors.submit}</div>
            )}

            <div className="form-actions">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="success" disabled={loading}>
                    {loading ? 'Saving...' : (transaction ? 'Update' : 'Add')} Transaction
                </Button>
            </div>
        </form>
    );
};

export default TransactionForm;
