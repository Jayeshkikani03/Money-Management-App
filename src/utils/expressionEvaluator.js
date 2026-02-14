/**
 * Safe Expression Evaluator
 * Evaluates mathematical expressions without using eval()
 */

/**
 * Tokenize the expression into numbers and operators
 */
const tokenize = (expression) => {
    const tokens = [];
    let currentNumber = '';

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (char === ' ') continue;

        if ('0123456789.'.includes(char)) {
            currentNumber += char;
        } else if ('+-*/()'.includes(char)) {
            if (currentNumber) {
                tokens.push(parseFloat(currentNumber));
                currentNumber = '';
            }
            tokens.push(char);
        } else {
            throw new Error('Invalid character in expression');
        }
    }

    if (currentNumber) {
        tokens.push(parseFloat(currentNumber));
    }

    return tokens;
};

/**
 * Convert infix notation to postfix (Reverse Polish Notation)
 */
const infixToPostfix = (tokens) => {
    const output = [];
    const operators = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

    for (const token of tokens) {
        if (typeof token === 'number') {
            output.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            operators.pop(); // Remove '('
        } else if ('+-*/'.includes(token)) {
            while (
                operators.length &&
                operators[operators.length - 1] !== '(' &&
                precedence[operators[operators.length - 1]] >= precedence[token]
            ) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    }

    while (operators.length) {
        output.push(operators.pop());
    }

    return output;
};

/**
 * Evaluate postfix expression
 */
const evaluatePostfix = (postfix) => {
    const stack = [];

    for (const token of postfix) {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            const b = stack.pop();
            const a = stack.pop();

            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    if (b === 0) throw new Error('Division by zero');
                    stack.push(a / b);
                    break;
                default:
                    throw new Error('Invalid operator');
            }
        }
    }

    return stack[0];
};

/**
 * Main evaluation function
 * @param {string} expression - Mathematical expression to evaluate
 * @returns {number} - Result of the calculation
 */
export const evaluateExpression = (expression) => {
    try {
        if (!expression || expression.trim() === '') {
            return 0;
        }

        // Replace × and ÷ with * and /
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');

        const tokens = tokenize(expression);
        const postfix = infixToPostfix(tokens);
        const result = evaluatePostfix(postfix);

        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid result');
        }

        // Round to 2 decimal places
        return Math.round(result * 100) / 100;
    } catch (error) {
        throw new Error('Invalid expression');
    }
};

/**
 * Validate if expression is valid
 */
export const isValidExpression = (expression) => {
    try {
        evaluateExpression(expression);
        return true;
    } catch {
        return false;
    }
};

/**
 * Format number with currency
 */
export const formatCalculatorResult = (value, currency = 'INR') => {
    const symbols = {
        'INR': '₹',
        'USD': '$',
        'EUR': '€',
        'GBP': '£'
    };

    const symbol = symbols[currency] || '₹';
    const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

    return `${symbol}${formatted}`;
};
