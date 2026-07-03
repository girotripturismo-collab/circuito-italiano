/* ══ TICKERS MODULE ════════════════════
   Responsibility: infinite marquee animation
   via requestAnimationFrame — NOT CSS animation.

   Motivo: CSS animation + overflow:hidden e
   fundamentalmente instavel no iOS Safari:
   conteudo pisca, some, trava no toque.
   rAF contorna todos os quirks do WebKit.
════════════════════════════════════════ */

function cloneTrackChildren(trackId) {
  const track = document.getElementById(trackId);
  if (!track) return;
  Array.from(track.children).forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
}

/* runTicker
   trackEl   — o elemento .ex-track / .dep-track
   durationMs — tempo (ms) para percorrer metade da largura total
   reverse   — true = da direita para esquerda (dep-track)
*/
function runTicker(trackEl, durationMs, reverse) {
  // Espera dois frames para o layout calcular scrollWidth corretamente
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const halfWidth = trackEl.scrollWidth / 2;
    if (halfWidth <= 0) return;

    const pixelsPerMs = halfWidth / durationMs;
    // reverse: começa em halfWidth e decrementa (move para direita)
    // normal:  começa em 0 e incrementa (move para esquerda)
    let pos = reverse ? halfWidth : 0;
    let lastTs = null;
    let paused = false;

    // Pausa quando aba fica oculta (economiza CPU/GPU)
    document.addEventListener('visibilitychange', () => {
      paused = document.hidden;
      if (!paused) lastTs = null; // reseta delta ao retomar
    });

    function step(ts) {
      if (!paused) {
        if (lastTs !== null) {
          const dt = Math.min(ts - lastTs, 50); // cap 50ms para nao pular apos tab switch
          if (reverse) {
            pos -= pixelsPerMs * dt;
            if (pos <= 0) pos += halfWidth;
          } else {
            pos += pixelsPerMs * dt;
            if (pos >= halfWidth) pos -= halfWidth;
          }
          trackEl.style.transform = `translateX(-${pos}px)`;
        }
        lastTs = ts;
      }
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }));
}

export function initTickers() {
  // Clona os cards para criar o loop seamless
  cloneTrackChildren('ex-track');
  cloneTrackChildren('dep-track');

  const exTrack  = document.getElementById('ex-track');
  const depTrack = document.getElementById('dep-track');

  // ex-track: esquerda (normal), 26s equivalente
  if (exTrack)  runTicker(exTrack,  26000, false);
  // dep-track: direita (reverse), 32s equivalente
  if (depTrack) runTicker(depTrack, 32000, true);
}
