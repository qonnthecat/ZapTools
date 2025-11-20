// router.js
export class Router {
    constructor(routes) {
        this.routes = routes;
        window.addEventListener("hashchange", () => this.handleRoute());
    }

    async handleRoute() {
        const path = location.hash.replace("#", "") || "home";
        const route = this.routes[path] || this.routes["home"];

        const templateModule = await import(`./views/templates/${route.template}.js`);
        const viewHtml = templateModule.default;

        const root = document.getElementById("app");
        root.innerHTML = viewHtml;

        if (route.viewmodel) {
            const vmModule = await import(`./viewmodels/${route.viewmodel}.js`);
            vmModule.default();
        }
    }

    start() {
        this.handleRoute();
    }
}