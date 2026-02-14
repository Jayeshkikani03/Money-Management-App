import { openDB } from 'idb';
import { DB_CONFIG, STORAGE_KEYS, DEFAULT_CATEGORIES } from '../utils/constants';

/**
 * Initialize IndexedDB database
 */
const initDB = async () => {
    try {
        const db = await openDB(DB_CONFIG.NAME, DB_CONFIG.VERSION, {
            upgrade(db) {
                // Create object stores if they don't exist
                if (!db.objectStoreNames.contains(DB_CONFIG.STORES.TRANSACTIONS)) {
                    db.createObjectStore(DB_CONFIG.STORES.TRANSACTIONS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(DB_CONFIG.STORES.CATEGORIES)) {
                    db.createObjectStore(DB_CONFIG.STORES.CATEGORIES, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(DB_CONFIG.STORES.SETTINGS)) {
                    db.createObjectStore(DB_CONFIG.STORES.SETTINGS);
                }
                if (!db.objectStoreNames.contains(DB_CONFIG.STORES.GOALS)) {
                    db.createObjectStore(DB_CONFIG.STORES.GOALS, { keyPath: 'id' });
                }

                // Notes Module Stores
                if (!db.objectStoreNames.contains(DB_CONFIG.STORES.PERSONS)) {
                    db.createObjectStore(DB_CONFIG.STORES.PERSONS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(DB_CONFIG.STORES.NOTE_TRANSACTIONS)) {
                    const store = db.createObjectStore(DB_CONFIG.STORES.NOTE_TRANSACTIONS, { keyPath: 'id' });
                    store.createIndex('personId', 'personId', { unique: false });
                }
                if (!db.objectStoreNames.contains(DB_CONFIG.STORES.SETTLEMENTS)) {
                    const store = db.createObjectStore(DB_CONFIG.STORES.SETTLEMENTS, { keyPath: 'id' });
                    store.createIndex('personId', 'personId', { unique: false });
                }
            }
        });
        return db;
    } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
        return null;
    }
};

/**
 * Fallback to LocalStorage if IndexedDB fails
 */
const useLocalStorage = () => {
    return {
        async get(storeName) {
            try {
                const data = localStorage.getItem(storeName);
                return data ? JSON.parse(data) : [];
            } catch (error) {
                console.error('LocalStorage get error:', error);
                return [];
            }
        },
        async set(storeName, data) {
            try {
                localStorage.setItem(storeName, JSON.stringify(data));
            } catch (error) {
                console.error('LocalStorage set error:', error);
            }
        },
        async clear(storeName) {
            try {
                localStorage.removeItem(storeName);
            } catch (error) {
                console.error('LocalStorage clear error:', error);
            }
        }
    };
};

// Storage service
const storageService = {
    db: null,
    useIDB: true,

    /**
     * Initialize storage
     */
    async init() {
        this.db = await initDB();
        this.useIDB = this.db !== null;

        if (!this.useIDB) {
            console.warn('Using LocalStorage fallback');
        }

        // Initialize default categories if not exists
        const categories = await this.loadCategories();
        if (categories.length === 0) {
            await this.saveCategories([
                ...DEFAULT_CATEGORIES.income,
                ...DEFAULT_CATEGORIES.expense
            ]);
        }

        // Initialize default settings if not exists
        const settings = await this.loadSettings();
        if (!settings || Object.keys(settings).length === 0) {
            await this.saveSettings({
                currency: 'INR',
                theme: 'light'
            });
        }
    },

    /**
     * Save transactions
     */
    async saveTransactions(transactions) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.TRANSACTIONS, 'readwrite');
            const store = tx.objectStore(DB_CONFIG.STORES.TRANSACTIONS);

            // Clear existing and add new
            await store.clear();
            for (const transaction of transactions) {
                await store.put(transaction);
            }
            await tx.done;
        } else {
            const storage = useLocalStorage();
            await storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);
        }
    },

    /**
     * Load all transactions
     */
    async loadTransactions() {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.TRANSACTIONS, 'readonly');
            const store = tx.objectStore(DB_CONFIG.STORES.TRANSACTIONS);
            return await store.getAll();
        } else {
            const storage = useLocalStorage();
            return await storage.get(STORAGE_KEYS.TRANSACTIONS);
        }
    },

    /**
     * Add a single transaction
     */
    async addTransaction(transaction) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.TRANSACTIONS, 'readwrite');
            await tx.objectStore(DB_CONFIG.STORES.TRANSACTIONS).put(transaction);
            await tx.done;
        } else {
            const transactions = await this.loadTransactions();
            transactions.push(transaction);
            const storage = useLocalStorage();
            await storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);
        }
    },

    /**
     * Update a transaction
     */
    async updateTransaction(transaction) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.TRANSACTIONS, 'readwrite');
            await tx.objectStore(DB_CONFIG.STORES.TRANSACTIONS).put(transaction);
            await tx.done;
        } else {
            const transactions = await this.loadTransactions();
            const index = transactions.findIndex(t => t.id === transaction.id);
            if (index !== -1) {
                transactions[index] = transaction;
                const storage = useLocalStorage();
                await storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);
            }
        }
    },

    /**
     * Delete a transaction
     */
    async deleteTransaction(id) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.TRANSACTIONS, 'readwrite');
            await tx.objectStore(DB_CONFIG.STORES.TRANSACTIONS).delete(id);
            await tx.done;
        } else {
            const transactions = await this.loadTransactions();
            const filtered = transactions.filter(t => t.id !== id);
            const storage = useLocalStorage();
            await storage.set(STORAGE_KEYS.TRANSACTIONS, filtered);
        }
    },

    /**
     * Save categories
     */
    async saveCategories(categories) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.CATEGORIES, 'readwrite');
            const store = tx.objectStore(DB_CONFIG.STORES.CATEGORIES);

            await store.clear();
            for (const category of categories) {
                await store.put(category);
            }
            await tx.done;
        } else {
            const storage = useLocalStorage();
            await storage.set(STORAGE_KEYS.CATEGORIES, categories);
        }
    },

    /**
     * Load categories
     */
    async loadCategories() {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.CATEGORIES, 'readonly');
            return await tx.objectStore(DB_CONFIG.STORES.CATEGORIES).getAll();
        } else {
            const storage = useLocalStorage();
            return await storage.get(STORAGE_KEYS.CATEGORIES);
        }
    },

    /**
     * Add a category
     */
    async addCategory(category) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.CATEGORIES, 'readwrite');
            await tx.objectStore(DB_CONFIG.STORES.CATEGORIES).put(category);
            await tx.done;
        } else {
            const categories = await this.loadCategories();
            categories.push(category);
            const storage = useLocalStorage();
            await storage.set(STORAGE_KEYS.CATEGORIES, categories);
        }
    },

    /**
     * Delete a category
     */
    async deleteCategory(id) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.CATEGORIES, 'readwrite');
            await tx.objectStore(DB_CONFIG.STORES.CATEGORIES).delete(id);
            await tx.done;
        } else {
            const categories = await this.loadCategories();
            const filtered = categories.filter(c => c.id !== id);
            const storage = useLocalStorage();
            await storage.set(STORAGE_KEYS.CATEGORIES, filtered);
        }
    },

    /**
     * Save settings
     */
    async saveSettings(settings) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.SETTINGS, 'readwrite');
            await tx.objectStore(DB_CONFIG.STORES.SETTINGS).put(settings, 'app-settings');
            await tx.done;
        } else {
            const storage = useLocalStorage();
            await storage.set(STORAGE_KEYS.SETTINGS, settings);
        }
    },

    /**
     * Load settings
     */
    async loadSettings() {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.SETTINGS, 'readonly');
            const settings = await tx.objectStore(DB_CONFIG.STORES.SETTINGS).get('app-settings');
            return settings || {};
        } else {
            const storage = useLocalStorage();
            const settings = await storage.get(STORAGE_KEYS.SETTINGS);
            return Array.isArray(settings) ? {} : settings;
        }
    },

    /**
     * Save goals
     */
    async saveGoals(goals) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.GOALS, 'readwrite');
            const store = tx.objectStore(DB_CONFIG.STORES.GOALS);

            await store.clear();
            for (const goal of goals) {
                await store.put(goal);
            }
            await tx.done;
        } else {
            const storage = useLocalStorage();
            await storage.set(STORAGE_KEYS.GOALS, goals);
        }
    },

    /**
     * Load goals
     */
    async loadGoals() {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.GOALS, 'readonly');
            return await tx.objectStore(DB_CONFIG.STORES.GOALS).getAll();
        } else {
            const storage = useLocalStorage();
            return await storage.get(STORAGE_KEYS.GOALS);
        }
    },

    // --- Notes Module Methods ---

    /**
     * Load all persons
     */
    async loadPersons() {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.PERSONS, 'readonly');
            return await tx.objectStore(DB_CONFIG.STORES.PERSONS).getAll();
        } else {
            const storage = useLocalStorage();
            return await storage.get('persons');
        }
    },

    /**
     * Add or update a person
     */
    async savePerson(person) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.PERSONS, 'readwrite');
            await tx.objectStore(DB_CONFIG.STORES.PERSONS).put(person);
            await tx.done;
        } else {
            const persons = await this.loadPersons();
            const index = persons.findIndex(p => p.id === person.id);
            if (index !== -1) {
                persons[index] = person;
            } else {
                persons.push(person);
            }
            const storage = useLocalStorage();
            await storage.set('persons', persons);
        }
    },

    /**
     * Delete a person
     */
    async deletePerson(id) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.PERSONS, 'readwrite');
            await tx.objectStore(DB_CONFIG.STORES.PERSONS).delete(id);
            await tx.done;
        } else {
            const persons = await this.loadPersons();
            const filtered = persons.filter(p => p.id !== id);
            const storage = useLocalStorage();
            await storage.set('persons', filtered);
        }
    },

    /**
     * Load note transactions
     */
    async loadNoteTransactions() {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.NOTE_TRANSACTIONS, 'readonly');
            return await tx.objectStore(DB_CONFIG.STORES.NOTE_TRANSACTIONS).getAll();
        } else {
            const storage = useLocalStorage();
            return await storage.get('note_transactions');
        }
    },

    /**
     * Add or update a note transaction
     */
    async saveNoteTransaction(transaction) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.NOTE_TRANSACTIONS, 'readwrite');
            await tx.objectStore(DB_CONFIG.STORES.NOTE_TRANSACTIONS).put(transaction);
            await tx.done;
        } else {
            const transactions = await this.loadNoteTransactions();
            const index = transactions.findIndex(t => t.id === transaction.id);
            if (index !== -1) {
                transactions[index] = transaction;
            } else {
                transactions.push(transaction);
            }
            const storage = useLocalStorage();
            await storage.set('note_transactions', transactions);
        }
    },

    /**
     * Load settlements
     */
    async loadSettlements() {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.SETTLEMENTS, 'readonly');
            return await tx.objectStore(DB_CONFIG.STORES.SETTLEMENTS).getAll();
        } else {
            const storage = useLocalStorage();
            return await storage.get('settlements');
        }
    },

    /**
     * Save a settlement
     */
    async saveSettlement(settlement) {
        if (this.useIDB && this.db) {
            const tx = this.db.transaction(DB_CONFIG.STORES.SETTLEMENTS, 'readwrite');
            await tx.objectStore(DB_CONFIG.STORES.SETTLEMENTS).put(settlement);
            await tx.done;
        } else {
            const settlements = await this.loadSettlements();
            settlements.push(settlement);
            const storage = useLocalStorage();
            await storage.set('settlements', settlements);
        }
    },

    /**
     * Export all data as JSON
     */
    async exportData() {
        const transactions = await this.loadTransactions();
        const categories = await this.loadCategories();
        const settings = await this.loadSettings();
        const goals = await this.loadGoals();

        // Notes Data
        const persons = await this.loadPersons();
        const noteTransactions = await this.loadNoteTransactions();
        const settlements = await this.loadSettlements();

        return {
            transactions,
            categories,
            settings,
            goals,
            persons,
            noteTransactions,
            settlements,
            exportDate: new Date().toISOString(),
            version: '2.0' // Incremented version
        };
    },

    /**
     * Import data from JSON
     */
    async importData(data) {
        if (data.transactions) await this.saveTransactions(data.transactions);
        if (data.categories) await this.saveCategories(data.categories);
        if (data.settings) await this.saveSettings(data.settings);
        if (data.goals) await this.saveGoals(data.goals);

        // Import Notes Data
        if (data.persons) {
            if (this.useIDB && this.db) {
                const tx = this.db.transaction(DB_CONFIG.STORES.PERSONS, 'readwrite');
                const store = tx.objectStore(DB_CONFIG.STORES.PERSONS);
                await store.clear();
                for (const p of data.persons) await store.put(p);
                await tx.done;
            } else {
                const storage = useLocalStorage();
                await storage.set('persons', data.persons);
            }
        }

        if (data.noteTransactions) {
            if (this.useIDB && this.db) {
                const tx = this.db.transaction(DB_CONFIG.STORES.NOTE_TRANSACTIONS, 'readwrite');
                const store = tx.objectStore(DB_CONFIG.STORES.NOTE_TRANSACTIONS);
                await store.clear();
                for (const t of data.noteTransactions) await store.put(t);
                await tx.done;
            } else {
                const storage = useLocalStorage();
                await storage.set('note_transactions', data.noteTransactions);
            }
        }

        if (data.settlements) {
            if (this.useIDB && this.db) {
                const tx = this.db.transaction(DB_CONFIG.STORES.SETTLEMENTS, 'readwrite');
                const store = tx.objectStore(DB_CONFIG.STORES.SETTLEMENTS);
                await store.clear();
                for (const s of data.settlements) await store.put(s);
                await tx.done;
            } else {
                const storage = useLocalStorage();
                await storage.set('settlements', data.settlements);
            }
        }
    },

    /**
     * Clear all data
     */
    async clearAllData() {
        if (this.useIDB && this.db) {
            const stores = [
                DB_CONFIG.STORES.TRANSACTIONS,
                DB_CONFIG.STORES.CATEGORIES,
                DB_CONFIG.STORES.SETTINGS,
                DB_CONFIG.STORES.GOALS,
                DB_CONFIG.STORES.PERSONS,
                DB_CONFIG.STORES.NOTE_TRANSACTIONS,
                DB_CONFIG.STORES.SETTLEMENTS
            ];

            for (const storeName of stores) {
                // Check if store exists before clearing (safe guard for older DBs)
                if (this.db.objectStoreNames.contains(storeName)) {
                    const tx = this.db.transaction(storeName, 'readwrite');
                    await tx.objectStore(storeName).clear();
                    await tx.done;
                }
            }
        } else {
            const storage = useLocalStorage();
            await storage.clear(STORAGE_KEYS.TRANSACTIONS);
            await storage.clear(STORAGE_KEYS.CATEGORIES);
            await storage.clear(STORAGE_KEYS.SETTINGS);
            await storage.clear(STORAGE_KEYS.GOALS);
            await storage.clear('persons');
            await storage.clear('note_transactions');
            await storage.clear('settlements');
        }

        // Reinitialize defaults
        await this.init();
    }
};

export default storageService;
