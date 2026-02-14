import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import { NOTE_TRANSACTION_TYPES } from '../../models/noteTransactionModel';
import './Notes.css';

const LedgerList = ({ transactions }) => {
    const { format: formatCurrency } = useCurrency();

    if (!transactions || transactions.length === 0) {
        return (
            <div className="empty-state">
                <p>No transactions yet</p>
            </div>
        );
    }

    // Sort by date desc
    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="ledger-list-container">
            {sorted.map(tx => {
                const isGive = tx.type === NOTE_TRANSACTION_TYPES.GIVE;
                const txDate = new Date(tx.date).toLocaleDateString();

                return (
                    <div key={tx.id} className="ledger-item">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className={`ledger-icon ${isGive ? 'give' : 'take'}`}>
                                {isGive ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div className="ledger-info">
                                <h4>{isGive ? 'You Gave' : 'You Took'}</h4>
                                <p>{tx.description || (isGive ? 'Lent money' : 'Borrowed money')}</p>
                            </div>
                        </div>

                        <div className="ledger-amount">
                            <span className="value" style={{ color: isGive ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                {formatCurrency(tx.amount)}
                            </span>
                            <span className="date">
                                <Clock size={10} /> {txDate}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LedgerList;
