import React, { useState } from 'react';
import { Moon, Sun, Download, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import storageService from '../services/storageService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { CURRENCIES } from '../utils/constants';
import { exportToCSV, downloadFile } from '../utils/helpers';
import './Settings.css';

const Settings = () => {
    const { settings, updateSettings, transactions } = useApp();
    const [loading, setLoading] = useState(false);

    const handleThemeToggle = async () => {
        const newTheme = settings.theme === 'light' ? 'dark' : 'light';
        await updateSettings({ theme: newTheme });
    };

    const handleCurrencyChange = async (e) => {
        await updateSettings({ currency: e.target.value });
    };

    const handleExportJSON = async () => {
        try {
            const data = await storageService.exportData();
            const jsonString = JSON.stringify(data, null, 2);
            downloadFile(jsonString, `money-management-backup-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
        } catch (error) {
            alert('Failed to export data');
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
                    <h3>Data Export</h3>
                    <div className="export-actions">
                        <Button variant="secondary" fullWidth onClick={handleExportJSON}>
                            <Download size={18} />
                            Export as JSON
                        </Button>
                        <Button variant="secondary" fullWidth onClick={handleExportCSV}>
                            <Download size={18} />
                            Export as CSV
                        </Button>
                    </div>
                </Card>

                <Card>
                    <h3>Danger Zone</h3>
                    <p className="danger-description">
                        This will permanently delete all your transactions, categories, and settings.
                    </p>
                    <Button
                        variant="danger"
                        fullWidth
                        onClick={handleClearData}
                        disabled={loading}
                    >
                        <Trash2 size={18} />
                        {loading ? 'Clearing...' : 'Clear All Data'}
                    </Button>
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
        </div>
    );
};

export default Settings;
