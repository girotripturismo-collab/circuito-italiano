function scrollToTarget(selector) {
  const target = document.querySelector(selector);
  if (!target) return;

  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - 72,
    behavior: 'smooth'
  });
}

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      event.preventDefault();
      scrollToTarget(href);
    });
  });

  document.querySelectorAll('[data-action="scroll-to"]').forEach(control => {
    control.addEventListener('click', () => {
      const target = control.dataset.target;
      if (target) scrollToTarget(target);
    });
  });
}
