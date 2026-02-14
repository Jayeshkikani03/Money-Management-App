import React, { useMemo } from 'react';
import './CalendarView.css';

const CalendarView = ({ transactions, month, year }) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Calculate daily totals
    const dailyTotals = useMemo(() => {
        const totals = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const day = date.getDate();

            if (!totals[day]) {
                totals[day] = { income: 0, expense: 0 };
            }

            if (transaction.type === 'income') {
                totals[day].income += transaction.amount;
            } else {
                totals[day].expense += transaction.amount;
            }
        });

        return totals;
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
            income: dailyTotals[day]?.income || 0,
            expense: dailyTotals[day]?.expense || 0
        });
    }

    return (
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
                        className={`calendar-day ${!dayData.isCurrentMonth ? 'other-month' : ''}`}
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
    );
};

export default CalendarView;
