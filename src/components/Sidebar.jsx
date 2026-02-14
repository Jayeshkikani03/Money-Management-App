/**
 * Sidebar Navigation Component
 * Responsive drawer sidebar with hamburger toggle
 */

import { NavLink } from 'react-router-dom';
import {
    X, Home, List, ArrowLeftRight, Wallet, BarChart3,
    Settings, Calendar, CreditCard, Repeat
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard', exact: true },
        { path: '/transactions', icon: List, label: 'Transactions' },
        { path: '/transfers', icon: ArrowLeftRight, label: 'Transfers' },
        { path: '/accounts', icon: Wallet, label: 'Accounts' },
        { path: '/scheduled', icon: Calendar, label: 'Scheduled' },
        { path: '/bills', icon: CreditCard, label: 'Bills' },
        { path: '/recurring-management', icon: Repeat, label: 'Recurring' },
        { path: '/reports', icon: BarChart3, label: 'Reports' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={onClose}
                    aria-label="Close sidebar"
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <img src="/MyPocketBook_Logo.jpg" alt="MyPocketBook" className="brand-logo" />
                        <h2>MyPocketBook</h2>
                    </div>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <p className="version">Version 1.0.0</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
