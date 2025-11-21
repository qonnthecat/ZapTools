// js/views/templates/features.js
import { toolsLoader } from '../../../tools/index.js';

export const FeaturesTemplate = () => {
    const categories = toolsLoader.getCategories();
    
    const categoriesHTML = categories.map(category => {
        const tools = toolsLoader.getToolsByCategory(category.name);
        
        const toolsHTML = tools.map(tool => `
            <div class="category-item" data-route="${tool.route}">
                <div class="category-item-icon">${tool.icon}</div>
                <div class="category-item-content">
                    <h4 data-i18n="${tool.name}">${tool.name}</h4>
                    <p data-i18n="${tool.description}">${tool.description}</p>
                </div>
            </div>
        `).join('');

        return `
            <div class="feature-category">
                <h3>${category.icon} <span>${category.name}</span></h3>
                <p class="category-description">${category.description}</p>
                <div class="category-grid">
                    ${toolsHTML}
                </div>
            </div>
        `;
    }).join('');

    return `
        <section id="features" class="section">
            <div class="container">
                <div class="features-list">
                    <h2 data-i18n="features.allFeaturesTitle">All Features</h2>
                    ${categoriesHTML || '<p class="no-tools">No tools available</p>'}
                </div>
            </div>
        </section>
    `;
};