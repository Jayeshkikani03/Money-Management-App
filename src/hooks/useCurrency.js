/**
 * Custom hook for currency formatting
 * Uses app settings to format currency dynamically
 */

import { useApp } from '../context/AppContext';
import {
    formatCurrency,
    formatCurrencyCompact,
    getCurrencySymbol,
    parseCurrency,
    formatCurrencyInput
} from '../utils/currencyUtils';

export const useCurrency = () => {
    const { settings } = useApp();
    const currency = settings?.currency || 'INR';

    /**
     * Format amount with current currency
     */
    const format = (amount, showSymbol = true) => {
        return formatCurrency(amount, currency, showSymbol);
    };

    /**
     * Format amount in compact notation (K, M, B)
     */
    const formatCompact = (amount) => {
        return formatCurrencyCompact(amount, currency);
    };

    /**
     * Get current currency symbol
     */
    const symbol = getCurrencySymbol(currency);

    /**
     * Parse currency string to number
     */
    const parse = (currencyString) => {
        return parseCurrency(currencyString);
    };

    /**
     * Format for input field
     */
    const formatInput = (amount) => {
        return formatCurrencyInput(amount);
    };

    return {
        format,
        formatCompact,
        symbol,
        currency,
        parse,
        formatInput
    };
};

export default useCurrency;
