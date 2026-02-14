import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import CategoryIcon from './CategoryIcon';
import { Lock } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { getAccountDisplayName } from '../services/accountTransactionService';
import { TRANSACTION_TYPES } from '../constants/accountTypes';
import './EnhancedTransactionList.css';

const EnhancedTransactionList = ({ transactions, onTransactionClick }) => {
    const { settings } = useApp();

    // Group transactions by date
    const groupedTransactions = useMemo(() => {
        const groups = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const dateKey = date.toISOString().split('T')[0];

            if (!groups[dateKey]) {
                groups[dateKey] = {
                    date: dateKey,
                    displayDate: formatDate(transaction.date),
                    transactions: []
                };
            }

            groups[dateKey].transactions.push(transaction);
        });

        // Sort groups by date (newest first)
        return Object.values(groups).sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );
    }, [transactions]);

    if (transactions.length === 0) {
        return (
            <div className="empty-transactions">
                <p>No transactions yet</p>
                <span>Tap the + button to add your first transaction</span>
            </div>
        );
    }

    return (
        <div className="enhanced-transaction-list">
            {groupedTransactions.map(group => (
                <div key={group.date} className="transaction-group">
                    <div className="group-header">
                        <span className="group-date">{group.displayDate}</span>
                        <span className="group-count">{group.transactions.length} transactions</span>
                    </div>
                    <div className="group-items">
                        {group.transactions.map(transaction => {
                            const isTransfer = transaction.type === TRANSACTION_TYPES.TRANSFER;
                            return (
                                <div
                                    key={transaction.id}
                                    className={`enhanced-transaction-item ${isTransfer ? 'transfer-item' : ''}`}
                                    onClick={() => !isTransfer && onTransactionClick?.(transaction)}
                                    title={isTransfer ? "Transfers cannot be edited here" : "Edit transaction"}
                                >
                                    <div className="icon-wrapper">
                                        <CategoryIcon
                                            category={transaction.category}
                                            type={transaction.type}
                                        />
                                        {isTransfer && <div className="lock-badge"><Lock size={10} /></div>}
                                    </div>
                                    <div className="transaction-details">
                                        <div className="transaction-title">
                                            {transaction.category}
                                        </div>
                                        {transaction.notes && (
                                            <div className="transaction-note">{transaction.notes}</div>
                                        )}
                                        <div className="transaction-account">
                                            {getAccountDisplayName(transaction.accountType, transaction.accountId)}
                                            {transaction.type === 'transfer' && transaction.toAccountType && (
                                                ` → ${getAccountDisplayName(transaction.toAccountType, transaction.toAccountId)}`
                                            )}
                                        </div>
                                    </div>
                                    <div className={`transaction-amount ${transaction.type}`}>
                                        {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                                        {formatCurrency(transaction.amount, settings.currency)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EnhancedTransactionList;
