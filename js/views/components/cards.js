// js/views/components/cards.js

/**
 * Card Components - Kumpulan komponen card yang reusable
 */
export const CardComponents = {
    /**
     * Feature Card untuk halaman home
     */
    renderFeatureCard(options) {
        const {
            icon = '📋',
            title = 'Feature',
            description = 'Feature description',
            route = '#',
            customClass = ''
        } = options;

        return `
            <div class="feature-card ${customClass}" data-route="${route}">
                <div class="feature-icon">${icon}</div>
                <h3 data-i18n="${title}">${title}</h3>
                <p data-i18n="${description}">${description}</p>
            </div>
        `;
    },

    /**
     * Tool Card untuk halaman features & tools
     */
    renderToolCard(options) {
        const {
            title = 'Tool',
            description = 'Tool description',
            customClass = ''
        } = options;

        return `
            <div class="tool-card ${customClass}">
                <h3 data-i18n="${title}">${title}</h3>
                ${description}
            </div>
        `;
    },

    /**
     * Converter Card khusus untuk konverter
     */
    renderConverterCard(options) {
        const {
            title = 'Converter',
            content = '',
            customClass = ''
        } = options;

        return `
            <div class="converter-card ${customClass}">
                <h3 data-i18n="${title}">${title}</h3>
                ${content}
            </div>
        `;
    },

    /**
     * Category Item untuk halaman features
     */
    renderCategoryItem(options) {
        const {
            title = 'Category',
            description = 'Category description',
            route = '#',
            customClass = ''
        } = options;

        return `
            <div class="category-item ${customClass}" data-route="${route}">
                <h4 data-i18n="${title}">${title}</h4>
                <p data-i18n="${description}">${description}</p>
            </div>
        `;
    },

    /**
     * Settings Group Card
     */
    renderSettingsGroup(options) {
        const {
            title = 'Settings',
            content = '',
            customClass = ''
        } = options;

        return `
            <div class="settings-group ${customClass}">
                <h3 data-i18n="${title}">${title}</h3>
                ${content}
            </div>
        `;
    },

    /**
     * Setting Item untuk dalam settings group
     */
    renderSettingItem(options) {
        const {
            title = 'Setting',
            description = 'Setting description',
            control = '', // HTML untuk toggle, select, dll
            customClass = ''
        } = options;

        return `
            <div class="setting-item ${customClass}">
                <div class="setting-info">
                    <h4 data-i18n="${title}">${title}</h4>
                    <p data-i18n="${description}">${description}</p>
                </div>
                ${control}
            </div>
        `;
    },

    /**
     * Toggle Switch untuk settings
     */
    renderToggleSwitch(options) {
        const {
            id = 'toggle',
            checked = false,
            customClass = ''
        } = options;

        return `
            <label class="toggle-switch ${customClass}">
                <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}>
                <span class="toggle-slider"></span>
            </label>
        `;
    }
};