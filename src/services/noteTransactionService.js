import storageService from './storageService';
import { createNoteTransaction, createSettlement, NOTE_TRANSACTION_TYPES } from '../models/noteTransactionModel';

const noteTransactionService = {
    /**
     * Get all note transactions
     * @returns {Promise<Array>}
     */
    getAllTransactions: async () => {
        try {
            return await storageService.loadNoteTransactions();
        } catch (error) {
            console.error('Failed to load note transactions:', error);
            throw error;
        }
    },

    /**
     * Get transactions for a specific person
     * @param {String} personId 
     * @returns {Promise<Array>}
     */
    getTransactionsByPerson: async (personId) => {
        try {
            const all = await storageService.loadNoteTransactions();
            return all.filter(t => t.personId === personId);
        } catch (error) {
            console.error('Failed to load person transactions:', error);
            throw error;
        }
    },

    /**
     * Add a new transaction (Borrow/Lend)
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    addTransaction: async (data) => {
        try {
            const transaction = createNoteTransaction(data);
            await storageService.saveNoteTransaction(transaction);
            return transaction;
        } catch (error) {
            console.error('Failed to add note transaction:', error);
            throw error;
        }
    },

    /**
     * Update a transaction
     * @param {Object} transaction 
     */
    updateTransaction: async (transaction) => {
        try {
            await storageService.saveNoteTransaction(transaction);
            return transaction;
        } catch (error) {
            console.error('Failed to update note transaction:', error);
            throw error;
        }
    },

    /**
     * Calculate Net Balance for a person
     * @param {String} personId 
     * @param {Array} transactions (Optional optimization)
     * @returns {Number} Positive = You get back, Negative = You owe
     */
    calculateNetBalance: async (personId, transactions = null) => {
        const txs = transactions || await noteTransactionService.getTransactionsByPerson(personId);

        return txs.reduce((acc, t) => {
            // isSettled logic is ignored in favor of simple running balance for now, 
            // as Settlements generate counter-transactions.
            // But if we ever used isSettled to hide transactions, we would check it here.

            // GIVE = +ve (Receive back), TAKE = -ve (Pay back)
            return acc + (t.type === NOTE_TRANSACTION_TYPES.GIVE ? t.amount : -t.amount);
        }, 0);
    },

    /**
     * Record a settlement
     * Creates both a counter-transaction (to zero out balance) and a settlement record (audit)
     */
    recordSettlement: async (settlementData) => {
        try {
            // 1. Create the Settlement Audit Record
            const settlement = createSettlement(settlementData);
            await storageService.saveSettlement(settlement);

            // 2. Create the Counter Transaction
            // If we received money (PAYMENT_RECEIVED), we TAKEO (money comes to us)
            // If we paid money (PAYMENT_MADE), we GIVE (money leaves us)
            // Wait, earlier logic: 
            // GIVE = +ve (I lent). To settle, I must TAKE (Get back).
            // TAKE = -ve (I borrowed). To settle, I must GIVE (Pay back).

            let noteTxType;
            if (settlementData.type === 'PAYMENT_RECEIVED') {
                // I received money. This reduces a GIVE balance.
                // So I "TOOK" money back?
                // Ledger: +500 (GIVE). I receive 500. 
                // If I record TAKE 500. Balance = 500 - 500 = 0. Correct.
                noteTxType = NOTE_TRANSACTION_TYPES.TAKE;
            } else {
                // PAYMENT_MADE (I paid). This reduces a TAKE balance (Debt).
                // Ledger: -500 (TAKE). I pay 500.
                // If I record GIVE 500. Balance = -500 + 500 = 0. Correct.
                noteTxType = NOTE_TRANSACTION_TYPES.GIVE;
            }

            const noteTx = createNoteTransaction({
                personId: settlementData.personId,
                type: noteTxType,
                amount: settlementData.amount,
                date: settlementData.date,
                description: `Settlement: ${settlementData.notes || 'Cleared dues'}`,
                category: 'Settlement',
                isSettled: true // It is itself a settlement
            });

            await storageService.saveNoteTransaction(noteTx);

            return { settlement, noteTransaction: noteTx };
        } catch (error) {
            console.error('Failed to record settlement:', error);
            throw error;
        }
    }
};

export default noteTransactionService;
