const routes = {
  "/": "home",
  "/artikel": "artikel",
  "/detail": "detail",
  "/komunitas": "komunitas",
  "/tentang": "tentang",
  "/kontak": "kontak",
};

export function highlightNav() {
  const current = location.hash.replace("#", "") || "/";
  const items = document.querySelectorAll(".nav-item");

  items.forEach((item) => item.classList.remove("active"));
  items.forEach((item) => {
    const href = item.getAttribute("href");
    if (href === `#${current}`) {
      item.classList.add("active");
    }
  });
}

export function router() {
  const hash = location.hash.replace("#", "") || "/";
  const pageName = routes[hash.split("?")[0]];

  if (!pageName) {
    document.getElementById("app").innerHTML = "<h2>404 - Halaman tidak ditemukan.</h2>";
    return;
  }

  import(`./pages/${pageName}.js`)
    .then((module) => {
      document.getElementById("app").innerHTML = module.render();
      module.init && module.init();
    })
    .catch(() => {
      document.getElementById("app").innerHTML = "<h2>Error load halaman.</h2>";
    });
}