// -------------------------
// Router untuk ZapTools MVVM + Alpine.js
// -------------------------

import { views } from "./views.js";

export const Router = {
    routes: {},

    init() {
        // Gabungkan semua views ke dalam routes
        this.routes = views;

        // Dengarkan perubahan URL
        window.addEventListener("hashchange", () => this.handleRoute());
        window.addEventListener("DOMContentLoaded", () => this.handleRoute());
    },

    handleRoute() {
        let hash = window.location.hash || "#/home";
        let path = hash.replace("#", "");

        // Jika route tidak ada, fallback ke home
        if (!this.routes[path]) {
            path = "/home";
        }

        // Ambil template & viewmodel
        const { template, viewmodel } = this.routes[path];

        // Ambil root container
        const app = document.getElementById("app");
        if (!app) {
            console.error("ERROR: Elemen #app tidak ditemukan!");
            return;
        }

        // Kosongkan container
        app.innerHTML = "";

        // Inject template
        app.innerHTML = template;

        // IMPORTANT: re-init Alpine untuk halaman baru
        this.mountAlpine(viewmodel);
    },

    mountAlpine(viewmodel) {
        // Bersihkan instance Alpine sebelumnya
        if (window.Alpine) {
            window.Alpine.flushAndStopDeferringMutations?.();
        }

        // Jika halaman punya ViewModel
        if (typeof viewmodel === "function") {
            window.currentViewModel = viewmodel;
        } else {
            window.currentViewModel = () => ({});
        }

        // Re-start Alpine
        if (window.Alpine) {
            window.Alpine.start();
        }
    }
};