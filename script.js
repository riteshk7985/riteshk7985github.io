/* =========================================
   BHAICHARA FITNESS — JavaScript
   Interactions, Animations, BMI, Carousel
   ========================================= */

// ====== NAVBAR SCROLL ======
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ====== HAMBURGER MENU ======
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ====== SCROLL ANIMATIONS (Intersection Observer) ======
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right').forEach(el => {
  observer.observe(el);
});

// Trigger hero animation on load
window.addEventListener('load', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => { heroContent.classList.add('visible'); }, 300);
  }
});

// ====== TESTIMONIAL CAROUSEL ======
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const cards = document.querySelectorAll('.testimonial-card');
let currentSlide = 0;
const totalSlides = cards.length;

// Create dots
cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(index) {
  currentSlide = (index + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Auto-play carousel
let autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);

document.getElementById('testimonialCarousel').addEventListener('mouseenter', () => clearInterval(autoPlay));
document.getElementById('testimonialCarousel').addEventListener('mouseleave', () => {
  autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
});

// Touch / Swipe support
let touchStartX = 0;
let touchEndX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
track.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 50) goToSlide(currentSlide + 1);
  if (touchEndX - touchStartX > 50) goToSlide(currentSlide - 1);
});

// ====== BMI CALCULATOR ======
function calculateBMI() {
  const weight = parseFloat(document.getElementById('bmiWeight').value);
  const height = parseFloat(document.getElementById('bmiHeight').value);
  const resultEl = document.getElementById('bmiResult');
  const scoreEl = document.getElementById('bmiScore');
  const catEl = document.getElementById('bmiCategory');
  const tipEl = document.getElementById('bmiTip');

  if (!weight || !height || weight <= 0 || height <= 0) {
    alert('Please enter valid weight and height values.');
    return;
  }

  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);

  let category, color, tip;

  if (bmi < 18.5) {
    category = 'Underweight';
    color = '#3b82f6';
    tip = 'Our Elite Strength Training program combined with a tailored nutrition plan can help you build healthy muscle mass. Book a free consultation with our certified trainers today!';
  } else if (bmi < 25) {
    category = 'Normal Weight ✓';
    color = '#22c55e';
    tip = 'Great job maintaining a healthy BMI! Our Body Recomposition and Athlete Conditioning programs can help you achieve an even more sculpted physique.';
  } else if (bmi < 30) {
    category = 'Overweight';
    color = '#f59e0b';
    tip = 'Our Fat Transformation Program is scientifically designed to help you reach your ideal weight. With certified trainers and custom nutrition plans, results are guaranteed.';
  } else {
    category = 'Obese';
    color = '#ef4444';
    tip = 'Take the first step today! Our personalized coaching program has helped hundreds of members achieve life-changing transformations. Book your free trial session now.';
  }

  scoreEl.textContent = bmi;
  scoreEl.style.color = color;
  catEl.textContent = category;
  catEl.style.color = color;
  tipEl.textContent = tip;
  resultEl.style.display = 'block';
  resultEl.style.borderLeftColor = color;

  // Animate result
  resultEl.style.opacity = '0';
  resultEl.style.transform = 'translateY(10px)';
  setTimeout(() => {
    resultEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    resultEl.style.opacity = '1';
    resultEl.style.transform = 'translateY(0)';
  }, 50);
}

// Allow Enter key in BMI inputs
document.getElementById('bmiWeight').addEventListener('keypress', e => { if (e.key === 'Enter') calculateBMI(); });
document.getElementById('bmiHeight').addEventListener('keypress', e => { if (e.key === 'Enter') calculateBMI(); });

// ====== CONTACT FORM ======
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('formSubmit');
  const successEl = document.getElementById('formSuccess');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    document.getElementById('contactForm').reset();
    btn.textContent = 'Book Free Trial Session';
    btn.disabled = false;
    successEl.style.display = 'block';

    setTimeout(() => { successEl.style.display = 'none'; }, 6000);
  }, 1600);
}

// ====== SMOOTH ACTIVE NAV LINKS ON SCROLL ======
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');

function updateActiveNavLink() {
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinkEls.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + sectionId) {
          link.style.color = 'var(--gold)';
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// ====== COUNTER ANIMATION ======
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 2000;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = start + suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const text = num.textContent.trim();
        const numericVal = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[0-9]/g, '').trim();
        animateCounter(num, numericVal, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ====== PARALLAX ON HERO ======
window.addEventListener('scroll', () => {
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo && window.scrollY < window.innerHeight) {
    heroVideo.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
}, { passive: true });

// ====== GALLERY SLIDER DOTS (decoration only) ======
document.querySelectorAll('.slider-btn').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.slider-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ====== PLAN CARD HOVER GLOW ======
document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(201,162,39,0.06), rgba(255,255,255,0.02))`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ====== PROGRAM CARD GLOW ======
document.querySelectorAll('.program-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

console.log('%c⚡ BHAICHARA FITNESS', 'color: #c9a227; font-size: 24px; font-weight: bold;');
console.log('%cPremium Fitness Destination | Shamli, Uttar Pradesh', 'color: #888; font-size: 12px;');
