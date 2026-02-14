/**
 * Date Utilities
 * Helper functions for date calculations and formatting
 */

/**
 * Calculate next date based on frequency
 * @param {string|Date} startDate - Starting date
 * @param {string} frequency - Frequency: daily, weekly, biweekly, monthly, quarterly, yearly
 * @param {number} interval - Interval (e.g., every 2 months)
 * @returns {string} Next date in ISO format
 */
export const calculateNextDate = (startDate, frequency, interval = 1) => {
    const date = new Date(startDate);

    switch (frequency) {
        case 'daily':
            date.setDate(date.getDate() + interval);
            break;
        case 'weekly':
            date.setDate(date.getDate() + (7 * interval));
            break;
        case 'biweekly':
            date.setDate(date.getDate() + (14 * interval));
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + interval);
            break;
        case 'quarterly':
            date.setMonth(date.getMonth() + (3 * interval));
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + interval);
            break;
        default:
            throw new Error(`Unknown frequency: ${frequency}`);
    }

    return date.toISOString().split('T')[0];
};

/**
 * Check if a date is due (today or past)
 * @param {string|Date} dueDate 
 * @returns {boolean}
 */
export const isDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due <= today;
};

/**
 * Check if a date is in the future
 * @param {string|Date} date 
 * @returns {boolean}
 */
export const isFuture = (date) => {
    const checkDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate > today;
};

/**
 * Get dates between two dates
 * @param {string|Date} startDate 
 * @param {string|Date} endDate 
 * @param {string} frequency 
 * @param {number} interval 
 * @returns {Array<string>} Array of dates
 */
export const getDatesBetween = (startDate, endDate, frequency, interval = 1) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0]);
        const nextDate = calculateNextDate(currentDate, frequency, interval);
        currentDate = new Date(nextDate);
    }

    return dates;
};

/**
 * Format date for display
 * @param {string|Date} date 
 * @param {string} format - 'short', 'long', 'full'
 * @returns {string}
 */
export const formatDate = (date, format = 'short') => {
    const d = new Date(date);

    const formats = {
        short: { day: '2-digit', month: 'short', year: 'numeric' },
        long: { day: '2-digit', month: 'long', year: 'numeric' },
        full: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }
    };

    return d.toLocaleDateString('en-IN', formats[format] || formats.short);
};

/**
 * Get days until a date
 * @param {string|Date} date 
 * @returns {number}
 */
export const getDaysUntil = (date) => {
    const target = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

/**
 * Get relative date string (e.g., "Today", "Tomorrow", "In 3 days")
 * @param {string|Date} date 
 * @returns {string}
 */
export const getRelativeDateString = (date) => {
    const days = getDaysUntil(date);

    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days <= 7) return `In ${days} days`;
    if (days <= 30) return `In ${Math.ceil(days / 7)} weeks`;

    return formatDate(date);
};

/**
 * Generate unique ID
 * @param {string} prefix 
 * @returns {string}
 */
export const generateId = (prefix = 'id') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default {
    calculateNextDate,
    isDue,
    isFuture,
    getDatesBetween,
    formatDate,
    getDaysUntil,
    getRelativeDateString,
    generateId
};
