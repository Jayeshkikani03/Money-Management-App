/**
 * Currency Utilities
 * Dynamic currency formatting based on user settings
 */

/**
 * Currency symbols mapping
 */
export const CURRENCY_SYMBOLS = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CNY: '¥',
    CHF: 'Fr',
    SEK: 'kr',
    NZD: 'NZ$'
};

/**
 * Currency locale mapping for proper number formatting
 */
export const CURRENCY_LOCALES = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    AUD: 'en-AU',
    CAD: 'en-CA',
    CNY: 'zh-CN',
    CHF: 'de-CH',
    SEK: 'sv-SE',
    NZD: 'en-NZ'
};

/**
 * Get currency symbol
 * @param {string} currencyCode - ISO currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode = 'INR') => {
    return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
};

/**
 * Get locale for currency
 * @param {string} currencyCode 
 * @returns {string} Locale string
 */
export const getCurrencyLocale = (currencyCode = 'INR') => {
    return CURRENCY_LOCALES[currencyCode] || 'en-IN';
};

/**
 * Format amount as currency
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'INR', showSymbol = true) => {
    const numAmount = parseFloat(amount) || 0;
    const locale = getCurrencyLocale(currencyCode);

    const formatted = numAmount.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    if (showSymbol) {
        const symbol = getCurrencySymbol(currencyCode);
        return `${symbol}${formatted}`;
    }

    return formatted;
};

/**
 * Format currency with compact notation (K, M, B)
 * @param {number} amount 
 * @param {string} currencyCode 
 * @returns {string}
 */
export const formatCurrencyCompact = (amount, currencyCode = 'INR') => {
    const numAmount = parseFloat(amount) || 0;
    const symbol = getCurrencySymbol(currencyCode);

    if (numAmount >= 1000000000) {
        return `${symbol}${(numAmount / 1000000000).toFixed(1)}B`;
    }
    if (numAmount >= 1000000) {
        return `${symbol}${(numAmount / 1000000).toFixed(1)}M`;
    }
    if (numAmount >= 1000) {
        return `${symbol}${(numAmount / 1000).toFixed(1)}K`;
    }

    return formatCurrency(numAmount, currencyCode);
};

/**
 * Parse currency string to number
 * @param {string} currencyString 
 * @returns {number}
 */
export const parseCurrency = (currencyString) => {
    if (typeof currencyString === 'number') {
        return currencyString;
    }

    // Remove currency symbols and separators
    const cleaned = String(currencyString)
        .replace(/[₹$€£¥Fr,\s]/g, '')
        .trim();

    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
};

/**
 * Format currency for input field (no symbol, proper decimals)
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrencyInput = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount.toFixed(2);
};

/**
 * Get all available currencies
 * @returns {Array} Array of currency objects
 */
export const getAvailableCurrencies = () => {
    return Object.keys(CURRENCY_SYMBOLS).map(code => ({
        code,
        symbol: CURRENCY_SYMBOLS[code],
        locale: CURRENCY_LOCALES[code]
    }));
};

export default {
    CURRENCY_SYMBOLS,
    CURRENCY_LOCALES,
    getCurrencySymbol,
    getCurrencyLocale,
    formatCurrency,
    formatCurrencyCompact,
    parseCurrency,
    formatCurrencyInput,
    getAvailableCurrencies
};
