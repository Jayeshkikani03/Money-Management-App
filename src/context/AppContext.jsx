import React, { createContext, useContext, useState, useEffect } from 'react';
import storageService from '../services/storageService';
import analyticsService from '../services/analyticsService';
import { createTransaction } from '../models/transactionModel';
import { createCategory } from '../models/categoryModel';
import * as accountService from '../services/accountService';
import * as cardService from '../services/cardService';
import { ACCOUNT_TYPES, TRANSACTION_TYPES } from '../constants/accountTypes';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [settings, setSettings] = useState({ currency: 'INR', theme: 'light' });
    const [goals, setGoals] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [creditCards, setCreditCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize app data
    useEffect(() => {
        const initializeApp = async () => {
            try {
                setLoading(true);
                await storageService.init();

                const [loadedTransactions, loadedCategories, loadedSettings, loadedGoals] = await Promise.all([
                    storageService.loadTransactions(),
                    storageService.loadCategories(),
                    storageService.loadSettings(),
                    storageService.loadGoals()
                ]);

                // Load bank accounts and credit cards
                const loadedBankAccounts = accountService.getAllBankAccounts();
                const loadedCreditCards = cardService.getAllCreditCards();

                setTransactions(loadedTransactions || []);
                setCategories(loadedCategories || []);
                setSettings(loadedSettings || { currency: 'INR', theme: 'light' });
                setGoals(loadedGoals || []);
                setBankAccounts(loadedBankAccounts || []);
                setCreditCards(loadedCreditCards || []);
            } catch (err) {
                console.error('Failed to initialize app:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        initializeApp();
    }, []);

    // Apply theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

    // Transaction operations
    const addTransaction = async (transactionData) => {
        try {
            const transaction = createTransaction(transactionData);

            // Update account balances based on transaction type
            if (transaction.accountType === ACCOUNT_TYPES.BANK && transaction.accountId) {
                if (transaction.type === TRANSACTION_TYPES.EXPENSE) {
                    accountService.updateBankBalance(transaction.accountId, transaction.amount, 'subtract');
                } else if (transaction.type === TRANSACTION_TYPES.INCOME) {
                    accountService.updateBankBalance(transaction.accountId, transaction.amount, 'add');
                }
                setBankAccounts(accountService.getAllBankAccounts());
            } else if (transaction.accountType === ACCOUNT_TYPES.CREDIT && transaction.accountId) {
                if (transaction.type === TRANSACTION_TYPES.EXPENSE) {
                    cardService.updateCardUsedAmount(transaction.accountId, transaction.amount, 'add');
                }
                setCreditCards(cardService.getAllCreditCards());
            }

            await storageService.addTransaction(transaction);
            setTransactions(prev => [...prev, transaction]);
            return transaction;
        } catch (err) {
            console.error('Failed to add transaction:', err);
            throw err;
        }
    };

    const updateTransaction = async (transactionData) => {
        try {
            const transaction = createTransaction(transactionData);
            await storageService.updateTransaction(transaction);
            setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
            return transaction;
        } catch (err) {
            console.error('Failed to update transaction:', err);
            throw err;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await storageService.deleteTransaction(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Failed to delete transaction:', err);
            throw err;
        }
    };

    // Category operations
    const addCategory = async (categoryData) => {
        try {
            const category = createCategory(categoryData);
            await storageService.addCategory(category);
            setCategories(prev => [...prev, category]);
            return category;
        } catch (err) {
            console.error('Failed to add category:', err);
            throw err;
        }
    };

    const deleteCategory = async (id) => {
        try {
            // Check if category is in use
            const inUse = transactions.some(t => t.category === categories.find(c => c.id === id)?.name);
            if (inUse) {
                throw new Error('Cannot delete category that is in use');
            }

            await storageService.deleteCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error('Failed to delete category:', err);
            throw err;
        }
    };

    // Settings operations
    const updateSettings = async (newSettings) => {
        try {
            const updated = { ...settings, ...newSettings };
            await storageService.saveSettings(updated);
            setSettings(updated);
        } catch (err) {
            console.error('Failed to update settings:', err);
            throw err;
        }
    };

    // Goal operations
    const addGoal = async (goalData) => {
        try {
            const goal = {
                id: `goal-${Date.now()}`,
                ...goalData,
                createdAt: Date.now()
            };
            const updatedGoals = [...goals, goal];
            await storageService.saveGoals(updatedGoals);
            setGoals(updatedGoals);
            return goal;
        } catch (err) {
            console.error('Failed to add goal:', err);
            throw err;
        }
    };

    const deleteGoal = async (id) => {
        try {
            const updatedGoals = goals.filter(g => g.id !== id);
            await storageService.saveGoals(updatedGoals);
            setGoals(updatedGoals);
        } catch (err) {
            console.error('Failed to delete goal:', err);
            throw err;
        }
    };

    // Analytics
    const getBalance = () => analyticsService.calculateBalance(transactions);

    const getMonthlyTotals = (month, year) =>
        analyticsService.getMonthlyTotals(transactions, month, year);

    const getCategoryBreakdown = (type) =>
        analyticsService.getCategoryBreakdown(transactions, type);

    const getMonthlyTrends = (months) =>
        analyticsService.getMonthlyTrends(transactions, months);

    const getSpendingInsights = () =>
        analyticsService.getSpendingInsights(transactions);

    const detectSubscriptions = () =>
        analyticsService.detectSubscriptions(transactions);

    // Bank Account operations
    const addBankAccount = (accountData) => {
        try {
            const account = accountService.createBankAccount(accountData);
            setBankAccounts(accountService.getAllBankAccounts());
            return account;
        } catch (err) {
            console.error('Failed to add bank account:', err);
            throw err;
        }
    };

    const updateBankAccount = (id, updates) => {
        try {
            const account = accountService.updateBankAccount(id, updates);
            setBankAccounts(accountService.getAllBankAccounts());
            return account;
        } catch (err) {
            console.error('Failed to update bank account:', err);
            throw err;
        }
    };

    const deleteBankAccount = (id) => {
        try {
            accountService.deleteBankAccount(id);
            setBankAccounts(accountService.getAllBankAccounts());
        } catch (err) {
            console.error('Failed to delete bank account:', err);
            throw err;
        }
    };

    // Credit Card operations
    const addCreditCard = (cardData) => {
        try {
            const card = cardService.createCreditCard(cardData);
            setCreditCards(cardService.getAllCreditCards());
            return card;
        } catch (err) {
            console.error('Failed to add credit card:', err);
            throw err;
        }
    };

    const updateCreditCard = (id, updates) => {
        try {
            const card = cardService.updateCreditCard(id, updates);
            setCreditCards(cardService.getAllCreditCards());
            return card;
        } catch (err) {
            console.error('Failed to update credit card:', err);
            throw err;
        }
    };

    const deleteCreditCard = (id) => {
        try {
            cardService.deleteCreditCard(id);
            setCreditCards(cardService.getAllCreditCards());
        } catch (err) {
            console.error('Failed to delete credit card:', err);
            throw err;
        }
    };

    // Transfer operations
    const addTransfer = async (transferData) => {
        try {
            const amount = parseFloat(transferData.amount);

            // 1. Update Source Account
            if (transferData.fromType === ACCOUNT_TYPES.BANK && transferData.fromId) {
                accountService.updateBankBalance(transferData.fromId, amount, 'subtract');
                setBankAccounts(accountService.getAllBankAccounts());
            }

            // 2. Update Destination Account
            if (transferData.toType === ACCOUNT_TYPES.BANK && transferData.toId) {
                accountService.updateBankBalance(transferData.toId, amount, 'add');
                setBankAccounts(accountService.getAllBankAccounts());
            } else if (transferData.toType === ACCOUNT_TYPES.CREDIT && transferData.toId) {
                // Payment to credit card reduces used amount
                cardService.updateCardUsedAmount(transferData.toId, amount, 'subtract');
                setCreditCards(cardService.getAllCreditCards());
            }

            // 3. Create Transaction Record
            const transaction = createTransaction({
                amount: amount,
                type: TRANSACTION_TYPES.TRANSFER,
                category: 'Transfer',
                date: new Date(transferData.date).toISOString(),
                notes: transferData.notes,
                accountType: transferData.fromType,
                accountId: transferData.fromId,
                toAccountType: transferData.toType,
                toAccountId: transferData.toId
            });

            await storageService.addTransaction(transaction);
            setTransactions(prev => [...prev, transaction]);
            return transaction;
        } catch (err) {
            console.error('Failed to process transfer:', err);
            throw err;
        }
    };

    const value = {
        // State
        transactions,
        categories,
        settings,
        goals,
        bankAccounts,
        creditCards,
        loading,
        error,

        // Transaction operations
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addTransfer,

        // Category operations
        addCategory,
        deleteCategory,

        // Settings operations
        updateSettings,

        // Goal operations
        addGoal,
        deleteGoal,

        // Bank Account operations
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,

        // Credit Card operations
        addCreditCard,
        updateCreditCard,
        deleteCreditCard,

        // Analytics
        getBalance,
        getMonthlyTotals,
        getCategoryBreakdown,
        getMonthlyTrends,
        getSpendingInsights,
        detectSubscriptions
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
