import React, { useState } from 'react';
import { CHARGE_TYPES, CHARGE_TYPE_LABELS } from '../constants/accountTypes';
import './ChargesFeeSelector.css';

/**
 * ChargesFeeSelector Component
 * Allows users to mark a transaction as a charge/fee and select the type
 */
const ChargesFeeSelector = ({ isCharge, chargeType, chargeDescription, onChange }) => {
    const [showCustomInput, setShowCustomInput] = useState(chargeType === CHARGE_TYPES.CUSTOM);

    const handleChargeToggle = (e) => {
        const checked = e.target.checked;
        onChange({
            isCharge: checked,
            chargeType: checked ? CHARGE_TYPES.LATE_FEE : null,
            chargeDescription: ''
        });
        setShowCustomInput(false);
    };

    const handleChargeTypeChange = (e) => {
        const type = e.target.value;
        setShowCustomInput(type === CHARGE_TYPES.CUSTOM);
        onChange({
            isCharge: true,
            chargeType: type,
            chargeDescription: type === CHARGE_TYPES.CUSTOM ? chargeDescription : ''
        });
    };

    const handleDescriptionChange = (e) => {
        onChange({
            isCharge: true,
            chargeType: chargeType,
            chargeDescription: e.target.value
        });
    };

    return (
        <div className="charges-fee-selector">
            <div className="charge-toggle">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={isCharge}
                        onChange={handleChargeToggle}
                    />
                    <span className="checkbox-text">
                        ⚠️ This is a Charge / Fee
                    </span>
                </label>
                <p className="charge-hint">
                    Charges and fees always count as expenses
                </p>
            </div>

            {isCharge && (
                <div className="charge-type-selector">
                    <label className="input-label">Charge Type</label>
                    <select
                        className="input select"
                        value={chargeType || CHARGE_TYPES.LATE_FEE}
                        onChange={handleChargeTypeChange}
                    >
                        {Object.entries(CHARGE_TYPE_LABELS).map(([key, label]) => (
                            <option key={key} value={CHARGE_TYPES[key]}>
                                {label}
                            </option>
                        ))}
                    </select>

                    {showCustomInput && (
                        <div className="custom-charge-input">
                            <input
                                type="text"
                                className="input"
                                placeholder="Enter custom charge description..."
                                value={chargeDescription || ''}
                                onChange={handleDescriptionChange}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChargesFeeSelector;
