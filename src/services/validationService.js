import { ACCOUNT_TYPES, TRANSACTION_TYPES } from '../constants/accountTypes';
import * as accountService from './accountService';
import * as cardService from './cardService';

/**
 * Validation Service
 * Centralized validation for all financial operations
 */

/**
 * Validate if account has sufficient balance
 */
export const validateAccountBalance = (accountType, accountId, amount) => {
    if (accountType === ACCOUNT_TYPES.CASH) {
        const cash = getCashAccount();
        if (cash.balance < amount) {
            return {
                valid: false,
                error: `Insufficient cash balance. Available: ₹${cash.balance.toFixed(2)}`
            };
        }
        return { valid: true };
    }

    if (accountType === ACCOUNT_TYPES.BANK) {
        return accountService.validateBankTransaction(accountId, amount);
    }

    return { valid: true };
};

/**
 * Validate credit card transaction
 */
export const validateCreditLimit = (cardId, amount) => {
    return cardService.validateCardTransaction(cardId, amount);
};

/**
 * Validate transfer pair compatibility
 */
export const validateTransferPair = (fromType, fromId, toType, toId, amount) => {
    // Cannot transfer to same account
    if (fromType === toType && fromId === toId && fromType !== ACCOUNT_TYPES.CASH) {
        return { valid: false, error: 'Source and destination cannot be the same' };
    }

    // Cannot transfer cash to cash
    if (fromType === ACCOUNT_TYPES.CASH && toType === ACCOUNT_TYPES.CASH) {
        return { valid: false, error: 'Cannot transfer from Cash to Cash' };
    }

    // Credit card cannot be source (except for cash advance which is handled separately)
    if (fromType === ACCOUNT_TYPES.CREDIT) {
        return { valid: false, error: 'Credit card cannot be used as transfer source. Use cash advance instead.' };
    }

    // Validate amount
    if (!amount || amount <= 0) {
        return { valid: false, error: 'Amount must be greater than 0' };
    }

    // Validate source account has sufficient balance
    const balanceCheck = validateAccountBalance(fromType, fromId, amount);
    if (!balanceCheck.valid) {
        return balanceCheck;
    }

    // Validate destination credit limit if applicable
    if (toType === ACCOUNT_TYPES.CREDIT) {
        const card = cardService.getCreditCardById(toId);
        if (!card) {
            return { valid: false, error: 'Credit card not found' };
        }
        // For bill payment, we're reducing usedAmount, so no limit check needed
    }

    return { valid: true };
};

/**
 * Check if account can be deleted
 */
export const canDeleteAccount = (accountType, accountId) => {
    if (accountType === ACCOUNT_TYPES.BANK) {
        const account = accountService.getBankAccountById(accountId);
        if (!account) {
            return { canDelete: false, error: 'Account not found' };
        }
        if (account.balance > 0) {
            return {
                canDelete: false,
                error: `Cannot delete account with balance ₹${account.balance.toFixed(2)}. Please transfer funds first.`
            };
        }
        return { canDelete: true };
    }

    if (accountType === ACCOUNT_TYPES.CREDIT) {
        const card = cardService.getCreditCardById(accountId);
        if (!card) {
            return { canDelete: false, error: 'Card not found' };
        }
        if (card.usedAmount > 0) {
            return {
                canDelete: false,
                error: `Cannot delete card with outstanding balance ₹${card.usedAmount.toFixed(2)}. Please clear dues first.`
            };
        }
        return { canDelete: true };
    }

    return { canDelete: true };
};

/**
 * Validate recurring transaction setup
 */
export const validateRecurringSetup = (data) => {
    if (!data.frequency) {
        return { valid: false, error: 'Frequency is required' };
    }

    if (!data.nextExecutionDate) {
        return { valid: false, error: 'Next execution date is required' };
    }

    if (data.endDate && new Date(data.endDate) <= new Date(data.nextExecutionDate)) {
        return { valid: false, error: 'End date must be after next execution date' };
    }

    return { valid: true };
};

/**
 * Validate installment setup
 */
export const validateInstallmentSetup = (data) => {
    if (!data.totalInstallments || data.totalInstallments < 1) {
        return { valid: false, error: 'Total installments must be at least 1' };
    }

    if (!data.amount || data.amount <= 0) {
        return { valid: false, error: 'Amount must be greater than 0' };
    }

    if (!data.nextExecutionDate) {
        return { valid: false, error: 'Start date is required' };
    }

    return { valid: true };
};

/**
 * Get cash account (helper function)
 */
const getCashAccount = () => {
    const cash = localStorage.getItem('cashAccount');
    return cash ? JSON.parse(cash) : { id: 'cash_main', balance: 0, type: 'cash' };
};

export default {
    validateAccountBalance,
    validateCreditLimit,
    validateTransferPair,
    canDeleteAccount,
    validateRecurringSetup,
    validateInstallmentSetup
};
