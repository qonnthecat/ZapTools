// js/views/templates/settings.js
export const SettingsTemplate = () => {
    return `
        <section id="settings" class="section">
            <div class="container">
                <div class="settings-container">
                    <h2 data-i18n="settings.title" style="text-align: center; margin-bottom: 30px; color: var(--primary-color);">Settings</h2>
                    
                    <div class="settings-group">
                        <h3>🎨 <span data-i18n="settings.appearance">Appearance</span></h3>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4 data-i18n="settings.darkMode">Dark Mode</h4>
                                <p data-i18n="settings.darkModeDesc">Enable dark theme for eye comfort</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="dark-mode-toggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4 data-i18n="settings.language">Language</h4>
                                <p data-i18n="settings.languageDesc">Choose your preferred language</p>
                            </div>
                            <select id="language-selector" class="form-control">
                                <option value="en" data-i18n="settings.english">English</option>
                                <option value="id" data-i18n="settings.indonesian">Indonesian</option>
                            </select>
                        </div>
                    </div>

                    <div class="settings-group">
                        <h3>ℹ️ <span data-i18n="settings.about">About</span></h3>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4 data-i18n="settings.appVersion">App Version</h4>
                                <p data-i18n="settings.version">ZapTools v1.0.0</p>
                            </div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-info">
                                <h4 data-i18n="settings.developer">Developer</h4>
                                <p data-i18n="settings.developerDesc">Made with ❤️ for your convenience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
};