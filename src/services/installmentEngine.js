import { INSTALLMENT_TYPES } from '../constants/accountTypes';

/**
 * Installment Engine
 * Manages installment-based transactions (SIP, EMI, investments)
 */

const STORAGE_KEY = 'installmentTransactions';

/**
 * Get all installments
 */
export const getAllInstallments = () => {
    try {
        const installments = localStorage.getItem(STORAGE_KEY);
        return installments ? JSON.parse(installments) : [];
    } catch (error) {
        console.error('Error getting installments:', error);
        return [];
    }
};

/**
 * Get active installments
 */
export const getActiveInstallments = () => {
    return getAllInstallments().filter(i => i.isActive !== false && i.completedInstallments < i.totalInstallments);
};

/**
 * Create installment plan
 */
export const createInstallment = (data) => {
    const installments = getAllInstallments();

    const newInstallment = {
        id: `installment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        completedInstallments: 0,
        isActive: true,
        createdAt: new Date().toISOString()
    };

    installments.push(newInstallment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(installments));

    return newInstallment;
};

/**
 * Check for due installments
 */
export const checkDueInstallments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const installments = getActiveInstallments();
    const dueInstallments = [];

    for (const inst of installments) {
        const nextDate = new Date(inst.nextExecutionDate);
        nextDate.setHours(0, 0, 0, 0);

        // Check if due and not completed
        if (nextDate <= today && inst.completedInstallments < inst.totalInstallments) {
            dueInstallments.push(inst);
        }
    }

    return dueInstallments;
};

/**
 * Execute an installment
 */
export const executeInstallment = async (installmentId, addTransactionFn) => {
    const installment = getAllInstallments().find(i => i.id === installmentId);
    if (!installment) {
        throw new Error('Installment not found');
    }

    if (installment.completedInstallments >= installment.totalInstallments) {
        throw new Error('Installment plan already completed');
    }

    // Create transaction
    const transaction = {
        amount: installment.amount,
        type: installment.type,
        category: installment.category,
        date: new Date().toISOString(),
        notes: `${installment.linkedType} Installment ${installment.completedInstallments + 1}/${installment.totalInstallments}: ${installment.description}`,
        accountType: installment.accountType,
        accountId: installment.accountId,
        isInstallment: true,
        installmentParentId: installmentId,
        installmentNumber: installment.completedInstallments + 1,
        totalInstallments: installment.totalInstallments
    };

    // Execute transaction
    await addTransactionFn(transaction);

    // Update installment record
    const newCompletedCount = installment.completedInstallments + 1;
    const isCompleted = newCompletedCount >= installment.totalInstallments;

    const updates = {
        completedInstallments: newCompletedCount,
        lastExecutionDate: new Date().toISOString()
    };

    if (!isCompleted) {
        // Calculate next date (monthly by default)
        const nextDate = new Date(installment.nextExecutionDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        updates.nextExecutionDate = nextDate.toISOString();
    } else {
        // Mark as completed
        updates.isActive = false;
        updates.completedAt = new Date().toISOString();
    }

    updateInstallment(installmentId, updates);

    return transaction;
};

/**
 * Update installment
 */
export const updateInstallment = (id, updates) => {
    const installments = getAllInstallments();
    const index = installments.findIndex(i => i.id === id);

    if (index === -1) {
        throw new Error('Installment not found');
    }

    installments[index] = {
        ...installments[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(installments));
    return installments[index];
};

/**
 * Delete installment
 */
export const deleteInstallment = (id) => {
    const installments = getAllInstallments();
    const filtered = installments.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Get installment progress
 */
export const getInstallmentProgress = (installmentId) => {
    const installment = getAllInstallments().find(i => i.id === installmentId);
    if (!installment) return null;

    return {
        completed: installment.completedInstallments,
        total: installment.totalInstallments,
        percentage: (installment.completedInstallments / installment.totalInstallments) * 100,
        remaining: installment.totalInstallments - installment.completedInstallments,
        amountPaid: installment.completedInstallments * installment.amount,
        totalAmount: installment.totalInstallments * installment.amount
    };
};

/**
 * Get upcoming installments (next 30 days)
 */
export const getUpcomingInstallments = (days = 30) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const installments = getActiveInstallments();
    return installments.filter(i => {
        const nextDate = new Date(i.nextExecutionDate);
        return nextDate >= today && nextDate <= futureDate;
    }).sort((a, b) => new Date(a.nextExecutionDate) - new Date(b.nextExecutionDate));
};

export default {
    getAllInstallments,
    getActiveInstallments,
    createInstallment,
    checkDueInstallments,
    executeInstallment,
    updateInstallment,
    deleteInstallment,
    getInstallmentProgress,
    getUpcomingInstallments
};
