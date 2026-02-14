import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Notes.css';

const AddPersonModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onSave({ name, phone, notes });
            onClose();
            setName('');
            setPhone('');
            setNotes('');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Add New Person</h2>
                    <button onClick={onClose} className="close-modal-btn">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            placeholder="Enter name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone (Optional)</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-input"
                            placeholder="+91..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="form-textarea"
                            placeholder="Relationship, context..."
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: 0 }}
                    >
                        {loading ? 'Saving...' : 'Save Person'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPersonModal;
