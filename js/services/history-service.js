// js/services/history-service.js
import translationService from './translation-service.js';

class HistoryService {
    constructor() {
        this.storageKey = 'zaptools_history';
        this.maxItems = 50; // Maximum history items to keep
        this._isAdding = false; // Prevent concurrent additions
    }

    /**
     * Add new history item
     */
    async addHistory(item) {
        // Prevent concurrent additions
        if (this._isAdding) {
            console.warn('History addition in progress, skipping...');
            return false;
        }

        this._isAdding = true;
        
        try {
            const history = this.getHistory();
            
            // Validate item
            if (!item || typeof item !== 'object') {
                throw new Error('Invalid history item');
            }
            
            // Add timestamp if not provided
            if (!item.timestamp) {
                item.timestamp = Date.now();
            }
            
            // Add ID if not provided
            if (!item.id) {
                item.id = this.generateId();
            }
            
            // Validate required fields
            if (!item.type) {
                console.warn('History item missing type:', item);
                this._isAdding = false;
                return false;
            }
            
            // Remove any existing item with same ID to prevent duplicates
            const existingIndex = history.findIndex(h => h.id === item.id);
            if (existingIndex !== -1) {
                history.splice(existingIndex, 1);
            }
            
            // Add to beginning of array (newest first)
            history.unshift(item);
            
            // Limit the number of items
            if (history.length > this.maxItems) {
                history.splice(this.maxItems);
            }
            
            // Save to localStorage with error handling
            await this.saveToStorage(history);
            
            console.log('History item added:', item.type, item.id);
            return true;
        } catch (error) {
            console.error('Error adding history item:', error);
            return false;
        } finally {
            this._isAdding = false;
        }
    }

    /**
     * Save history to storage with retry logic
     */
    async saveToStorage(history) {
        const maxRetries = 3;
        let retries = 0;
        
        while (retries < maxRetries) {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(history));
                return;
            } catch (error) {
                retries++;
                if (retries === maxRetries) {
                    throw new Error(`Failed to save history after ${maxRetries} attempts: ${error.message}`);
                }
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 100 * retries));
            }
        }
    }

    /**
     * Get all history items
     */
    getHistory() {
        try {
            const history = localStorage.getItem(this.storageKey);
            if (!history) return [];
            
            const parsed = JSON.parse(history);
            if (!Array.isArray(parsed)) {
                console.warn('Invalid history data format, resetting...');
                this.clearHistory();
                return [];
            }
            
            // Filter out invalid items and ensure required fields
            return parsed.filter(item => 
                item && 
                typeof item === 'object' && 
                item.id && 
                item.timestamp && 
                item.type
            );
        } catch (error) {
            console.error('Error getting history:', error);
            // If corrupted, clear and start fresh
            this.clearHistory();
            return [];
        }
    }

    /**
     * Clear all history
     */
    clearHistory() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('History cleared');
            
            // Dispatch event for other components
            window.dispatchEvent(new CustomEvent('historyCleared'));
            return true;
        } catch (error) {
            console.error('Error clearing history:', error);
            return false;
        }
    }

    /**
     * Delete specific history item
     */
    deleteHistoryItem(id) {
        try {
            if (!id) {
                console.error('No ID provided for deletion');
                return false;
            }
            
            const history = this.getHistory();
            const initialLength = history.length;
            const filteredHistory = history.filter(item => item.id !== id);
            
            if (filteredHistory.length === initialLength) {
                console.warn('History item not found for deletion:', id);
                return false;
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(filteredHistory));
            console.log('History item deleted:', id);
            
            // Dispatch event for UI updates
            window.dispatchEvent(new CustomEvent('historyItemDeleted', { 
                detail: { id } 
            }));
            
            return true;
        } catch (error) {
            console.error('Error deleting history item:', error);
            return false;
        }
    }

    /**
     * Get history statistics
     */
    getStatistics() {
        const history = this.getHistory();
        const stats = {
            total: history.length,
            image: history.filter(item => item.type === 'image').length,
            text: history.filter(item => item.type === 'text').length,
            color: history.filter(item => item.type === 'color').length,
            password: history.filter(item => item.type === 'password').length,
            other: history.filter(item => !['image', 'text', 'color', 'password'].includes(item.type)).length
        };
        
        return stats;
    }

    /**
     * Get recent activities (last 10 items)
     */
    getRecentActivities(limit = 10) {
        const history = this.getHistory();
        return history.slice(0, limit);
    }

    /**
     * Generate unique ID for history items
     */
    generateId() {
        return `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Format timestamp to relative time
     */
    formatTimeAgo(timestamp) {
        if (!timestamp) return 'Unknown time';
        
        try {
            const now = Date.now();
            const diff = now - parseInt(timestamp);
            
            if (diff < 0) return 'Future time';
            
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            const weeks = Math.floor(diff / 604800000);
            
            if (seconds < 60) {
                return translationService.get('history.justNow', 'Just now');
            } else if (minutes < 60) {
                return `${minutes}m ${translationService.get('history.ago', 'ago')}`;
            } else if (hours < 24) {
                return `${hours}h ${translationService.get('history.ago', 'ago')}`;
            } else if (days < 7) {
                return `${days}d ${translationService.get('history.ago', 'ago')}`;
            } else if (weeks < 4) {
                return `${weeks}w ${translationService.get('history.ago', 'ago')}`;
            } else {
                // Format as date for older items
                return new Date(parseInt(timestamp)).toLocaleDateString();
            }
        } catch (error) {
            console.error('Error formatting time ago:', error);
            return 'Unknown time';
        }
    }

    /**
     * Get type display name
     */
    getTypeDisplayName(type) {
        const typeMap = {
            'image': translationService.get('history.imageConversion', 'Image Conversion'),
            'text': translationService.get('history.textConversion', 'Text Conversion'),
            'color': translationService.get('history.colorTool', 'Color Tool'),
            'password': translationService.get('history.passwordGeneration', 'Password Generation'),
            'calculator': translationService.get('history.calculation', 'Calculation'),
            'converter': translationService.get('history.unitConversion', 'Unit Conversion')
        };
        
        return typeMap[type] || type || 'Unknown Activity';
    }

    /**
     * Get icon for history type
     */
    getTypeIcon(type) {
        const iconMap = {
            'image': '🖼️',
            'text': '📝',
            'color': '🎨',
            'password': '🔐',
            'calculator': '🧮',
            'converter': '📐'
        };
        
        return iconMap[type] || '📄';
    }

    /**
     * Get history items by type
     */
    getHistoryByType(type, limit = 10) {
        const history = this.getHistory();
        return history.filter(item => item.type === type).slice(0, limit);
    }

    /**
     * Search history items
     */
    searchHistory(query) {
        if (!query || typeof query !== 'string') {
            return this.getHistory();
        }
        
        const history = this.getHistory();
        const lowerQuery = query.toLowerCase().trim();
        
        return history.filter(item => {
            if (!item) return false;
            
            return (
                (item.type && item.type.toLowerCase().includes(lowerQuery)) ||
                (item.operation && item.operation.toLowerCase().includes(lowerQuery)) ||
                (item.fileName && item.fileName.toLowerCase().includes(lowerQuery)) ||
                (item.input && typeof item.input === 'string' && item.input.toLowerCase().includes(lowerQuery)) ||
                (item.output && typeof item.output === 'string' && item.output.toLowerCase().includes(lowerQuery)) ||
                (item.color && item.color.toLowerCase().includes(lowerQuery)) ||
                (item.fromFormat && item.fromFormat.toLowerCase().includes(lowerQuery)) ||
                (item.toFormat && item.toFormat.toLowerCase().includes(lowerQuery))
            );
        });
    }

    /**
     * Export history as JSON
     */
    exportHistory() {
        try {
            const history = this.getHistory();
            return JSON.stringify({
                version: '1.0',
                exportDate: new Date().toISOString(),
                itemCount: history.length,
                history: history
            }, null, 2);
        } catch (error) {
            console.error('Error exporting history:', error);
            return JSON.stringify({ error: 'Failed to export history' });
        }
    }

    /**
     * Import history from JSON
     */
    importHistory(jsonData) {
        try {
            if (!jsonData || typeof jsonData !== 'string') {
                throw new Error('Invalid JSON data');
            }
            
            const importedData = JSON.parse(jsonData);
            let historyToImport = [];
            
            // Handle different export formats
            if (Array.isArray(importedData)) {
                historyToImport = importedData;
            } else if (importedData.history && Array.isArray(importedData.history)) {
                historyToImport = importedData.history;
            } else {
                throw new Error('Invalid history format');
            }
            
            // Validate and clean imported data
            const validHistory = historyToImport.filter(item => 
                item && 
                typeof item === 'object' && 
                item.type && 
                item.timestamp
            ).map(item => ({
                ...item,
                id: item.id || this.generateId(), // Ensure IDs
                timestamp: item.timestamp || Date.now() // Ensure timestamps
            }));
            
            if (validHistory.length === 0) {
                throw new Error('No valid history items found in import data');
            }
            
            // Merge with existing history
            const existingHistory = this.getHistory();
            const mergedHistory = [...validHistory, ...existingHistory];
            
            // Remove duplicates based on ID
            const uniqueHistory = mergedHistory.filter((item, index, self) =>
                index === self.findIndex(t => t.id === item.id)
            );
            
            // Limit to max items
            const finalHistory = uniqueHistory.slice(0, this.maxItems);
            
            localStorage.setItem(this.storageKey, JSON.stringify(finalHistory));
            
            // Dispatch event for UI updates
            window.dispatchEvent(new CustomEvent('historyImported', {
                detail: { count: validHistory.length }
            }));
            
            return true;
        } catch (error) {
            console.error('Error importing history:', error);
            return false;
        }
    }

    /**
     * Get storage usage information
     */
    getStorageInfo() {
        try {
            const history = this.getHistory();
            const dataSize = new Blob([JSON.stringify(history)]).size;
            
            return {
                itemCount: history.length,
                dataSize: dataSize,
                dataSizeFormatted: this.formatFileSize(dataSize)
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return { itemCount: 0, dataSize: 0, dataSizeFormatted: '0 Bytes' };
        }
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Create singleton instance
const historyService = new HistoryService();

export default historyService;