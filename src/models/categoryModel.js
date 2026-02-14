import { generateId } from '../utils/helpers';

/**
 * Create a new category object
 */
export const createCategory = (data) => {
    return {
        id: data.id || generateId(),
        name: data.name,
        type: data.type || 'expense' // 'income', 'expense', or 'both'
    };
};

/**
 * Validate category data
 */
export const isValidCategory = (category) => {
    return (
        category &&
        category.name &&
        category.name.trim() !== ''
    );
};
