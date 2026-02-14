import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import BankAccountListModal from '../BankAccountListModal';
import './Notes.css';

const SettlementModal = ({ isOpen, onClose, person, balance, onSettle }) => {
    const { format: formatCurrency } = useCurrency();
    const [amount, setAmount] = useState(Math.abs(balance)); // Default to full balance
    const [mode, setMode] = useState('CASH'); // CASH, BANK, EXTERNAL
    const [accountId, setAccountId] = useState(null);
    const [showBankModal, setShowBankModal] = useState(false);
    const [createMainTx, setCreateMainTx] = useState(true);

    if (!isOpen) return null;

    const handleSettle = () => {
        onSettle({
            amount: parseFloat(amount),
            type: balance > 0 ? 'PAYMENT_RECEIVED' : 'PAYMENT_MADE', // >0 means we receive, <0 means we pay
            mode,
            accountId,
            createMainTx
        });
        onClose();
    };

    const handleBankSelect = (account) => {
        setAccountId(account.id);
        setShowBankModal(false);
    };

    const isReceiving = balance > 0;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Settle Up</h2>
                    <button onClick={onClose} className="close-modal-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                            {isReceiving ? 'You are receiving from' : 'You are paying'}
                        </p>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>{person?.name}</h3>
                        <p style={{ fontSize: 24, fontWeight: 700, margin: '12px 0', color: isReceiving ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {formatCurrency(amount)}
                        </p>
                    </div>

                    <div className="form-group">
                        <label>Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Payment Mode</label>
                        <div className="toggle-group">
                            <button
                                className={`toggle-btn ${mode === 'CASH' ? 'active' : ''}`}
                                onClick={() => setMode('CASH')}
                                style={{ color: mode === 'CASH' ? 'var(--color-text-primary)' : '' }}
                            >
                                Cash
                            </button>
                            <button
                                className={`toggle-btn ${mode === 'BANK' ? 'active' : ''}`}
                                onClick={() => { setMode('BANK'); setShowBankModal(true); }}
                                style={{ color: mode === 'BANK' ? 'var(--color-text-primary)' : '' }}
                            >
                                {accountId ? 'Bank (Selected)' : 'Bank'}
                            </button>
                            <button
                                className={`toggle-btn ${mode === 'EXTERNAL' ? 'active' : ''}`}
                                onClick={() => setMode('EXTERNAL')}
                                style={{ color: mode === 'EXTERNAL' ? 'var(--color-text-primary)' : '' }}
                            >
                                Other
                            </button>
                        </div>
                    </div>

                    {mode === 'BANK' && !accountId && (
                        <p style={{ color: 'var(--color-danger)', fontSize: 12 }}>
                            * Please select a bank account
                        </p>
                    )}

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                            type="checkbox"
                            id="settleSync"
                            checked={createMainTx}
                            onChange={(e) => setCreateMainTx(e.target.checked)}
                            style={{ width: 18, height: 18, accentColor: '#b89359' }}
                        />
                        <label htmlFor="settleSync" style={{ margin: 0, cursor: 'pointer' }}>
                            Record as {isReceiving ? 'Income' : 'Expense'}
                        </label>
                    </div>

                    <button
                        onClick={handleSettle}
                        disabled={!amount || (mode === 'BANK' && !accountId)}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                        <CheckCircle2 size={18} /> Confirm Settlement
                    </button>
                </div>
            </div>

            <BankAccountListModal
                isOpen={showBankModal}
                onClose={() => setShowBankModal(false)}
                onSelect={handleBankSelect}
            />
        </div>
    );
};

export default SettlementModal;
