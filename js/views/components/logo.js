// js/views/components/logo.js

/**
 * Logo Component - Reusable logo dengan berbagai variasi
 */
export const LogoComponent = {
    /**
     * Generate logo markup dengan berbagai ukuran dan style
     * @param {Object} options - Opsi konfigurasi logo
     * @param {string} options.size - Ukuran logo ('small', 'medium', 'large')
     * @param {boolean} options.showText - Tampilkan teks atau icon only
     * @param {boolean} options.withGlow - Tambahkan efek glow
     * @param {boolean} options.clickable - Jadikan logo bisa diklik
     * @param {string} options.customClass - Class custom tambahan
     * @returns {string} HTML markup untuk logo
     */
    render(options = {}) {
        const {
            size = 'medium',
            showText = true,
            withGlow = true,
            clickable = true,
            customClass = ''
        } = options;

        const sizeClasses = {
            small: 'logo-small',
            medium: '',
            large: 'logo-large'
        };

        const classes = [
            'logo',
            sizeClasses[size],
            withGlow ? 'logo-glow' : '',
            !showText ? 'logo-icon-only' : '',
            clickable ? 'logo-clickable' : '',
            customClass
        ].filter(Boolean).join(' ');

        const logoText = showText ? `
            <div class="logo-text">
                <h1 data-i18n="app.title">ZapTools</h1>
                <p data-i18n="app.tagline">Practical online utility tools</p>
            </div>
        ` : '';

        return `
            <div class="${classes}">
                <div class="logo-container">
                    <img src="images/logos/transparent.png" alt="ZapTools Logo" class="logo-image">
                    ${logoText}
                </div>
            </div>
        `;
    },

    /**
     * Logo khusus untuk footer (lebih kecil dan sederhana)
     */
    renderFooter() {
        return `
            <div class="footer-logo">
                <img src="images/logos/transparent.png" alt="ZapTools" class="footer-logo-image">
                <span data-i18n="app.title">ZapTools</span>
            </div>
        `;
    },

    /**
     * Logo untuk loading state
     */
    renderLoading() {
        return `
            <div class="logo logo-loading">
                <div class="logo-container">
                    <img src="images/logos/transparent.png" alt="ZapTools Logo" class="logo-image">
                    <div class="logo-text">
                        <h1 data-i18n="app.title">ZapTools</h1>
                    </div>
                </div>
            </div>
        `;
    }
};