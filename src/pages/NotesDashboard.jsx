import React, { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useCurrency } from '../hooks/useCurrency';
import PersonCard from '../components/notes/PersonCard';
import AddPersonModal from '../components/notes/AddPersonModal';
import '../components/notes/Notes.css';

const NotesDashboard = () => {
    const { persons, addPerson, getPersonBalance } = useNotes();
    const { format: formatCurrency } = useCurrency();
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Calculate totals
    const totalToReceive = persons.reduce((acc, p) => {
        const bal = getPersonBalance(p.id);
        return bal > 0 ? acc + bal : acc;
    }, 0);

    const totalToPay = persons.reduce((acc, p) => {
        const bal = getPersonBalance(p.id);
        return bal < 0 ? acc + Math.abs(bal) : acc;
    }, 0);

    const filteredPersons = persons.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="notes-dashboard">
            {/* Header / Summary */}
            <div className="notes-header">
                <div className="notes-title-row">
                    <h1 className="notes-title">Personal Notes</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="add-btn-icon"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <div className="notes-summary-grid">
                    <div className="summary-card receive">
                        <p className="summary-label">To Receive</p>
                        <p className="summary-value">
                            {formatCurrency(totalToReceive)}
                        </p>
                    </div>
                    <div className="summary-card pay">
                        <p className="summary-label">To Pay</p>
                        <p className="summary-value">
                            {formatCurrency(totalToPay)}
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="notes-search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search people..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="notes-search-input"
                    />
                </div>
            </div>

            {/* List */}
            <div className="person-list-container">
                {persons.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <Users size={32} />
                        </div>
                        <h3 className="section-title" style={{ textAlign: 'center', marginBottom: 8 }}>No people added yet</h3>
                        <p style={{ marginBottom: 24 }}>
                            Add friends, family, or colleagues to start tracking borrow & lend transactions.
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn-primary"
                        >
                            Add First Person
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="section-title">People ({filteredPersons.length})</h2>
                        <div className="person-grid">
                            {filteredPersons.map(person => (
                                <PersonCard
                                    key={person.id}
                                    person={person}
                                    balance={getPersonBalance(person.id)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <AddPersonModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={addPerson}
            />
        </div>
    );
};

export default NotesDashboard;
