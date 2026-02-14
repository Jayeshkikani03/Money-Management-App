import { STORAGE_KEYS } from '../constants/accountTypes';

/**
 * Bank Account Service
 * Handles CRUD operations for bank accounts
 */

// Generate unique ID
const generateId = () => {
    return `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Mask account number (show last 4 digits)
export const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return '';
    const lastFour = accountNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
};

// Get all bank accounts
export const getAllBankAccounts = () => {
    try {
        const accounts = localStorage.getItem(STORAGE_KEYS.BANK_ACCOUNTS);
        return accounts ? JSON.parse(accounts) : [];
    } catch (error) {
        console.error('Error getting bank accounts:', error);
        return [];
    }
};

// Get active bank accounts only
export const getActiveBankAccounts = () => {
    return getAllBankAccounts().filter(account => account.isActive !== false);
};

// Get bank account by ID
export const getBankAccountById = (id) => {
    const accounts = getAllBankAccounts();
    return accounts.find(account => account.id === id);
};

// Create new bank account
export const createBankAccount = (accountData) => {
    try {
        const accounts = getAllBankAccounts();

        const newAccount = {
            id: generateId(),
            bankName: accountData.bankName,
            accountName: accountData.accountName,
            accountNumberMasked: maskAccountNumber(accountData.accountNumber),
            balance: parseFloat(accountData.initialBalance) || 0,
            accountType: accountData.accountType || 'savings',
            ifsc: accountData.ifsc || null,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        accounts.push(newAccount);
        localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(accounts));

        return newAccount;
    } catch (error) {
        console.error('Error creating bank account:', error);
        throw error;
    }
};

// Update bank account
export const updateBankAccount = (id, updates) => {
    try {
        const accounts = getAllBankAccounts();
        const index = accounts.findIndex(account => account.id === id);

        if (index === -1) {
            throw new Error('Bank account not found');
        }

        accounts[index] = {
            ...accounts[index],
            ...updates,
            id, // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(accounts));
        return accounts[index];
    } catch (error) {
        console.error('Error updating bank account:', error);
        throw error;
    }
};

// Delete bank account (soft delete)
export const deleteBankAccount = (id) => {
    try {
        const accounts = getAllBankAccounts();
        const index = accounts.findIndex(account => account.id === id);

        if (index === -1) {
            throw new Error('Bank account not found');
        }

        // Soft delete - set isActive to false
        accounts[index].isActive = false;
        accounts[index].deletedAt = new Date().toISOString();

        localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(accounts));
        return true;
    } catch (error) {
        console.error('Error deleting bank account:', error);
        throw error;
    }
};

// Update bank balance
export const updateBankBalance = (id, amount, operation = 'add') => {
    try {
        const account = getBankAccountById(id);

        if (!account) {
            throw new Error('Bank account not found');
        }

        const newBalance = operation === 'add'
            ? account.balance + amount
            : account.balance - amount;

        if (newBalance < 0) {
            throw new Error('Insufficient balance');
        }

        return updateBankAccount(id, { balance: newBalance });
    } catch (error) {
        console.error('Error updating bank balance:', error);
        throw error;
    }
};

// Validate bank transaction
export const validateBankTransaction = (accountId, amount) => {
    const account = getBankAccountById(accountId);

    if (!account) {
        return { valid: false, error: 'Bank account not found' };
    }

    if (!account.isActive) {
        return { valid: false, error: 'Bank account is inactive' };
    }

    if (account.balance < amount) {
        return {
            valid: false,
            error: `Insufficient balance in ${account.accountName}. Available: ₹${account.balance.toFixed(2)}`
        };
    }

    return { valid: true };
};

// Get total balance across all bank accounts
export const getTotalBankBalance = () => {
    const accounts = getActiveBankAccounts();
    return accounts.reduce((total, account) => total + account.balance, 0);
};
