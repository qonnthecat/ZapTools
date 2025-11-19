// MAIN JAVASCRIPT - DuniaBercerita
// Final version with complete functionality

// Global configuration
const CONFIG = {
    debug: true,
    animationEnabled: true,
    lazyLoadingEnabled: true
};

// Utility functions
const DomUtils = {
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Add loading animation to elements
    addLoadingAnimation: (elements) => {
        if (!CONFIG.animationEnabled) return;

        elements.forEach(el => {
            if (el && !el.hasAttribute('data-animated')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.setAttribute('data-animated', 'true');
            }
        });
    },

    // Animate elements when they come into view
    setupScrollAnimations: () => {
        if (!CONFIG.animationEnabled) return;

        const animatedElements = document.querySelectorAll('[data-animated]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }
};

// Newsletter functionality
class NewsletterManager {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            if (CONFIG.debug) console.log('Newsletter manager initialized');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const emailInput = this.form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (this.validateEmail(email)) {
            this.subscribe(email);
        } else {
            this.showMessage('Please enter a valid email address.', 'error');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    subscribe(email) {
        // Show loading state
        this.showLoadingState(true);

        // Simulate API call
        setTimeout(() => {
            this.showLoadingState(false);
            this.showMessage('Thank you for subscribing to our newsletter!', 'success');
            this.form.reset();
            
            // Log for analytics
            if (CONFIG.debug) {
                console.log('New newsletter subscription:', email);
            }
        }, 1500);
    }

    showLoadingState(show) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            if (show) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Subscribe';
            }
        }
    }

    showMessage(message, type) {
        // Use Utils if available, otherwise create basic notification
        if (window.Utils && typeof window.Utils.showNotification === 'function') {
            window.Utils.showNotification(message, type);
        } else {
            // Fallback notification
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Image lazy loading with Intersection Observer
class LazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if (!CONFIG.lazyLoadingEnabled) return;

        if ('IntersectionObserver' in window) {
            this.setupObserver();
        } else {
            this.loadAllImages(); // Fallback for older browsers
        }
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        this.observeImages();
    }

    observeImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            this.observer.observe(img);
        });

        if (CONFIG.debug) {
            console.log(`Observing ${images.length} lazy images`);
        }
    }

    loadImage(img) {
        if (img.getAttribute('data-loaded')) return;

        img.setAttribute('data-loaded', 'true');
        
        // Add loading animation
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            img.style.opacity = '1';
            
            // Hide loading indicator if exists
            const loadingIndicator = img.previousElementSibling;
            if (loadingIndicator && loadingIndicator.classList.contains('image-loading')) {
                loadingIndicator.style.display = 'none';
            }
        }, 300);
    }

    loadAllImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            this.loadImage(img);
        });
    }
}

// Category filter functionality
class CategoryFilter {
    constructor() {
        this.categoryCards = document.querySelectorAll('.category-card');
        this.init();
    }

    init() {
        if (this.categoryCards.length > 0) {
            this.bindEvents();
            if (CONFIG.debug) console.log('Category filter initialized');
        }
    }

    bindEvents() {
        this.categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                this.filterByCategory(category);
            });
        });
    }

    filterByCategory(category) {
        // Scroll to articles section
        const articlesSection = document.getElementById('artikel');
        if (articlesSection) {
            articlesSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Show loading state
        const container = document.getElementById('articles-container');
        if (container) {
            container.innerHTML = `
                <div class="loading" style="grid-column: 1 / -1;">
                    <i class="fas fa-spinner fa-spin"></i> 
                    Memuat artikel ${category ? `dalam kategori: ${this.formatCategoryName(category)}` : ''}...
                </div>
            `;
        }

        // Simulate filtering (in real app, this would be an API call)
        setTimeout(() => {
            this.displayFilteredArticles(category);
        }, 1000);
    }

    displayFilteredArticles(category) {
        const message = category ? 
            `Menampilkan artikel dalam kategori: ${this.formatCategoryName(category)}` :
            'Menampilkan semua artikel';
        
        const container = document.getElementById('articles-container');
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <h3>${message}</h3>
                    <p>Fitur filter kategori akan tersedia segera!</p>
                    <button onclick="window.mainApp.loadArticles()" class="cta-button" style="margin-top: 20px;">
                        Tampilkan Semua Artikel
                    </button>
                </div>
            `;
        }
    }

    formatCategoryName(category) {
        const categoryMap = {
            'berita': 'Berita',
            'fakta-unik': 'Fakta Unik',
            'inovasi': 'Inovasi',
            'tips': 'Tips Praktis',
            'teknologi': 'Teknologi',
            'sains': 'Sains'
        };
        return categoryMap[category] || category;
    }
}

// Main application controller
class MainApp {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        this.initializeComponents();
        this.setupEventListeners();
        this.setupErrorHandling();
        
        if (CONFIG.debug) {
            console.log('🏠 DuniaBercerita main app initialized');
            console.log('Active components:', Object.keys(this.components));
        }
    }

    initializeComponents() {
        // Initialize DOM animations
        this.initializeAnimations();

        // Initialize newsletter if available
        if (document.getElementById('newsletter-form')) {
            this.components.newsletter = new NewsletterManager();
        }

        // Initialize lazy loading
        this.components.lazyLoader = new LazyLoader();

        // Initialize category filter
        this.components.categoryFilter = new CategoryFilter();

        // Load articles if on homepage
        if (document.getElementById('articles-container')) {
            this.loadArticles();
        }

        // Initialize article content if on article page
        if (document.getElementById('article-content')) {
            this.loadArticleContent();
        }
    }

    initializeAnimations() {
        // Add loading animation to key elements
        const elementsToAnimate = [
            '.hero-content', '.hero-image',
            '.article-card', '.category-card',
            '.featured-articles', '.categories'
        ];

        elementsToAnimate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            DomUtils.addLoadingAnimation(elements);
        });

        // Setup scroll animations
        DomUtils.setupScrollAnimations();
    }

    setupEventListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.onPageVisible();
            }
        });

        // Handle window resize with debounce
        window.addEventListener('resize', Utils.debounce(() => {
            this.onWindowResize();
        }, 250));

        // Handle beforeunload for cleanup
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showErrorNotification('A system error occurred');
        });

        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.showErrorNotification('A network error occurred');
        });
    }

    async loadArticles() {
        const container = document.getElementById('articles-container');
        if (!container) return;

        try {
            // Show loading state
            container.innerHTML = `
                <div class="loading" style="grid-column: 1 / -1;">
                    <i class="fas fa-spinner fa-spin"></i> Memuat artikel...
                </div>
            `;

            // Use CMS if available, otherwise load from JSON directly
            if (window.cmsCore && typeof window.cmsCore.loadArticles === 'function') {
                const articles = await window.cmsCore.loadArticles();
                this.displayArticles(articles);
            } else {
                // Fallback: load directly from JSON
                const response = await fetch('data/articles.json');
                const articles = await response.json();
                this.displayArticles(articles);
            }
        } catch (error) {
            console.error('Error loading articles:', error);
            this.showErrorState(container, 'Gagal memuat artikel');
        }
    }

    displayArticles(articles) {
        const container = document.getElementById('articles-container');
        if (!container) return;

        if (!articles || articles.length === 0) {
            this.showEmptyState(container);
            return;
        }

        const articlesHTML = articles.map(article => `
            <article class="article-card">
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
                <div class="article-content">
                    <h3><a href="article.html?id=${article.id}">${article.title}</a></h3>
                    <p class="article-meta">
                        <i class="fas fa-user"></i> ${article.author} 
                        • <i class="fas fa-calendar"></i> ${Utils.formatDate(article.date)}
                    </p>
                    <p>${article.excerpt}</p>
                    <div class="article-tags">
                        ${article.tags ? article.tags.map(tag => 
                            `<span class="tag">${tag}</span>`
                        ).join('') : ''}
                    </div>
                    <a href="article.html?id=${article.id}" class="read-more">
                        Baca Selengkapnya <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `).join('');

        container.innerHTML = articlesHTML;

        // Re-initialize animations for new articles
        const newArticleCards = container.querySelectorAll('.article-card');
        DomUtils.addLoadingAnimation(newArticleCards);
        DomUtils.setupScrollAnimations();
    }

    loadArticleContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        
        if (!articleId) {
            window.location.href = 'index.html';
            return;
        }

        this.fetchAndDisplayArticle(articleId);
    }

    async fetchAndDisplayArticle(articleId) {
        const container = document.getElementById('article-content');
        if (!container) return;

        try {
            let article;
            
            // Try to get article from CMS first
            if (window.cmsCore && typeof window.cmsCore.getArticle === 'function') {
                article = window.cmsCore.getArticle(articleId);
            }

            // Fallback: load from JSON
            if (!article) {
                const response = await fetch('data/articles.json');
                const articles = await response.json();
                article = articles.find(a => a.id === articleId);
            }

            if (!article) {
                this.showArticleNotFound(container);
                return;
            }

            this.displayArticleContent(container, article);
            this.loadRelatedArticles(article);

        } catch (error) {
            console.error('Error loading article:', error);
            this.showErrorState(container, 'Gagal memuat artikel');
        }
    }

    displayArticleContent(container, article) {
        container.innerHTML = `
            <h1 class="article-title">${article.title}</h1>
            <p class="meta-info">
                Oleh <span class="author">${article.author}</span> | 
                <time datetime="${article.date}">${Utils.formatDate(article.date)}</time> | 
                <span class="reading-time">${article.readTime || 5} menit membaca</span>
            </p>
            
            ${article.image ? `
                <div class="featured-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
            ` : ''}
            
            <div class="article-content">
                ${article.content.split('\n').map(paragraph => 
                    paragraph.trim() ? `<p>${paragraph}</p>` : ''
                ).join('')}
                
                ${article.tags && article.tags.length > 0 ? `
                    <div class="article-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    loadRelatedArticles(currentArticle) {
        // Implementation for related articles
        const container = document.getElementById('related-articles');
        if (!container) return;

        // This would typically fetch related articles based on category/tags
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p>Fitur artikel terkait akan segera tersedia</p>
            </div>
        `;
    }

    showEmptyState(container) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-newspaper"></i>
                <h3>Belum ada artikel</h3>
                <p>Artikel akan muncul di sini setelah dibuat.</p>
            </div>
        `;
    }

    showErrorState(container, message) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Terjadi Kesalahan</h3>
                <p>${message}</p>
                <button onclick="window.mainApp.loadArticles()" class="cta-button">
                    Coba Lagi
                </button>
            </div>
        `;
    }

    showArticleNotFound(container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Artikel Tidak Ditemukan</h3>
                <p>Artikel yang Anda cari tidak ditemukan atau telah dihapus.</p>
                <a href="index.html" class="cta-button">Kembali ke Beranda</a>
            </div>
        `;
    }

    showErrorNotification(message) {
        if (window.Utils && typeof window.Utils.showNotification === 'function') {
            window.Utils.showNotification(message, 'error');
        } else {
            console.error('Error:', message);
        }
    }

    onPageVisible() {
        // Refresh data when page becomes visible again
        if (CONFIG.debug) console.log('Page became visible');
    }

    onWindowResize() {
        // Handle responsive behavior
        if (CONFIG.debug) console.log('Window resized');
    }

    cleanup() {
        // Cleanup resources
        if (this.components.lazyLoader && this.components.lazyLoader.observer) {
            this.components.lazyLoader.observer.disconnect();
        }
    }

    // Public method to reload articles
    reloadArticles() {
        this.loadArticles();
    }

    // Public method to refresh the app
    refresh() {
        this.cleanup();
        this.init();
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other components to initialize
    setTimeout(() => {
        window.mainApp = new MainApp();
    }, 100);
});

// Make main app available globally
window.MainApp = MainApp;

// Export untuk penggunaan modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MainApp,
        NewsletterManager,
        LazyLoader,
        CategoryFilter,
        DomUtils,
        CONFIG
    };
}