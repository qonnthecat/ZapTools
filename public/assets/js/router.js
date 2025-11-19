const routes = {
  "/": "home",
  "/artikel": "artikel",
  "/detail": "detail",
  "/komunitas": "komunitas",
  "/tentang": "tentang",
  "/kontak": "kontak",
};

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