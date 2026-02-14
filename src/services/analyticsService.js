import { filterTransactionsByMonth, groupByCategory } from '../utils/helpers';

/**
 * Analytics Service
 * Provides calculations and insights for financial data
 */
const analyticsService = {
    /**
     * Calculate current balance
     * CRITICAL: Only includes income and expense types, transfers are excluded
     */
    calculateBalance(transactions) {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Transfers are automatically excluded by filtering only 'income' and 'expense' types
        // This prevents double-counting in financial reports

        return {
            balance: income - expense,
            totalIncome: income,
            totalExpense: expense
        };
    },

    /**
     * Get monthly totals for a specific month
     */
    getMonthlyTotals(transactions, month, year) {
        const monthlyTransactions = filterTransactionsByMonth(transactions, month, year);
        return this.calculateBalance(monthlyTransactions);
    },

    /**
     * Get category breakdown
     */
    getCategoryBreakdown(transactions, type = null) {
        const filtered = type
            ? transactions.filter(t => t.type === type)
            : transactions;

        const grouped = groupByCategory(filtered);

        return Object.entries(grouped).map(([category, items]) => ({
            category,
            total: items.reduce((sum, item) => sum + item.amount, 0),
            count: items.length,
            percentage: 0 // Will be calculated after getting total
        })).sort((a, b) => b.total - a.total);
    },

    /**
     * Get monthly trends for the last N months
     */
    getMonthlyTrends(transactions, numberOfMonths = 6) {
        const trends = [];
        const now = new Date();

        for (let i = numberOfMonths - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.getMonth();
            const year = date.getFullYear();

            const monthlyData = this.getMonthlyTotals(transactions, month, year);

            trends.push({
                month,
                year,
                monthName: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                income: monthlyData.totalIncome,
                expense: monthlyData.totalExpense,
                balance: monthlyData.balance
            });
        }

        return trends;
    },

    /**
     * Generate spending insights
     */
    getSpendingInsights(transactions) {
        const insights = [];
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Get current and previous month data
        const currentMonthData = this.getMonthlyTotals(transactions, currentMonth, currentYear);

        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const previousMonthData = this.getMonthlyTotals(transactions, prevMonth, prevYear);

        // Compare spending
        if (previousMonthData.totalExpense > 0) {
            const change = currentMonthData.totalExpense - previousMonthData.totalExpense;
            const percentChange = (change / previousMonthData.totalExpense) * 100;

            if (Math.abs(percentChange) > 10) {
                insights.push({
                    type: percentChange > 0 ? 'warning' : 'success',
                    message: `Your spending ${percentChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(percentChange).toFixed(1)}% this month`
                });
            }
        }

        // High spending category
        const currentMonthTransactions = filterTransactionsByMonth(transactions, currentMonth, currentYear);
        const categoryBreakdown = this.getCategoryBreakdown(
            currentMonthTransactions.filter(t => t.type === 'expense')
        );

        if (categoryBreakdown.length > 0) {
            const topCategory = categoryBreakdown[0];
            if (topCategory.total > currentMonthData.totalExpense * 0.3) {
                insights.push({
                    type: 'info',
                    message: `${topCategory.category} is your highest expense category this month`
                });
            }
        }

        // Savings rate
        if (currentMonthData.totalIncome > 0) {
            const savingsRate = ((currentMonthData.totalIncome - currentMonthData.totalExpense) / currentMonthData.totalIncome) * 100;

            if (savingsRate > 20) {
                insights.push({
                    type: 'success',
                    message: `Great job! You're saving ${savingsRate.toFixed(1)}% of your income`
                });
            } else if (savingsRate < 0) {
                insights.push({
                    type: 'warning',
                    message: 'You spent more than you earned this month'
                });
            }
        }

        return insights;
    },

    /**
     * Detect recurring transactions (subscriptions)
     */
    detectSubscriptions(transactions) {
        const subscriptions = [];
        const grouped = groupByCategory(transactions.filter(t => t.type === 'expense'));

        Object.entries(grouped).forEach(([category, items]) => {
            // Check for similar amounts occurring monthly
            const amounts = {};

            items.forEach(item => {
                const roundedAmount = Math.round(item.amount);
                if (!amounts[roundedAmount]) {
                    amounts[roundedAmount] = [];
                }
                amounts[roundedAmount].push(item);
            });

            // If same amount appears 3+ times, likely a subscription
            Object.entries(amounts).forEach(([amount, occurrences]) => {
                if (occurrences.length >= 3) {
                    subscriptions.push({
                        category,
                        amount: parseFloat(amount),
                        frequency: occurrences.length,
                        lastDate: occurrences[occurrences.length - 1].date
                    });
                }
            });
        });

        return subscriptions.sort((a, b) => b.amount - a.amount);
    },

    /**
     * Calculate goal progress
     */
    calculateGoalProgress(transactions, goal) {
        if (!goal || !goal.targetAmount) return null;

        const balance = this.calculateBalance(transactions);
        const currentSavings = balance.balance;
        const progress = (currentSavings / goal.targetAmount) * 100;

        return {
            currentAmount: currentSavings,
            targetAmount: goal.targetAmount,
            progress: Math.min(progress, 100),
            remaining: Math.max(goal.targetAmount - currentSavings, 0)
        };
    }
};

export default analyticsService;
