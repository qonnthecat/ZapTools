import { initRouter } from './router.js';

// App bootstrap: start router
window.addEventListener('DOMContentLoaded', async () => {
  await initRouter({ rootId: 'app' });
});