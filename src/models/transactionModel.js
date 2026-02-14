import { generateId } from '../utils/helpers';

/**
 * Create a new transaction object
 */
export const createTransaction = (data) => {
    return {
        id: data.id || generateId(),
        amount: parseFloat(data.amount),
        type: data.type, // 'income' or 'expense'
        category: data.category,
        date: data.date || new Date().toISOString(),
        notes: data.notes || '',
        createdAt: data.createdAt || Date.now()
    };
};

/**
 * Validate transaction data
 */
export const isValidTransaction = (transaction) => {
    return (
        transaction &&
        typeof transaction.amount === 'number' &&
        transaction.amount > 0 &&
        ['income', 'expense'].includes(transaction.type) &&
        transaction.category &&
        transaction.date
    );
};
