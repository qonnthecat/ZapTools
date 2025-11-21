// js/views/templates/template.js
import { HeaderTemplate } from './header.js';
import { FooterTemplate } from './footer.js';
import { NavigationTemplate } from './navigation.js';
import { HomeTemplate } from './home.js';
import { FeaturesTemplate } from './features.js';
import { SettingsTemplate } from './settings.js';
import { toolsLoader } from '../../tools/index.js';

export const MainTemplate = async () => {
    // Load semua tool templates
    const toolTemplates = await Promise.all(
        toolsLoader.getAllTools().map(tool => 
            toolsLoader.getToolTemplate(tool.id)
        )
    );

    const toolsHTML = toolTemplates.join('');

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