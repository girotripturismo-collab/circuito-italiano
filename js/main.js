import {
  initHeader,
  initReveal,
  initSmoothScroll,
  initStrips,
  initCountdown,
  initRoteiro,
  initTickers
} from './index.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initReveal();
  initStrips();
  initRoteiro();
  initCountdown();
  initSmoothScroll();
  initTickers();
});
