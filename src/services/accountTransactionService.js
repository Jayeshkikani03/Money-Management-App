import { safeNumber } from '../utils/numberUtils';

import { ACCOUNT_TYPES, TRANSACTION_TYPES } from '../constants/accountTypes';
import { getBankAccountById } from './accountService';
import { getCreditCardById } from './cardService';

/**
 * Account Transaction Service
 * Handles account-specific transaction filtering and operations
 */

// Get transactions by account
export const getTransactionsByAccount = (transactions, accountType, accountId = null) => {
    return transactions.filter(transaction => {
        const isTransfer = transaction.type === TRANSACTION_TYPES.TRANSFER;

        // Check if account is the primary (source) account
        const isSource = (() => {
            if (isTransfer) {
                // For transfers, use fromAccountType/fromAccountId
                if (accountType === ACCOUNT_TYPES.CASH) {
                    return transaction.fromAccountType === ACCOUNT_TYPES.CASH;
                }
                return transaction.fromAccountType === accountType && transaction.fromAccountId === accountId;
            }

            // For Income/Expense
            if (accountType === ACCOUNT_TYPES.CASH) {
                return transaction.accountType === ACCOUNT_TYPES.CASH || !transaction.accountType;
            }
            return transaction.accountType === accountType && transaction.accountId === accountId;
        })();

        // Check if account is the destination account (for transfers)
        const isDestination =
            isTransfer &&
            transaction.toAccountType === accountType &&
            transaction.toAccountId === accountId;

        return isSource || isDestination;
    });
};

// Get account totals (income, expense, balance)
export const getAccountTotals = (transactions, accountType, accountId = null) => {
    const accountTransactions = getTransactionsByAccount(transactions, accountType, accountId);

    let totalIncome = 0;
    let totalExpense = 0;

    accountTransactions.forEach(transaction => {
        const amount = safeNumber(transaction.amount);
        const isTransfer = transaction.type === TRANSACTION_TYPES.TRANSFER;

        const isSource = (() => {
            if (isTransfer) {
                if (accountType === ACCOUNT_TYPES.CASH) {
                    return transaction.fromAccountType === ACCOUNT_TYPES.CASH;
                }
                return transaction.fromAccountType === accountType && transaction.fromAccountId === accountId;
            }

            if (accountType === ACCOUNT_TYPES.CASH) {
                return transaction.accountType === ACCOUNT_TYPES.CASH || !transaction.accountType;
            }
            return transaction.accountType === accountType && transaction.accountId === accountId;
        })();

        if (transaction.type === TRANSACTION_TYPES.INCOME) {
            totalIncome += amount;
        } else if (transaction.type === TRANSACTION_TYPES.EXPENSE) {
            totalExpense += amount;
        } else if (transaction.type === TRANSACTION_TYPES.TRANSFER) {
            if (isSource) {
                // Money leaving this account
                totalExpense += amount;
            } else {
                // Money entering this account
                totalIncome += amount;
            }
        }
    });

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactionCount: accountTransactions.length
    };
};




// Get account display name
export const getAccountDisplayName = (accountType, accountId) => {
    if (accountType === ACCOUNT_TYPES.CASH) {
        return 'Cash';
    }

    if (accountType === ACCOUNT_TYPES.BANK) {
        const account = getBankAccountById(accountId);
        return account ? account.accountName : 'Unknown Bank Account';
    }

    if (accountType === ACCOUNT_TYPES.CREDIT) {
        const card = getCreditCardById(accountId);
        return card ? card.cardName : 'Unknown Credit Card';
    }

    return 'Unknown Account';
};

// Get account details for display
export const getAccountDetails = (accountType, accountId) => {
    if (accountType === ACCOUNT_TYPES.CASH) {
        return {
            name: 'Cash',
            type: ACCOUNT_TYPES.CASH,
            icon: '💵',
            color: '#10b981'
        };
    }

    if (accountType === ACCOUNT_TYPES.BANK) {
        const account = getBankAccountById(accountId);
        if (!account) return null;

        return {
            name: account.accountName,
            bankName: account.bankName,
            type: ACCOUNT_TYPES.BANK,
            balance: account.balance,
            accountType: account.accountType,
            icon: '🏦',
            color: '#3b82f6'
        };
    }

    if (accountType === ACCOUNT_TYPES.CREDIT) {
        const card = getCreditCardById(accountId);
        if (!card) return null;

        return {
            name: card.cardName,
            cardNumber: card.cardNumberMasked,
            type: ACCOUNT_TYPES.CREDIT,
            usedAmount: card.usedAmount,
            creditLimit: card.creditLimit,
            remainingCredit: card.creditLimit - card.usedAmount,
            icon: '💳',
            color: '#f97316'
        };
    }

    return null;
};

// Filter transactions by date range and account
export const getAccountTransactionsByDateRange = (
    transactions,
    accountType,
    accountId,
    startDate,
    endDate
) => {
    const accountTransactions = getTransactionsByAccount(transactions, accountType, accountId);

    return accountTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return transactionDate >= start && transactionDate <= end;
    });
};

// Get monthly totals for account
export const getAccountMonthlyTotals = (transactions, accountType, accountId, month, year) => {
    const accountTransactions = getTransactionsByAccount(transactions, accountType, accountId);

    const monthlyTransactions = accountTransactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === month - 1 && date.getFullYear() === year;
    });

    return getAccountTotals(monthlyTransactions, accountType, accountId);
};

// Check if account has transactions
export const accountHasTransactions = (transactions, accountType, accountId) => {
    const accountTransactions = getTransactionsByAccount(transactions, accountType, accountId);
    return accountTransactions.length > 0;
};
