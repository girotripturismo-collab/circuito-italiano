/* ══ STRIPS MODULE ════════════════════
   Responsibility: Vesperata image strips
   - Curtain-open animation on scroll entry
   - Hover / click expand interaction
   - Auto-rotation
═══════════════════════════════════════ */
export function initStrips() {
  const container = document.getElementById('ves-strips');
  if (!container) return;

  const strips = container.querySelectorAll('.ves-strip');
  const dots   = document.querySelectorAll('.ves-dot');
  let current  = 0;
  let autoTimer;

  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    strips.forEach((s, i) => {
      setTimeout(() => s.classList.add('open'), i * 100);
    });
    setTimeout(() => {
      strips[0].classList.add('act');
      startAuto();
    }, strips.length * 100 + 200);
    obs.disconnect();
  }, { threshold: 0.3 });

  obs.observe(container);

  function setStrip(idx) {
    if (idx < 0 || idx >= strips.length) return;
    strips.forEach((s, i) => s.classList.toggle('act', i === idx));
    dots.forEach((d, i)   => d.classList.toggle('act', i === idx));
    current = idx;
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!container.matches(':hover')) {
        setStrip((current + 1) % strips.length);
      }
    }, 4000);
  }

  strips.forEach((s, i) => {
    s.addEventListener('mouseenter', () => { setStrip(i); clearInterval(autoTimer); });
    s.addEventListener('mouseleave', startAuto);
    s.addEventListener('click', () => setStrip(i));
  });

  dots.forEach((dot, i) => {
    const index = Number(dot.dataset.stripIndex ?? i);
    dot.addEventListener('click', () => setStrip(index));
  });
}
