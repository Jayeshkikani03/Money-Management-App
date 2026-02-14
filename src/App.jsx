import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { NotesProvider } from './context/NotesContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Reports from './pages/Reports';
import TransfersPage from './pages/TransfersPage';
import ScheduledPage from './pages/ScheduledPage';
import BillsPage from './pages/BillsPage';
import RecurringManagementPage from './pages/RecurringManagementPage';
import BankAccountDetail from './pages/BankAccountDetail';
import CreditCardDetail from './pages/CreditCardDetail';
import CashAccountDetail from './pages/CashAccountDetail';
import Settings from './pages/Settings';
import NotesDashboard from './pages/NotesDashboard';
import NotesPersonDetail from './pages/NotesPersonDetail';
import './styles/reset.css';
import './styles/global.css';
import './App.css';

function App() {
    const { theme } = useApp();

    return (
        <BrowserRouter>
            <NotesProvider>
                <div className={`app ${theme}`}>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="transactions" element={<Transactions />} />
                            <Route path="transfers" element={<TransfersPage />} />
                            <Route path="notes" element={<NotesDashboard />} />
                            <Route path="notes/person/:id" element={<NotesPersonDetail />} />
                            <Route path="scheduled" element={<ScheduledPage />} />
                            <Route path="bills" element={<BillsPage />} />
                            <Route path="recurring-management" element={<RecurringManagementPage />} />
                            <Route path="accounts" element={<Accounts />} />
                            <Route path="accounts/cash" element={<CashAccountDetail />} />
                            <Route path="accounts/bank/:id" element={<BankAccountDetail />} />
                            <Route path="accounts/credit/:id" element={<CreditCardDetail />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Routes>
                </div>
            </NotesProvider>
        </BrowserRouter>
    );
}

export default App;
