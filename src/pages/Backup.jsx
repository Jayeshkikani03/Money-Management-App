import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, CheckCircle, AlertCircle, FileJson } from 'lucide-react';
import backupService from '../services/backupService';
import storageService from '../services/storageService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/helpers';
import './Backup.css';

const Backup = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [backupMeta, setBackupMeta] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setBackupMeta(backupService.getBackupMetadata());
    }, []);

    const handleBackup = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const data = await storageService.exportData();
            const meta = await backupService.backupToFile(data);
            setBackupMeta(meta);
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
        } catch (error) {
            setMessage({ type: 'error', text: 'Restore failed. Please check the file and try again.' });
        } finally {
            setLoading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="backup-page">
            <div className="page-header">
                <h1>Backup & Restore</h1>
            </div>

            <div className="backup-content">
                <Card>
                    <div className="backup-status">
                        <FileJson size={48} color="var(--color-secondary)" />
                        <h3>File-Based Backup</h3>
                        <p className="status-text">
                            Download and upload backup files
                        </p>
                    </div>

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <div className="backup-actions">
                        <Button
                            variant="success"
                            fullWidth
                            onClick={handleBackup}
                            disabled={loading}
                        >
                            <Download size={18} />
                            {loading ? 'Creating Backup...' : 'Download Backup'}
                        </Button>

                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={handleRestoreClick}
                            disabled={loading}
                        >
                            <Upload size={18} />
                            Upload & Restore Backup
                        </Button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {backupMeta && (
                        <div className="backup-info">
                            <p className="info-label">Last Backup:</p>
                            <p className="info-value">{formatDate(backupMeta.lastBackupDate)}</p>
                            <p className="info-label" style={{ marginTop: '8px' }}>File:</p>
                            <p className="info-value" style={{ fontSize: '12px' }}>{backupMeta.fileName}</p>
                        </div>
                    )}
                </Card>

                <Card>
                    <h3 style={{ marginBottom: '16px' }}>How It Works</h3>
                    <ol className="instructions-list">
                        <li><strong>Download Backup:</strong> Creates a JSON file with all your data</li>
                        <li><strong>Save the file:</strong> Store it in a safe location (cloud storage, USB drive, etc.)</li>
                        <li><strong>Restore:</strong> Upload the backup file to restore your data</li>
                    </ol>
                    <p className="instructions-note">
                        💡 Tip: Regularly backup your data to avoid losing important financial information
                    </p>
                </Card>

                <Card>
                    <h3 style={{ marginBottom: '16px' }}>Alternative Backup Options</h3>
                    <ul className="instructions-list">
                        <li>Use the <strong>Export JSON</strong> option in Settings for manual backups</li>
                        <li>Export transactions as CSV for spreadsheet analysis</li>
                        <li>Store backup files in cloud storage (Google Drive, Dropbox, OneDrive)</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Backup;
