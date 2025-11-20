// js/views/templates/navigation.js
import { toolsRegistry } from '../../tools-registry.js';
import translationService from '../../services/translation-service.js';

export const NavigationTemplate = () => {
    // Build navigation items from toolsRegistry where showInNav === true
    const items = toolsRegistry
        .filter(t => t.showInNav)
        .map(t => {
            const name = translationService.get(t.i18nKey) || t.id;
            return `
                <li class="bottom-nav-item">
                    <a href="#${t.path}" class="bottom-nav-link" data-tool="${t.id}">
                        <span class="bottom-nav-icon">${t.icon}</span>
                        <span class="bottom-nav-text" data-i18n="${t.i18nKey}">${name}</span>
                    </a>
                </li>
            `;
        }).join('\n');

    return `
        <nav class="bottom-bar">
            <ul class="bottom-nav">
                ${items}
            </ul>
        </nav>
    `;
};