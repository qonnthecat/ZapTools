// js/services/history-manager.js
import historyService from './history-service.js';
import translationService from './translation-service.js';

export class HistoryManager {
    constructor() {
        this.initialized = false;
        this.currentLanguage = translationService.getCurrentLanguage();
    }

    init() {
        if (this.initialized) return;
        
        console.log('Initializing History Manager...');
        
        // Set up language change listener
        window.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail;
            this.loadHistory(); // Reload history to update translations
        });
        
        this.setupEventListeners();
        this.loadHistory();
        this.initialized = true;
    }

    setupEventListeners() {
        // Clear history button
        const clearHistoryBtn = document.getElementById('clear-history');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }

        // Listen for new conversions
        window.addEventListener('conversionCompleted', (e) => {
            this.addConversionToHistory(e.detail);
        });

        // Search functionality (optional enhancement)
        this.setupSearchFunctionality();
    }

    setupSearchFunctionality() {
        const searchInput = document.getElementById('history-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterHistory(e.target.value);
            });
        }
    }

    loadHistory() {
        const historyList = document.getElementById('history-list');
        const emptyState = document.getElementById('empty-history');
        
        if (!historyList) return;

        const history = historyService.getRecentActivities(20);
        const stats = historyService.getStatistics();

        // Update statistics
        this.updateStatistics(stats);

        if (history.length === 0) {
            this.showEmptyState(historyList, emptyState);
            return;
        }

        this.showHistoryList(historyList, emptyState, history);
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
        
        historyList.innerHTML = history.map((item, index) => 
            this.createHistoryItem(item, index)
        ).join('');
        
        // Add delete event listeners
        this.addDeleteEventListeners();
        
        // Add click event listeners for potential re-use
        this.addItemClickListeners();
    }

    createHistoryItem(item, index) {
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
                content = 'Conversion completed';
        }

        return `
            <div class="history-item ${index === 0 ? 'new-item' : ''}" 
                 data-id="${item.id}" 
                 data-type="${item.type}"
                 data-timestamp="${item.timestamp}">
                <div class="history-item-icon" title="${typeName}">${icon}</div>
                <div class="history-item-content">
                    <div class="history-item-header">
                        <span class="history-item-type">${typeName}</span>
                        <span class="history-item-time">${timeAgo}</span>
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
            content += `<br><small class="compression-info">${item.compressionRatio}% smaller</small>`;
        }
        
        return content;
    }

    createTextHistoryContent(item) {
        let content = '';
        
        if (item.operation) {
            content += `Operation: ${this.formatTextOperation(item.operation)}`;
        }
        
        if (item.input) {
            const preview = item.input.length > 50 ? 
                item.input.substring(0, 50) + '...' : item.input;
            content += `<br><small>"${preview}"</small>`;
        }
        
        if (item.inputLength && item.outputLength) {
            content += `<br><small>${item.inputLength} → ${item.outputLength} characters</small>`;
        }
        
        return content || 'Text conversion completed';
    }

    createColorHistoryContent(item) {
        if (item.color) {
            return `
                Color: ${item.color}
                <div class="color-preview" style="background-color: ${item.color};"></div>
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

    createAdditionalInfo(item) {
        const info = [];
        
        if (item.timestamp) {
            const date = new Date(item.timestamp).toLocaleString();
            info.push(`<small class="history-timestamp">${date}</small>`);
        }
        
        return info.length > 0 ? 
            `<div class="history-additional-info">${info.join('')}</div>` : '';
    }

    updateStatistics(stats) {
        const elements = {
            'image-count': stats.image,
            'text-count': stats.text,
            'color-count': stats.color,
            'password-count': stats.password
        };

        Object.entries(elements).forEach(([id, count]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = count;
                element.parentElement.style.display = count > 0 ? 'flex' : 'none';
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
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = button.getAttribute('data-id');
                this.deleteHistoryItem(id);
            });
        });
    }

    addItemClickListeners() {
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
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
        
        // Could implement re-use functionality here
        // For example, navigate to the corresponding tool with pre-filled data
        this.showItemDetails(id);
    }

    showItemDetails(id) {
        // Optional: Show detailed view of history item
        // This could be a modal or expanded view
        console.log('Show details for history item:', id);
    }

    deleteHistoryItem(id) {
        if (historyService.deleteHistoryItem(id)) {
            // Show confirmation
            this.showNotification('History item deleted', 'success');
            // Reload the history display
            this.loadHistory();
        } else {
            this.showNotification('Failed to delete history item', 'error');
        }
    }

    clearHistory() {
        const confirmMessage = translationService.get('history.confirmClear', 'Are you sure you want to clear all history?');
        
        if (confirm(confirmMessage)) {
            if (historyService.clearHistory()) {
                this.showNotification('All history cleared', 'success');
                this.loadHistory(); // Reload to show empty state
            } else {
                this.showNotification('Failed to clear history', 'error');
            }
        }
    }

    addConversionToHistory(conversionData) {
        if (historyService.addHistory(conversionData)) {
            // If we're currently on the history page, update the display
            if (window.location.hash === '#history') {
                // Add slight delay to show animation
                setTimeout(() => {
                    this.loadHistory();
                }, 100);
            }
            
            this.showNotification('Activity recorded in history', 'success');
            return true;
        } else {
            this.showNotification('Failed to record activity', 'error');
            return false;
        }
    }

    filterHistory(query) {
        if (!query.trim()) {
            this.loadHistory();
            return;
        }

        const filteredHistory = historyService.searchHistory(query);
        const historyList = document.getElementById('history-list');
        const emptyState = document.getElementById('empty-history');

        if (filteredHistory.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>No results found</h3>
                    <p>No history items match your search</p>
                </div>
            `;
        } else {
            this.showHistoryList(historyList, emptyState, filteredHistory);
        }
    }

    // Helper methods
    truncateFileName(filename, maxLength = 25) {
        if (filename.length <= maxLength) return filename;
        
        const extension = filename.split('.').pop();
        const nameWithoutExt = filename.substring(0, filename.length - extension.length - 1);
        const truncateLength = maxLength - extension.length - 3; // Account for "..."
        
        return nameWithoutExt.substring(0, truncateLength) + '...' + extension;
    }

    formatFileSize(bytes) {
        if (!bytes) return 'Unknown';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            'copy': 'Copy to Clipboard'
        };
        
        return operationMap[operation] || operation;
    }

    showNotification(message, type = 'info') {
        // Simple notification system - could be enhanced with toast notifications
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // For now, using alert for important notifications
        if (type === 'error') {
            alert(message);
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

    // Export history functionality
    exportHistory() {
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
    }

    // Import history functionality
    importHistory(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (historyService.importHistory(e.target.result)) {
                this.showNotification('History imported successfully', 'success');
                this.loadHistory();
            } else {
                this.showNotification('Failed to import history', 'error');
            }
        };
        reader.readAsText(file);
    }
}