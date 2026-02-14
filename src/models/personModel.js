import { generateId } from '../utils/helpers';

/**
 * Create a new Person entity
 * @param {Object} data
 * @returns {Object}
 */
export const createPerson = (data) => {
    return {
        id: data.id || generateId(),
        name: data.name,
        phone: data.phone || '',
        notes: data.notes || '',
        avatar: data.avatar || getInitials(data.name),
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
    };
};

/**
 * Validate person data
 * @param {Object} person 
 * @returns {Boolean}
 */
export const isValidPerson = (person) => {
    return (
        person &&
        typeof person.name === 'string' &&
        person.name.trim().length > 0
    );
};

// Helper to generate initials
const getInitials = (name) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
};
