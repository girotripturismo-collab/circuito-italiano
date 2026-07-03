/* ══ REVEAL MODULE ════════════════════
   Responsibility: word-by-word title reveal
   + section entrance animations
═══════════════════════════════════════ */
export function initReveal() {
  document.querySelectorAll('.word-reveal').forEach(el => {
    el.querySelectorAll('span, em').forEach(child => {
      const words = child.innerHTML.trim().split(/\s+/);
      child.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.classList.contains('word-reveal')) {
        el.classList.add('fired');
        const words = el.querySelectorAll('.word');
        words.forEach((w, i) => {
          w.style.transitionDelay = `${100 + i * 65}ms`;
        });
      } else {
        el.classList.add('in');
      }
      obs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll(
    '.word-reveal, .from-left, .from-right, .scale-up'
  ).forEach(el => obs.observe(el));
}
