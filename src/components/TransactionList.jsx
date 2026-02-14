import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Edit2, Trash2, Search, Lock } from 'lucide-react';
import { formatCurrency, formatDate, sortTransactionsByDate } from '../utils/helpers';
import { TRANSACTION_TYPES } from '../constants/accountTypes';
import Button from './ui/Button';
import './TransactionList.css';

const TransactionList = ({ onEdit }) => {
    const { transactions, deleteTransaction, settings } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    const filteredTransactions = useMemo(() => {
        let filtered = [...transactions];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }

        // Category filter
        if (filterCategory !== 'all') {
            filtered = filtered.filter(t => t.category === filterCategory);
        }

        return sortTransactionsByDate(filtered);
    }, [transactions, searchTerm, filterType, filterCategory]);

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(transactions.map(t => t.category))];
        return uniqueCategories.sort();
    }, [transactions]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id);
            } catch (error) {
                alert('Failed to delete transaction');
            }
        }
    };

    return (
        <div className="transaction-list">
            <div className="list-filters">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-row">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredTransactions.length === 0 ? (
                <div className="empty-state">
                    <p>No transactions found</p>
                </div>
            ) : (
                <div className="transactions">
                    {filteredTransactions.map(transaction => (
                        <div key={transaction.id} className="transaction-item">
                            <div className="transaction-info">
                                <div className="transaction-category">{transaction.category}</div>
                                <div className="transaction-date">{formatDate(transaction.date)}</div>
                                {transaction.notes && (
                                    <div className="transaction-notes">{transaction.notes}</div>
                                )}
                            </div>
                            <div className="transaction-right">
                                <div className={`transaction-amount ${transaction.type}`}>
                                    {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                                    {formatCurrency(transaction.amount)}
                                </div>
                                <div className="transaction-actions">
                                    {transaction.type === TRANSACTION_TYPES.TRANSFER ? (
                                        <button
                                            className="action-button disabled"
                                            title="Transfers cannot be edited here"
                                            disabled
                                        >
                                            <Lock size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            className="action-button"
                                            onClick={() => onEdit(transaction)}
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                    <button
                                        className="action-button delete"
                                        onClick={() => handleDelete(transaction.id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionList;
