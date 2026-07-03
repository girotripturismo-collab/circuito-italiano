/* ══ HEADER MODULE ════════════════════
   Responsibility: sticky state + scroll bar
═══════════════════════════════════════ */
export function initHeader() {
  const hdr = document.getElementById('hdr');
  const bar = document.getElementById('scroll-bar');
  if (!hdr) return;

  const onScroll = () => {
    hdr.classList.toggle('solid', window.scrollY > 60);

    if (bar) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
