import { generateId } from '../utils/helpers';

/**
 * Create a new transaction object
 */
export const createTransaction = (data) => {
    return {
        id: data.id || generateId(),
        amount: parseFloat(data.amount),
        type: data.type, // 'income', 'expense', or 'transfer'
        category: data.category,
        date: data.date || new Date().toISOString(),
        notes: data.notes || '',
        accountType: data.accountType || 'cash',
        accountId: data.accountId || null,
        toAccountType: data.toAccountType || null, // for transfers
        toAccountId: data.toAccountId || null,     // for transfers
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
        !isNaN(transaction.amount) &&
        transaction.amount > 0 &&
        ['income', 'expense', 'transfer'].includes(transaction.type) &&
        transaction.category &&
        transaction.date
    );
};
