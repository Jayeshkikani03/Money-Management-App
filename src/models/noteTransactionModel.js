import { generateId } from '../utils/helpers';

/**
 * Note Transaction Types
 */
export const NOTE_TRANSACTION_TYPES = {
    GIVE: 'GIVE', // You lent money / You paid for them
    TAKE: 'TAKE'  // You borrowed money / They paid for you
};

/**
 * Create a new Note Transaction entity
 * @param {Object} data 
 * @returns {Object}
 */
export const createNoteTransaction = (data) => {
    return {
        id: data.id || generateId(),
        personId: data.personId,
        type: data.type, // GIVE or TAKE
        amount: parseFloat(data.amount),
        date: data.date || new Date().toISOString(),
        description: data.description || '',
        category: data.category || 'General',

        // Settlement Status
        isSettled: data.isSettled || false,
        settlementDate: data.settlementDate || null,

        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
    };
};

/**
 * Validate note transaction
 * @param {Object} transaction 
 * @returns {Boolean}
 */
export const isValidNoteTransaction = (transaction) => {
    return (
        transaction &&
        transaction.personId &&
        [NOTE_TRANSACTION_TYPES.GIVE, NOTE_TRANSACTION_TYPES.TAKE].includes(transaction.type) &&
        !isNaN(transaction.amount) &&
        transaction.amount > 0
    );
};

/**
 * Create a Settlement entity (Audit Log)
 * @param {Object} data 
 * @returns {Object}
 */
export const createSettlement = (data) => {
    return {
        id: data.id || generateId(),
        personId: data.personId,
        amount: parseFloat(data.amount),
        type: data.type, // 'PAYMENT_RECEIVED' or 'PAYMENT_MADE'
        date: data.date || new Date().toISOString(),
        noteTransactionIds: data.noteTransactionIds || [],
        mode: data.mode || 'CASH',
        notes: data.notes || '',
        createdAt: new Date().toISOString()
    };
};
