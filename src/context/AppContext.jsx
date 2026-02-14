import React, { createContext, useContext, useState, useEffect } from 'react';
import storageService from '../services/storageService';
import analyticsService from '../services/analyticsService';
import { createTransaction } from '../models/transactionModel';
import { createCategory } from '../models/categoryModel';
import * as accountService from '../services/accountService';
import * as cardService from '../services/cardService';
import * as cashService from '../services/cashService';
import transferService from '../services/transferService';
import recurringEngine from '../services/recurringEngine';
import installmentEngine from '../services/installmentEngine';
import billingEngine from '../services/billingEngine';
import autoExecutionService from '../services/autoExecutionService';
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
    const [cashAccount, setCashAccount] = useState(null);
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

                // Load bank accounts, credit cards, and cash account
                const loadedBankAccounts = accountService.getAllBankAccounts();
                const loadedCreditCards = cardService.getAllCreditCards();
                const loadedCashAccount = cashService.getCashAccount();

                setTransactions(loadedTransactions || []);
                setCategories(loadedCategories || []);
                setSettings(loadedSettings || { currency: 'INR', theme: 'light' });
                setGoals(loadedGoals || []);
                setBankAccounts(loadedBankAccounts || []);
                setCreditCards(loadedCreditCards || []);
                setCashAccount(loadedCashAccount);

                // Run auto-execution after data is loaded
                // This will execute due recurring transactions, installments, and generate billing statements
                const context = {
                    addTransaction: (data) => {
                        const transaction = createTransaction(data);
                        storageService.addTransaction(transaction);
                        setTransactions(prev => [...prev, transaction]);
                        return transaction;
                    },
                    creditCards: loadedCreditCards || []
                };

                await autoExecutionService.runAutoExecution(context);

                // Setup midnight scheduler for future executions
                autoExecutionService.setupMidnightScheduler(context);
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

            // Capture before balances
            const beforeBalances = transferService.captureBalances(transferData);

            // Execute transfer using transfer service
            const result = await transferService.executeTransfer(transferData);

            // Create transaction record with ledger tracking
            const transaction = createTransaction({
                amount: amount,
                type: TRANSACTION_TYPES.TRANSFER,
                category: 'Transfer',
                date: new Date(transferData.date).toISOString(),
                notes: transferData.notes,
                fromAccountType: transferData.fromType,
                fromAccountId: transferData.fromId,
                toAccountType: transferData.toType,
                toAccountId: transferData.toId,
                beforeBalance: beforeBalances.from,
                afterBalance: result.afterBalances.from
            });

            await storageService.addTransaction(transaction);
            setTransactions(prev => [...prev, transaction]);

            // Refresh all account states
            setBankAccounts(accountService.getAllBankAccounts());
            setCreditCards(cardService.getAllCreditCards());
            setCashAccount(cashService.getCashAccount());

            return transaction;
        } catch (err) {
            console.error('Failed to process transfer:', err);
            throw err;
        }
    };

    const updateTransfer = async (id, updatedData) => {
        try {
            // 1. Find original transaction
            const originalTransaction = transactions.find(t => t.id === id);
            if (!originalTransaction) throw new Error('Transfer not found');

            // 2. Revert original transfer
            await transferService.revertTransfer({
                fromType: originalTransaction.fromAccountType,
                fromId: originalTransaction.fromAccountId,
                toType: originalTransaction.toAccountType,
                toId: originalTransaction.toAccountId,
                amount: originalTransaction.amount
            });

            // 3. Execute new transfer
            const beforeBalances = transferService.captureBalances(updatedData);
            const result = await transferService.executeTransfer(updatedData);

            // 4. Update transaction record
            const updatedTransaction = {
                ...originalTransaction,
                amount: parseFloat(updatedData.amount),
                date: new Date(updatedData.date).toISOString(),
                notes: updatedData.notes,
                fromAccountType: updatedData.fromType,
                fromAccountId: updatedData.fromId,
                toAccountType: updatedData.toType,
                toAccountId: updatedData.toId,
                beforeBalance: beforeBalances.from,
                afterBalance: result.afterBalances.from,
                updatedAt: new Date().toISOString()
            };

            await storageService.updateTransaction(updatedTransaction);
            setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));

            // Refresh all account states
            setBankAccounts(accountService.getAllBankAccounts());
            setCreditCards(cardService.getAllCreditCards());
            setCashAccount(cashService.getCashAccount());

            return updatedTransaction;
        } catch (err) {
            console.error('Failed to update transfer:', err);
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
        cashAccount,
        loading,
        error,

        // Transaction operations
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addTransfer,
        updateTransfer,

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

        // Cash Account operations
        updateCashBalance: (amount, operation) => {
            cashService.updateCashBalance(amount, operation);
            setCashAccount(cashService.getCashAccount());
        },
        setCashBalance: (balance) => {
            cashService.setCashBalance(balance);
            setCashAccount(cashService.getCashAccount());
        },

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
