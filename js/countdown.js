// Countdown timer module — urgency trigger
// Conta regressiva para a PRÓXIMA saída futura entre as 3 datas de 2027
// (Minas usa uma única data fixa; aqui há 3 possíveis, escolhemos
// dinamicamente a mais próxima que ainda não passou)

const DEPARTURE_DATES = [
  '2027-05-05T00:00:00',
  '2027-06-09T00:00:00',
  '2027-09-01T00:00:00'
];

function nextDepartureDate() {
  const now = Date.now();
  const future = DEPARTURE_DATES
    .map(d => new Date(d).getTime())
    .filter(t => t > now)
    .sort((a, b) => a - b);
  return future.length > 0 ? future[0] : new Date(DEPARTURE_DATES[DEPARTURE_DATES.length - 1]).getTime();
}

export function initCountdown() {
  const countdownEl = document.getElementById('countdown-timer');
  if (!countdownEl) return;

  const targetDate = nextDepartureDate();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      countdownEl.innerHTML = '<p class="cd-expired">Embarque acontecendo agora!</p>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = countdownEl.querySelector('[data-value="days"]');
    const hoursEl = countdownEl.querySelector('[data-value="hours"]');
    const minutesEl = countdownEl.querySelector('[data-value="minutes"]');
    const secondsEl = countdownEl.querySelector('[data-value="seconds"]');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}
