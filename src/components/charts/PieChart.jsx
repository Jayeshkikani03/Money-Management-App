import React from 'react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#2563EB', '#16A34A', '#DC2626', '#F59E0B', '#8B5CF6', '#EC4899', '#10B981', '#F97316'];

const PieChart = ({ data, title }) => {
    if (!data || data.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                No data available
            </div>
        );
    }

    const chartData = data.map(item => ({
        name: item.category,
        value: item.total
    }));

    return (
        <div>
            {title && <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>{title}</h3>}
            <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                    <Legend />
                </RechartsPie>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart;
