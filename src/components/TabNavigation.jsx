import React from 'react';
import './TabNavigation.css';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="tab-navigation">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabNavigation;
