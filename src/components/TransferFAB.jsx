/**
 * Transfer Floating Action Button (FAB)
 * Quick access to transfer functionality
 */

import { ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TransferFAB.css';

const TransferFAB = () => {
    const navigate = useNavigate();

    return (
        <button
            className="transfer-fab"
            onClick={() => navigate('/transfers')}
            aria-label="Quick Transfer"
            title="Quick Transfer"
        >
            <ArrowLeftRight size={24} />
        </button>
    );
};

export default TransferFAB;
