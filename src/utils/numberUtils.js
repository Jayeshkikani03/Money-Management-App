/**
 * Number Utilities
 * Safe number operations to prevent NaN issues
 */

/**
 * Safely parse a value to a number
 * @param {*} value - Value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed number or default
 */
export const safeNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }

    const num = parseFloat(value);
    return isNaN(num) || !isFinite(num) ? defaultValue : num;
};

/**
 * Safely sum an array of numbers
 * @param {Array} numbers - Array of numbers to sum
 * @returns {number} Sum of all numbers
 */
export const safeSum = (numbers) => {
    if (!Array.isArray(numbers)) {
        return 0;
    }

    return numbers.reduce((sum, num) => sum + safeNumber(num), 0);
};

/**
 * Safely calculate with multiple values
 * @param {Function} operation - Operation to perform
 * @param  {...any} values - Values to operate on
 * @returns {number} Result of operation
 */
export const safeCalculate = (operation, ...values) => {
    const safeValues = values.map(v => safeNumber(v));
    try {
        const result = operation(...safeValues);
        return safeNumber(result);
    } catch (error) {
        console.error('Calculation error:', error);
        return 0;
    }
};

/**
 * Safely divide two numbers
 * @param {number} numerator 
 * @param {number} denominator 
 * @param {number} defaultValue 
 * @returns {number}
 */
export const safeDivide = (numerator, denominator, defaultValue = 0) => {
    const num = safeNumber(numerator);
    const den = safeNumber(denominator);

    if (den === 0) {
        return defaultValue;
    }

    return num / den;
};

/**
 * Safely multiply numbers
 * @param  {...any} values 
 * @returns {number}
 */
export const safeMultiply = (...values) => {
    return values.reduce((product, value) => product * safeNumber(value, 1), 1);
};

/**
 * Round to specified decimal places
 * @param {number} value 
 * @param {number} decimals 
 * @returns {number}
 */
export const safeRound = (value, decimals = 2) => {
    const num = safeNumber(value);
    const multiplier = Math.pow(10, decimals);
    return Math.round(num * multiplier) / multiplier;
};

/**
 * Format number with thousand separators
 * @param {number} value 
 * @param {number} decimals 
 * @returns {string}
 */
export const formatNumber = (value, decimals = 2) => {
    const num = safeNumber(value);
    return num.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

/**
 * Calculate percentage
 * @param {number} value 
 * @param {number} total 
 * @returns {number}
 */
export const safePercentage = (value, total) => {
    const percentage = safeDivide(value, total) * 100;
    return safeRound(percentage, 1);
};

/**
 * Clamp value between min and max
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export const clamp = (value, min, max) => {
    const num = safeNumber(value);
    return Math.min(Math.max(num, min), max);
};

export default {
    safeNumber,
    safeSum,
    safeCalculate,
    safeDivide,
    safeMultiply,
    safeRound,
    formatNumber,
    safePercentage,
    clamp
};
