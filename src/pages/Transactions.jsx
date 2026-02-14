import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import MonthSelector from '../components/MonthSelector';
import TabNavigation from '../components/TabNavigation';
import SummaryBar from '../components/SummaryBar';
import EnhancedTransactionList from '../components/EnhancedTransactionList';
import CalendarView from '../components/CalendarView';
import MonthlyView from '../components/MonthlyView';
import TotalView from '../components/TotalView';
import FloatingActionButton from '../components/FloatingActionButton';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/ui/Modal';
import { getCurrentMonthYear, filterTransactionsByMonth } from '../utils/helpers';
import './Transactions.css';

const TABS = [
    { id: 'daily', label: 'Daily' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'total', label: 'Total' }
    // { id: 'note', label: 'Note' }
];

const Transactions = () => {
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

    const renderView = () => {
        switch (activeTab) {
            case 'calendar':
                return (
                    <CalendarView
                        transactions={monthlyTransactions}
                        month={selectedMonth}
                        year={selectedYear}
                        onTransactionClick={handleTransactionClick}
                    />
                );
            case 'monthly':
                return (
                    <MonthlyView
                        transactions={transactions.filter(t => {
                            const date = new Date(t.date);
                            return date.getFullYear() === selectedYear;
                        })}
                        year={selectedYear}
                    />
                );
            case 'total':
                return (
                    <TotalView
                        transactions={transactions.filter(t => {
                            const date = new Date(t.date);
                            return date.getFullYear() === selectedYear;
                        })}
                        month={selectedMonth}
                        year={selectedYear}
                    />
                );
            // case 'note':
            //     return (
            //         <div className="note-view">
            //             <p>Notes feature coming soon...</p>
            //         </div>
            //     );
            case 'daily':
            default:
                return (
                    <EnhancedTransactionList
                        transactions={monthlyTransactions}
                        onTransactionClick={handleTransactionClick}
                    />
                );
        }
    };

    return (
        <div className="transactions-page">
            <MonthSelector
                month={selectedMonth}
                year={selectedYear}
                onMonthChange={handleMonthChange}
                mode={activeTab === 'monthly' || activeTab === 'total' ? 'year' : 'month'}
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

            <div className="view-container">
                {renderView()}
            </div>

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

export default Transactions;
