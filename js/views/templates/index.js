// js/views/templates/index.js
import { HeaderTemplate } from './header.js';
import { FooterTemplate } from './footer.js';
import { NavigationTemplate } from './navigation.js';

// MainTemplate now renders header, navigation, footer and a content placeholder (#content).
// Individual tool templates will be injected into #content by the router dynamically.
export const MainTemplate = () => {
    return `
        ${HeaderTemplate()}
        <main id="content" class="content-area">
            <!-- Tool content will be injected here -->
            <section class="container">
                <div class="loading-message" data-i18n="app.loading">Loading...</div>
            </section>
        </main>
        ${NavigationTemplate()}
        ${FooterTemplate()}
    `;
};

export { HeaderTemplate, FooterTemplate, NavigationTemplate };