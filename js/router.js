// js/router.js
export class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Handle initial route
        window.addEventListener('load', () => this.navigate(window.location.hash));

        // Handle hash changes
        window.addEventListener('hashchange', () => this.navigate(window.location.hash));

        // Handle popstate (browser back/forward)
        window.addEventListener('popstate', () => this.navigate(window.location.hash));
    }

    navigate(hash = '') {
        const route = hash.replace('#', '') || 'home';
        
        if (this.currentRoute === route) return;

        this.currentRoute = route;
        
        // Find matching route
        const matchingRoute = this.routes.find(r => r.path === route) || 
                            this.routes.find(r => r.path === 'home');

        if (matchingRoute) {
            // Update URL without triggering hashchange
            if (window.location.hash !== `#${route}`) {
                window.history.pushState(null, null, `#${route}`);
            }

            // Execute route handler
            matchingRoute.handler();
        }
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    // Navigation helper methods
    goTo(route) {
        this.navigate(`#${route}`);
    }

    back() {
        window.history.back();
    }

    forward() {
        window.history.forward();
    }
}