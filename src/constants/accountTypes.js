// Account Types
export const ACCOUNT_TYPES = {
    CASH: 'cash',
    BANK: 'bank',
    CREDIT: 'credit'
};

// Transaction Types
export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
    TRANSFER: 'transfer'
};

// Bank Account Types
export const BANK_ACCOUNT_TYPES = {
    SAVINGS: 'savings',
    CURRENT: 'current'
};

// Storage Keys
export const STORAGE_KEYS = {
    TRANSACTIONS: 'transactions',
    BANK_ACCOUNTS: 'bankAccounts',
    CREDIT_CARDS: 'creditCards',
    CASH_BALANCE: 'cashBalance'
};

// Account Type Labels
export const ACCOUNT_TYPE_LABELS = {
    [ACCOUNT_TYPES.CASH]: 'Cash',
    [ACCOUNT_TYPES.BANK]: 'Bank Account',
    [ACCOUNT_TYPES.CREDIT]: 'Credit Card'
};

// Account Type Icons
export const ACCOUNT_TYPE_ICONS = {
    [ACCOUNT_TYPES.CASH]: '💵',
    [ACCOUNT_TYPES.BANK]: '🏦',
    [ACCOUNT_TYPES.CREDIT]: '💳'
};

// Account Type Colors
export const ACCOUNT_TYPE_COLORS = {
    [ACCOUNT_TYPES.CASH]: '#10b981', // green
    [ACCOUNT_TYPES.BANK]: '#3b82f6', // blue
    [ACCOUNT_TYPES.CREDIT]: '#f97316' // orange
};
