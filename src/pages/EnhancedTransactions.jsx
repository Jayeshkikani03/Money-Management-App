import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import MonthSelector from '../components/MonthSelector';
import TabNavigation from '../components/TabNavigation';
import SummaryBar from '../components/SummaryBar';
import EnhancedTransactionList from '../components/EnhancedTransactionList';
import FloatingActionButton from '../components/FloatingActionButton';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/ui/Modal';
import { getCurrentMonthYear, filterTransactionsByMonth } from '../utils/helpers';
import './EnhancedTransactions.css';

const TABS = [
    { id: 'daily', label: 'Daily' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'total', label: 'Total' },
    { id: 'note', label: 'Note' }
];

const EnhancedTransactions = () => {
    const { transactions, getMonthlyTotals } = useApp();
    const { month: currentMonth, year: currentYear } = getCurrentMonthYear();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [activeTab, setActiveTab] = useState('daily');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const handleMonthChange = (newMonth, newYear) => {
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
    };

    const monthlyTransactions = useMemo(() => {
        return filterTransactionsByMonth(transactions, selectedMonth, selectedYear);
    }, [transactions, selectedMonth, selectedYear]);

    const monthlyTotals = useMemo(() => {
        return getMonthlyTotals(selectedMonth, selectedYear);
    }, [getMonthlyTotals, selectedMonth, selectedYear]);

    const handleTransactionClick = (transaction) => {
        setEditingTransaction(transaction);
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingTransaction(null);
    };

    const handleAddClick = () => {
        setEditingTransaction(null);
        setShowAddModal(true);
    };

    return (
        <div className="enhanced-transactions-page">
            <MonthSelector
                month={selectedMonth}
                year={selectedYear}
                onMonthChange={handleMonthChange}
            />

            <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={TABS}
            />

            <SummaryBar
                income={monthlyTotals.totalIncome}
                expense={monthlyTotals.totalExpense}
            />

            <EnhancedTransactionList
                transactions={monthlyTransactions}
                onTransactionClick={handleTransactionClick}
            />

            <FloatingActionButton onClick={handleAddClick} />

            <Modal
                isOpen={showAddModal}
                onClose={handleCloseModal}
                title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            >
                <TransactionForm
                    transaction={editingTransaction}
                    onClose={handleCloseModal}
                    onSuccess={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default EnhancedTransactions;
