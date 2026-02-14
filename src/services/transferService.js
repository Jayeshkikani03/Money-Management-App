import { ACCOUNT_TYPES, TRANSACTION_TYPES } from '../constants/accountTypes';
import * as accountService from './accountService';
import * as cardService from './cardService';
import validationService from './validationService';

/**
 * Transfer Service
 * Handles all account-to-account transfer operations with proper ledger tracking
 */

/**
 * Capture current balances before transfer
 */
export const captureBalances = (transferData) => {
    const balances = {
        from: null,
        to: null
    };

    // Capture source balance
    if (transferData.fromType === ACCOUNT_TYPES.CASH) {
        const cash = getCashAccount();
        balances.from = cash.balance;
    } else if (transferData.fromType === ACCOUNT_TYPES.BANK) {
        const account = accountService.getBankAccountById(transferData.fromId);
        balances.from = account?.balance || 0;
    }

    // Capture destination balance
    if (transferData.toType === ACCOUNT_TYPES.CASH) {
        const cash = getCashAccount();
        balances.to = cash.balance;
    } else if (transferData.toType === ACCOUNT_TYPES.BANK) {
        const account = accountService.getBankAccountById(transferData.toId);
        balances.to = account?.balance || 0;
    } else if (transferData.toType === ACCOUNT_TYPES.CREDIT) {
        const card = cardService.getCreditCardById(transferData.toId);
        balances.to = card?.usedAmount || 0;
    }

    return balances;
};

/**
 * Execute transfer operation
 */
export const executeTransfer = async (transferData) => {
    const amount = parseFloat(transferData.amount);

    // Validate transfer
    const validation = validationService.validateTransferPair(
        transferData.fromType,
        transferData.fromId,
        transferData.toType,
        transferData.toId,
        amount
    );

    if (!validation.valid) {
        throw new Error(validation.error);
    }

    // Capture before balances
    const beforeBalances = captureBalances(transferData);

    try {
        // Update source account
        await updateSourceAccount(transferData.fromType, transferData.fromId, amount);

        // Update destination account
        await updateDestinationAccount(transferData.toType, transferData.toId, amount);

        // Capture after balances
        const afterBalances = captureBalances(transferData);

        return {
            success: true,
            beforeBalances,
            afterBalances
        };
    } catch (error) {
        // Rollback if possible
        console.error('Transfer failed:', error);
        throw error;
    }
};

/**
 * Update source account (deduct amount)
 */
const updateSourceAccount = async (accountType, accountId, amount) => {
    if (accountType === ACCOUNT_TYPES.CASH) {
        updateCashBalance(amount, 'subtract');
    } else if (accountType === ACCOUNT_TYPES.BANK) {
        accountService.updateBankBalance(accountId, amount, 'subtract');
    }
    // Credit cards cannot be source for regular transfers
};

/**
 * Update destination account (add amount)
 */
const updateDestinationAccount = async (accountType, accountId, amount) => {
    if (accountType === ACCOUNT_TYPES.CASH) {
        updateCashBalance(amount, 'add');
    } else if (accountType === ACCOUNT_TYPES.BANK) {
        accountService.updateBankBalance(accountId, amount, 'add');
    } else if (accountType === ACCOUNT_TYPES.CREDIT) {
        // Payment to credit card reduces used amount
        cardService.updateCardUsedAmount(accountId, amount, 'subtract');
    }
};

/**
 * ATM Withdrawal: Bank → Cash
 */
export const atmWithdrawal = async (bankAccountId, amount, metadata = {}) => {
    return executeTransfer({
        fromType: ACCOUNT_TYPES.BANK,
        fromId: bankAccountId,
        toType: ACCOUNT_TYPES.CASH,
        toId: null,
        amount,
        ...metadata
    });
};

/**
 * Cash Deposit: Cash → Bank
 */
export const cashDeposit = async (bankAccountId, amount, metadata = {}) => {
    return executeTransfer({
        fromType: ACCOUNT_TYPES.CASH,
        fromId: null,
        toType: ACCOUNT_TYPES.BANK,
        toId: bankAccountId,
        amount,
        ...metadata
    });
};

/**
 * Bill Payment: Bank → Credit Card
 */
export const billPayment = async (bankAccountId, creditCardId, amount, metadata = {}) => {
    return executeTransfer({
        fromType: ACCOUNT_TYPES.BANK,
        fromId: bankAccountId,
        toType: ACCOUNT_TYPES.CREDIT,
        toId: creditCardId,
        amount,
        ...metadata
    });
};

/**
 * Cash Advance: Credit Card → Cash
 * Note: This increases card usedAmount and adds to cash
 */
export const cashAdvance = async (creditCardId, amount, metadata = {}) => {
    const card = cardService.getCreditCardById(creditCardId);
    if (!card) {
        throw new Error('Credit card not found');
    }

    // Check credit limit
    const validation = validationService.validateCreditLimit(creditCardId, amount);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    // Increase card used amount
    cardService.updateCardUsedAmount(creditCardId, amount, 'add');

    // Add to cash
    updateCashBalance(amount, 'add');

    return {
        success: true,
        type: 'cash_advance',
        cardId: creditCardId,
        amount
    };
};

/**
 * Bank to Bank Transfer
 */
export const bankToBankTransfer = async (fromBankId, toBankId, amount, metadata = {}) => {
    return executeTransfer({
        fromType: ACCOUNT_TYPES.BANK,
        fromId: fromBankId,
        toType: ACCOUNT_TYPES.BANK,
        toId: toBankId,
        amount,
        ...metadata
    });
};

/**
 * Get cash account
 */
const getCashAccount = () => {
    const cash = localStorage.getItem('cashAccount');
    return cash ? JSON.parse(cash) : { id: 'cash_main', balance: 0, type: 'cash' };
};

/**
 * Update cash balance
 */
const updateCashBalance = (amount, operation) => {
    const cash = getCashAccount();
    const newBalance = operation === 'add' ? cash.balance + amount : cash.balance - amount;

    if (newBalance < 0) {
        throw new Error('Insufficient cash balance');
    }

    localStorage.setItem('cashAccount', JSON.stringify({
        ...cash,
        balance: newBalance,
        updatedAt: new Date().toISOString()
    }));

    return newBalance;
};

export default {
    executeTransfer,
    captureBalances,
    atmWithdrawal,
    cashDeposit,
    billPayment,
    cashAdvance,
    bankToBankTransfer
};
