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

        // Transfer fields
        toAccountType: data.toAccountType || null,
        toAccountId: data.toAccountId || null,
        fromAccountType: data.fromAccountType || null,
        fromAccountId: data.fromAccountId || null,

        // Ledger tracking
        beforeBalance: data.beforeBalance || null,
        afterBalance: data.afterBalance || null,

        // Recurring fields
        isRecurring: data.isRecurring || false,
        recurringParentId: data.recurringParentId || null,

        // Installment fields
        isInstallment: data.isInstallment || false,
        installmentParentId: data.installmentParentId || null,
        installmentNumber: data.installmentNumber || null,
        totalInstallments: data.totalInstallments || null,

        // Charge/Fee fields
        isCharge: data.isCharge || false,
        chargeType: data.chargeType || null,
        chargeDescription: data.chargeDescription || null,

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
