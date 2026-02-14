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
    CASH_ACCOUNT: 'cashAccount'
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

// Charge/Fee Types
export const CHARGE_TYPES = {
    LATE_FEE: 'late_fee',
    INTEREST: 'interest',
    PROCESSING_FEE: 'processing_fee',
    LOW_BALANCE: 'low_balance',
    ANNUAL_FEE: 'annual_fee',
    CUSTOM: 'custom'
};

// Charge Type Labels
export const CHARGE_TYPE_LABELS = {
    [CHARGE_TYPES.LATE_FEE]: 'Late Fee',
    [CHARGE_TYPES.INTEREST]: 'Interest Charge',
    [CHARGE_TYPES.PROCESSING_FEE]: 'Processing Fee',
    [CHARGE_TYPES.LOW_BALANCE]: 'Low Balance Charge',
    [CHARGE_TYPES.ANNUAL_FEE]: 'Annual Fee',
    [CHARGE_TYPES.CUSTOM]: 'Custom Charge'
};

// Recurring Frequencies
export const RECURRING_FREQUENCIES = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    BI_WEEKLY: 'bi_weekly',
    MONTHLY: 'monthly',
    BI_MONTHLY: 'bi_monthly',
    QUARTERLY: 'quarterly',
    SEMI_ANNUAL: 'semi_annual',
    YEARLY: 'yearly'
};

// Recurring Frequency Labels
export const RECURRING_FREQUENCY_LABELS = {
    [RECURRING_FREQUENCIES.DAILY]: 'Daily',
    [RECURRING_FREQUENCIES.WEEKLY]: 'Weekly',
    [RECURRING_FREQUENCIES.BI_WEEKLY]: 'Every 2 Weeks',
    [RECURRING_FREQUENCIES.MONTHLY]: 'Monthly',
    [RECURRING_FREQUENCIES.BI_MONTHLY]: 'Every 2 Months',
    [RECURRING_FREQUENCIES.QUARTERLY]: 'Every 3 Months',
    [RECURRING_FREQUENCIES.SEMI_ANNUAL]: 'Every 6 Months',
    [RECURRING_FREQUENCIES.YEARLY]: 'Yearly'
};

// Installment Types
export const INSTALLMENT_TYPES = {
    SIP: 'SIP',
    STOCK: 'Stock',
    MUTUAL_FUND: 'MF',
    EMI: 'EMI',
    LOAN: 'Loan',
    CUSTOM: 'Custom'
};

// Installment Type Labels
export const INSTALLMENT_TYPE_LABELS = {
    [INSTALLMENT_TYPES.SIP]: 'SIP (Systematic Investment Plan)',
    [INSTALLMENT_TYPES.STOCK]: 'Stock Investment',
    [INSTALLMENT_TYPES.MUTUAL_FUND]: 'Mutual Fund',
    [INSTALLMENT_TYPES.EMI]: 'EMI (Equated Monthly Installment)',
    [INSTALLMENT_TYPES.LOAN]: 'Loan Payment',
    [INSTALLMENT_TYPES.CUSTOM]: 'Custom Installment'
};

