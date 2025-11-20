// js/tools-registry.js
// Central registry of tools (plugin-style). Each tool describes how to load its template and optional controller/service.
// To add a new tool, add an entry here with: id, path, icon, i18nKey, template loader, optional controller loader, showInNav.
export const toolsRegistry = [
    {
        id: 'home',
        path: 'home',
        icon: '🏠',
        i18nKey: 'navigation.home',
        showInNav: true,
        template: () => import('./tools/home/index.js').then(m => m.template),
        controller: () => import('./tools/home/index.js').then(m => m.controller)
    },
    {
        id: 'features',
        path: 'features',
        icon: '📋',
        i18nKey: 'navigation.features',
        showInNav: true,
        template: () => import('./tools/features/index.js').then(m => m.template),
        controller: () => import('./tools/features/index.js').then(m => m.controller)
    },
    {
        id: 'image-converter',
        path: 'image-converter',
        icon: '🖼️',
        i18nKey: 'navigation.imageConverter',
        showInNav: true,
        template: () => import('./tools/image-converter/index.js').then(m => m.template),
        controller: () => import('./tools/image-converter/index.js').then(m => m.controller)
    },
    {
        id: 'text-converter',
        path: 'text-converter',
        icon: '✍️',
        i18nKey: 'navigation.textConverter',
        showInNav: true,
        template: () => import('./tools/text-converter/index.js').then(m => m.template),
        controller: () => import('./tools/text-converter/index.js').then(m => m.controller)
    },
    {
        id: 'color-tools',
        path: 'color-tools',
        icon: '🎨',
        i18nKey: 'navigation.colorTools',
        showInNav: true,
        template: () => import('./tools/color-tools/index.js').then(m => m.template),
        controller: () => import('./tools/color-tools/index.js').then(m => m.controller)
    },
    {
        id: 'password-generator',
        path: 'password-generator',
        icon: '🔑',
        i18nKey: 'navigation.passwordGenerator',
        showInNav: true,
        template: () => import('./tools/password-generator/index.js').then(m => m.template),
        controller: () => import('./tools/password-generator/index.js').then(m => m.controller)
    },
    {
        id: 'history',
        path: 'history',
        icon: '🕒',
        i18nKey: 'navigation.history',
        showInNav: true,
        template: () => import('./tools/history/index.js').then(m => m.template),
        controller: () => import('./tools/history/index.js').then(m => m.controller)
    },
    {
        id: 'settings',
        path: 'settings',
        icon: '⚙️',
        i18nKey: 'navigation.settings',
        showInNav: true,
        template: () => import('./tools/settings/index.js').then(m => m.template),
        controller: () => import('./tools/settings/index.js').then(m => m.controller)
    }
];

export function findToolByPath(path) {
    return toolsRegistry.find(t => t.path === path) || null;
}