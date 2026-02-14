import storageService from './storageService';
import { createPerson } from '../models/personModel';

const personService = {
    /**
     * Get all persons with sorted logic
     * @returns {Promise<Array>}
     */
    getAllPersons: async () => {
        try {
            return await storageService.loadPersons();
        } catch (error) {
            console.error('Failed to load persons:', error);
            throw error;
        }
    },

    /**
     * Add a new person
     * @param {Object} personData 
     * @returns {Promise<Object>}
     */
    addPerson: async (personData) => {
        try {
            const person = createPerson(personData);
            await storageService.savePerson(person);
            return person;
        } catch (error) {
            console.error('Failed to add person:', error);
            throw error;
        }
    },

    /**
     * Update a person
     * @param {Object} person 
     * @returns {Promise<Object>}
     */
    updatePerson: async (person) => {
        try {
            await storageService.savePerson(person);
            return person;
        } catch (error) {
            console.error('Failed to update person:', error);
            throw error;
        }
    },

    /**
     * Delete a person
     * @param {String} id 
     */
    deletePerson: async (id) => {
        try {
            await storageService.deletePerson(id);
        } catch (error) {
            console.error('Failed to delete person:', error);
            throw error;
        }
    }
};

export default personService;
