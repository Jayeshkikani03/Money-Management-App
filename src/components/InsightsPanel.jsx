import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import Card from './ui/Card';
import './InsightsPanel.css';

const InsightsPanel = () => {
    const { getSpendingInsights } = useApp();
    const insights = getSpendingInsights();

    if (insights.length === 0) {
        return null;
    }

    const getIcon = (type) => {
        switch (type) {
            case 'warning':
                return <AlertCircle size={20} />;
            case 'success':
                return <TrendingUp size={20} />;
            case 'info':
                return <Info size={20} />;
            default:
                return <TrendingDown size={20} />;
        }
    };

    return (
        <Card className="insights-panel">
            <h3>Spending Insights</h3>
            <div className="insights-list">
                {insights.map((insight, index) => (
                    <div key={index} className={`insight-item ${insight.type}`}>
                        <div className="insight-icon">
                            {getIcon(insight.type)}
                        </div>
                        <div className="insight-message">
                            {insight.message}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default InsightsPanel;
