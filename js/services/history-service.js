
// ZapTools - History Service (Fixed and Enhanced Version)
const historyService = {
    storageKey: 'zaptools_history',
    maxItems: 50,

    _readStorage() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("History parse error:", e);
            return [];
        }
    },

    _writeStorage(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error("History save error:", e);
            return false;
        }
    },

    getHistory() {
        return this._readStorage();
    },

    addHistory(item) {
        if (!item || typeof item !== 'object') return false;

        const history = this._readStorage();

        // Ensure ID
        if (!item.id) {
            if (window.crypto && crypto.randomUUID) {
                item.id = crypto.randomUUID();
            } else {
                item.id = 'id-' + Math.random().toString(36).slice(2, 10);
            }
        }

        // Timestamp
        item.timestamp = item.timestamp || Date.now();

        // Remove duplicate ID if exists
        const filtered = history.filter(h => h.id !== item.id);

        // Add new item at top
        filtered.unshift(item);

        // Limit total items
        const limited = filtered.slice(0, this.maxItems);

        return this._writeStorage(limited);
    },

    clearHistory() {
        return this._writeStorage([]);
    },

    removeItemById(id) {
        if (!id) return false;
        const history = this._readStorage();
        const updated = history.filter(item => item.id !== id);
        return this._writeStorage(updated);
    },

    getRecentActivities(limit = 10) {
        return this._readStorage().slice(0, limit);
    },

    searchHistory(query) {
        if (!query) return this.getHistory();
        const q = query.toLowerCase();

        return this._readStorage().filter(item => {
            const text = JSON.stringify(item).toLowerCase();
            return text.includes(q);
        });
    },

    getStatistics() {
        const history = this._readStorage();
        const stats = { text: 0, color: 0, image: 0, password: 0 };

        history.forEach(item => {
            if (stats[item.type] !== undefined) stats[item.type]++;
        });

        return stats;
    },

    exportHistory() {
        return JSON.stringify(this._readStorage(), null, 2);
    },

    importHistory(jsonData) {
        try {
            const parsed = JSON.parse(jsonData);
            if (!Array.isArray(parsed)) return false;

            const existing = this._readStorage();

            // Merge + dedupe by id
            const map = new Map();
            [...existing, ...parsed].forEach(item => {
                if (item && item.id) map.set(item.id, item);
            });

            const merged = Array.from(map.values()).slice(0, this.maxItems);

            return this._writeStorage(merged);
        } catch (e) {
            console.error("Import error:", e);
            return false;
        }
    },

    // ------------ Utilities ------------

    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;

        const sec = Math.floor(diff / 1000);
        const min = Math.floor(sec / 60);
        const hr  = Math.floor(min / 60);
        const day = Math.floor(hr / 24);

        if (day > 0) return `${day} day(s) ago`;
        if (hr > 0) return `${hr} hour(s) ago`;
        if (min > 0) return `${min} minute(s) ago`;
        return `${sec} second(s) ago`;
    },

    getTypeDisplayName(type) {
        const names = {
            text: "Text Conversion",
            color: "Color Tools",
            image: "Image Tools",
            password: "Password Generator"
        };
        return names[type] || type;
    }
};

export default historyService;
