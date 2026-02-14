import React, { useState, useRef } from 'react';
import { Moon, Sun, Download, Trash2, Upload, FileJson, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import storageService from '../services/storageService';
import backupService from '../services/backupService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { CURRENCIES } from '../utils/constants';
import { exportToCSV, downloadFile } from '../utils/helpers';
import './Settings.css';

const Settings = () => {
    const { settings, updateSettings, transactions } = useApp();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);

    const handleThemeToggle = async () => {
        const newTheme = settings.theme === 'light' ? 'dark' : 'light';
        await updateSettings({ theme: newTheme });
    };

    const handleCurrencyChange = async (e) => {
        await updateSettings({ currency: e.target.value });
    };

    const handleBackup = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const data = await storageService.exportData();
            const meta = await backupService.backupToFile(data);
            setMessage({ type: 'success', text: 'Backup downloaded successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Backup failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!window.confirm('This will replace all your current data. Are you sure?')) {
            e.target.value = '';
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const data = await backupService.restoreFromFile(file);
            await storageService.importData(data);
            setMessage({ type: 'success', text: 'Data restored successfully! Please refresh the page.' });
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: 'Restore failed. Please check the file and try again.' });
        } finally {
            setLoading(false);
            e.target.value = '';
        }
    };

    const handleExportCSV = () => {
        try {
            const csvContent = exportToCSV(transactions);
            downloadFile(csvContent, `transactions-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        } catch (error) {
            alert('Failed to export CSV');
        }
    };

    const handleClearData = async () => {
        if (!window.confirm('This will delete ALL your data permanently. Are you sure?')) {
            return;
        }

        if (!window.confirm('This action cannot be undone. Please confirm again.')) {
            return;
        }

        setLoading(true);
        try {
            await storageService.clearAllData();
            alert('All data cleared successfully. Please refresh the page.');
            window.location.reload();
        } catch (error) {
            alert('Failed to clear data');
        } finally {
            setLoading(false);
        }
    };

    const currencyOptions = CURRENCIES.map(c => ({
        value: c.code,
        label: `${c.symbol} ${c.name}`
    }));

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Settings</h1>
            </div>

            <div className="settings-content">
                <Card>
                    <h3>Appearance</h3>
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Theme</div>
                            <div className="setting-description">
                                {settings.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                            </div>
                        </div>
                        <button className="theme-toggle" onClick={handleThemeToggle}>
                            {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>
                </Card>

                <Card>
                    <h3>Currency</h3>
                    <Select
                        value={settings.currency}
                        onChange={handleCurrencyChange}
                        options={currencyOptions}
                    />
                </Card>

                <Card>
                    <h3>Data Management</h3>

                    {message && (
                        <div className={`message ${message.type}`} style={{
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: message.type === 'success' ? '#16a34a' : '#dc2626'
                        }}>
                            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            <span style={{ fontSize: '14px' }}>{message.text}</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleBackup}
                            disabled={loading}
                        >
                            <FileJson size={18} />
                            {loading ? 'Processing...' : 'Backup Data (JSON)'}
                        </Button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".json"
                            style={{ display: 'none' }}
                        />

                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={handleRestoreClick}
                            disabled={loading}
                        >
                            <Upload size={18} />
                            Restore Data
                        </Button>

                        <div style={{ height: '1px', background: 'var(--color-border)', margin: '8px 0' }}></div>

                        <Button
                            variant="outline"
                            fullWidth
                            onClick={handleExportCSV}
                        >
                            <Download size={18} />
                            Export Transactions (CSV)
                        </Button>

                        <Button
                            variant="danger"
                            fullWidth
                            onClick={handleClearData}
                            disabled={loading}
                        >
                            <Trash2 size={18} />
                            Clear All Data
                        </Button>
                    </div>
                </Card>

                <Card>
                    <h3>About</h3>
                    <div className="about-info">
                        <p><strong>Version:</strong> 1.0.0</p>
                        <p><strong>Storage:</strong> IndexedDB / LocalStorage</p>
                        <p><strong>Transactions:</strong> {transactions.length}</p>
                    </div>
                </Card>
            </div>
        </div >
    );
};

export default Settings;
