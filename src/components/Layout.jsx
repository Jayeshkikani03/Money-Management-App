import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import './Layout.css';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-layout">
            {/* Header with Hamburger */}
            <header className="layout-header">
                <button
                    className="hamburger-btn"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
                <img src="/MyPocketBook_Logo.jpg" alt="MyPocketBook" className="app-logo" />
                <h1 className="app-title">MyPocketBook</h1>
            </header>

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <main className="main-content">
                <div className="container">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Layout;
