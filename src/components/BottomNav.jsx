import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, BarChart3, Cloud, Settings } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/transactions', icon: List, label: 'Transactions' },
        { path: '/reports', icon: BarChart3, label: 'Reports' },
        { path: '/backup', icon: Cloud, label: 'Backup' },
        { path: '/settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <nav className="bottom-nav">
            <div className="nav-container">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`.trim()}
                    >
                        <Icon size={20} />
                        <span className="nav-label">{label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
