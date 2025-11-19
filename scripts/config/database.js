// Konfigurasi Database Neon
const DB_CONFIG = {
    connectionString: 'your_neon_connection_string_here',
    // Untuk keamanan, simpan di environment variables Netlify
};

// API Base URL untuk Netlify Functions
const API_BASE = '/.netlify/functions';

// Export untuk digunakan di modul lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DB_CONFIG, API_BASE };
}