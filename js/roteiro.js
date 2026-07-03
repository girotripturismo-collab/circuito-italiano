/* ══ ROTEIRO MODULE ═══════════════════
   Responsibility: Pinned horizontal scroll
   - Translates .rot-track based on scroll
   - Updates active panel and dots
   - Diamantina cinema entrance
═══════════════════════════════════════ */
export function initRoteiro() {
  const outer  = document.querySelector('.rot-pin-outer');
  const track  = document.querySelector('.rot-track');
  const panels = document.querySelectorAll('.rot-panel');
  const dots   = document.querySelectorAll('.rot-dot-item');
  const dotsWrap = document.querySelector('.rot-dots');
  const hint   = document.querySelector('.rot-scroll-hint');
  const counter = document.querySelector('.rot-counter span');
  if (!outer || !track) return;

  const total = panels.length;
  let lastActive = -1;
  let hintShown = false;

  function update() {
    const rect   = outer.getBoundingClientRect();
    const outerH = outer.offsetHeight;
    const scroll = -rect.top;
    const range  = outerH - window.innerHeight;
    const prog   = Math.max(0, Math.min(1, scroll / range));

    // Translate track
    const tx = prog * (total - 1) * 100;
    track.style.transform = `translateX(-${tx}vw)`;

    // Active panel index
    const activeIdx = Math.min(total - 1, Math.round(prog * (total - 1)));

    if (activeIdx !== lastActive) {
      panels.forEach((p, i) => p.classList.toggle('active', i === activeIdx));
      dots.forEach((d, i)   => d.classList.toggle('active', i === activeIdx));
      if (counter) counter.textContent = String(activeIdx + 1).padStart(2, '0');

      // Diamantina cinema (last panel)
      if (activeIdx === total - 1) {
        const dia = panels[total - 1].querySelector('.dia-cinema');
        if (dia) setTimeout(() => dia.classList.add('fired'), 300);
      }

      lastActive = activeIdx;
    }

    // Show dots when pinned section is active
    if (dotsWrap) dotsWrap.classList.toggle('visible', scroll > 0 && scroll < range);

    // Scroll hint — show on first panel, hide after first scroll
    if (!hintShown && scroll <= 0 && rect.top <= window.innerHeight) {
      if (hint) hint.classList.add('show');
    }
    if (scroll > 80 && hint) {
      hint.classList.remove('show');
      hintShown = true;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  // Dot click — scroll to that city
  dots.forEach((d, i) => {
    d.addEventListener('click', () => {
      const outerTop = outer.getBoundingClientRect().top + window.scrollY;
      const range    = outer.offsetHeight - window.innerHeight;
      const target   = outerTop + (i / (total - 1)) * range;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });
}
