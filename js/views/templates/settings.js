// js/views/templates/settings.js
import { CardComponents } from '../components/cards.js';

export const SettingsTemplate = () => {
    const darkModeToggle = CardComponents.renderToggleSwitch({
        id: 'dark-mode-toggle',
        checked: false
    });

    const languageSelector = `
        <select id="language-selector" class="form-control">
            <option value="en" data-i18n="settings.english">English</option>
            <option value="id" data-i18n="settings.indonesian">Indonesian</option>
        </select>
    `;

    const appearanceSettings = CardComponents.renderSettingsGroup({
        title: 'settings.appearance',
        content: `
            ${CardComponents.renderSettingItem({
                title: 'settings.darkMode',
                description: 'settings.darkModeDesc',
                control: darkModeToggle
            })}
            ${CardComponents.renderSettingItem({
                title: 'settings.language',
                description: 'settings.languageDesc',
                control: languageSelector
            })}
        `
    });

    const aboutSettings = CardComponents.renderSettingsGroup({
        title: 'settings.about',
        content: `
            ${CardComponents.renderSettingItem({
                title: 'settings.appVersion',
                description: 'settings.version'
            })}
            ${CardComponents.renderSettingItem({
                title: 'settings.developer',
                description: 'settings.developerDesc'
            })}
        `
    });

    return `
        <section id="settings" class="section">
            <div class="container">
                <div class="settings-container">
                    <h2 data-i18n="settings.title" style="text-align: center; margin-bottom: 30px; color: var(--primary-color);">Settings</h2>
                    ${appearanceSettings}
                    ${aboutSettings}
                </div>
            </div>
        </section>
    `;
};