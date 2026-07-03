export function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      if (!item) return;

      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(activeItem => {
        activeItem.classList.remove('open');
      });

      if (!open) item.classList.add('open');
    });
  });
}
