/**
 * Testing Utilities
 * For development and testing of auto-execution features
 */

import autoExecutionService from './autoExecutionService';

/**
 * Simulate future date by manipulating the last execution check
 * This allows testing of recurring/installment execution
 */
export const simulateFutureDate = (days) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() - days);
    const futureDateString = futureDate.toISOString().split('T')[0];

    // Set last execution to past date to trigger execution
    localStorage.setItem('lastAutoExecutionCheck', futureDateString);

    console.log(`✅ Simulated ${days} days into the future`);
    console.log(`Last execution set to: ${futureDateString}`);
    console.log('Reload app to trigger auto-execution');

    return futureDateString;
};

/**
 * Simulate billing cycle
 * Adjusts credit card billing dates to trigger statement generation
 */
export const simulateBillingCycle = (cardId) => {
    const cardsData = localStorage.getItem('creditCards');
    const cards = cardsData ? JSON.parse(cardsData) : [];
    const card = cards.find(c => c.id === cardId);

    if (!card) {
        console.error('Card not found');
        return null;
    }

    // Set billing date to today
    const today = new Date().getDate();
    card.billingDate = today;

    // Update card
    const updatedCards = cards.map(c => c.id === cardId ? card : c);
    localStorage.setItem('creditCards', JSON.stringify(updatedCards));

    console.log(`✅ Set billing date for ${card.cardName} to today (${today})`);
    console.log('Reload app to trigger billing statement generation');

    return card;
};

/**
 * Simulate recurring execution
 * Sets next execution date to today for a recurring transaction
 */
export const simulateRecurringExecution = (recurringId) => {
    const recurringData = localStorage.getItem('recurringTransactions');
    const recurring = recurringData ? JSON.parse(recurringData) : [];
    const item = recurring.find(r => r.id === recurringId);

    if (!item) {
        console.error('Recurring transaction not found');
        return null;
    }

    // Set next execution to today
    const today = new Date().toISOString().split('T')[0];
    item.nextExecutionDate = today;

    // Update recurring
    const updated = recurring.map(r => r.id === recurringId ? item : r);
    localStorage.setItem('recurringTransactions', JSON.stringify(updated));

    console.log(`✅ Set next execution for "${item.description}" to today`);
    console.log('Reload app to trigger execution');

    return item;
};

/**
 * Reset auto-execution state
 * Clears last execution check to force re-execution
 */
export const resetAutoExecution = () => {
    localStorage.removeItem('lastAutoExecutionCheck');
    console.log('✅ Reset auto-execution state');
    console.log('Next app load will trigger auto-execution');
};

/**
 * Get execution history
 * Returns log of all auto-executions
 */
export const getExecutionHistory = () => {
    const historyData = localStorage.getItem('executionHistory');
    const history = historyData ? JSON.parse(historyData) : [];
    console.table(history);
    return history;
};

/**
 * Clear execution history
 */
export const clearExecutionHistory = () => {
    localStorage.setItem('executionHistory', JSON.stringify([]));
    console.log('✅ Cleared execution history');
};

/**
 * Test auto-execution manually
 * Forces execution without waiting for midnight or app reload
 */
export const testAutoExecution = async (context) => {
    console.log('🧪 Testing auto-execution...');
    const result = await autoExecutionService.forceExecution(context);
    console.log('Result:', result);
    return result;
};

// Export all utilities
export default {
    simulateFutureDate,
    simulateBillingCycle,
    simulateRecurringExecution,
    resetAutoExecution,
    getExecutionHistory,
    clearExecutionHistory,
    testAutoExecution
};

// Make available in browser console for development
if (typeof window !== 'undefined') {
    window.testUtils = {
        simulateFutureDate,
        simulateBillingCycle,
        simulateRecurringExecution,
        resetAutoExecution,
        getExecutionHistory,
        clearExecutionHistory,
        testAutoExecution
    };
    console.log('✅ Test utilities available at window.testUtils');
}
