import * as cardService from './cardService';

/**
 * Billing Engine
 * Handles credit card billing cycles and statement generation
 */

const STORAGE_KEY = 'billingStatements';

/**
 * Get all billing statements
 */
export const getAllStatements = () => {
    try {
        const statements = localStorage.getItem(STORAGE_KEY);
        return statements ? JSON.parse(statements) : [];
    } catch (error) {
        console.error('Error getting billing statements:', error);
        return [];
    }
};

/**
 * Check for billing dates
 */
export const checkBillingDates = () => {
    const today = new Date();
    const currentDay = today.getDate();

    const cards = cardService.getActiveCreditCards();
    const dueForBilling = [];

    for (const card of cards) {
        if (card.billingDate === currentDay) {
            dueForBilling.push(card);
        }
    }

    return dueForBilling;
};

/**
 * Generate billing statement
 */
export const generateStatement = (cardId) => {
    const card = cardService.getCreditCardById(cardId);
    if (!card) {
        throw new Error('Credit card not found');
    }

    const today = new Date();
    const dueDate = new Date(today);

    // Calculate due date based on card's due date setting
    const daysDiff = card.dueDate - card.billingDate;
    if (daysDiff > 0) {
        dueDate.setDate(today.getDate() + daysDiff);
    } else {
        dueDate.setMonth(today.getMonth() + 1);
        dueDate.setDate(card.dueDate);
    }

    const statement = {
        id: `statement_${cardId}_${Date.now()}`,
        cardId: card.id,
        cardName: card.cardName,
        statementDate: today.toISOString(),
        dueDate: dueDate.toISOString(),
        statementAmount: card.usedAmount,
        minimumDue: calculateMinimumDue(card.usedAmount),
        paidAmount: 0,
        isPaid: false,
        isOverdue: false,
        createdAt: new Date().toISOString()
    };

    // Save statement
    const statements = getAllStatements();
    statements.push(statement);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statements));

    // Update card with statement info
    cardService.updateCreditCard(cardId, {
        currentStatementAmount: statement.statementAmount,
        statementDate: statement.statementDate,
        lastBillingDate: today.toISOString()
    });

    return statement;
};

/**
 * Calculate minimum due (typically 5% of statement amount)
 */
const calculateMinimumDue = (statementAmount) => {
    return Math.max(statementAmount * 0.05, 100); // Minimum ₹100 or 5% of statement
};

/**
 * Calculate due amount for a card
 */
export const calculateDueAmount = (cardId) => {
    const card = cardService.getCreditCardById(cardId);
    if (!card) return 0;

    // Get latest unpaid statement
    const statements = getAllStatements()
        .filter(s => s.cardId === cardId && !s.isPaid)
        .sort((a, b) => new Date(b.statementDate) - new Date(a.statementDate));

    if (statements.length === 0) {
        return card.usedAmount; // No statement yet, return current used amount
    }

    return statements[0].statementAmount - statements[0].paidAmount;
};

/**
 * Handle partial payment
 */
export const handlePartialPayment = (cardId, paymentAmount) => {
    const card = cardService.getCreditCardById(cardId);
    if (!card) {
        throw new Error('Credit card not found');
    }

    // Get latest unpaid statement
    const statements = getAllStatements();
    const statementIndex = statements.findIndex(s => s.cardId === cardId && !s.isPaid);

    if (statementIndex !== -1) {
        const statement = statements[statementIndex];
        statement.paidAmount += paymentAmount;

        if (statement.paidAmount >= statement.statementAmount) {
            statement.isPaid = true;
            statement.paidDate = new Date().toISOString();
        }

        statements[statementIndex] = statement;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(statements));
    }

    // Update card used amount (payment reduces it)
    cardService.updateCardUsedAmount(cardId, paymentAmount, 'subtract');

    return {
        success: true,
        remainingDue: calculateDueAmount(cardId)
    };
};

/**
 * Check for overdue bills
 */
export const checkOverdueBills = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const statements = getAllStatements().filter(s => !s.isPaid);
    const overdue = [];

    for (const statement of statements) {
        const dueDate = new Date(statement.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate < today) {
            statement.isOverdue = true;
            overdue.push(statement);
        }
    }

    // Update overdue status
    if (overdue.length > 0) {
        const allStatements = getAllStatements();
        overdue.forEach(overdueStmt => {
            const index = allStatements.findIndex(s => s.id === overdueStmt.id);
            if (index !== -1) {
                allStatements[index].isOverdue = true;
            }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allStatements));
    }

    return overdue;
};

/**
 * Get upcoming bills (next 7 days)
 */
export const getUpcomingBills = (days = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const statements = getAllStatements()
        .filter(s => !s.isPaid)
        .filter(s => {
            const dueDate = new Date(s.dueDate);
            return dueDate >= today && dueDate <= futureDate;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return statements;
};

/**
 * Calculate interest (future enhancement)
 */
export const calculateInterest = (cardId, daysOverdue) => {
    // Placeholder for future interest calculation
    // Typically: (Principal × Annual Rate × Days) / 365
    return 0;
};

export default {
    getAllStatements,
    checkBillingDates,
    generateStatement,
    calculateDueAmount,
    handlePartialPayment,
    checkOverdueBills,
    getUpcomingBills,
    calculateInterest
};
