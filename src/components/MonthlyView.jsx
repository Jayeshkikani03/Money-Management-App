import React, { useMemo } from 'react';
import './MonthlyView.css';

const MonthlyView = ({ transactions, year }) => {
    // Group transactions by month and week
    const monthlyData = useMemo(() => {
        const data = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const month = date.getMonth() + 1;
            const monthKey = `${year}-${String(month).padStart(2, '0')}`;

            if (!data[monthKey]) {
                data[monthKey] = {
                    month,
                    monthName: date.toLocaleString('default', { month: 'short' }),
                    weeks: {},
                    totalIncome: 0,
                    totalExpense: 0
                };
            }

            // Get week number (simple week grouping)
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!data[monthKey].weeks[weekKey]) {
                data[monthKey].weeks[weekKey] = {
                    startDate: weekStart,
                    income: 0,
                    expense: 0
                };
            }

            if (transaction.type === 'income') {
                data[monthKey].weeks[weekKey].income += transaction.amount;
                data[monthKey].totalIncome += transaction.amount;
            } else {
                data[monthKey].weeks[weekKey].expense += transaction.amount;
                data[monthKey].totalExpense += transaction.amount;
            }
        });

        return Object.values(data).sort((a, b) => b.month - a.month);
    }, [transactions, year]);

    const formatDateRange = (startDate) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);

        return `${start.getDate()}.${String(start.getMonth() + 1).padStart(2, '0')} ~ ${end.getDate()}.${String(end.getMonth() + 1).padStart(2, '0')}`;
    };

    const formatCurrency = (amount) => {
        return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="monthly-view">
            {monthlyData.map((monthData) => (
                <div key={`${year}-${monthData.month}`} className="month-section">
                    <div className="month-header">
                        <h3>{monthData.monthName}</h3>
                        <div className="month-totals">
                            <span className="month-income">{formatCurrency(monthData.totalIncome)}</span>
                            <span className="month-expense">{formatCurrency(monthData.totalExpense)}</span>
                        </div>
                    </div>

                    <div className="week-list">
                        {Object.values(monthData.weeks)
                            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                            .map((week, index) => {
                                const net = week.income - week.expense;
                                return (
                                    <div key={index} className="week-item">
                                        <div className="week-date">
                                            {formatDateRange(week.startDate)}
                                        </div>
                                        <div className="week-amounts">
                                            <div className="week-income">
                                                {formatCurrency(week.income)}
                                            </div>
                                            <div className="week-expense">
                                                {formatCurrency(week.expense)}
                                            </div>
                                            <div className="week-net">
                                                {formatCurrency(net)}
                                            </div>
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

export default MonthlyView;
