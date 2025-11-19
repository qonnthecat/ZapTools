// CMS MANAGEMENT SYSTEM - DuniaBercerita

class CMSManager {
    constructor() {
        this.articles = [];
        this.currentArticle = null;
        this.ARTICLES_DATA_URL = 'data/articles.json';
        this.init();
    }

    async init() {
        await this.loadArticles();
        this.setupEventListeners();
        this.initializeComponents();
    }

    // Load articles from JSON file
    async loadArticles() {
        try {
            const response = await fetch(this.ARTICLES_DATA_URL);
            if (!response.ok) throw new Error('Failed to load articles');
            
            this.articles = await response.json();
            this.displayStats();
            
            if (typeof displayArticles === 'function') {
                displayArticles(this.articles);
            }
            
            if (typeof loadArticlesList === 'function') {
                loadArticlesList();
            }
            
            return this.articles;
        } catch (error) {
            console.error('Error loading articles:', error);
            this.showNotification('Gagal memuat artikel: ' + error.message, 'error');
            return [];
        }
    }

    // Setup all event listeners
    setupEventListeners() {
        // Article form submission
        const articleForm = document.getElementById('article-form');
        if (articleForm) {
            articleForm.addEventListener('submit', (e) => this.handleArticleSubmit(e));
        }

        // Search functionality
        this.setupSearch();

        // Category filtering
        this.setupCategoryFilter();

        // Image URL validation
        this.setupImageValidation();
    }

    // Initialize various components
    initializeComponents() {
        this.setupRichTextEditor();
        this.setupAutoSave();
    }

    // Handle article form submission
    async handleArticleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const articleData = this.prepareArticleData(formData);
        
        if (this.validateArticle(articleData)) {
            await this.saveArticle(articleData);
        }
    }

    // Prepare article data from form
    prepareArticleData(formData) {
        return {
            id: this.currentArticle?.id || this.generateArticleId(),
            title: formData.get('title').trim(),
            author: formData.get('author').trim(),
            category: formData.get('category'),
            image: formData.get('image').trim() || this.getDefaultImage(),
            content: formData.get('content').trim(),
            tags: formData.get('tags') ? 
                formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) 
                : [],
            date: new Date().toISOString().split('T')[0],
            excerpt: this.generateExcerpt(formData.get('content')),
            readTime: this.calculateReadTime(formData.get('content'))
        };
    }

    // Validate article data
    validateArticle(article) {
        const errors = [];

        if (!article.title) errors.push('Judul artikel harus diisi');
        if (!article.author) errors.push('Nama penulis harus diisi');
        if (!article.category) errors.push('Kategori harus dipilih');
        if (!article.content) errors.push('Konten artikel harus diisi');
        if (article.content.length < 50) errors.push('Konten artikel terlalu pendek (minimal 50 karakter)');

        if (errors.length > 0) {
            this.showNotification(errors.join(', '), 'error');
            return false;
        }

        return true;
    }

    // Save article to JSON (simulated)
    async saveArticle(articleData) {
        try {
            // If editing existing article, update it
            if (this.currentArticle) {
                const index = this.articles.findIndex(a => a.id === this.currentArticle.id);
                if (index !== -1) {
                    this.articles[index] = { ...this.articles[index], ...articleData };
                }
            } else {
                // Add new article
                this.articles.unshift(articleData);
            }

            // In a real application, you would send this to a server
            // For demo purposes, we'll simulate saving to localStorage
            this.simulateSaveToStorage();

            this.showNotification(
                `Artikel "${articleData.title}" berhasil ${this.currentArticle ? 'diperbarui' : 'disimpan'}!`,
                'success'
            );

            // Reset form and reload data
            this.resetForm();
            await this.loadArticles();

        } catch (error) {
            console.error('Error saving article:', error);
            this.showNotification('Gagal menyimpan artikel: ' + error.message, 'error');
        }
    }

    // Simulate saving to storage
    simulateSaveToStorage() {
        localStorage.setItem('duniabercerita_articles', JSON.stringify(this.articles));
        console.log('Articles saved to localStorage:', this.articles);
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');

        if (searchInput && searchResults) {
            let searchTimeout;

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('focus', () => {
                if (searchInput.value.length >= 2) {
                    this.performSearch(searchInput.value);
                }
            });

            // Close search results when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchResults.contains(e.target) && !searchInput.contains(e.target)) {
                    searchResults.classList.remove('active');
                }
            });
        }
    }

    // Perform search across articles
    performSearch(query) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }

        const results = this.articles.filter(article =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            (article.tags && article.tags.some(tag =>
                tag.toLowerCase().includes(query.toLowerCase())
            ))
        );

        this.displaySearchResults(results, query);
    }

    // Display search results
    displaySearchResults(results, query) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Tidak ditemukan artikel untuk "${query}"</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map(article => `
                <div class="search-result-item" onclick="window.location.href='article.html?id=${article.id}'">
                    <h4>${this.highlightText(article.title, query)}</h4>
                    <p>${this.highlightText(article.excerpt, query)}</p>
                    <small class="article-meta">
                        ${article.author} • ${this.formatDate(article.date)}
                    </small>
                </div>
            `).join('');
        }

        searchResults.classList.add('active');
    }

    // Setup category filtering
    setupCategoryFilter() {
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                this.filterByCategory(category);
            });
        });
    }

    // Filter articles by category
    filterByCategory(category) {
        const filteredArticles = category ?
            this.articles.filter(article => article.category === category) :
            this.articles;

        if (typeof displayArticles === 'function') {
            displayArticles(filteredArticles);
        }

        this.showNotification(
            category ? 
            `Menampilkan ${filteredArticles.length} artikel dalam kategori: ${category}` :
            'Menampilkan semua artikel',
            'success'
        );
    }

    // Setup image URL validation
    setupImageValidation() {
        const imageInput = document.getElementById('image');
        if (imageInput) {
            imageInput.addEventListener('blur', (e) => {
                const url = e.target.value.trim();
                if (url && !this.isValidImageUrl(url)) {
                    this.showNotification('URL gambar tidak valid', 'warning');
                }
            });
        }
    }

    // Setup rich text editor (basic)
    setupRichTextEditor() {
        const contentTextarea = document.getElementById('content');
        if (contentTextarea) {
            // Add basic formatting buttons
            this.addFormattingButtons(contentTextarea);
        }
    }

    // Add formatting buttons to textarea
    addFormattingButtons(textarea) {
        const formattingToolbar = document.createElement('div');
        formattingToolbar.className = 'formatting-toolbar';
        formattingToolbar.innerHTML = `
            <button type="button" data-format="bold"><i class="fas fa-bold"></i></button>
            <button type="button" data-format="italic"><i class="fas fa-italic"></i></button>
            <button type="button" data-format="underline"><i class="fas fa-underline"></i></button>
            <button type="button" data-format="link"><i class="fas fa-link"></i></button>
            <button type="button" data-format="list"><i class="fas fa-list"></i></button>
        `;

        textarea.parentNode.insertBefore(formattingToolbar, textarea);

        // Add event listeners to formatting buttons
        formattingToolbar.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.applyFormatting(textarea, button.getAttribute('data-format'));
            });
        });
    }

    // Apply text formatting
    applyFormatting(textarea, format) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        let formattedText = '';

        switch (format) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'underline':
                formattedText = `__${selectedText}__`;
                break;
            case 'link':
                const url = prompt('Masukkan URL:');
                if (url) {
                    formattedText = `[${selectedText}](${url})`;
                } else {
                    return;
                }
                break;
            case 'list':
                formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
                break;
        }

        textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        textarea.focus();
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }

    // Setup auto-save functionality
    setupAutoSave() {
        const form = document.getElementById('article-form');
        if (form) {
            let autoSaveTimeout;

            form.addEventListener('input', () => {
                clearTimeout(autoSaveTimeout);
                autoSaveTimeout = setTimeout(() => {
                    this.autoSaveDraft();
                }, 2000);
            });

            // Load draft on page load
            this.loadDraft();
        }
    }

    // Auto-save draft
    autoSaveDraft() {
        const form = document.getElementById('article-form');
        if (!form) return;

        const formData = new FormData(form);
        const draft = {
            title: formData.get('title'),
            author: formData.get('author'),
            category: formData.get('category'),
            image: formData.get('image'),
            content: formData.get('content'),
            tags: formData.get('tags'),
            lastSaved: new Date().toISOString()
        };

        localStorage.setItem('article_draft', JSON.stringify(draft));
    }

    // Load saved draft
    loadDraft() {
        const draft = localStorage.getItem('article_draft');
        if (draft) {
            try {
                const draftData = JSON.parse(draft);
                this.populateForm(draftData);
                
                this.showNotification(
                    `Draft tersimpan dari ${this.formatDate(draftData.lastSaved)} telah dimuat`,
                    'success'
                );
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }

    // Populate form with data
    populateForm(data) {
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element && data[key]) {
                element.value = data[key];
            }
        });
    }

    // Reset form
    resetForm() {
        const form = document.getElementById('article-form');
        if (form) {
            form.reset();
            this.currentArticle = null;
            localStorage.removeItem('article_draft');
            
            // Clear current article indicator
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Artikel';
                submitBtn.classList.remove('btn-success');
                submitBtn.classList.add('btn-primary');
            }
        }
    }

    // Display admin statistics
    displayStats() {
        const totalArticles = document.getElementById('total-articles');
        const totalCategories = document.getElementById('total-categories');
        const latestArticle = document.getElementById('latest-article');

        if (totalArticles) {
            totalArticles.textContent = this.articles.length;
        }

        if (totalCategories) {
            const categories = [...new Set(this.articles.map(article => article.category))];
            totalCategories.textContent = categories.length;
        }

        if (latestArticle && this.articles.length > 0) {
            const latest = this.articles[0];
            latestArticle.textContent = this.formatDate(latest.date);
        }
    }

    // Utility methods
    generateArticleId() {
        return 'article_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getDefaultImage() {
        const defaultImages = [
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ];
        return defaultImages[Math.floor(Math.random() * defaultImages.length)];
    }

    generateExcerpt(content, length = 150) {
        return content.substring(0, length) + (content.length > length ? '...' : '');
    }

    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }

    isValidImageUrl(url) {
        try {
            new URL(url);
            return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
        } catch {
            return false;
        }
    }

    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.style.display = 'block';

            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        } else {
            // Fallback for pages without notification element
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Global functions for HTML integration
function loadArticles() {
    const cms = new CMSManager();
    return cms.loadArticles();
}

function displayArticles(articles) {
    const container = document.getElementById('articles-container');
    if (!container) return;

    if (!articles || articles.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-newspaper"></i>
                <h3>Belum ada artikel</h3>
                <p>Artikel akan muncul di sini setelah dibuat melalui panel admin.</p>
                <a href="admin.html" class="cta-button">Buat Artikel Pertama</a>
            </div>
        `;
        return;
    }

    container.innerHTML = articles.map(article => `
        <article class="article-card">
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy">
            </div>
            <div class="article-content">
                <h3><a href="article.html?id=${article.id}">${article.title}</a></h3>
                <p class="article-meta">
                    <i class="fas fa-user"></i> ${article.author} 
                    <i class="fas fa-calendar"></i> ${new CMSManager().formatDate(article.date)}
                    <i class="fas fa-clock"></i> ${article.readTime || 5} menit
                </p>
                <p>${article.excerpt}</p>
                <div class="article-tags">
                    ${article.tags ? article.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <a href="article.html?id=${article.id}" class="read-more">
                    Baca Selengkapnya <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `).join('');
}

function loadArticlesList() {
    const cms = new CMSManager();
    const container = document.getElementById('articles-list');
    
    if (!container) return;

    if (cms.articles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <h3>Belum ada artikel</h3>
                <p>Mulai dengan membuat artikel pertama Anda!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cms.articles.map(article => `
        <div class="article-item">
            <div class="article-info">
            <h3>${article.title}</h3>
                <p class="article-meta">
                    <i class="fas fa-user"></i> ${article.author} 
                    • <i class="fas fa-calendar"></i> ${cms.formatDate(article.date)}
                    • <i class="fas fa-tag"></i> ${article.category}
                </p>
                <p>${article.excerpt}</p>
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
}

function setupFormHandler() {
    const cms = new CMSManager();
    // Handler is already set up in CMSManager constructor
}

function clearForm() {
    const cms = new CMSManager();
    cms.resetForm();
    cms.showNotification('Form telah dibersihkan', 'success');
}

function editArticle(articleId) {
    const cms = new CMSManager();
    const article = cms.articles.find(a => a.id === articleId);
    
    if (article) {
        cms.currentArticle = article;
        cms.populateForm(article);
        
        const submitBtn = document.querySelector('#article-form button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Perbarui Artikel';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-success');
        }
        
        cms.showNotification(`Mengedit artikel: ${article.title}`, 'success');
        
        // Scroll to form
        document.querySelector('.form-container').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function deleteArticle(articleId) {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.')) {
        return;
    }

    const cms = new CMSManager();
    const articleIndex = cms.articles.findIndex(a => a.id === articleId);
    
    if (articleIndex !== -1) {
        const deletedArticle = cms.articles.splice(articleIndex, 1)[0];
        cms.simulateSaveToStorage();
        cms.showNotification(`Artikel "${deletedArticle.title}" telah dihapus`, 'success');
        loadArticlesList();
    }
}

function loadArticleContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        window.location.href = 'index.html';
        return;
    }

    const cms = new CMSManager();
    const article = cms.articles.find(a => a.id === articleId);
    
    const container = document.getElementById('article-content');
    if (!container) return;
    
    if (!article) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Artikel Tidak Ditemukan</h3>
                <p>Artikel yang Anda cari tidak ditemukan atau telah dihapus.</p>
                <a href="index.html" class="cta-button">Kembali ke Beranda</a>
            </div>
        `;
        return;
    }

    // Display the article
    container.innerHTML = `
        <h1 class="article-title">${article.title}</h1>
        <p class="meta-info">
            Oleh <span class="author">${article.author}</span> | 
            <time datetime="${article.date}">${cms.formatDate(article.date)}</time> | 
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

    // Load related articles
    loadRelatedArticles(article);
}

function loadRelatedArticles(currentArticle) {
    const cms = new CMSManager();
    const related = cms.articles
        .filter(article => 
            article.id !== currentArticle.id && 
            article.category === currentArticle.category
        )
        .slice(0, 2);

    const container = document.getElementById('related-articles');
    if (!container) return;

    if (related.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>Belum ada artikel terkait</p>
            </div>
        `;
        return;
    }

    container.innerHTML = related.map(article => `
        <article class="article-card">
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy">
            </div>
            <div class="article-content">
                <h3><a href="article.html?id=${article.id}">${article.title}</a></h3>
                <p class="article-meta">
                    <i class="fas fa-user"></i> ${article.author} 
                    <i class="fas fa-calendar"></i> ${cms.formatDate(article.date)}
                </p>
                <p>${article.excerpt}</p>
                <a href="article.html?id=${article.id}" class="read-more">
                    Baca Selengkapnya
                </a>
            </div>
        </article>
    `).join('');
}

// Initialize CMS when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new CMSManager();
});

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CMSManager };
}