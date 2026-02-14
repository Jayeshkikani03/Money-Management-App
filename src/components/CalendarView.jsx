import React, { useMemo, useState } from 'react';
import Modal from './ui/Modal';
import './CalendarView.css';

const CalendarView = ({ transactions, month, year, onTransactionClick }) => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [showDayModal, setShowDayModal] = useState(false);

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Calculate daily totals and store transactions
    const dailyData = useMemo(() => {
        const data = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const day = date.getDate();

            if (!data[day]) {
                data[day] = { income: 0, expense: 0, transactions: [] };
            }

            data[day].transactions.push(transaction);

            if (transaction.type === 'income') {
                data[day].income += transaction.amount;
            } else {
                data[day].expense += transaction.amount;
            }
        });

        return data;
    }, [transactions]);

    // Generate calendar days
    const calendarDays = [];

    // Previous month days
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push({ day: null, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push({
            day,
            isCurrentMonth: true,
            income: dailyData[day]?.income || 0,
            expense: dailyData[day]?.expense || 0,
            transactions: dailyData[day]?.transactions || []
        });
    }

    const handleDayClick = (dayData) => {
        if (dayData.isCurrentMonth && dayData.transactions.length > 0) {
            setSelectedDay(dayData);
            setShowDayModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowDayModal(false);
        setSelectedDay(null);
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (day) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${monthNames[month - 1]} ${year}`;
    };

    return (
        <>
            <div className="calendar-view">
                <div className="calendar-grid">
                    {/* Week day headers */}
                    {weekDays.map(day => (
                        <div key={day} className="calendar-weekday">
                            {day}
                        </div>
                    ))}

                    {/* Calendar days */}
                    {calendarDays.map((dayData, index) => (
                        <div
                            key={index}
                            className={`calendar-day ${!dayData.isCurrentMonth ? 'other-month' : ''} ${dayData.transactions?.length > 0 ? 'has-transactions' : ''}`}
                            onClick={() => handleDayClick(dayData)}
                        >
                            {dayData.day && (
                                <>
                                    <div className="day-number">{dayData.day}</div>
                                    {dayData.income > 0 && (
                                        <div className="day-income">
                                            {dayData.income.toFixed(2)}
                                        </div>
                                    )}
                                    {dayData.expense > 0 && (
                                        <div className="day-expense">
                                            {dayData.expense.toFixed(2)}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Transactions Modal */}
            {selectedDay && selectedDay.transactions && (
                <Modal
                    isOpen={showDayModal}
                    onClose={handleCloseModal}
                    title={formatDate(selectedDay.day)}
                >
                    <div className="daily-transactions">
                        <div className="daily-summary">
                            <div className="daily-summary-item income">
                                <span className="label">Income</span>
                                <span className="amount">{formatCurrency(selectedDay.income)}</span>
                            </div>
                            <div className="daily-summary-item expense">
                                <span className="label">Expense</span>
                                <span className="amount">{formatCurrency(selectedDay.expense)}</span>
                            </div>
                        </div>

                        <div className="transaction-list">
                            {selectedDay.transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className={`transaction-item ${transaction.type}`}
                                    onClick={() => {
                                        if (onTransactionClick) {
                                            handleCloseModal();
                                            onTransactionClick(transaction);
                                        }
                                    }}
                                >
                                    <div className="transaction-info">
                                        <div className="transaction-category">{transaction.category}</div>
                                        {transaction.notes && (
                                            <div className="transaction-notes">{transaction.notes}</div>
                                        )}
                                    </div>
                                    <div className={`transaction-amount ${transaction.type}`}>
                                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default CalendarView;
