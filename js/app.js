// js/app.js (refactored to plugin-based routing)
import { Router } from './router.js';
import { ViewManager } from './views/index.js';
import translationService from './services/translation-service.js';
import { toolsRegistry, findToolByPath } from './tools-registry.js';

class ZapToolsApp {
    constructor() {
        this.viewManager = new ViewManager();
        // create routes from toolsRegistry
        const routes = toolsRegistry.map(tool => ({
            path: tool.path,
            handler: async () => this.showTool(tool.path)
        }));
        this.router = new Router(routes);
    }

    async init() {
        await this.viewManager.render();
        // initial navigation to current hash or default 'home'
        const initial = location.hash.replace('#','') || 'home';
        this.router.navigate(initial);
        // listen for hash changes
        window.addEventListener('hashchange', () => {
            const route = location.hash.replace('#','') || 'home';
            this.router.navigate(route);
        });
    }

    async showTool(path) {
        const tool = findToolByPath(path);
        const contentEl = document.getElementById('content');
        if (!tool) {
            contentEl.innerHTML = '<section class="container"><h2>Not found</h2></section>';
            return;
        }
        // show loader
        contentEl.innerHTML = '<section class="container"><div class="loading-message">Loading...</div></section>';
        // load template
        try {
            const templateFactory = await tool.template();
            const html = typeof templateFactory === 'function' ? templateFactory() : (templateFactory.default ? templateFactory.default() : '');
            contentEl.innerHTML = html;
            // initialize controller/service if provided
            if (tool.controller) {
                const module = await tool.controller();
                // common export names: init, default, or a named class with init()
                if (module && typeof module.init === 'function') {
                    module.init();
                } else if (module && typeof module.default === 'function') {
                    // default export as function or class
                    const exported = module.default;
                    if (exported.prototype && typeof exported.prototype.init === 'function') {
                        new exported().init();
                    } else if (typeof exported === 'function') {
                        exported();
                    }
                } else {
                    // try named class based on id (PascalCase)
                    const className = tool.id.split('-').map(p => p.charAt(0).toUpperCase()+p.slice(1)).join('');
                    if (module && typeof module[className] === 'function') {
                        try { new module[className]().init(); } catch(e) {}
                    }
                }
            }
            // update i18n texts
            this.viewManager.updateTextContent();
            // update active nav links
            this.viewManager.updateActiveNav(path);
        } catch (err) {
            console.error('Error loading tool', path, err);
            contentEl.innerHTML = '<section class="container"><h2>Error loading tool</h2></section>';
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = new ZapToolsApp();
    await app.init();
    // expose for debugging
    window.zapToolsApp = app;
});

export default ZapToolsApp;