/**
 * Backup Service
 * Handles data backup and restore using browser downloads
 * Google Drive integration removed due to Node.js compatibility
 */

const backupService = {
    /**
     * Export data as downloadable JSON file
     */
    async backupToFile(data) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().split('T')[0];
            link.href = url;
            link.download = `money-management-backup-${timestamp}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Save backup metadata
            const backupMeta = {
                lastBackupDate: new Date().toISOString(),
                fileName: link.download
            };
            localStorage.setItem('backup_meta', JSON.stringify(backupMeta));

            return backupMeta;
        } catch (error) {
            console.error('Backup error:', error);
            throw error;
        }
    },

    /**
     * Import data from uploaded JSON file
     */
    async restoreFromFile(file) {
        try {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        resolve(data);
                    } catch (error) {
                        reject(new Error('Invalid backup file'));
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsText(file);
            });
        } catch (error) {
            console.error('Restore error:', error);
            throw error;
        }
    },

    /**
     * Get backup metadata
     */
    getBackupMetadata() {
        try {
            const meta = localStorage.getItem('backup_meta');
            return meta ? JSON.parse(meta) : null;
        } catch (error) {
            return null;
        }
    }
};

export default backupService;
