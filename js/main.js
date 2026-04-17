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

/* ── PARTICLE GLOBE ── */
(function () {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const SIZE = 460;
  canvas.width  = SIZE * dpr;
  canvas.height = SIZE * dpr;
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cx = SIZE / 2, cy = SIZE / 2, R = 190;
  const TOTAL = 700;

  // Fibonacci lattice for even sphere distribution
  const pts = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < TOTAL; i++) {
    const y     = 1 - (i / (TOTAL - 1)) * 2;
    const r     = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    pts.push({ x: r * Math.cos(theta), y, z: r * Math.sin(theta) });
  }

  // Sparse latitude/longitude ring lines
  const rings = [];
  for (let lat = -75; lat <= 75; lat += 30) {
    const phi = (lat * Math.PI) / 180;
    const ring = [];
    for (let lng = 0; lng <= 360; lng += 4) {
      const lam = (lng * Math.PI) / 180;
      ring.push({
        x: Math.cos(phi) * Math.cos(lam),
        y: Math.sin(phi),
        z: Math.cos(phi) * Math.sin(lam)
      });
    }
    rings.push(ring);
  }
  // Meridians
  for (let lng = 0; lng < 360; lng += 45) {
    const lam = (lng * Math.PI) / 180;
    const ring = [];
    for (let lat = -90; lat <= 90; lat += 4) {
      const phi = (lat * Math.PI) / 180;
      ring.push({
        x: Math.cos(phi) * Math.cos(lam),
        y: Math.sin(phi),
        z: Math.cos(phi) * Math.sin(lam)
      });
    }
    rings.push(ring);
  }

  let angle = 0;

  function rotY(p, cosA, sinA) {
    return {
      x: p.x * cosA - p.z * sinA,
      y: p.y,
      z: p.x * sinA + p.z * cosA
    };
  }

  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);

    const cosA = Math.cos(angle), sinA = Math.sin(angle);

    // Draw grid lines
    for (const ring of rings) {
      let started = false;
      for (const p of ring) {
        const r = rotY(p, cosA, sinA);
        const sx = cx + r.x * R;
        const sy = cy - r.y * R;
        const vis = (r.z + 1) / 2;
        if (vis < 0.05) { started = false; continue; }
        if (!started) { ctx.beginPath(); ctx.moveTo(sx, sy); started = true; }
        else ctx.lineTo(sx, sy);
      }
      if (started) {
        ctx.strokeStyle = `rgba(169,235,23,${0.04})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    // Draw dots
    const projected = pts.map(p => {
      const r = rotY(p, cosA, sinA);
      return { sx: cx + r.x * R, sy: cy - r.y * R, z: r.z };
    });
    projected.sort((a, b) => a.z - b.z);

    for (const p of projected) {
      const vis = (p.z + 1) / 2;
      if (vis < 0.04) continue;
      const size  = 0.7 + vis * 2.1;
      const alpha = 0.10 + vis * 0.82;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(169,235,23,${alpha})`;
      ctx.fill();
    }

    // Soft radial fade vignette at edges
    const grad = ctx.createRadialGradient(cx, cy, R * 0.72, cx, cy, R * 1.05);
    grad.addColorStop(0, 'rgba(13,13,11,0)');
    grad.addColorStop(1, 'rgba(13,13,11,0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    angle += 0.0025;
    requestAnimationFrame(draw);
  }

  draw();
})();

/* ── ABOUT COLLAGE SCROLL ANIMATION ── */
window.addEventListener('load', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const scene = document.querySelector('.team-collage-scene');
  if (!scene) return;

  const mainPhoto     = scene.querySelector('.team-main-photo');
  const collageTop    = scene.querySelector('.collage-card');
  const portraits     = scene.querySelectorAll('.collage-card-portrait');

  // Capture each element's final inline transform so we restore it after animation
  const topRot    = '-8deg';
  const p0Rot     = '-5deg';
  const p1Rot     = '5deg';

  // Set initial hidden states (exaggerated positions matching delosmedia style)
  gsap.set(mainPhoto, { opacity: 0, y: 48, scale: 0.90, transformOrigin: 'center bottom' });
  gsap.set(collageTop, { opacity: 0, y: 36, scale: 0.88, rotate: -14, transformOrigin: 'center center' });
  gsap.set(portraits[0], { opacity: 0, y: 44, scale: 0.88, rotate: -10, transformOrigin: 'center bottom' });
  gsap.set(portraits[1], { opacity: 0, y: 44, scale: 0.88, rotate: 10,  transformOrigin: 'center bottom' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: 'top 78%',
      once: true,
    }
  });

  tl.to(mainPhoto, {
    opacity: 1, y: 0, scale: 1,
    duration: 0.85, ease: 'power3.out'
  })
  .to(collageTop, {
    opacity: 1, y: 0, scale: 1, rotate: -8,
    duration: 0.72, ease: 'power3.out'
  }, '-=0.55')
  .to(portraits[0], {
    opacity: 0.78, y: 0, scale: 1, rotate: -5,
    duration: 0.72, ease: 'power3.out'
  }, '-=0.50')
  .to(portraits[1], {
    opacity: 0.78, y: 0, scale: 1, rotate: 5,
    duration: 0.72, ease: 'power3.out'
  }, '-=0.60');
});
