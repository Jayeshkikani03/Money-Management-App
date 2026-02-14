import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';
import { getCurrentMonthYear, getMonthName } from '../utils/helpers';
import './Reports.css';

const Reports = () => {
    const { getCategoryBreakdown, getMonthlyTrends, detectSubscriptions } = useApp();
    const { month, year } = getCurrentMonthYear();
    const [selectedMonth, setSelectedMonth] = useState(month);
    const [selectedYear, setSelectedYear] = useState(year);

    const expenseBreakdown = getCategoryBreakdown('expense');
    const incomeBreakdown = getCategoryBreakdown('income');
    const monthlyTrends = getMonthlyTrends(6);
    const subscriptions = detectSubscriptions();

    // Generate month options (last 12 months)
    const monthOptions = [];
    for (let i = 11; i >= 0; i--) {
        const date = new Date(year, month - i, 1);
        monthOptions.push({
            month: date.getMonth(),
            year: date.getFullYear(),
            label: `${getMonthName(date.getMonth())} ${date.getFullYear()}`
        });
    }

    return (
        <div className="reports-page">
            <div className="page-header">
                <h1>Reports & Analytics</h1>
            </div>

            <div className="reports-grid">
                <Card>
                    <PieChart
                        data={expenseBreakdown}
                        title="Expense Breakdown by Category"
                    />
                </Card>

                <Card>
                    <PieChart
                        data={incomeBreakdown}
                        title="Income Breakdown by Category"
                    />
                </Card>

                <Card className="full-width">
                    <BarChart
                        data={monthlyTrends}
                        title="Monthly Income vs Expense Trend"
                    />
                </Card>

                {subscriptions.length > 0 && (
                    <Card className="full-width">
                        <h3 style={{ marginBottom: '16px' }}>Detected Subscriptions</h3>
                        <div className="subscriptions-list">
                            {subscriptions.map((sub, index) => (
                                <div key={index} className="subscription-item">
                                    <div>
                                        <div className="sub-category">{sub.category}</div>
                                        <div className="sub-frequency">Occurs {sub.frequency} times</div>
                                    </div>
                                    <div className="sub-amount">₹{sub.amount.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Reports;
