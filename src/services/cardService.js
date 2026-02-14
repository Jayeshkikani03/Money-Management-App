import { STORAGE_KEYS } from '../constants/accountTypes';

/**
 * Credit Card Service
 * Handles CRUD operations for credit cards
 */

// Generate unique ID
const generateId = () => {
    return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Mask card number (show last 4 digits)
export const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    const lastFour = cardNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
};

// Get all credit cards
export const getAllCreditCards = () => {
    try {
        const cards = localStorage.getItem(STORAGE_KEYS.CREDIT_CARDS);
        return cards ? JSON.parse(cards) : [];
    } catch (error) {
        console.error('Error getting credit cards:', error);
        return [];
    }
};

// Get active credit cards only
export const getActiveCreditCards = () => {
    return getAllCreditCards().filter(card => card.isActive !== false);
};

// Get credit card by ID
export const getCreditCardById = (id) => {
    const cards = getAllCreditCards();
    return cards.find(card => card.id === id);
};

// Create new credit card
export const createCreditCard = (cardData) => {
    try {
        const cards = getAllCreditCards();

        const newCard = {
            id: generateId(),
            cardName: cardData.cardName,
            cardNumberMasked: maskCardNumber(cardData.cardNumber),
            creditLimit: parseFloat(cardData.creditLimit) || 0,
            usedAmount: parseFloat(cardData.usedAmount) || 0,
            billingDate: parseInt(cardData.billingDate) || 1,
            dueDate: parseInt(cardData.dueDate) || 15,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        cards.push(newCard);
        localStorage.setItem(STORAGE_KEYS.CREDIT_CARDS, JSON.stringify(cards));

        return newCard;
    } catch (error) {
        console.error('Error creating credit card:', error);
        throw error;
    }
};

// Update credit card
export const updateCreditCard = (id, updates) => {
    try {
        const cards = getAllCreditCards();
        const index = cards.findIndex(card => card.id === id);

        if (index === -1) {
            throw new Error('Credit card not found');
        }

        cards[index] = {
            ...cards[index],
            ...updates,
            id, // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.CREDIT_CARDS, JSON.stringify(cards));
        return cards[index];
    } catch (error) {
        console.error('Error updating credit card:', error);
        throw error;
    }
};

// Delete credit card (soft delete)
export const deleteCreditCard = (id) => {
    try {
        const cards = getAllCreditCards();
        const index = cards.findIndex(card => card.id === id);

        if (index === -1) {
            throw new Error('Credit card not found');
        }

        // Soft delete - set isActive to false
        cards[index].isActive = false;
        cards[index].deletedAt = new Date().toISOString();

        localStorage.setItem(STORAGE_KEYS.CREDIT_CARDS, JSON.stringify(cards));
        return true;
    } catch (error) {
        console.error('Error deleting credit card:', error);
        throw error;
    }
};

// Update card used amount
export const updateCardUsedAmount = (id, amount, operation = 'add') => {
    try {
        const card = getCreditCardById(id);

        if (!card) {
            throw new Error('Credit card not found');
        }

        const newUsedAmount = operation === 'add'
            ? card.usedAmount + amount
            : card.usedAmount - amount;

        if (newUsedAmount < 0) {
            throw new Error('Used amount cannot be negative');
        }

        if (newUsedAmount > card.creditLimit) {
            throw new Error('Credit limit exceeded');
        }

        return updateCreditCard(id, { usedAmount: newUsedAmount });
    } catch (error) {
        console.error('Error updating card used amount:', error);
        throw error;
    }
};

// Validate card transaction
export const validateCardTransaction = (cardId, amount) => {
    const card = getCreditCardById(cardId);

    if (!card) {
        return { valid: false, error: 'Credit card not found' };
    }

    if (!card.isActive) {
        return { valid: false, error: 'Credit card is inactive' };
    }

    const remainingCredit = card.creditLimit - card.usedAmount;

    if (remainingCredit < amount) {
        return {
            valid: false,
            error: `Credit limit exceeded. Available: ₹${remainingCredit.toFixed(2)}`
        };
    }

    return { valid: true };
};

// Get remaining credit
export const getRemainingCredit = (cardId) => {
    const card = getCreditCardById(cardId);

    if (!card) {
        return 0;
    }

    return card.creditLimit - card.usedAmount;
};

// Get total used amount across all cards
export const getTotalCardUsedAmount = () => {
    const cards = getActiveCreditCards();
    return cards.reduce((total, card) => total + card.usedAmount, 0);
};

// Get total credit limit across all cards
export const getTotalCreditLimit = () => {
    const cards = getActiveCreditCards();
    return cards.reduce((total, card) => total + card.creditLimit, 0);
};
