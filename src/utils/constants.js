// Default categories for the application
export const DEFAULT_CATEGORIES = {
    income: [
        { id: 'salary', name: 'Salary', type: 'income' },
        { id: 'freelance', name: 'Freelance', type: 'income' },
        { id: 'investment', name: 'Investment', type: 'income' },
        { id: 'other-income', name: 'Other Income', type: 'income' }
    ],
    expense: [
        { id: 'food', name: 'Food', type: 'expense' },
        { id: 'travel', name: 'Travel', type: 'expense' },
        { id: 'bills', name: 'Bills', type: 'expense' },
        { id: 'shopping', name: 'Shopping', type: 'expense' },
        { id: 'entertainment', name: 'Entertainment', type: 'expense' },
        { id: 'health', name: 'Health', type: 'expense' },
        { id: 'education', name: 'Education', type: 'expense' },
        { id: 'other-expense', name: 'Other Expense', type: 'expense' }
    ]
};

// Storage keys for IndexedDB and LocalStorage
export const STORAGE_KEYS = {
    TRANSACTIONS: 'transactions',
    CATEGORIES: 'categories',
    SETTINGS: 'settings',
    GOALS: 'goals',
    BACKUP_META: 'backup_meta'
};

// Currency options
export const CURRENCIES = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
];

// Theme options
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

// Transaction types
export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense'
};

// Date formats
export const DATE_FORMATS = {
    DISPLAY: 'DD MMM YYYY',
    ISO: 'YYYY-MM-DD'
};

// IndexedDB configuration
export const DB_CONFIG = {
    NAME: 'MoneyManagementDB',
    VERSION: 2,
    STORES: {
        TRANSACTIONS: 'transactions',
        CATEGORIES: 'categories',
        SETTINGS: 'settings',
        GOALS: 'goals',
        // Notes Module Stores
        PERSONS: 'persons',
        NOTE_TRANSACTIONS: 'note_transactions',
        SETTLEMENTS: 'settlements'
    }
};

// Google Drive configuration
export const GOOGLE_DRIVE_CONFIG = {
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    SCOPES: 'https://www.googleapis.com/auth/drive.file',
    BACKUP_FOLDER_NAME: 'MoneyManagementBackups',
    BACKUP_FILE_NAME: 'money_management_backup.json'
};
