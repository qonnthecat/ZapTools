// js/views/templates/index.js
// Optional template registry (not required by router)
// Used only if you want to manually fetch templates by name.

export async function loadTemplate(name) {
    try {
        const module = await import(`./${name}.js`);
        return module.default;
    } catch (err) {
        console.error(`Template '${name}' not found`, err);
        return `<div class="error">Template '${name}' not found.</div>`;
    }
}