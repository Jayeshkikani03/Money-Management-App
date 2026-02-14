import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import './Notes.css';

const PersonCard = ({ person, balance }) => {
    const navigate = useNavigate();
    const { format: formatCurrency } = useCurrency();

    // Balance > 0: GIVE (You lent, You get back) -> Green
    // Balance < 0: TAKE (You borrowed, You owe) -> Red
    const isPositive = balance > 0;
    const isNegative = balance < 0;
    const isSettled = balance === 0;

    let statusClass = 'settled';
    if (isPositive) statusClass = 'positive';
    if (isNegative) statusClass = 'negative';

    return (
        <div
            className="person-card"
            onClick={() => navigate(`/notes/person/${person.id}`)}
        >
            <div className={`status-indicator-bar ${statusClass}`} />

            <div className="person-info-row">
                <div className="person-avatar">
                    {person.avatar}
                </div>
                <div className="person-details">
                    <h3>{person.name}</h3>
                    {person.notes && (
                        <p className="person-notes">{person.notes}</p>
                    )}
                </div>
            </div>

            <div className="person-balance-row">
                <p className="balance-label">
                    {isSettled ? 'Settled' : isPositive ? 'To Receive' : 'To Pay'}
                </p>
                <div className={`balance-amount ${statusClass}`}>
                    {formatCurrency(Math.abs(balance))}
                    {isPositive && <ArrowDownLeft size={16} />}
                    {isNegative && <ArrowUpRight size={16} />}
                </div>
            </div>
        </div>
    );
};

export default PersonCard;
