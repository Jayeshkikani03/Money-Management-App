import React, { createContext, useContext, useState, useEffect } from 'react';
import personService from '../services/personService';
import noteTransactionService from '../services/noteTransactionService';
import storageService from '../services/storageService';

const NotesContext = createContext();

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within NotesProvider');
    }
    return context;
};

export const NotesProvider = ({ children }) => {
    const [persons, setPersons] = useState([]);
    const [transactions, setTransactions] = useState([]); // All active notes transactions
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial Load
    useEffect(() => {
        const loadNotesData = async () => {
            try {
                setLoading(true);
                // Ensure DB is init (main app likely did it, but safe to check)
                await storageService.init();

                const [loadedPersons, loadedTransactions] = await Promise.all([
                    personService.getAllPersons(),
                    noteTransactionService.getAllTransactions()
                ]);

                setPersons(loadedPersons || []);
                setTransactions(loadedTransactions || []);
            } catch (err) {
                console.error('Failed to load notes data:', err);
                setError('Failed to load notes data');
            } finally {
                setLoading(false);
            }
        };

        loadNotesData();
    }, []);

    // Operations
    const addPerson = async (data) => {
        try {
            const newPerson = await personService.addPerson(data);
            setPersons(prev => [...prev, newPerson]);
            return newPerson;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deletePerson = async (id) => {
        try {
            await personService.deletePerson(id);
            setPersons(prev => prev.filter(p => p.id !== id));
            // Also logically should handle transactions cleanup, but keeping simple for now
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const addTransaction = async (data) => {
        try {
            const newTx = await noteTransactionService.addTransaction(data);
            setTransactions(prev => [...prev, newTx]);
            return newTx;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const getPersonBalance = (personId) => {
        const personTxs = transactions.filter(t => t.personId === personId && !t.isSettled);
        return personTxs.reduce((acc, t) => {
            // GIVE = +ve (Receive back), TAKE = -ve (Pay back)
            return acc + (t.type === 'GIVE' ? t.amount : -t.amount);
        }, 0);
    };

    const value = {
        persons,
        transactions,
        loading,
        error,
        addPerson,
        deletePerson,
        addTransaction,
        getPersonBalance
    };

    return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
