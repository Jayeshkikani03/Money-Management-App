import { STORAGE_KEYS } from '../constants/accountTypes';

/**
 * Cash Account Service
 * Manages cash account as a first-class entity
 */

const CASH_ACCOUNT_ID = 'cash_main';

/**
 * Get cash account
 */
export const getCashAccount = () => {
    try {
        const cash = localStorage.getItem(STORAGE_KEYS.CASH_ACCOUNT);
        if (cash) {
            return JSON.parse(cash);
        }

        // Initialize default cash account
        const defaultCash = {
            id: CASH_ACCOUNT_ID,
            name: 'Cash',
            type: 'cash',
            balance: 0,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        localStorage.setItem(STORAGE_KEYS.CASH_ACCOUNT, JSON.stringify(defaultCash));
        return defaultCash;
    } catch (error) {
        console.error('Error getting cash account:', error);
        return { id: CASH_ACCOUNT_ID, balance: 0, type: 'cash' };
    }
};

/**
 * Update cash balance
 */
export const updateCashBalance = (amount, operation = 'add') => {
    try {
        const cash = getCashAccount();

        const newBalance = operation === 'add'
            ? cash.balance + amount
            : cash.balance - amount;

        if (newBalance < 0) {
            throw new Error('Insufficient cash balance');
        }

        const updatedCash = {
            ...cash,
            balance: newBalance,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.CASH_ACCOUNT, JSON.stringify(updatedCash));
        return updatedCash;
    } catch (error) {
        console.error('Error updating cash balance:', error);
        throw error;
    }
};

/**
 * Set cash balance (for initial setup or corrections)
 */
export const setCashBalance = (balance) => {
    try {
        const cash = getCashAccount();

        const updatedCash = {
            ...cash,
            balance: parseFloat(balance),
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.CASH_ACCOUNT, JSON.stringify(updatedCash));
        return updatedCash;
    } catch (error) {
        console.error('Error setting cash balance:', error);
        throw error;
    }
};

/**
 * Validate cash transaction
 */
export const validateCashTransaction = (amount) => {
    const cash = getCashAccount();

    if (cash.balance < amount) {
        return {
            valid: false,
            error: `Insufficient cash balance. Available: ₹${cash.balance.toFixed(2)}`
        };
    }

    return { valid: true };
};

/**
 * Get cash balance
 */
export const getCashBalance = () => {
    const cash = getCashAccount();
    return cash.balance;
};

export default {
    getCashAccount,
    updateCashBalance,
    setCashBalance,
    validateCashTransaction,
    getCashBalance
};
