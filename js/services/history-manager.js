// js/services/history-manager.js - Update createHistoryItem method
createHistoryItem(item) {
    const timeAgo = historyService.formatTimeAgo(item.timestamp);
    const typeName = historyService.getTypeDisplayName(item.type);
    const icon = historyService.getTypeIcon(item.type);
    
    let content = '';
    let detailsClass = '';
    
    switch (item.type) {
        case 'image':
            content = `Converted ${item.fromFormat} → ${item.toFormat}`;
            if (item.fileName) {
                content = `${this.truncateFileName(item.fileName)} (${item.fromFormat} → ${item.toFormat})`;
            }
            detailsClass = 'history-item-image';
            break;
            
        case 'text':
            const textPreview = item.input ? 
                (item.input.length > 30 ? item.input.substring(0, 30) + '...' : item.input) 
                : 'Text conversion';
            content = `${textPreview} → ${item.operation}`;
            detailsClass = 'history-item-text';
            break;
            
        case 'color':
            content = `Color: ${item.color}`;
            detailsClass = 'history-item-color';
            break;
            
        case 'password':
            content = `Generated ${item.length} character password`;
            if (item.hasUpper) content += ' + uppercase';
            if (item.hasNumbers) content += ' + numbers';
            if (item.hasSymbols) content += ' + symbols';
            detailsClass = 'history-item-password';
            break;
            
        default:
            content = 'Conversion';
    }

    return `
        <div class="history-item" data-id="${item.id}" data-type="${item.type}">
            <div class="history-item-icon">${icon}</div>
            <div class="history-item-content">
                <div class="history-item-header">
                    <span class="history-item-type">${typeName}</span>
                    <span class="history-item-time">${timeAgo}</span>
                </div>
                <div class="history-item-details ${detailsClass}">${content}</div>
            </div>
            <button class="history-item-delete" data-id="${item.id}" 
                    title="${translationService.get('history.delete', 'Delete')}"
                    aria-label="${translationService.get('history.delete', 'Delete')}">
                ×
            </button>
        </div>
    `;
}

// Add helper method for file name truncation
truncateFileName(filename, maxLength = 25) {
    if (filename.length <= maxLength) return filename;
    
    const extension = filename.split('.').pop();
    const nameWithoutExt = filename.substring(0, filename.length - extension.length - 1);
    const truncateLength = maxLength - extension.length - 3; // Account for "..."
    
    return nameWithoutExt.substring(0, truncateLength) + '...' + extension;
}