import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import CalculatorInput from '../CalculatorInput'; // Correct: in components/
import { useApp } from '../../context/AppContext'; // Correct: in src/context
import { NOTE_TRANSACTION_TYPES } from '../../models/noteTransactionModel'; // Correct: in src/models
import './Notes.css';

const NoteTransactionForm = ({ isOpen, onClose, onSave, initialType = 'GIVE' }) => {
    const { settings } = useApp();
    const [type, setType] = useState(initialType);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [createMainTx, setCreateMainTx] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setType(initialType);
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setDescription('');
            setCreateMainTx(true);
        }
    }, [isOpen, initialType]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        onSave({
            type,
            amount: parseFloat(amount),
            date,
            description,
            createMainTx // Pass this flag if you want to handle main app syncing
        });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">New Transaction</h2>
                    <button onClick={onClose} className="close-modal-btn">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Toggle */}
                    <div className="toggle-group">
                        <button
                            type="button"
                            className={`toggle-btn give ${type === NOTE_TRANSACTION_TYPES.GIVE ? 'active' : ''}`}
                            onClick={() => setType(NOTE_TRANSACTION_TYPES.GIVE)}
                        >
                            I Gave / Paid
                            <span className="toggle-subtext">You'll get back</span>
                        </button>
                        <button
                            type="button"
                            className={`toggle-btn take ${type === NOTE_TRANSACTION_TYPES.TAKE ? 'active' : ''}`}
                            onClick={() => setType(NOTE_TRANSACTION_TYPES.TAKE)}
                        >
                            I Took / Received
                            <span className="toggle-subtext">You owe</span>
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="form-group">
                        <label>Amount</label>
                        <CalculatorInput
                            value={amount}
                            onChange={setAmount}
                            placeholder="0.00"
                            className="form-input" // CalculatorInput needs to accept className or we wrap it
                        />
                    </div>

                    {/* Date */}
                    <div className="form-group">
                        <label>Date</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="form-input"
                                style={{ paddingRight: 40 }}
                            />
                            <Calendar
                                size={18}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-secondary)' }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-input"
                            placeholder="Dinner, Rent, etc."
                        />
                    </div>

                    {/* Sync Toggle (Optional feature) */}
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                            type="checkbox"
                            id="syncTx"
                            checked={createMainTx}
                            onChange={(e) => setCreateMainTx(e.target.checked)}
                            style={{ width: 18, height: 18, accentColor: '#b89359' }}
                        />
                        <label htmlFor="syncTx" style={{ margin: 0, cursor: 'pointer' }}>Record in main ledger?</label>
                    </div>

                    <button
                        type="submit"
                        disabled={!amount}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: 0 }}
                    >
                        Save Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NoteTransactionForm;
