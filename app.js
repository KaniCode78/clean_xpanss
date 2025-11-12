/* Helpers */
const $ = (s, ctx = document) => ctx.querySelector(s);

/* Año footer */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Menú hamburguesa accesible */
const burger = $('.hamburger');
const drawer = $('#mobile-menu');

const toggleMenu = () => {
  const isOpen = drawer.classList.toggle('open');
  burger.classList.toggle('is-active', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
};
burger?.addEventListener('click', toggleMenu);
drawer?.addEventListener('click', (e) => { if (e.target.tagName === 'A') toggleMenu(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) toggleMenu(); });

/* Form demo */
$('#cta-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $('#email').value.trim();
  if (!email) return;
  alert(`¡Gracias! Te contactamos en: ${email}`);
  e.target.reset();
});

/* Slide-in on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.slide-in').forEach(el => io.observe(el));