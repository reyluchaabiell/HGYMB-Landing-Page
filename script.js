const body = document.body;
const cursorGlow = document.querySelector('.cursor-glow');
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.dot')];
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const mobileToggle = document.querySelector('.mobile-toggle');
const siteNav = document.querySelector('.site-nav');
const revealNodes = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const testimonialCards = [...document.querySelectorAll('.testimonial-card')];
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const leadForm = document.querySelector('#lead-form');
let heroIndex = 0;
let testimonialIndex = 0;
let heroTimer;
let testimonialTimer;

slides.forEach(slide => {
  slide.style.backgroundImage = `url(${slide.dataset.bg})`;
});

function activateHeroSlide(index) {
  heroIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === heroIndex));
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === heroIndex));
}

function autoPlayHero() {
  heroTimer = setInterval(() => activateHeroSlide(heroIndex + 1), 4200);
}
activateHeroSlide(0);
autoPlayHero();

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(heroTimer);
    activateHeroSlide(Number(dot.dataset.slide));
    autoPlayHero();
  });
});

if (cursorGlow) {
  window.addEventListener('pointermove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
}

if (mobileToggle && siteNav) {
  mobileToggle.addEventListener('click', () => {
    const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!expanded));
    mobileToggle.classList.toggle('open');
    siteNav.classList.toggle('open');
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.classList.remove('open');
    siteNav.classList.remove('open');
  }));
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      entry.target.style.transitionDelay = `${delay}ms`;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealNodes.forEach(node => revealObserver.observe(node));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.target || 0);
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target;
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.6 });

counters.forEach(counter => counterObserver.observe(counter));

function setActiveTestimonial(index) {
  testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;
  testimonialCards.forEach((card, i) => card.classList.toggle('is-active', i === testimonialIndex));
}

function autoplayTestimonial() {
  testimonialTimer = setInterval(() => setActiveTestimonial(testimonialIndex + 1), 4500);
}

if (testimonialCards.length) {
  setActiveTestimonial(0);
  autoplayTestimonial();
}

prevBtn?.addEventListener('click', () => {
  clearInterval(testimonialTimer);
  setActiveTestimonial(testimonialIndex - 1);
  autoplayTestimonial();
});

nextBtn?.addEventListener('click', () => {
  clearInterval(testimonialTimer);
  setActiveTestimonial(testimonialIndex + 1);
  autoplayTestimonial();
});

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = `#${entry.target.id}`;
    const link = navLinks.find(a => a.getAttribute('href') === id);
    if (entry.isIntersecting && link) {
      navLinks.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -45% 0px', threshold: 0.01 });

sections.forEach(section => navObserver.observe(section));

const tiltCards = document.querySelectorAll('.pain-card, .feature-card, .package-card, .why-card');
tiltCards.forEach(card => {
  card.addEventListener('pointermove', (e) => {
    if (window.innerWidth < 860) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 8;
    const rotateX = (0.5 - py) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

leadForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const template = document.querySelector('#toast-template');
  const toast = template.content.firstElementChild.cloneNode(true);
  body.appendChild(toast);
  leadForm.reset();
  setTimeout(() => toast.remove(), 2800);
});

// Keep only one FAQ open at a time for a cleaner UX.
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});
