// views.js
// Optional helper for global view utilities

export const Views = {
    /**
     * Load a template by name (used by router)
     */
    async loadTemplate(name) {
        const module = await import(`./views/templates/${name}.js`);
        return module.default;
    },

    /**
     * Render HTML into the #app container
     */
    render(html) {
        const root = document.getElementById("app");
        if (root) root.innerHTML = html;
    }
};