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


/*movil flip*/

document.querySelectorAll('[data-flip]').forEach(card => {
  const btn = card.querySelector('.flip-card__btn');
  btn.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
});

// Tabs Servicios
const tabs = document.querySelectorAll(".services__tab");
const panels = document.querySelectorAll(".services__panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    panels.forEach(p => p.classList.remove("is-active"));

    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    document.getElementById(tab.getAttribute("aria-controls")).classList.add("is-active");
  });
});

// ===== Testimonios: carrusel suave (snap por slide) =====
(() => {
  const track = document.querySelector('[data-testi-track]');
  if (!track) return;

  const prev = document.querySelector('[data-testi-prev]');
  const next = document.querySelector('[data-testi-next]');

  const getStep = () => {
    const card = track.querySelector('.testi__card');
    if (!card) return 320;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '16');
    return card.getBoundingClientRect().width + gap;
  };

  let index = 0;

  const maxIndex = () => {
    const step = getStep();
    return Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step));
  };

  const goTo = (i, behavior = 'smooth') => {
    const max = maxIndex();
    index = i;
    if (index > max) index = 0;
    if (index < 0) index = max;

    const step = getStep();
    const left = Math.min(index * step, track.scrollWidth - track.clientWidth);
    track.scrollTo({ left, behavior });
  };

  const syncIndexFromScroll = () => {
    const step = getStep();
    index = Math.round(track.scrollLeft / step);
  };

  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));

  // Auto-play: avanza 1 slide, loop limpio
  let timer = null;
  const start = () => {
    stop();
    timer = setInterval(() => {
      syncIndexFromScroll();
      goTo(index + 1);
    }, 4200);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  // Pausa en interacción
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);
  track.addEventListener('focusin', stop);
  track.addEventListener('focusout', start);
  track.addEventListener('touchstart', stop, { passive: true });
  track.addEventListener('touchend', start);

  track.addEventListener('scroll', () => syncIndexFromScroll(), { passive: true });

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) start();
})();