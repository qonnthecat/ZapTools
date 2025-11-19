// CMS Functions for DuniaBercerita

const ARTICLES_DATA_URL = 'data/articles.json';

// Load articles for homepage
async function loadArticles() {
    try {
        const response = await fetch(ARTICLES_DATA_URL);
        const articles = await response.json();
        displayArticles(articles);
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articles-container').innerHTML = 
            '<p>Error memuat artikel. Silakan refresh halaman.</p>';
    }
}

// Display articles on homepage
function displayArticles(articles) {
    const container = document.getElementById('articles-container');
    
    if (!articles || articles.length === 0) {
        container.innerHTML = '<p>Belum ada artikel yang tersedia.</p>';
        return;
    }

    const articlesHTML = articles.map(article => `
        <article class="article-card">
            <div class="article-image">
                <img src="${article.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" 
                     alt="${article.title}" loading="lazy">
            </div>
            <div class="article-content">
                <h3><a href="article.html?id=${article.id}">${article.title}</a></h3>
                <p class="article-meta">Oleh ${article.author} • ${formatDate(article.date)}</p>
                <p>${article.excerpt || article.content.substring(0, 150)}...</p>
                <div class="article-tags">
                    ${article.tags ? article.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <a href="article.html?id=${article.id}" class="read-more">Baca Selengkapnya</a>
            </div>
        </article>
    `).join('');

    container.innerHTML = articlesHTML;
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchSubmit = document.getElementById('search-submit');

    if (!searchInput) return;

    let allArticles = [];

    // Load articles for search
    fetch(ARTICLES_DATA_URL)
        .then(response => response.json())
        .then(articles => {
            allArticles = articles;
        })
        .catch(error => {
            console.error('Error loading articles for search:', error);
        });

    function performSearch(query) {
        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }

        const results = allArticles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            (article.tags && article.tags.some(tag => 
                tag.toLowerCase().includes(query.toLowerCase())
            ))
        );

        displaySearchResults(results, query);
    }

    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p>Tidak ditemukan artikel untuk "${query}"</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map(article => `
                <div class="search-result-item" onclick="window.location.href='article.html?id=${article.id}'">
                    <h4>${highlightText(article.title, query)}</h4>
                    <p>${article.excerpt || article.content.substring(0, 100)}...</p>
                </div>
            `).join('');
        }
        
        searchResults.classList.add('active');
    }

    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    searchSubmit.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && !searchInput.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// CMS Functions for Admin Panel
function setupFormHandler() {
    const form = document.getElementById('article-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveArticle();
    });
}

async function saveArticle() {
    const form = document.getElementById('article-form');
    const formData = new FormData(form);
    
    const article = {
        id: generateId(),
        title: formData.get('title'),
        author: formData.get('author'),
        category: formData.get('category'),
        image: formData.get('image'),
        content: formData.get('content'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
        date: new Date().toISOString().split('T')[0],
        excerpt: formData.get('content').substring(0, 150) + '...'
    };

    try {
        // Load existing articles
        const response = await fetch(ARTICLES_DATA_URL);
        const articles = await response.json();
        
        // Add new article
        articles.unshift(article);
        
        // In a real application, you would send this to a server
        // For demo purposes, we'll just show a success message
        showNotification('Artikel berhasil disimpan!', 'success');
        form.reset();
        
        // Reload articles list
        loadArticlesList();
        
    } catch (error) {
        console.error('Error saving article:', error);
        showNotification('Error menyimpan artikel', 'error');
    }
}

async function loadArticlesList() {
    try {
        const response = await fetch(ARTICLES_DATA_URL);
        const articles = await response.json();
        displayArticlesList(articles);
    } catch (error) {
        console.error('Error loading articles list:', error);
    }
}

function displayArticlesList(articles) {
    const container = document.getElementById('articles-list');
    
    if (!articles || articles.length === 0) {
        container.innerHTML = '<p>Belum ada artikel.</p>';
        return;
    }

    const articlesHTML = articles.map(article => `
        <div class="article-item">
            <div class="article-info">
                <h3>${article.title}</h3>
                <p class="article-meta">
                    Oleh ${article.author} • ${formatDate(article.date)} • ${article.category}
                </p>
            </div>
            <div class="article-actions">
                <button class="btn btn-small btn-secondary" onclick="editArticle('${article.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteArticle('${article.id}')">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = articlesHTML;
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function generateId() {
    return 'article_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
});

// Placeholder functions for edit/delete
function editArticle(id) {
    showNotification('Fitur edit akan segera tersedia', 'success');
}

function deleteArticle(id) {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
        showNotification('Artikel berhasil dihapus', 'success');
        // In real implementation, remove from articles array and update JSON
    }
}