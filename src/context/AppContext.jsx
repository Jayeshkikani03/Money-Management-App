import React, { createContext, useContext, useState, useEffect } from 'react';
import storageService from '../services/storageService';
import analyticsService from '../services/analyticsService';
import { createTransaction } from '../models/transactionModel';
import { createCategory } from '../models/categoryModel';

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

                setTransactions(loadedTransactions || []);
                setCategories(loadedCategories || []);
                setSettings(loadedSettings || { currency: 'INR', theme: 'light' });
                setGoals(loadedGoals || []);
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

    const value = {
        // State
        transactions,
        categories,
        settings,
        goals,
        loading,
        error,

        // Transaction operations
        addTransaction,
        updateTransaction,
        deleteTransaction,

        // Category operations
        addCategory,
        deleteCategory,

        // Settings operations
        updateSettings,

        // Goal operations
        addGoal,
        deleteGoal,

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
