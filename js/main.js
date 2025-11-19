// MAIN JAVASCRIPT - DuniaBercerita

// Theme Management
class ThemeManager {
    constructor() {
        this.toggleBtn = document.getElementById('theme-toggle');
        this.body = document.body;
        this.init();
    }

    init() {
        this.loadTheme();
        this.bindEvents();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (savedTheme === 'auto' && systemPrefersDark)) {
            this.body.classList.add('dark');
            this.updateToggleButton('dark');
        } else {
            this.body.classList.remove('dark');
            this.updateToggleButton('light');
        }
    }

    bindEvents() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('theme') === 'auto') {
                this.body.classList.toggle('dark', e.matches);
                this.updateToggleButton(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        const isDark = this.body.classList.contains('dark');
        
        if (isDark) {
            this.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            this.updateToggleButton('light');
        } else {
            this.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            this.updateToggleButton('dark');
        }
    }

    updateToggleButton(theme) {
        if (this.toggleBtn) {
            this.toggleBtn.innerHTML = theme === 'dark' 
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
            this.toggleBtn.setAttribute('title', theme === 'dark' ? 'Mode Terang' : 'Mode Gelap');
        }
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.menuBtn = document.getElementById('mobile-menu-btn');
        this.navMenu = document.getElementById('nav-menu');
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleResize();
    }

    bindEvents() {
        if (this.menuBtn && this.navMenu) {
            this.menuBtn.addEventListener('click', (e) => this.toggleMenu(e));
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => this.handleClickOutside(e));
            
            // Prevent menu close when clicking inside
            this.navMenu.addEventListener('click', (e) => e.stopPropagation());
        }
    }

    toggleMenu(e) {
        e.stopPropagation();
        this.navMenu.classList.toggle('active');
        
        if (this.navMenu.classList.contains('active')) {
            this.menuBtn.innerHTML = '<i class="fas fa-times"></i>';
            this.menuBtn.style.backgroundColor = 'var(--accent-color)';
            this.menuBtn.style.color = 'white';
        } else {
            this.menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            this.menuBtn.style.backgroundColor = '';
            this.menuBtn.style.color = '';
        }
    }

    handleClickOutside(e) {
        if (!this.navMenu.contains(e.target) && !this.menuBtn.contains(e.target)) {
            this.closeMenu();
        }
    }

    closeMenu() {
        if (this.navMenu.classList.contains('active')) {
            this.navMenu.classList.remove('active');
            this.menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            this.menuBtn.style.backgroundColor = '';
            this.menuBtn.style.color = '';
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }
}

// Smooth Scrolling
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        this.bindAnchorLinks();
    }

    bindAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            });
        });
    }

    scrollToElement(element) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Newsletter Form
class NewsletterForm {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const email = this.form.querySelector('input[type="email"]').value;
        
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
        // Simulate API call
        setTimeout(() => {
            this.showMessage('Thank you for subscribing to our newsletter!', 'success');
            this.form.reset();
            
            // In a real application, you would send this to your backend
            console.log('Subscribed email:', email);
        }, 1000);
    }

    showMessage(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.background = '#4caf50';
        } else {
            notification.style.background = '#f44336';
        }

        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Image Lazy Loading
class LazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupObserver();
        } else {
            this.loadAllImages();
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
    }

    loadImage(img) {
        // Image is already loading or loaded
        if (img.getAttribute('data-loaded')) return;

        img.setAttribute('data-loaded', 'true');
        
        // Add loading animation
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        // Simulate loading for demo purposes
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

// Category Filter
class CategoryFilter {
    constructor() {
        this.categoryCards = document.querySelectorAll('.category-card');
        this.init();
    }

    init() {
        this.bindEvents();
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
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i> Memuat artikel ${category}...
                </div>
            `;
        }

        // Simulate filtering (in real app, this would be an API call)
        setTimeout(() => {
            this.displayFilteredArticles(category);
        }, 1000);
    }

    displayFilteredArticles(category) {
        // This would be replaced with actual filtered data from CMS
        const message = category ? 
            `Menampilkan artikel dalam kategori: ${category}` :
            'Menampilkan semua artikel';
        
        // Show message (in real app, show actual filtered articles)
        const container = document.getElementById('articles-container');
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <h3>${message}</h3>
                    <p>Fitur filter kategori akan tersedia segera!</p>
                    <button onclick="loadArticles()" class="cta-button" style="margin-top: 20px;">
                        Tampilkan Semua Artikel
                    </button>
                </div>
            `;
        }
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme manager
    new ThemeManager();
    
    // Initialize mobile navigation
    new MobileNavigation();
    
    // Initialize smooth scrolling
    new SmoothScroller();
    
    // Initialize newsletter form
    new NewsletterForm();
    
    // Initialize lazy loading
    new LazyLoader();
    
    // Initialize category filter
    new CategoryFilter();

    // Add loading animation to elements
    const animatedElements = document.querySelectorAll('.article-card, .category-card, .hero-content, .hero-image');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Observe elements for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Add stagger animation to category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Handle page load completion
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Remove loading indicators
        const loadingIndicators = document.querySelectorAll('.image-loading');
        loadingIndicators.forEach(indicator => {
            indicator.style.display = 'none';
        });
    });
});

// Utility function for external scripts
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        MobileNavigation,
        SmoothScroller,
        NewsletterForm,
        LazyLoader,
        CategoryFilter
    };
}