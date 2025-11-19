// js/views/templates/index.js
import { HeaderTemplate } from './header.js';
import { FooterTemplate } from './footer.js';
import { NavigationTemplate } from './navigation.js';
import { HomeTemplate } from './home.js';
import { FeaturesTemplate } from './features.js';
import { ImageConverterTemplate } from './image-converter.js';
import { TextConverterTemplate } from './text-converter.js';
import { ColorToolsTemplate } from './color-tools.js';
import { PasswordGeneratorTemplate } from './password-generator.js';
import { SettingsTemplate } from './settings.js';

export const MainTemplate = () => {
    return `
        ${HeaderTemplate()}
        
        <main class="main">
            ${HomeTemplate()}
            ${FeaturesTemplate()}
            ${ImageConverterTemplate()}
            ${TextConverterTemplate()}
            ${ColorToolsTemplate()}
            ${PasswordGeneratorTemplate()}
            ${SettingsTemplate()}
        </main>

        ${NavigationTemplate()}
        ${FooterTemplate()}
    `;
};

// Export individual templates for dynamic loading if needed
export {
    HeaderTemplate,
    FooterTemplate,
    NavigationTemplate,
    HomeTemplate,
    FeaturesTemplate,
    ImageConverterTemplate,
    TextConverterTemplate,
    ColorToolsTemplate,
    PasswordGeneratorTemplate,
    SettingsTemplate
};