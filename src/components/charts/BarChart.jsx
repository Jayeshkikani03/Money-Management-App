import React from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChart = ({ data, title }) => {
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
                <RechartsBar data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthName" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="income" fill="#16A34A" name="Income" />
                    <Bar dataKey="expense" fill="#DC2626" name="Expense" />
                </RechartsBar>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;
