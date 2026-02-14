import { RECURRING_FREQUENCIES } from '../constants/accountTypes';
import storageService from './storageService';

/**
 * Recurring Engine
 * Manages and executes recurring transactions
 */

const STORAGE_KEY = 'recurringTransactions';

/**
 * Get all recurring transactions
 */
export const getAllRecurring = () => {
    try {
        const recurring = localStorage.getItem(STORAGE_KEY);
        return recurring ? JSON.parse(recurring) : [];
    } catch (error) {
        console.error('Error getting recurring transactions:', error);
        return [];
    }
};

/**
 * Get active recurring transactions
 */
export const getActiveRecurring = () => {
    return getAllRecurring().filter(r => r.isActive !== false);
};

/**
 * Create recurring transaction template
 */
export const createRecurring = (data) => {
    const recurring = getAllRecurring();

    const newRecurring = {
        id: `recurring_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        isActive: true,
        completedCount: 0,
        createdAt: new Date().toISOString()
    };

    recurring.push(newRecurring);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recurring));

    return newRecurring;
};

/**
 * Check for due recurring transactions
 */
export const checkDueRecurring = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recurring = getActiveRecurring();
    const dueTransactions = [];

    for (const r of recurring) {
        const nextDate = new Date(r.nextExecutionDate);
        nextDate.setHours(0, 0, 0, 0);

        // Check if due
        if (nextDate <= today) {
            // Check if end date passed
            if (r.endDate && new Date(r.endDate) < today) {
                // Deactivate
                updateRecurring(r.id, { isActive: false });
                continue;
            }

            dueTransactions.push(r);
        }
    }

    return dueTransactions;
};

/**
 * Execute a recurring transaction
 */
export const executeRecurring = async (recurringId, addTransactionFn) => {
    const recurring = getAllRecurring().find(r => r.id === recurringId);
    if (!recurring) {
        throw new Error('Recurring transaction not found');
    }

    // Create transaction from template
    const transaction = {
        amount: recurring.amount,
        type: recurring.type,
        category: recurring.category,
        date: new Date().toISOString(),
        notes: recurring.notes || `Recurring: ${recurring.description}`,
        accountType: recurring.accountType,
        accountId: recurring.accountId,
        isRecurring: true,
        recurringParentId: recurringId
    };

    // Execute transaction
    await addTransactionFn(transaction);

    // Update recurring record
    const nextDate = calculateNextDate(recurring.nextExecutionDate, recurring.frequency, recurring.interval);
    updateRecurring(recurringId, {
        nextExecutionDate: nextDate,
        lastExecutionDate: new Date().toISOString(),
        completedCount: (recurring.completedCount || 0) + 1
    });

    return transaction;
};

/**
 * Calculate next execution date
 */
const calculateNextDate = (currentDate, frequency, interval = 1) => {
    const date = new Date(currentDate);

    switch (frequency) {
        case RECURRING_FREQUENCIES.DAILY:
            date.setDate(date.getDate() + interval);
            break;
        case RECURRING_FREQUENCIES.WEEKLY:
            date.setDate(date.getDate() + (7 * interval));
            break;
        case RECURRING_FREQUENCIES.BI_WEEKLY:
            date.setDate(date.getDate() + 14);
            break;
        case RECURRING_FREQUENCIES.MONTHLY:
            date.setMonth(date.getMonth() + interval);
            break;
        case RECURRING_FREQUENCIES.BI_MONTHLY:
            date.setMonth(date.getMonth() + 2);
            break;
        case RECURRING_FREQUENCIES.QUARTERLY:
            date.setMonth(date.getMonth() + 3);
            break;
        case RECURRING_FREQUENCIES.SEMI_ANNUAL:
            date.setMonth(date.getMonth() + 6);
            break;
        case RECURRING_FREQUENCIES.YEARLY:
            date.setFullYear(date.getFullYear() + interval);
            break;
        default:
            date.setMonth(date.getMonth() + 1);
    }

    return date.toISOString();
};

/**
 * Update recurring transaction
 */
export const updateRecurring = (id, updates) => {
    const recurring = getAllRecurring();
    const index = recurring.findIndex(r => r.id === id);

    if (index === -1) {
        throw new Error('Recurring transaction not found');
    }

    recurring[index] = {
        ...recurring[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recurring));
    return recurring[index];
};

/**
 * Delete recurring transaction
 */
export const deleteRecurring = (id) => {
    const recurring = getAllRecurring();
    const filtered = recurring.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Get upcoming recurring transactions (next 30 days)
 */
export const getUpcomingRecurring = (days = 30) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const recurring = getActiveRecurring();
    return recurring.filter(r => {
        const nextDate = new Date(r.nextExecutionDate);
        return nextDate >= today && nextDate <= futureDate;
    }).sort((a, b) => new Date(a.nextExecutionDate) - new Date(b.nextExecutionDate));
};

export default {
    getAllRecurring,
    getActiveRecurring,
    createRecurring,
    checkDueRecurring,
    executeRecurring,
    updateRecurring,
    deleteRecurring,
    getUpcomingRecurring
};
