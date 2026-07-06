/* ══ ROTEIRO MODULE ═══════════════════
   Responsibility: timeline accordion —
   abre/fecha cada dia do roteiro de forma independente
═══════════════════════════════════════ */
export function initRoteiro() {
  document.querySelectorAll('.rot-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      if (!item) return;
      item.classList.toggle('open');
    });
  });
}
