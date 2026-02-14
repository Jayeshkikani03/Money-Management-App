import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useApp } from '../context/AppContext';
import { useCurrency } from '../hooks/useCurrency';
import NoteTransactionForm from '../components/notes/NoteTransactionForm';
import LedgerList from '../components/notes/LedgerList';
import SettlementModal from '../components/notes/SettlementModal';
import { NOTE_TRANSACTION_TYPES } from '../models/noteTransactionModel';
import noteTransactionService from '../services/noteTransactionService';
import { useToast } from '../context/ToastContext';
import '../components/notes/Notes.css';

const NotesPersonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { persons, transactions, addTransaction, deletePerson, getPersonBalance } = useNotes();
    const { addTransaction: addMainAppTransaction } = useApp();
    const { format: formatCurrency } = useCurrency();
    const { success } = useToast();

    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showSettlementModal, setShowSettlementModal] = useState(false);
    const [initialTxType, setInitialTxType] = useState('GIVE');

    const person = persons.find(p => p.id === id);
    const personTransactions = transactions.filter(t => t.personId === id && !t.isSettled);
    const balance = getPersonBalance(id);

    if (!person) {
        return (
            <div className="p-4 text-center">
                <p>Person not found</p>
                <button onClick={() => navigate('/notes')} className="text-indigo-600 mt-2">Go Back</button>
            </div>
        );
    }

    const handleDelete = async () => {
        if (window.confirm('Delete this person and all history?')) {
            await deletePerson(id);
            navigate('/notes');
        }
    };

    const handleAddTx = async (data) => {
        await addTransaction({
            ...data,
            personId: id
        });
        success('Transaction added');
    };

    const handleSettle = async (data) => {
        // 1. Record Settlement in Notes Module
        await noteTransactionService.recordSettlement({
            personId: id,
            amount: data.amount,
            type: data.type,
            mode: data.mode,
            notes: 'Settlement via UI'
        });

        // 2. Create Main App Transaction if requested
        if (data.createMainTx) {
            const isReceiving = data.type === 'PAYMENT_RECEIVED';
            await addMainAppTransaction({
                amount: data.amount,
                type: isReceiving ? 'income' : 'expense',
                category: 'Debt Settlement',
                date: new Date().toISOString(),
                notes: `Settlement with ${person.name}`,
                accountType: data.mode === 'BANK' ? 'bank' : 'cash',
                accountId: data.accountId
            });
        }

        success('Settlement recorded');
        // Force refresh by navigating
        navigate('/notes');
    };

    const openTxModal = (type) => {
        setInitialTxType(type);
        setShowTransactionModal(true);
    };

    return (
        <div className="notes-dashboard">
            {/* Header */}
            <div className="person-detail-header">
                <div className="header-nav-row">
                    <button onClick={() => navigate('/notes')} className="back-btn">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSettlementModal(true)}
                            disabled={balance === 0}
                            className="action-btn settle"
                            title="Settle Up"
                        >
                            <CheckCircle2 size={20} />
                        </button>
                        <button onClick={handleDelete} className="action-btn delete">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                <div className="person-profile-centered">
                    <div className="profile-avatar-large">
                        {person.avatar}
                    </div>
                    <h1 className="notes-title">{person.name}</h1>
                    {person.notes && <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>{person.notes}</p>}
                </div>

                {/* Balance Card */}
                <div className={`large-balance-card ${balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'settled'
                    }`}>
                    <p style={{ opacity: 0.9, fontSize: 12, marginBottom: 4 }}>
                        {balance === 0 ? 'Settled' : balance > 0 ? 'You will receive' : 'You need to pay'}
                    </p>
                    <p style={{ fontSize: 32, fontWeight: 700 }}>
                        {formatCurrency(Math.abs(balance))}
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <button
                        onClick={() => openTxModal(NOTE_TRANSACTION_TYPES.GIVE)}
                        className="action-button-large give"
                    >
                        <Plus size={18} /> I Gave
                    </button>
                    <button
                        onClick={() => openTxModal(NOTE_TRANSACTION_TYPES.TAKE)}
                        className="action-button-large take"
                    >
                        <Plus size={18} /> I Took
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            <div className="ledger-list">
                <h3 className="history-title">History</h3>
                <LedgerList transactions={personTransactions} />
            </div>

            <NoteTransactionForm
                isOpen={showTransactionModal}
                onClose={() => setShowTransactionModal(false)}
                onSave={handleAddTx}
                initialType={initialTxType}
            />

            <SettlementModal
                isOpen={showSettlementModal}
                onClose={() => setShowSettlementModal(false)}
                person={person}
                balance={balance}
                onSettle={handleSettle}
            />
        </div>
    );
};

export default NotesPersonDetail;
