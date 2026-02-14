import recurringEngine from '../services/recurringEngine';

/**
 * Recurring Transaction Management Functions
 * For editing, deleting, and pausing recurring transactions
 */

/**
 * Update a recurring transaction
 */
export const updateRecurring = (id, updates) => {
    const recurring = recurringEngine.getRecurringById(id);
    if (!recurring) {
        throw new Error('Recurring transaction not found');
    }

    const updated = {
        ...recurring,
        ...updates,
        updatedAt: new Date().toISOString()
    };

    recurringEngine.updateRecurring(id, updated);
    return updated;
};

/**
 * Delete a recurring transaction
 */
export const deleteRecurring = (id) => {
    return recurringEngine.deleteRecurring(id);
};

/**
 * Pause a recurring transaction
 */
export const pauseRecurring = (id) => {
    return updateRecurring(id, { isPaused: true });
};

/**
 * Resume a paused recurring transaction
 */
export const resumeRecurring = (id) => {
    return updateRecurring(id, { isPaused: false });
};

/**
 * Skip next occurrence of a recurring transaction
 */
export const skipNextRecurring = (id) => {
    const recurring = recurringEngine.getRecurringById(id);
    if (!recurring) {
        throw new Error('Recurring transaction not found');
    }

    // Calculate next execution date after skipping
    const nextDate = recurringEngine.calculateNextDate(
        recurring.nextExecutionDate,
        recurring.frequency,
        recurring.interval
    );

    return updateRecurring(id, { nextExecutionDate: nextDate });
};

export default {
    updateRecurring,
    deleteRecurring,
    pauseRecurring,
    resumeRecurring,
    skipNextRecurring
};
