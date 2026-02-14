import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import CalculatorPad from './CalculatorPad';
import { evaluateExpression, formatCalculatorResult } from '../utils/expressionEvaluator';
import './CalculatorInput.css';

const CalculatorInput = ({
    value,
    onChange,
    currency = 'INR',
    allowNegative = false,
    placeholder = '0.00',
    error,
    required = false
}) => {
    const [expression, setExpression] = useState('');
    const [showCalculator, setShowCalculator] = useState(false);
    const [calculatedValue, setCalculatedValue] = useState(null);
    const [calculationError, setCalculationError] = useState('');

    const handleExpressionChange = (newExpression) => {
        setExpression(newExpression);
        setCalculationError('');

        // Try to evaluate in real-time
        try {
            if (newExpression.trim()) {
                const result = evaluateExpression(newExpression);

                // Validate result
                if (result < 0 && !allowNegative) {
                    setCalculationError('Negative values not allowed');
                    setCalculatedValue(null);
                } else if (result === 0) {
                    setCalculatedValue(0);
                } else {
                    setCalculatedValue(result);
                }
            } else {
                setCalculatedValue(null);
            }
        } catch (err) {
            // Don't show error while typing
            setCalculatedValue(null);
        }
    };

    const handleConfirm = () => {
        try {
            const result = evaluateExpression(expression);

            if (result < 0 && !allowNegative) {
                setCalculationError('Amount cannot be negative');
                return;
            }

            if (result <= 0) {
                setCalculationError('Amount must be greater than 0');
                return;
            }

            // Update parent component with the calculated value
            onChange(result);
            setShowCalculator(false);
            // Clear expression after confirming
            setExpression('');
            setCalculatedValue(null);
        } catch (err) {
            setCalculationError('Invalid expression');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConfirm();
        }
    };

    const handleInputClick = () => {
        if (showCalculator) return; // Prevent resetting if already open

        // Reset expression when opening calculator
        setExpression('');
        setCalculatedValue(null);
        setCalculationError('');
        setShowCalculator(true);
    };

    const handleClose = () => {
        setShowCalculator(false);
        setExpression('');
        setCalculatedValue(null);
        setCalculationError('');
    };

    // Display only the final confirmed value, formatted
    const displayValue = value ? formatCalculatorResult(value, currency) : '';

    return (
        <div className="calculator-input-wrapper">
            <div className="input-group">
                <label className="input-label">
                    Amount {required && <span className="required">*</span>}
                </label>
                <div
                    className={`calculator-input-field ${error ? 'error' : ''}`}
                    onClick={handleInputClick}
                >
                    <input
                        type="text"
                        value={displayValue}
                        placeholder={placeholder}
                        readOnly
                        className="amount-display"
                    />
                    <Calculator size={20} className="calculator-icon" />
                </div>

                {error && (
                    <div className="error-message">{error}</div>
                )}
            </div>

            {showCalculator && (
                <CalculatorPad
                    expression={expression}
                    onExpressionChange={handleExpressionChange}
                    onConfirm={handleConfirm}
                    onClose={handleClose}
                    currency={currency}
                    calculatedValue={calculatedValue}
                    error={calculationError}
                />
            )}
        </div>
    );
};

export default CalculatorInput;
