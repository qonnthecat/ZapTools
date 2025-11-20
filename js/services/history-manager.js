// js/services/history-manager.js
import historyService from './history-service.js';
import translationService from './translation-service.js';

export class HistoryManager {
    constructor() {
        this.initialized = false;
        this.currentLanguage = translationService.getCurrentLanguage();
        this.isLoading = false;
        this._eventListeners = [];
    }

    async init() {
        if (this.initialized) return;
        
        console.log('Initializing History Manager...');
        
        try {
            // Set up language change listener
            this._addEventListener(window, 'languageChanged', (e) => {
                this.currentLanguage = e.detail;
                this.loadHistory(); // Reload history to update translations
            });
            
            // Listen for history changes from other components
            this._addEventListener(window, 'historyItemDeleted', () => {
                this.loadHistory();
            });
            
            this._addEventListener(window, 'historyCleared', () => {
                this.loadHistory();
            });
            
            this._addEventListener(window, 'historyImported', (e) => {
                this.showNotification(`Imported ${e.detail.count} history items`, 'success');
                this.loadHistory();
            });
            
            await this.setupEventListeners();
            await this.loadHistory();
            this.initialized = true;
            
            console.log('History Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize History Manager:', error);
        }
    }

    _addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this._eventListeners.push({ element, event, handler });
    }

    _removeAllEventListeners() {
        this._eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this._eventListeners = [];
    }

    destroy() {
        this._removeAllEventListeners();
        this.initialized = false;
    }

    async setupEventListeners() {
        // Clear history button
        const clearHistoryBtn = document.getElementById('clear-history');
        if (clearHistoryBtn) {
            this._addEventListener(clearHistoryBtn, 'click', () => this.clearHistory());
        }

        // Export history button
        const exportHistoryBtn = document.getElementById('export-history');
        if (exportHistoryBtn) {
            this._addEventListener(exportHistoryBtn, 'click', () => this.exportHistory());
        }

        // Import history button
        const importHistoryBtn = document.getElementById('import-history');
        const importHistoryFile = document.getElementById('import-history-file');
        if (importHistoryBtn && importHistoryFile) {
            this._addEventListener(importHistoryBtn, 'click', () => importHistoryFile.click());
            this._addEventListener(importHistoryFile, 'change', (e) => this.importHistory(e.target.files[0]));
        }

        // Listen for new conversions
        this._addEventListener(window, 'conversionCompleted', (e) => {
            this.addConversionToHistory(e.detail);
        });

        // Search functionality
        await this.setupSearchFunctionality();
    }

    async setupSearchFunctionality() {
        const searchInput = document.getElementById('history-search');
        if (searchInput) {
            let searchTimeout;
            this._addEventListener(searchInput, 'input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterHistory(e.target.value);
                }, 300); // Debounce search
            });
            
            // Clear search button
            const clearSearchBtn = document.getElementById('clear-search');
            if (clearSearchBtn) {
                this._addEventListener(clearSearchBtn, 'click', () => {
                    searchInput.value = '';
                    this.filterHistory('');
                });
            }
        }
    }

    async loadHistory() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            const historyList = document.getElementById('history-list');
            const emptyState = document.getElementById('empty-history');
            
            if (!historyList) {
                console.warn('History list element not found');
                return;
            }

            // Show loading state
            historyList.innerHTML = this.createLoadingState();
            
            const history = await Promise.resolve(historyService.getRecentActivities(20));
            const stats = historyService.getStatistics();

            // Update statistics
            this.updateStatistics(stats);

            // Small delay for smooth transition
            await new Promise(resolve => setTimeout(resolve, 100));

            if (history.length === 0) {
                this.showEmptyState(historyList, emptyState);
            } else {
                this.showHistoryList(historyList, emptyState, history);
            }
        } catch (error) {
            console.error('Error loading history:', error);
            this.showErrorState();
        } finally {
            this.isLoading = false;
        }
    }

    createLoadingState() {
        return `
            <div class="history-loading">
                <div class="loading-spinner"></div>
                <p>Loading history...</p>
            </div>
        `;
    }

    showErrorState() {
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = `
                <div class="empty-state error-state">
                    <div class="empty-icon">⚠️</div>
                    <h3>Failed to load history</h3>
                    <p>Please try refreshing the page</p>
                    <button class="btn primary" onclick="window.location.reload()">Reload Page</button>
                </div>
            `;
        }
    }

    showEmptyState(historyList, emptyState) {
        if (emptyState) {
            emptyState.style.display = 'block';
            historyList.innerHTML = '';
            historyList.appendChild(emptyState);
        } else {
            historyList.innerHTML = `
                <div class="empty-state" id="empty-history">
                    <div class="empty-icon">📊</div>
                    <h3 data-i18n="history.noHistory">No conversion history yet</h3>
                    <p>Your recent conversions will appear here</p>
                </div>
            `;
        }
    }

    showHistoryList(historyList, emptyState, history) {
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        try {
            historyList.innerHTML = history.map((item, index) => 
                this.createHistoryItem(item, index)
            ).join('');
            
            // Add event listeners
            this.addDeleteEventListeners();
            this.addItemClickListeners();
        } catch (error) {
            console.error('Error showing history list:', error);
            this.showErrorState();
        }
    }

    createHistoryItem(item, index) {
        try {
            const timeAgo = historyService.formatTimeAgo(item.timestamp);
            const typeName = historyService.getTypeDisplayName(item.type);
            const icon = historyService.getTypeIcon(item.type);
            
            let content = '';
            let detailsClass = `history-item-${item.type}`;
            
            switch (item.type) {
                case 'image':
                    content = this.createImageHistoryContent(item);
                    break;
                    
                case 'text':
                    content = this.createTextHistoryContent(item);
                    break;
                    
                case 'color':
                    content = this.createColorHistoryContent(item);
                    break;
                    
                case 'password':
                    content = this.createPasswordHistoryContent(item);
                    break;
                    
                default:
                    content = this.createDefaultHistoryContent(item);
            }

            return `
                <div class="history-item ${index === 0 ? 'new-item' : ''}" 
                     data-id="${item.id}" 
                     data-type="${item.type}"
                     data-timestamp="${item.timestamp}">
                    <div class="history-item-icon" title="${this.escapeHtml(typeName)}">${icon}</div>
                    <div class="history-item-content">
                        <div class="history-item-header">
                            <span class="history-item-type">${this.escapeHtml(typeName)}</span>
                            <span class="history-item-time">${this.escapeHtml(timeAgo)}</span>
                        </div>
                        <div class="history-item-details ${detailsClass}">${content}</div>
                        ${this.createAdditionalInfo(item)}
                    </div>
                    <button class="history-item-delete" 
                            data-id="${item.id}" 
                            title="${translationService.get('history.delete', 'Delete')}"
                            aria-label="${translationService.get('history.delete', 'Delete')}">
                        ×
                    </button>
                </div>
            `;
        } catch (error) {
            console.error('Error creating history item:', error, item);
            return `
                <div class="history-item error">
                    <div class="history-item-icon">⚠️</div>
                    <div class="history-item-content">
                        <div class="history-item-header">
                            <span class="history-item-type">Invalid History Item</span>
                        </div>
                        <div class="history-item-details">This item could not be displayed</div>
                    </div>
                </div>
            `;
        }
    }

    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    createImageHistoryContent(item) {
        let content = `Converted ${item.fromFormat || 'image'} → ${item.toFormat || 'target'}`;
        
        if (item.fileName) {
            content = `${this.truncateFileName(item.fileName)} (${item.fromFormat} → ${item.toFormat})`;
        }
        
        if (item.originalSize && item.newSize) {
            content += `<br><small>${this.formatFileSize(item.originalSize)} → ${this.formatFileSize(item.newSize)}</small>`;
        }
        
        if (item.compressionRatio) {
            const ratio = Math.max(0, Math.min(100, item.compressionRatio));
            content += `<br><small class="compression-info">${ratio}% smaller</small>`;
        }
        
        return content;
    }

    createTextHistoryContent(item) {
        let content = '';
        
        if (item.operation) {
            content += `Operation: ${this.formatTextOperation(item.operation)}`;
        }
        
        if (item.input && typeof item.input === 'string') {
            const preview = item.input.length > 50 ? 
                item.input.substring(0, 50) + '...' : item.input;
            content += `<br><small>"${this.escapeHtml(preview)}"</small>`;
        }
        
        if (item.inputLength && item.outputLength) {
            content += `<br><small>${item.inputLength} → ${item.outputLength} characters</small>`;
        }
        
        return content || 'Text conversion completed';
    }

    createColorHistoryContent(item) {
        if (item.color) {
            return `
                Color: ${this.escapeHtml(item.color)}
                <div class="color-preview" style="background-color: ${this.escapeHtml(item.color)};"></div>
            `;
        }
        return 'Color tool used';
    }

    createPasswordHistoryContent(item) {
        let content = `Generated ${item.length || 'unknown'} character password`;
        
        if (item.hasUpper || item.hasNumbers || item.hasSymbols) {
            const features = [];
            if (item.hasUpper) features.push('uppercase');
            if (item.hasNumbers) features.push('numbers');
            if (item.hasSymbols) features.push('symbols');
            
            content += `<br><small>With ${features.join(', ')}</small>`;
        }
        
        if (item.strength) {
            content += `<br><small class="strength-${item.strength}">${item.strength} strength</small>`;
        }
        
        return content;
    }

    createDefaultHistoryContent(item) {
        let content = 'Activity completed';
        
        if (item.operation) {
            content = `Operation: ${this.formatTextOperation(item.operation)}`;
        }
        
        return content;
    }

    createAdditionalInfo(item) {
        const info = [];
        
        if (item.timestamp) {
            const date = new Date(parseInt(item.timestamp)).toLocaleString();
            info.push(`<small class="history-timestamp">${this.escapeHtml(date)}</small>`);
        }
        
        return info.length > 0 ? 
            `<div class="history-additional-info">${info.join('')}</div>` : '';
    }

    updateStatistics(stats) {
        const elements = {
            'image-count': stats.image,
            'text-count': stats.text,
            'color-count': stats.color,
            'password-count': stats.password,
            'other-count': stats.other
        };

        Object.entries(elements).forEach(([id, count]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = count;
                const parent = element.closest('.stat-card');
                if (parent) {
                    parent.style.display = count > 0 ? 'flex' : 'none';
                }
            }
        });

        // Update total count if element exists
        const totalElement = document.getElementById('total-count');
        if (totalElement) {
            totalElement.textContent = stats.total;
        }
    }

    addDeleteEventListeners() {
        document.querySelectorAll('.history-item-delete').forEach(button => {
            this._addEventListener(button, 'click', (e) => {
                e.stopPropagation();
                const id = button.getAttribute('data-id');
                if (id) {
                    this.deleteHistoryItem(id);
                }
            });
        });
    }

    addItemClickListeners() {
        document.querySelectorAll('.history-item').forEach(item => {
            this._addEventListener(item, 'click', (e) => {
                if (!e.target.classList.contains('history-item-delete')) {
                    this.handleHistoryItemClick(item);
                }
            });
        });
    }

    handleHistoryItemClick(item) {
        const id = item.getAttribute('data-id');
        const type = item.getAttribute('data-type');
        
        console.log('History item clicked:', { id, type });
        
        // Optional: Implement re-use functionality
        this.showItemDetails(id);
    }

    showItemDetails(id) {
        // Could show modal or expand item details
        console.log('Show details for history item:', id);
    }

    async deleteHistoryItem(id) {
        if (!id) {
            this.showNotification('Invalid history item', 'error');
            return;
        }

        try {
            if (await Promise.resolve(historyService.deleteHistoryItem(id))) {
                this.showNotification('History item deleted', 'success');
            } else {
                this.showNotification('Failed to delete history item', 'error');
            }
        } catch (error) {
            console.error('Error deleting history item:', error);
            this.showNotification('Error deleting history item', 'error');
        }
    }

    async clearHistory() {
        const confirmMessage = translationService.get('history.confirmClear', 'Are you sure you want to clear all history? This action cannot be undone.');
        
        if (confirm(confirmMessage)) {
            try {
                if (await Promise.resolve(historyService.clearHistory())) {
                    this.showNotification('All history cleared', 'success');
                } else {
                    this.showNotification('Failed to clear history', 'error');
                }
            } catch (error) {
                console.error('Error clearing history:', error);
                this.showNotification('Error clearing history', 'error');
            }
        }
    }

    async addConversionToHistory(conversionData) {
        if (!conversionData || typeof conversionData !== 'object') {
            console.error('Invalid conversion data:', conversionData);
            return false;
        }

        try {
            const success = await historyService.addHistory(conversionData);
            
            if (success) {
                // If we're currently on the history page, update the display
                if (window.location.hash === '#history') {
                    setTimeout(() => {
                        this.loadHistory();
                    }, 100);
                }
                return true;
            } else {
                this.showNotification('Failed to record activity', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error adding conversion to history:', error);
            return false;
        }
    }

    async filterHistory(query) {
        if (this.isLoading) return;

        if (!query || !query.trim()) {
            await this.loadHistory();
            return;
        }

        this.isLoading = true;
        
        try {
            const filteredHistory = historyService.searchHistory(query);
            const historyList = document.getElementById('history-list');
            const emptyState = document.getElementById('empty-history');

            if (!historyList) return;

            if (filteredHistory.length === 0) {
                historyList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🔍</div>
                        <h3>No results found</h3>
                        <p>No history items match "${this.escapeHtml(query)}"</p>
                    </div>
                `;
            } else {
                this.showHistoryList(historyList, emptyState, filteredHistory);
            }
        } catch (error) {
            console.error('Error filtering history:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // Helper methods
    truncateFileName(filename, maxLength = 25) {
        if (!filename || typeof filename !== 'string') return 'Unknown file';
        
        if (filename.length <= maxLength) return this.escapeHtml(filename);
        
        const extension = filename.split('.').pop();
        const nameWithoutExt = filename.substring(0, filename.length - extension.length - 1);
        const truncateLength = maxLength - extension.length - 3; // Account for "..."
        
        if (truncateLength <= 0) {
            return '...' + extension;
        }
        
        return this.escapeHtml(nameWithoutExt.substring(0, truncateLength) + '...' + extension);
    }

    formatFileSize(bytes) {
        return historyService.formatFileSize(bytes);
    }

    formatTextOperation(operation) {
        const operationMap = {
            'uppercase': 'Uppercase',
            'lowercase': 'Lowercase',
            'titlecase': 'Title Case',
            'camelcase': 'Camel Case',
            'snakecase': 'Snake Case',
            'reverse': 'Reverse',
            'remove-spaces': 'Remove Spaces',
            'copy': 'Copy to Clipboard',
            'encode': 'Encode',
            'decode': 'Decode',
            'compress': 'Compress',
            'format': 'Format'
        };
        
        return operationMap[operation] || operation;
    }

    showNotification(message, type = 'info') {
        // Simple notification system - could be enhanced with toast notifications
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Create toast notification if toast system exists
        if (window.showToast) {
            window.showToast(message, type);
        } else if (type === 'error') {
            // Fallback to alert for important errors
            alert(`Error: ${message}`);
        }
    }

    // Export history functionality
    exportHistory() {
        try {
            const data = historyService.exportHistory();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zaptools-history-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('History exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting history:', error);
            this.showNotification('Failed to export history', 'error');
        }
    }

    // Import history functionality
    async importHistory(file) {
        if (!file) {
            this.showNotification('No file selected', 'error');
            return;
        }

        if (file.type !== 'application/json') {
            this.showNotification('Please select a JSON file', 'error');
            return;
        }

        try {
            const success = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve(historyService.importHistory(e.target.result));
                };
                reader.onerror = () => resolve(false);
                reader.readAsText(file);
            });

            if (success) {
                // Notification will be shown via event listener
            } else {
                this.showNotification('Failed to import history - invalid file format', 'error');
            }
        } catch (error) {
            console.error('Error importing history:', error);
            this.showNotification('Error importing history file', 'error');
        }
    }

    // Method to be called by other services when conversions happen
    static recordConversion(type, data) {
        const historyData = {
            type: type,
            timestamp: Date.now(),
            ...data
        };
        
        window.dispatchEvent(new CustomEvent('conversionCompleted', {
            detail: historyData
        }));
    }

    // Get storage information
    getStorageInfo() {
        return historyService.getStorageInfo();
    }
}

// Export singleton instance
export const historyManager = new HistoryManager();
export default historyManager;