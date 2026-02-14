import React from 'react';
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChart = ({ data, title }) => {
    if (!data || data.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                No data available
            </div>
        );
    }

    return (
        <div>
            {title && <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>{title}</h3>}
            <ResponsiveContainer width="100%" height={300}>
                <RechartsLine data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthName" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#16A34A" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expense" stroke="#DC2626" strokeWidth={2} name="Expense" />
                </RechartsLine>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChart;
