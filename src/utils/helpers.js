import { CURRENCIES } from './constants';

/**
 * Generate a unique ID using timestamp and random string
 */
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format a number as currency
 */
export const formatCurrency = (amount, currencyCode = 'INR') => {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    const symbol = currency ? currency.symbol : '₹';

    const formatted = Math.abs(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return `${symbol}${formatted}`;
};

/**
 * Format a date for display
 */
export const formatDate = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-IN', options);
};

/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

/**
 * Get month name from month number (0-11)
 */
export const getMonthName = (monthIndex) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
};

/**
 * Get current month and year
 */
export const getCurrentMonthYear = () => {
    const now = new Date();
    return {
        month: now.getMonth(),
        year: now.getFullYear()
    };
};

/**
 * Validate transaction data
 */
export const validateTransaction = (transaction) => {
    const errors = {};

    if (!transaction.amount || transaction.amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
    }

    if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
        errors.type = 'Transaction type must be income or expense';
    }

    if (!transaction.category || transaction.category.trim() === '') {
        errors.category = 'Category is required';
    }

    if (!transaction.date) {
        errors.date = 'Date is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Export data to CSV format
 */
export const exportToCSV = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return '';
    }

    const headers = ['Date', 'Type', 'Category', 'Amount', 'Notes'];
    const rows = transactions.map(t => [
        formatDate(t.date),
        t.type,
        t.category,
        t.amount,
        t.notes || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
};

/**
 * Download data as file
 */
export const downloadFile = (content, filename, contentType = 'text/plain') => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Filter transactions by date range
 */
export const filterTransactionsByMonth = (transactions, month, year) => {
    return transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === month && date.getFullYear() === year;
    });
};

/**
 * Sort transactions by date (newest first)
 */
export const sortTransactionsByDate = (transactions, ascending = false) => {
    return [...transactions].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return ascending ? dateA - dateB : dateB - dateA;
    });
};

/**
 * Group transactions by category
 */
export const groupByCategory = (transactions) => {
    return transactions.reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(transaction);
        return acc;
    }, {});
};
