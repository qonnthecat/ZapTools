// Main application script
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Load header dan footer
    await loadComponent('header', 'header');
    await loadComponent('footer', 'footer');
    
    // Load data
    articlesModule.loadFeaturedArticles();
    categoriesModule.displayCategories();
    
    // Setup event listeners
    setupEventListeners();
}

// Load komponen HTML
async function loadComponent(componentName, elementId) {
    try {
        const response = await fetch(`/components/${componentName}.html`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${componentName}:`, error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchArticles();
            }
        });
    }
}

// Global search function
async function searchArticles() {
    const query = document.getElementById('searchInput').value;
    if (query.trim()) {
        const results = await articlesModule.searchArticles(query);
        // Redirect ke halaman pencarian dengan results
        window.location.href = `/pages/articles/index.html?search=${encodeURIComponent(query)}`;
    }
}