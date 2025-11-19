// NAVIGATION MANAGEMENT - DuniaBercerita

class NavigationManager {
    constructor() {
        this.menuBtn = document.getElementById('mobile-menu-btn');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleResize();
        this.setupSmoothScrolling();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.menuBtn && this.navMenu) {
            this.menuBtn.addEventListener('click', (e) => this.toggleMenu(e));
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => this.handleClickOutside(e));

        // Nav link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavLinkClick(e));
        });

        // Prevent menu close when clicking inside nav
        if (this.navMenu) {
            this.navMenu.addEventListener('click', (e) => e.stopPropagation());
        }
    }

    toggleMenu(e) {
        if (e) e.stopPropagation();
        
        this.isMenuOpen = !this.isMenuOpen;
        this.navMenu.classList.toggle('active');

        if (this.isMenuOpen) {
            this.menuBtn.innerHTML = '<i class="fas fa-times"></i>';
            this.menuBtn.style.backgroundColor = 'var(--accent-color)';
            this.menuBtn.style.color = 'white';
            document.body.style.overflow = 'hidden';
        } else {
            this.menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            this.menuBtn.style.backgroundColor = '';
            this.menuBtn.style.color = '';
            document.body.style.overflow = '';
        }
    }

    handleClickOutside(e) {
        if (this.isMenuOpen && 
            !this.navMenu.contains(e.target) && 
            !this.menuBtn.contains(e.target)) {
            this.closeMenu();
        }
    }

    handleNavLinkClick(e) {
        const link = e.currentTarget;
        
        // Update active state
        this.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Close mobile menu if open
        if (this.isMenuOpen && window.innerWidth <= 768) {
            this.closeMenu();
        }

        // Handle anchor links
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            this.scrollToSection(href);
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove('active');
        if (this.menuBtn) {
            this.menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            this.menuBtn.style.backgroundColor = '';
            this.menuBtn.style.color = '';
        }
        document.body.style.overflow = '';
    }

    setupSmoothScrolling() {
        // Handle all anchor links on the page
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                this.scrollToSection(href);
            });
        });
    }

    scrollToSection(selector) {
        const targetElement = document.querySelector(selector);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    handleResize() {
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        }, 250));
    }

    // Update active nav based on scroll position
    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Auto-initialize navigation manager
document.addEventListener('DOMContentLoaded', function() {
    window.navigationManager = new NavigationManager();
    
    // Optional: Add scroll-based active nav updates
    window.addEventListener('scroll', Utils.debounce(() => {
        window.navigationManager.updateActiveNavOnScroll();
    }, 100));
});

// Export untuk penggunaan modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}