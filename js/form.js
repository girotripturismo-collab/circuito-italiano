const WEBHOOK = 'https://automatik-n8n.t1prud.easypanel.host/webhook/circuito-italiano-claude';

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

function getValue(id) {
  return document.getElementById(id)?.value.trim() || '';
}

function trackMeta(event, params) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', event, params || {});
  }
}

export function nextStep() {
  const nome = getValue('nome');
  const email = getValue('email');
  const whatsapp = getValue('wpp');

  if (!nome || !email || !whatsapp) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  if (!email.includes('@')) {
    alert('Insira um e-mail válido.');
    return;
  }

  if (whatsapp.replace(/\D/g, '').length < 11) {
    alert('Insira um WhatsApp válido com DDD e 9 dígitos.');
    return;
  }

  document.getElementById('fs1')?.classList.remove('act');
  document.getElementById('fs2')?.classList.add('act');

  const pd1 = document.getElementById('pd1');
  if (pd1) {
    pd1.classList.replace('act', 'dn');
    pd1.textContent = '✓';
  }
  document.getElementById('pd2')?.classList.add('act');

  trackMeta('InitiateCheckout', { content_name: 'LP Circuito Italiano — Etapa 2' });
}

export function prevStep() {
  document.getElementById('fs2')?.classList.remove('act');
  document.getElementById('fs1')?.classList.add('act');
  document.getElementById('pd2')?.classList.remove('act');

  const pd1 = document.getElementById('pd1');
  if (pd1) {
    pd1.classList.replace('dn', 'act');
    pd1.textContent = '1';
  }
}

export function send() {
  const pessoas = getValue('pss');
  const saida = getValue('saida');
  const origem = getValue('ori');

  if (!pessoas || !saida || !origem) {
    alert('Por favor, preencha todos os campos.');
    return false;
  }

  const btn = document.querySelector('#fs2 .btn-orange');
  if (btn) {
    btn.textContent = 'Enviando...';
    btn.disabled = true;
  }

  const whatsapp = '+55 ' + getValue('wpp');
  const payload = {
    nome: getValue('nome'),
    email: getValue('email'),
    telefone: whatsapp,
    whatsapp,

    quantas_pessoas: pessoas,
    pessoas,

    saida_preferida: saida,

    como_ficou_sabendo: origem,
    origem,

    conversion_identifier: 'Circuito Italiano Claude',
    roteiro: 'Circuito Italiano',

    utm_source: getParam('utm_source'),
    utm_medium: getParam('utm_medium'),
    utm_campaign: getParam('utm_campaign'),
    utm_content: getParam('utm_content'),
    utm_term: getParam('utm_term'),
    utm_id: getParam('utm_id'),

    gclid: getParam('gclid'),
    gbraid: getParam('gbraid'),
    wbraid: getParam('wbraid'),
    fbclid: getParam('fbclid'),

    campaign_id: getParam('campaignid'),
    adgroup_id: getParam('adgroupid'),
    ad_id: getParam('adid'),
    creative_id: getParam('creative'),
    keyword: getParam('keyword'),
    keyword_id: getParam('keywordid'),

    matchtype: getParam('matchtype'),
    device: getParam('device'),
    network: getParam('network'),
    placement: getParam('placement'),
    target: getParam('target'),
    adposition: getParam('adposition'),

    loc_physical_ms: getParam('loc_physical_ms'),
    loc_interest_ms: getParam('loc_interest_ms'),

    page_url: window.location.href,
    landing_page: window.location.pathname,
    referrer: document.referrer,
    user_agent: navigator.userAgent,

    timestamp: new Date().toISOString()
  };

  try {
    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch (error) {
    console.error('Erro ao enviar webhook', error);
  }

  trackMeta('Lead', {
    content_name: 'LP Circuito Italiano',
    content_category: 'Roteiro Circuito Italiano'
  });

  return true;
}

function applyWppMask(input) {
  let d = input.value.replace(/\D/g, '');
  if (d.startsWith('55') && d.length > 11) d = d.slice(2);
  d = d.slice(0, 11);
  let v = '';
  if (d.length === 0)      v = '';
  else if (d.length <= 2)  v = '(' + d;
  else if (d.length <= 7)  v = '(' + d.slice(0,2) + ') ' + d.slice(2);
  else                     v = '(' + d.slice(0,2) + ') ' + d.slice(2,7) + '-' + d.slice(7);
  input.value = v;
}

function fillHiddenTracking() {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  set('h-utm_source', getParam('utm_source'));
  set('h-utm_medium', getParam('utm_medium'));
  set('h-utm_campaign', getParam('utm_campaign'));
  set('h-utm_content', getParam('utm_content'));
  set('h-utm_term', getParam('utm_term'));
  set('h-gclid', getParam('gclid'));
  set('h-fbclid', getParam('fbclid'));
  set('h-campaign_id', getParam('campaignid'));
  set('h-adgroup_id', getParam('adgroupid'));
  set('h-creative_id', getParam('creative'));
  set('h-keyword', getParam('keyword'));
  set('h-device', getParam('device'));
  set('h-page_url', window.location.href);
  set('h-referrer', document.referrer);
}

export function initFormActions() {
  fillHiddenTracking();
  document.querySelectorAll('[data-action="next-step"]').forEach(btn => {
    btn.addEventListener('click', nextStep);
  });

  document.querySelectorAll('[data-action="prev-step"]').forEach(btn => {
    btn.addEventListener('click', prevStep);
  });

  const form = document.getElementById('form-lead-circuito-italiano');
  if (form) {
    form.addEventListener('submit', (e) => {
      if (!send()) e.preventDefault();
    });
  }

  const wpp = document.getElementById('wpp');
  if (wpp) {
    wpp.addEventListener('input', () => applyWppMask(wpp));
    wpp.addEventListener('paste', () => setTimeout(() => applyWppMask(wpp), 0));
  }
}
