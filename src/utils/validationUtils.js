/**
 * Validation Utilities
 * Field validation helpers for forms
 */

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'Field') => {
    if (value === null || value === undefined || value === '') {
        return `${fieldName} is required`;
    }
    return null;
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    if (!email) return 'Email is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Invalid email format';
    }

    return null;
};

/**
 * Validate number
 */
export const validateNumber = (value, fieldName = 'Value', options = {}) => {
    const { min, max, required = true } = options;

    if (required && (value === null || value === undefined || value === '')) {
        return `${fieldName} is required`;
    }

    const num = parseFloat(value);

    if (isNaN(num)) {
        return `${fieldName} must be a valid number`;
    }

    if (min !== undefined && num < min) {
        return `${fieldName} must be at least ${min}`;
    }

    if (max !== undefined && num > max) {
        return `${fieldName} must be at most ${max}`;
    }

    return null;
};

/**
 * Validate positive number
 */
export const validatePositive = (value, fieldName = 'Amount') => {
    const error = validateNumber(value, fieldName);
    if (error) return error;

    const num = parseFloat(value);
    if (num <= 0) {
        return `${fieldName} must be greater than 0`;
    }

    return null;
};

/**
 * Validate date
 */
export const validateDate = (date, fieldName = 'Date') => {
    if (!date) return `${fieldName} is required`;

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return `${fieldName} is not a valid date`;
    }

    return null;
};

/**
 * Validate future date
 */
export const validateFutureDate = (date, fieldName = 'Date') => {
    const error = validateDate(date, fieldName);
    if (error) return error;

    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateObj < today) {
        return `${fieldName} cannot be in the past`;
    }

    return null;
};

/**
 * Validate string length
 */
export const validateLength = (value, fieldName = 'Field', options = {}) => {
    const { min = 0, max = Infinity, required = true } = options;

    if (required && !value) {
        return `${fieldName} is required`;
    }

    const length = String(value).length;

    if (length < min) {
        return `${fieldName} must be at least ${min} characters`;
    }

    if (length > max) {
        return `${fieldName} must be at most ${max} characters`;
    }

    return null;
};

/**
 * Validate account balance
 */
export const validateBalance = (amount, availableBalance, accountType = 'account') => {
    const error = validatePositive(amount, 'Amount');
    if (error) return error;

    const numAmount = parseFloat(amount);
    const numBalance = parseFloat(availableBalance) || 0;

    if (numAmount > numBalance) {
        return `Insufficient balance in ${accountType}`;
    }

    return null;
};

/**
 * Validate credit card limit
 */
export const validateCreditLimit = (amount, availableLimit) => {
    const error = validatePositive(amount, 'Amount');
    if (error) return error;

    const numAmount = parseFloat(amount);
    const numLimit = parseFloat(availableLimit) || 0;

    if (numAmount > numLimit) {
        return `Amount exceeds available credit limit`;
    }

    return null;
};

/**
 * Validate form with multiple fields
 */
export const validateForm = (formData, validationRules) => {
    const errors = {};

    Object.keys(validationRules).forEach(field => {
        const rules = validationRules[field];
        const value = formData[field];

        for (const rule of rules) {
            const error = rule(value);
            if (error) {
                errors[field] = error;
                break; // Stop at first error for this field
            }
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export default {
    validateRequired,
    validateEmail,
    validateNumber,
    validatePositive,
    validateDate,
    validateFutureDate,
    validateLength,
    validateBalance,
    validateCreditLimit,
    validateForm
};
