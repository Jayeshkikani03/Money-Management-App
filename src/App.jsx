import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Backup from './pages/Backup';
import Settings from './pages/Settings';

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="backup" element={<Backup />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
