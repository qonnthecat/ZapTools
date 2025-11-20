// router.js - simple router that fetches HTML partials and mounts them into #app

const routes = {
  '/': '/js/views/templates/home.html',
  '/home': '/js/views/templates/home.html',
  '/tools/color': '/js/views/templates/color-tools.html',
  '/tools/image': '/js/views/templates/image-converter.html',
  '/tools/text': '/js/views/templates/text-converter.html',
  '/tools/password': '/js/views/templates/password-generator.html',
  '/history': '/js/views/templates/history.html',
  '/settings': '/js/views/templates/settings.html',
  '/features': '/js/views/templates/home.html'
};

let appRoot = null;
let currentPath = null;

async function fetchHtml(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load ' + path);
  return await res.text();
}

async function navigateTo(path, replace = false) {
  try {
    const route = routes[path] || routes['/'];
    const html = await fetchHtml(route);

    // optional cleanup hook if the mounted component set window.__zaptools_unmount
    if (window.__zaptools_unmount && typeof window.__zaptools_unmount === 'function') {
      try { window.__zaptools_unmount(); } catch(e){ console.warn(e); }
      window.__zaptools_unmount = null;
    }

    appRoot.innerHTML = html;

    // initialize Alpine for this subtree
    if (window.Alpine && window.Alpine.initTree) {
      window.Alpine.initTree(appRoot);
    } else if (window.Alpine && window.Alpine.start) {
      // fallback: start (won't re-init trees if already started), try discover
      try { window.Alpine.initTree(appRoot); } catch(e) {}
    }

    // update history
    if (replace) history.replaceState({}, '', path);
    else history.pushState({}, '', path);

    currentPath = path;
  } catch (err) {
    console.error(err);
    appRoot.innerHTML = `<div class="error">Gagal memuat halaman. ${err.message}</div>`;
  }
}

export async function initRouter({ rootId = 'app' } = {}) {
  appRoot = document.getElementById(rootId);
  if (!appRoot) throw new Error('Root element not found: ' + rootId);

  // initial navigation based on location.pathname
  const initial = normalizePath(location.pathname);
  await navigateTo(initial, true);

  // handle link clicks (delegate) for internal navigation
  document.body.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-spa]');
    if (!a) return;
    e.preventDefault();
    const href = a.getAttribute('href');
    navigateTo(normalizePath(href));
  });

  // popstate
  window.addEventListener('popstate', () => {
    const p = normalizePath(location.pathname);
    if (p === currentPath) return;
    navigateTo(p, true);
  });
}

function normalizePath(p) {
  if (!p) return '/';
  // strip trailing slash
  try { const u = new URL(p, location.origin); return u.pathname || '/'; } catch(e) {}
  if (p.endsWith('/') && p.length > 1) return p.slice(0, -1);
  return p;
}

export { navigateTo };