// UTILITY FUNCTIONS - DuniaBercerita

class Utils {
    // Debounce function untuk optimasi performance
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Format tanggal Indonesia
    static formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Asia/Jakarta'
        };
        return date.toLocaleDateString('id-ID', options);
    }

    // Generate ID unik
    static generateId(prefix = 'article') {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `${prefix}_${timestamp}_${random}`;
    }

    // Validasi email
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validasi URL gambar
    static isValidImageUrl(url) {
        if (!url) return true; // URL kosong dianggap valid (gunakan default)
        try {
            new URL(url);
            return url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) != null;
        } catch {
            return false;
        }
    }

    // Escape karakter khusus regex
    static escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Highlight teks dalam hasil pencarian
    static highlightText(text, query) {
        if (!query || !text) return text;
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Generate excerpt dari konten
    static generateExcerpt(content, length = 150) {
        if (!content) return '';
        // Hapus markdown dan tag HTML sederhana
        const plainText = content
            .replace(/#{1,6}\s?/g, '') // Hapus header markdown
            .replace(/\*\*(.*?)\*\*/g, '$1') // Hapus bold
            .replace(/\*(.*?)\*/g, '$1') // Hapus italic
            .replace(/`(.*?)`/g, '$1') // Hapus inline code
            .replace(/\n/g, ' ') // Ganti newline dengan space
            .trim();
        
        return plainText.substring(0, length) + 
               (plainText.length > length ? '...' : '');
    }

    // Hitung waktu baca
    static calculateReadTime(content) {
        if (!content) return 1;
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    }

    // Get default image URL
    static getDefaultImage() {
        const defaultImages = [
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ];
        return defaultImages[Math.floor(Math.random() * defaultImages.length)];
    }

    // Sanitize input text
    static sanitizeInput(text) {
        if (!text) return '';
        return text
            .trim()
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    // Parse tags dari string
    static parseTags(tagString) {
        if (!tagString) return [];
        return tagString
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
            .slice(0, 10); // Maksimal 10 tags
    }

    // Show notification
    static showNotification(message, type = 'info', duration = 5000) {
        // Cari notification element yang sudah ada
        let notification = document.getElementById('global-notification');
        
        // Buat baru jika tidak ada
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'global-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
            `;
            document.body.appendChild(notification);
        }

        // Set style berdasarkan type
        const styles = {
            success: { background: '#4caf50' },
            error: { background: '#f44336' },
            warning: { background: '#ff9800' },
            info: { background: '#2196f3' }
        };

        Object.assign(notification.style, styles[type] || styles.info);
        notification.textContent = message;
        notification.style.display = 'block';

        // Sembunyikan setelah duration
        setTimeout(() => {
            notification.style.display = 'none';
        }, duration);
    }

    // Load JSON data dengan error handling
    static async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading JSON:', error);
            throw error;
        }
    }

    // Save data ke localStorage dengan backup
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            Utils.showNotification('Gagal menyimpan data sementara', 'error');
            return false;
        }
    }

    // Load data dari localStorage
    static loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Smooth scroll to element
    static scrollToElement(element, offset = 80) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Add CSS animation for notifications
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Export untuk penggunaan modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}