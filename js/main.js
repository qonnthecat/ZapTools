// Kode JavaScript Dark Mode
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Cek localStorage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  if (toggleBtn) {
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    if(body.classList.contains('dark')){
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    }
  });
}

// Menu mobile toggle
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

// Smooth scrolling untuk anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
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

// Animasi scroll untuk elements
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

// Terapkan animasi pada elements saat dimuat
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.article-card, .category-card, .hero-content, .hero-image');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});