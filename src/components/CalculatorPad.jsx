import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { formatCalculatorResult } from '../utils/expressionEvaluator';
import './CalculatorPad.css';

const CalculatorPad = ({
    expression,
    onExpressionChange,
    onConfirm,
    onClose,
    currency,
    calculatedValue,
    error
}) => {
    const [showOperators, setShowOperators] = useState(false);

    const handleButtonClick = (value) => {
        if (value === 'backspace') {
            onExpressionChange(expression.slice(0, -1));
        } else if (value === 'done') {
            onConfirm();
        } else {
            onExpressionChange(expression + value);
        }
    };

    const toggleOperators = () => {
        setShowOperators(!showOperators);
    };

    // Numeric keypad layout
    const numericButtons = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
    ];

    // Calculator operators
    const operators = ['+', '-', '×', '÷'];

    return (
        <div className="calculator-overlay" onClick={onClose}>
            <div className="calculator-bottom-sheet" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="calculator-sheet-header">
                    <span className="sheet-title">Amount</span>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Display Area */}
                <div className="calculator-display-area">
                    <div className="expression-text">
                        {expression || '0'}
                    </div>
                    {calculatedValue !== null && calculatedValue > 0 && !error && (
                        <div className="result-text">
                            = {formatCalculatorResult(calculatedValue, currency)}
                        </div>
                    )}
                    {error && (
                        <div className="error-text">{error}</div>
                    )}
                </div>

                {/* Keypad */}
                <div className="calculator-keypad">
                    {/* Number grid */}
                    <div className="number-grid">
                        {numericButtons.map((row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                {row.map((btn) => (
                                    <button
                                        key={btn}
                                        className="keypad-btn number-btn"
                                        onClick={() => handleButtonClick(btn)}
                                    >
                                        {btn}
                                    </button>
                                ))}
                                {/* Add special button for each row */}
                                {rowIndex === 0 && (
                                    <button
                                        className="keypad-btn backspace-btn"
                                        onClick={() => handleButtonClick('backspace')}
                                    >
                                        <Delete size={20} />
                                    </button>
                                )}
                                {rowIndex === 1 && (
                                    <button
                                        className="keypad-btn operator-btn"
                                        onClick={() => handleButtonClick('÷')}
                                    >
                                        ÷
                                    </button>
                                )}
                                {rowIndex === 2 && (
                                    <button
                                        className="keypad-btn operator-btn"
                                        onClick={() => handleButtonClick('×')}
                                    >
                                        ×
                                    </button>
                                )}
                            </React.Fragment>
                        ))}

                        {/* Last row: 0, ., Done */}
                        <button
                            className="keypad-btn number-btn"
                            onClick={() => handleButtonClick('0')}
                        >
                            0
                        </button>
                        <button
                            className="keypad-btn number-btn"
                            onClick={() => handleButtonClick('.')}
                        >
                            .
                        </button>
                        <button
                            className="keypad-btn operator-btn"
                            onClick={() => handleButtonClick('-')}
                        >
                            -
                        </button>
                        <button
                            className="keypad-btn operator-btn"
                            onClick={() => handleButtonClick('+')}
                        >
                            +
                        </button>

                        {/* Done button spans full width */}
                        <button
                            className="keypad-btn done-btn"
                            onClick={() => handleButtonClick('done')}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalculatorPad;
