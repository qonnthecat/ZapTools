// js/services/history-service.js
import translationService from './translation-service.js';

class HistoryService {
    constructor() {
        this.storageKey = 'zaptools_history';
        this.maxItems = 50; // Maximum history items to keep
    }

    /**
     * Add new history item
     */
    addHistory(item) {
        try {
            const history = this.getHistory();
            
            // Add timestamp if not provided
            if (!item.timestamp) {
                item.timestamp = Date.now();
            }
            
            // Add ID if not provided
            if (!item.id) {
                item.id = this.generateId();
            }
            
            // Add to beginning of array (newest first)
            history.unshift(item);
            
            // Limit the number of items
            if (history.length > this.maxItems) {
                history.splice(this.maxItems);
            }
            
            // Save to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            
            console.log('History item added:', item.type);
            return true;
        } catch (error) {
            console.error('Error adding history item:', error);
            return false;
        }
    }

    /**
     * Get all history items
     */
    getHistory() {
        try {
            const history = localStorage.getItem(this.storageKey);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error getting history:', error);
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
            const history = this.getHistory();
            const filteredHistory = history.filter(item => item.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(filteredHistory));
            console.log('History item deleted:', id);
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
            password: history.filter(item => item.type === 'password').length
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
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Format timestamp to relative time
     */
    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (seconds < 60) {
            return translationService.get('history.timeAgo', 'Just now');
        } else if (minutes < 60) {
            return `${minutes}m ${translationService.get('history.timeAgo', 'ago')}`;
        } else if (hours < 24) {
            return `${hours}h ${translationService.get('history.timeAgo', 'ago')}`;
        } else if (days < 7) {
            return `${days}d ${translationService.get('history.timeAgo', 'ago')}`;
        } else {
            // Format as date for older items
            return new Date(timestamp).toLocaleDateString();
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
            'password': translationService.get('history.passwordGeneration', 'Password Generation')
        };
        
        return typeMap[type] || type;
    }

    /**
     * Get icon for history type
     */
    getTypeIcon(type) {
        const iconMap = {
            'image': '🖼️',
            'text': '📝',
            'color': '🎨',
            'password': '🔐'
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
        const history = this.getHistory();
        const lowerQuery = query.toLowerCase();
        
        return history.filter(item => {
            return (
                item.type?.toLowerCase().includes(lowerQuery) ||
                item.operation?.toLowerCase().includes(lowerQuery) ||
                item.fileName?.toLowerCase().includes(lowerQuery) ||
                item.input?.toLowerCase().includes(lowerQuery) ||
                item.output?.toLowerCase().includes(lowerQuery)
            );
        });
    }

    /**
     * Export history as JSON
     */
    exportHistory() {
        const history = this.getHistory();
        return JSON.stringify(history, null, 2);
    }

    /**
     * Import history from JSON
     */
    importHistory(jsonData) {
        try {
            const importedHistory = JSON.parse(jsonData);
            if (Array.isArray(importedHistory)) {
                localStorage.setItem(this.storageKey, jsonData);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing history:', error);
            return false;
        }
    }
}

// Create singleton instance
const historyService = new HistoryService();

export default historyService;