// js/views/templates/template.js
import { HeaderTemplate } from './header.js';
import { FooterTemplate } from './footer.js';
import { NavigationTemplate } from './navigation.js';
import { HomeTemplate } from './home.js';
import { FeaturesTemplate } from './features.js';
import { SettingsTemplate } from './settings.js';
import { toolsLoader } from '../../tools/index.js';

// Template utama tidak bisa async, jadi kita buat sync
export const MainTemplate = () => {
    // Tools templates akan di-load nanti oleh ViewManager
    const toolsHTML = `
        <!-- Tools sections will be loaded dynamically -->
    `;

    return `
        ${HeaderTemplate()}
        
        <main class="main">
            ${HomeTemplate()}
            ${FeaturesTemplate()}
            ${toolsHTML}
            ${SettingsTemplate()}
        </main>

        ${NavigationTemplate()}
        ${FooterTemplate()}
    `;
};

export {
    HeaderTemplate,
    FooterTemplate,
    NavigationTemplate,
    HomeTemplate,
    FeaturesTemplate,
    SettingsTemplate
};