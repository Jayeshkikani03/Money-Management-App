import recurringEngine from './recurringEngine';
import installmentEngine from './installmentEngine';
import billingEngine from './billingEngine';

/**
 * Auto-Execution Service
 * Handles automatic execution of recurring transactions, installments, and billing cycles
 */

const LAST_CHECK_KEY = 'lastAutoExecutionCheck';

/**
 * Check if we need to run auto-execution
 * Runs on app load and checks if it's a new day
 */
export const shouldRunAutoExecution = () => {
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if (!lastCheck || lastCheck !== today) {
        return true;
    }

    return false;
};

/**
 * Execute all due recurring transactions
 */
const executeRecurringTransactions = async (addTransaction) => {
    const dueRecurring = recurringEngine.checkDueRecurring();
    const executed = [];

    for (const recurring of dueRecurring) {
        try {
            const result = await recurringEngine.executeRecurring(recurring.id, addTransaction);
            if (result.success) {
                executed.push({
                    type: 'recurring',
                    id: recurring.id,
                    description: recurring.description,
                    amount: recurring.amount
                });
            }
        } catch (error) {
            console.error(`Failed to execute recurring ${recurring.id}:`, error);
        }
    }

    return executed;
};

/**
 * Execute all due installments
 */
const executeInstallments = async (addTransaction) => {
    const dueInstallments = installmentEngine.checkDueInstallments();
    const executed = [];

    for (const installment of dueInstallments) {
        try {
            const result = await installmentEngine.executeInstallment(installment.id, addTransaction);
            if (result.success) {
                executed.push({
                    type: 'installment',
                    id: installment.id,
                    description: installment.description,
                    amount: installment.amount,
                    progress: `${result.completedInstallments}/${installment.totalInstallments}`
                });
            }
        } catch (error) {
            console.error(`Failed to execute installment ${installment.id}:`, error);
        }
    }

    return executed;
};

/**
 * Generate billing statements for due credit cards
 */
const generateBillingStatements = async (creditCards) => {
    const statements = billingEngine.checkBillingDates(creditCards);
    const generated = [];

    for (const statement of statements) {
        generated.push({
            type: 'billing',
            cardId: statement.cardId,
            cardName: statement.cardName,
            amount: statement.statementAmount,
            dueDate: statement.dueDate
        });
    }

    return generated;
};

/**
 * Main auto-execution function
 * Call this on app load
 */
export const runAutoExecution = async (context) => {
    if (!shouldRunAutoExecution()) {
        return {
            skipped: true,
            reason: 'Already executed today'
        };
    }

    const results = {
        recurring: [],
        installments: [],
        billing: [],
        timestamp: new Date().toISOString()
    };

    try {
        // Execute recurring transactions
        results.recurring = await executeRecurringTransactions(context.addTransaction);

        // Execute installments
        results.installments = await executeInstallments(context.addTransaction);

        // Generate billing statements
        results.billing = await generateBillingStatements(context.creditCards);

        // Update last check timestamp
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(LAST_CHECK_KEY, today);

        // Log summary
        console.log('Auto-Execution Summary:', {
            recurring: results.recurring.length,
            installments: results.installments.length,
            billing: results.billing.length
        });

        return {
            success: true,
            results
        };
    } catch (error) {
        console.error('Auto-execution failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Setup midnight scheduler
 * This uses setTimeout to schedule execution at midnight
 */
export const setupMidnightScheduler = (context) => {
    const scheduleMidnightExecution = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const timeUntilMidnight = tomorrow - now;

        setTimeout(() => {
            runAutoExecution(context);
            scheduleMidnightExecution(); // Schedule next midnight
        }, timeUntilMidnight);
    };

    scheduleMidnightExecution();
};

/**
 * Get summary of upcoming scheduled items
 */
export const getUpcomingSummary = (days = 7) => {
    const upcoming = {
        recurring: recurringEngine.getUpcomingRecurring(days),
        installments: installmentEngine.getUpcomingInstallments(days),
        bills: billingEngine.getUpcomingBills(days)
    };

    return upcoming;
};

/**
 * Force manual execution (for testing or manual trigger)
 */
export const forceExecution = async (context) => {
    // Clear last check to force execution
    localStorage.removeItem(LAST_CHECK_KEY);
    return await runAutoExecution(context);
};

export default {
    shouldRunAutoExecution,
    runAutoExecution,
    setupMidnightScheduler,
    getUpcomingSummary,
    forceExecution
};
