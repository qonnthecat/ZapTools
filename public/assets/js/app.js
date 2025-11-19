import { router } from "./router.js";
import { loadNavbar } from "./components/navbar.js";
import { loadFooter } from "./components/footer.js";
import { initTheme } from "./components/theme.js";

loadNavbar();
loadFooter();
initTheme();

// SPA Router Start
router();
window.addEventListener("hashchange", router);