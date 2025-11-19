// Fungsi Pencarian
const searchBtn = document.getElementById('search-btn');
const searchBox = document.getElementById('search-box');
const searchInput = document.getElementById('search-input');
const searchClose = document.getElementById('search-close');

if (searchBtn && searchBox) {
  searchBtn.addEventListener('click', () => {
    searchBox.classList.toggle('active');
    if (searchBox.classList.contains('active')) {
      searchInput.focus();
    }
  });

  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchBox.classList.remove('active');
      searchInput.value = '';
    });
  }

  // Tutup search box ketika klik di luar
  document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target) && !searchBtn.contains(e.target)) {
      searchBox.classList.remove('active');
    }
  });

  // Handle search input
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(searchInput.value);
      }
    });
  }
}

function performSearch(query) {
  if (query.trim()) {
    // Simulasi pencarian - bisa diganti dengan API call
    alert(`Mencari: "${query}"\n\nFitur pencarian lengkap akan segera tersedia!`);
    searchBox.classList.remove('active');
    searchInput.value = '';
  }
}

// Improved Mobile Menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
    
    if (navMenu.classList.contains('active')) {
      mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
      mobileMenuBtn.style.backgroundColor = 'var(--accent-color)';
      mobileMenuBtn.style.color = 'white';
    } else {
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      mobileMenuBtn.style.backgroundColor = '';
      mobileMenuBtn.style.color = '';
    }
  });

  // Tutup menu mobile ketika klik di luar
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navMenu.classList.remove('active');
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      mobileMenuBtn.style.backgroundColor = '';
      mobileMenuBtn.style.color = '';
    }
  });

  // Prevent menu close when clicking inside
  navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Enhanced Navigation
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // Update active state
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Close mobile menu if open
    if (window.innerWidth <= 768 && navMenu) {
      navMenu.classList.remove('active');
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.style.backgroundColor = '';
        mobileMenuBtn.style.color = '';
      }
    }
  });
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    // Simulasi berlangganan
    if (email) {
      alert(`Terima kasih! Email ${email} telah berhasil didaftarkan untuk newsletter.`);
      newsletterForm.reset();
    }
  });
}

// Intersection Observer untuk animasi
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Terapkan animasi pada elements
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll(
    '.article-card, .category-card, .tip-card, .hero-content, .hero-image'
  );
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // Stagger animation untuk category cards
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });
});