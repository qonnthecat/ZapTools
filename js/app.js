// app.js
import { Router } from "./router.js";

// ----------------------------
// ROUTE DEFINITIONS
// ----------------------------
const routes = {
    "home": {
        template: "home",
        viewmodel: "home.vm"
    },
    "features": {
        template: "features",
        viewmodel: "features.vm"
    },
    "tools": {
        template: "tools",
        viewmodel: "tools.vm"
    },
    "color-tools": {
        template: "color-tools",
        viewmodel: "color-tools.vm"
    },
    "text-converter": {
        template: "text-converter",
        viewmodel: "text-converter.vm"
    },
    "image-converter": {
        template: "image-converter",
        viewmodel: "image-converter.vm"
    },
    "password-generator": {
        template: "password-generator",
        viewmodel: "password-generator.vm"
    },
    "history": {
        template: "history",
        viewmodel: "history.vm"
    },
    "settings": {
        template: "settings",
        viewmodel: "settings.vm"
    }
};

// ----------------------------
// INIT ROUTER
// ----------------------------
const router = new Router(routes);
router.start();

// ----------------------------
// ALPINE INIT (DELAYED FOR ROUTER)
// ----------------------------
document.addEventListener("alpine:init", () => {
    console.log("Alpine initialized (router-controlled MVVM)");
});