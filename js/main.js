/* ============================================================
   THE CODE WEAVERS — Main JavaScript
   ============================================================ */

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

/* ── MOBILE MENU ── */
function openMobileNav() {
  document.getElementById('mobile-nav').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
  document.body.style.overflow = '';
}

/* Close mobile nav when a link is clicked */
document.querySelectorAll('#mobile-nav a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

/* ── ANIMATED COUNTERS ── */
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCount(el, target, duration) {
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(p) * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => {
        animateCount(el, parseInt(el.dataset.count), 1800);
      });
      statsObs.disconnect();
    }
  });
}, { threshold: .5 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObs.observe(statsSection);
