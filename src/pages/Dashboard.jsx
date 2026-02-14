import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BalanceCard from '../components/BalanceCard';
import LineChart from '../components/charts/LineChart';
import InsightsPanel from '../components/InsightsPanel';
import TransactionForm from '../components/TransactionForm';
import FloatingActionButton from '../components/FloatingActionButton';
import CategoryIcon from '../components/CategoryIcon';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import { formatCurrency, formatDate, getCurrentMonthYear } from '../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
    const { transactions, getMonthlyTrends, settings } = useApp();
    const [showAddModal, setShowAddModal] = useState(false);
    const { month, year } = getCurrentMonthYear();

    const monthlyTrends = getMonthlyTrends(6);
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <div className="dashboard">

            <div className="dashboard-grid">
                <BalanceCard month={month} year={year} />

                <Card>
                    <LineChart
                        data={monthlyTrends}
                        title="Income vs Expense Trend"
                    />
                </Card>

                <InsightsPanel />

                <Card>
                    <h3 style={{ marginBottom: '16px' }}>Recent Transactions</h3>
                    {recentTransactions.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>
                            No transactions yet
                        </p>
                    ) : (
                        <div className="recent-transactions">
                            {recentTransactions.map(transaction => (
                                <div key={transaction.id} className="recent-transaction-item">
                                    <CategoryIcon category={transaction.category} type={transaction.type} />
                                    <div className="transaction-details">
                                        <div className="transaction-category">{transaction.category}</div>
                                        <div className="transaction-date">{formatDate(transaction.date)}</div>
                                    </div>
                                    <div className={`transaction-amount ${transaction.type}`}>
                                        {transaction.type === 'income' ? '+' : '-'}
                                        {formatCurrency(transaction.amount, settings.currency)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            <FloatingActionButton onClick={() => setShowAddModal(true)} />

            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add Transaction"
            >
                <TransactionForm
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => setShowAddModal(false)}
                />
            </Modal>
        </div>
    );
};

export default Dashboard;
