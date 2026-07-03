# Circuito Italiano — Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, vanilla HTML/CSS/JS landing page for the Girotrip "Circuito Italiano" tour, following the exact architectural pattern of `minas-historica/` and `mexico-cultural-colonial/`, then deploy it to its own isolated GitHub repo + Vercel project.

**Architecture:** Single `index.html` entry point + one CSS file per section + one JS module per responsibility (`type="module"`, `main.js` imports and calls `init*()` functions via a barrel `index.js`). No build step — files served as-is by Vercel. Modules that are 100% generic (`tickers.js`, `faq.js`, `smooth-scroll.js`, `reveal.js`, `header.js`, `strips.js`, `roteiro.js`) are copied byte-for-byte from `minas-historica/js/`; only `countdown.js` and `form.js` get logic changes (multiple departure dates, new webhook/form id).

**Tech Stack:** Vanilla JS (ES modules), vanilla CSS (custom properties, no preprocessor), Google Fonts (Libre Baskerville + Montserrat), Meta Pixel, Google Tag Manager, RD Station "Formulários Capturados", n8n webhook.

## Global Constraints

(copied verbatim from `DIRETRIZES.md` and `docs/PRD-circuito-italiano.md` — every task below implicitly obeys these)

- `overflow-x: clip` on `html`/`body`, never `hidden` (breaks `position: sticky`)
- `background-attachment: fixed` always needs a `background-attachment: scroll` override at `max-width: 768px`
- Loop/marquee animations via `requestAnimationFrame` (`tickers.js`), never CSS `animation` with `overflow: hidden`
- Max 500 lines per CSS/JS file
- Cache-busting query string (`?v=N`) bumped on every edit to a CSS/JS file already referenced in `index.html`
- Form: `method="get"`, `action` → thank-you page, `id="form-lead-circuito-italiano"` (unique per LP — a real bug on 16/06/2026 attributed México leads to the wrong LP in RD Station because both forms shared `id="form-lead"`)
- Buttons that advance a form step use `type="button"` (no `type="button"` = premature native submit)
- `preventDefault()` on form submit **only** when client-side validation fails — RD Station ignores cancelled submits
- Webhook `fetch` uses `keepalive: true`, no `await`, fire-and-forget
- `git config user.email "girotripturismo@gmail.com"` before the first commit (Vercel blocks deploy otherwise)
- New repo, new Vercel project, **no** `vercel.json` — must not touch `minas-historica-vesperata` or `mexico-cultural-colonial` repos/projects in any way
- Meta Pixel ID `170983320269952`, GTM container `GTM-57G5D65H` (both reused, same Girotrip account)
- Webhook URL (production): `https://automatik-n8n.t1prud.easypanel.host/webhook/circuito-italiano-claude`
- RD Station form name: **"Circuito Italiano Claude"**
- Price: 10x R$ 3.424 (total R$ 34.240) ou R$ 33.213 à vista (3% desconto)
- Datas de saída 2027: Maio 05-20, Junho 09-24, Setembro 01-16
- Roteiro: 7 capítulos narrativos (ver Task 6)

---

## Task 0: Read reference files (no code changes)

Before starting, re-confirm current state (per `DIRETRIZES.md` §7.1 "nunca presumir"):

- [ ] **Step 1:** Run `ls "C:\Users\mkt02\Desktop\Claude-Work\Landing Pages\circuito-italiano"` and confirm only `docs/` and `Design-system/` exist (no `index.html`, `css/`, `js/` yet). If anything else exists, stop and report to the user before continuing — do not overwrite unknown files.

---

## Task 1: Scaffolding — folders, base.css, animations.css, index.html shell, Design-system doc

**Files:**
- Create: `circuito-italiano/css/base.css`
- Create: `circuito-italiano/css/animations.css`
- Create: `circuito-italiano/css/responsive.css`
- Create: `circuito-italiano/css/header.css`
- Create: `circuito-italiano/css/footer.css`
- Create: `circuito-italiano/index.html` (shell only — header, footer, empty `<section>` stubs for all 11 blocks, `<head>` fully wired)
- Create: `circuito-italiano/js/main.js`
- Create: `circuito-italiano/js/index.js`
- Create: `circuito-italiano/Design-system/design-system-circuito-italiano.md`
- Copy: `minas-historica/js/header.js` → `circuito-italiano/js/header.js` (unchanged)
- Copy: `minas-historica/js/reveal.js` → `circuito-italiano/js/reveal.js` (unchanged)
- Copy: `minas-historica/js/smooth-scroll.js` → `circuito-italiano/js/smooth-scroll.js` (unchanged)

**Interfaces:**
- Produces: CSS custom properties in `base.css` (`--blue`, `--orange`, `--cinema-bg`, `--ff-serif`, `--ff-sans`, `--max`, `--pad`, spacing/motion tokens) — every later CSS file in this plan depends on these. `.wrap`, `.btn`, `.btn-orange`, `.overline`, `.rule` utility classes.
- Produces: `index.js` barrel exporting `initHeader`, `initReveal`, `initSmoothScroll` (Task 1), plus placeholders for the rest added incrementally in later tasks.
- Produces: `<section id="s-hero">`, `<section id="s-dolcevita">`, `<section id="s-data">`, `<section id="s-rot">`, `<section id="s-grupo">`, `<section id="s-excl">`, `<section id="s-pv">`, `<section id="s-dep">`, `<section id="s-inv">`, `<section id="s-faq">`, `<section id="s-form">` — every later task fills in one of these ids.

- [ ] **Step 1: Create folder structure**

```bash
mkdir -p "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages/circuito-italiano/css"
mkdir -p "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages/circuito-italiano/js"
```

- [ ] **Step 2: Copy the 100%-generic JS modules unchanged**

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages"
cp minas-historica/js/header.js circuito-italiano/js/header.js
cp minas-historica/js/reveal.js circuito-italiano/js/reveal.js
cp minas-historica/js/smooth-scroll.js circuito-italiano/js/smooth-scroll.js
```

- [ ] **Step 3: Write `css/base.css`**

```css
/* ═══════════════════════════════════════
   BASE — Design tokens, reset, utilities
   Contract: CSS custom properties are the
   shared interface between all modules.
═══════════════════════════════════════ */

:root {
  /* Brand — Girotrip (igual em todas as LPs) */
  --blue:        #1f4c94;
  --blue-d:      #163a73;
  --blue-l:      #2a5faf;
  --orange:      #ff7f00;
  --orange-d:    #e06f00;

  /* Neutrals */
  --white:       #ffffff;
  --off:         #f5f5f5;
  --cream:       #faf9f7;
  --dark:        #1a1a2e;
  --text:        #2c2c3e;
  --muted:       #666677;
  --border:      #e8e8e8;

  /* La Dolce Vita — seção temática (equivalente ao --cinema-bg) */
  --cinema-bg:   #3D2817;

  /* Typography */
  --ff-serif:    'Libre Baskerville', 'Baskerville URW', Baskerville, Georgia, serif;
  --ff-sans:     'Montserrat', system-ui, sans-serif;

  /* Layout */
  --max:         1200px;
  --pad:         40px;

  /* Motion */
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --dur-fast:    0.3s;
  --dur-med:     0.6s;
  --dur-slow:    1s;
}

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html {
  scroll-behavior: smooth;
  font-size: 16px;
  overflow-x: clip; /* nunca hidden — quebraria position:sticky */
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
body {
  font-family: var(--ff-sans);
  color: var(--text);
  background: var(--white);
  line-height: 1.6;
  overflow-x: clip;
}
img { max-width: 100%; display: block; }
a   { text-decoration: none; color: inherit; }
button { font-family: var(--ff-sans); cursor: pointer; }

/* Container */
.wrap {
  max-width: var(--max);
  margin: 0 auto;
  padding: 0 var(--pad);
}

/* Typography helpers */
.serif    { font-family: var(--ff-serif); }
.overline {
  font-size: 11px; font-weight: 700;
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--orange); display: block; margin-bottom: 14px;
}
.overline--light { color: rgba(255,255,255,.6); }
.rule {
  width: 40px; height: 3px;
  background: var(--orange);
  margin-bottom: 20px;
}
.rule--white { background: rgba(255,255,255,.5); }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 15px 36px; border: none; border-radius: 0;
  font-family: var(--ff-sans); font-size: 13px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase;
  cursor: pointer; transition: background var(--dur-fast), transform var(--dur-fast);
  white-space: nowrap;
}
.btn-orange { background: var(--orange); color: var(--white); }
.btn-orange:hover { background: var(--orange-d); transform: translateY(-2px); }
.btn-outline-w { background: transparent; color: var(--white); border: 1.5px solid rgba(255,255,255,.4); }
.btn-outline-w:hover { background: rgba(255,255,255,.08); border-color: var(--white); }
.btn-outline-b { background: transparent; color: var(--blue); border: 1.5px solid var(--blue); }
.btn-outline-b:hover { background: var(--blue); color: var(--white); }
.btn-lg { padding: 18px 48px; font-size: 14px; }
.btn-full { width: 100%; padding: 18px; justify-content: center; }
```

- [ ] **Step 4: Write `css/animations.css`**

```css
/* ═══════════════════════════════════════
   ANIMATIONS — reveal + word-reveal keyframes
   Consumed by reveal.js (class toggles)
═══════════════════════════════════════ */
.word-reveal .word {
  display: inline-block;
  opacity: 0; transform: translateY(14px);
  transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
}
.word-reveal.fired .word { opacity: 1; transform: none; }

.from-left, .from-right, .scale-up {
  opacity: 0; transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
}
.from-left  { transform: translateX(-32px); }
.from-right { transform: translateX(32px); }
.scale-up   { transform: scale(0.96); }
.from-left.in, .from-right.in, .scale-up.in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .word-reveal .word, .from-left, .from-right, .scale-up {
    transition: none !important; opacity: 1 !important; transform: none !important;
  }
}
```

- [ ] **Step 5: Write `css/header.css`** (identical to Minas — generic header behavior)

```css
/* ══ HEADER MODULE ══════════════════════ */
#hdr {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 18px 0;
  transition: background 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease;
}
#hdr.solid {
  background: rgba(255,255,255,.97);
  padding: 10px 0;
  box-shadow: 0 1px 0 var(--border), 0 4px 24px rgba(0,0,0,.06);
  backdrop-filter: blur(12px);
}
.hdr-in { display: flex; align-items: center; justify-content: space-between; }

#logo-w { height: 90px; width: auto; transition: height 0.4s ease; }
#logo-c { height: 90px; width: auto; display: none; transition: height 0.4s ease; }
#hdr.solid #logo-w { display: none; height: 72px; }
#hdr.solid #logo-c { display: block; height: 72px; }

.hdr-nav { display: flex; align-items: center; gap: 8px; }
.hdr-ghost {
  padding: 8px 20px; border: 1px solid rgba(255,255,255,.45);
  color: var(--white); font-size: 11px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase;
  background: transparent; transition: all 0.2s ease; cursor: pointer;
}
#hdr.solid .hdr-ghost { border-color: var(--blue); color: var(--blue); }
.hdr-ghost:hover { background: rgba(255,255,255,.1); }
#hdr.solid .hdr-ghost:hover { background: var(--blue); color: var(--white); }

/* Scroll progress bar */
#scroll-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0;
  background: var(--orange); z-index: 1001; transition: width 0.1s linear;
}
```

- [ ] **Step 6: Write `css/footer.css`**

```css
/* ══ FOOTER MODULE ══════════════════════ */
#ft {
  background: var(--dark); color: rgba(255,255,255,.55);
  padding: 40px 0; text-align: center; font-size: 12px;
}
#ft a { color: rgba(255,255,255,.75); }
#ft a:hover { color: var(--orange); }
```

- [ ] **Step 7: Write `css/responsive.css`** (skeleton — later tasks append per-section rules here, never in the section's own file, per `DIRETRIZES.md` §3.2)

```css
/* ═══════════════════════════════════════
   RESPONSIVE — all breakpoints centralized
   Order: 1024 → 900 → 768 (mobile-first override cascade)
═══════════════════════════════════════ */

@media (max-width: 1024px) {
  :root { --pad: 28px; }
}

@media (max-width: 900px) {
}

@media (max-width: 768px) {
  #logo-w, #logo-c { height: 56px; }
  #hdr.solid #logo-w, #hdr.solid #logo-c { height: 48px; }
}
```

- [ ] **Step 8: Write `js/index.js`** (barrel — grows with each later task)

```js
export { initHeader } from './header.js';
export { initReveal } from './reveal.js';
export { initSmoothScroll } from './smooth-scroll.js';
```

- [ ] **Step 9: Write `js/main.js`** (entry point — grows with each later task)

```js
import {
  initHeader,
  initReveal,
  initSmoothScroll
} from './index.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initReveal();
  initSmoothScroll();
});
```

- [ ] **Step 10: Write `index.html`** (shell — head fully wired, all 11 sections present as empty stubs so later tasks only fill content, never restructure)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Circuito Italiano · Girotrip Turismo</title>
<meta name="description" content="Toscana, Roma, Veneza e a Costa Amalfitana em uma única viagem em grupo com guia desde o Brasil. Saídas 2027.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

<!-- CSS Modules -->
<link rel="stylesheet" href="css/base.css?v=1">
<link rel="stylesheet" href="css/animations.css?v=1">
<link rel="stylesheet" href="css/header.css?v=1">
<link rel="stylesheet" href="css/hero.css?v=1">
<link rel="stylesheet" href="css/dolcevita.css?v=1">
<link rel="stylesheet" href="css/data.css?v=1">
<link rel="stylesheet" href="css/roteiro.css?v=1">
<link rel="stylesheet" href="css/grupo.css?v=1">
<link rel="stylesheet" href="css/exclusividades.css?v=1">
<link rel="stylesheet" href="css/para-voce.css?v=1">
<link rel="stylesheet" href="css/depoimentos.css?v=1">
<link rel="stylesheet" href="css/investimento.css?v=1">
<link rel="stylesheet" href="css/faq.css?v=1">
<link rel="stylesheet" href="css/form.css?v=1">
<link rel="stylesheet" href="css/footer.css?v=1">
<link rel="stylesheet" href="css/responsive.css?v=1">

<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '170983320269952');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=170983320269952&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-57G5D65H');</script>
<!-- End Google Tag Manager -->
<script type="text/javascript" async src="https://d335luupugsy2.cloudfront.net/cs/loader-min.js?lc=5d2aab381fc10f79ae66cc75d383b6ad"></script>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-57G5D65H"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<div id="scroll-bar"></div>

<!-- ══ HEADER ══════════════════════════ -->
<header id="hdr">
  <div class="wrap"><div class="hdr-in">
    <a href="#">
      <img id="logo-w" src="MARCA D'ÁGUA (3).png" alt="Girotrip Turismo" onerror="this.style.display='none'">
      <img id="logo-c" src="MARCA D'ÁGUA (1).png" alt="Girotrip Turismo" onerror="this.style.display='none'">
    </a>
    <nav class="hdr-nav">
      <button class="hdr-ghost" data-action="scroll-to" data-target="#s-form">Receber detalhes</button>
    </nav>
  </div></div>
</header>

<section id="s-hero"></section>
<section id="s-dolcevita"></section>
<section id="s-data"></section>
<section id="s-rot"></section>
<section id="s-grupo"></section>
<section id="s-excl"></section>
<section id="s-pv"></section>
<section id="s-dep"></section>
<section id="s-inv"></section>
<section id="s-faq"></section>
<section id="s-form"></section>

<!-- ══ FOOTER ══════════════════════════ -->
<footer id="ft">
  <div class="wrap">Girotrip Turismo © 2027. Todos os direitos reservados.</div>
</footer>

<script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 11: Write `Design-system/design-system-circuito-italiano.md`**

```markdown
# Design System — Circuito Italiano
**Campanha:** Circuito Italiano
**Marca:** Girotrip Turismo

## Relação com o sistema Minas Histórica
Reutiliza integralmente `css/base.css` de `minas-historica/` (reset, tipografia, botões, container). Só `--cinema-bg` ganha tom próprio para a seção temática "La Dolce Vita".

## Tokens (idênticos a base.css, exceto --cinema-bg)
- `--cinema-bg: #3D2817` — terracota-pôr-do-sol, evoca a Costa Amalfitana ao entardecer (era `#0a0e1a`, azul-noite de Diamantina, em Minas)

## Mapeamento de seções (minas-historica → circuito-italiano)
| minas-historica | circuito-italiano | Observação |
|---|---|---|
| Hero | Hero | Mesmo componente, troca imagem/copy |
| Vesperata (cinema) | La Dolce Vita | Troca `--cinema-bg`, imagens `strip-*` |
| Data | Data | 3 datas de saída 2027, countdown pra mais próxima |
| Roteiro | Roteiro | 7 painéis em vez de 5 — `.rot-track`/`.rot-pin-outer` recalculados |
| Grupo | Grupo | Mesmo componente |
| Exclusividades | Exclusividades | Ticker de texto/ícone, sem imagem própria |
| Para Você | Para Você | Mesmo componente |
| Depoimentos | Depoimentos | Reaproveita imagens/textos reais (Sidio, Sandra, Dalva, Jacqueline, Marilia) |
| Investimento | Investimento | Value stack (11 itens) antes do preço |
| FAQ | FAQ | Mesmo componente |
| Formulário | Formulário | `id="form-lead-circuito-italiano"`, webhook próprio, campo extra "saída preferida" |
```

- [ ] **Step 12: Test locally**

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages/circuito-italiano"
npx http-server . -p 5500
```
Open `http://127.0.0.1:5500/` — expected: white page, fixed header with Girotrip logo (or broken-image icon hidden by `onerror` if `MARCA D'ÁGUA` files aren't copied yet — that's fine, they get copied in Task 2), "Receber detalhes" button, dark footer with copyright text, zero console errors about missing CSS/JS files (all 15 stylesheets and `main.js` must return 200, even though most sections are still empty).

- [ ] **Step 13: Commit** (local only — no git repo yet, this is just the working tree; actual `git init` happens in Task 14)

No commit yet — `git init` hasn't run. Proceed to Task 2.

---

## Task 2: Header logo assets + Hero section

**Files:**
- Create: `circuito-italiano/css/hero.css`
- Modify: `circuito-italiano/index.html:` (fill `<section id="s-hero">`)
- Modify: `circuito-italiano/index.html:` (bump `css/hero.css?v=1`)
- User action required: copy `MARCA D'ÁGUA (1).png` and `MARCA D'ÁGUA (3).png` from `minas-historica/` into `circuito-italiano/` root, and add `circuito-italiano-hero.jpg` (1600×1000px) per the image manifest in the PRD

**Interfaces:**
- Consumes: `--blue-d`, `--orange`, `--ff-serif`, `--ff-sans`, `.wrap`, `.btn`, `.overline` from `base.css` (Task 1)
- Produces: `#s-hero` filled — no other task depends on hero internals

- [ ] **Step 1: Write `css/hero.css`**

```css
/* ══ HERO MODULE ════════════════════════ */
#hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: center;
  padding: 140px 0 100px;
  background: var(--blue-d);
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background-image: url('../circuito-italiano-hero.jpg');
  background-size: cover; background-position: center;
  background-attachment: fixed;
}
.hero-bg::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(110deg,
    rgba(22,58,115,.96) 0%,
    rgba(31,76,148,.82) 45%,
    rgba(31,76,148,.45) 70%,
    rgba(31,76,148,.08) 100%
  );
}
.hero-content { position: relative; z-index: 2; max-width: 820px; }

.hero-kicker {
  display: inline-block;
  font-size: 11px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
  color: var(--orange); padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,127,0,.35);
  margin-bottom: 32px;
}
.hero-h1 {
  font-family: var(--ff-serif);
  font-size: 84px; font-weight: 400; line-height: 1.04;
  color: var(--white); margin-bottom: 28px; letter-spacing: -.02em;
}
.hero-h1 span { display: block; }
.hero-h1 em { font-style: italic; color: var(--orange); font-weight: 300; }
.hero-sub {
  font-size: 18px; font-weight: 300; line-height: 1.75;
  color: rgba(255,255,255,.7);
  margin-bottom: 44px; max-width: 560px;
}
.hero-cta { margin-bottom: 60px; }
.hero-data {
  display: flex; align-items: center; gap: 36px;
  padding-top: 28px;
  border-top: 1px solid rgba(255,255,255,.12);
  flex-wrap: wrap;
}
.hero-data-item span {
  display: block; font-size: 10px; font-weight: 700;
  letter-spacing: .14em; text-transform: uppercase;
  color: rgba(255,255,255,.38); margin-bottom: 3px;
}
.hero-data-item strong { font-size: 13px; font-weight: 600; color: var(--white); }
```

- [ ] **Step 2: Add mobile override to `css/responsive.css`** (background-attachment fixed is forbidden on mobile — `DIRETRIZES.md` §4.2)

Append to `css/responsive.css`:
```css
@media (max-width: 768px) {
  .hero-bg { background-attachment: scroll; }
  .hero-h1 { font-size: 44px; }
}
```

- [ ] **Step 3: Fill `<section id="s-hero">` in `index.html`**

```html
<section id="s-hero">
  <div class="hero-bg"></div>
  <div class="wrap"><div class="hero-content">
    <span class="hero-kicker">Circuito Italiano · Saídas 2027</span>
    <h1 class="hero-h1 word-reveal">
      <span><em>Da Toscana a Roma,</em></span>
      <span>de Veneza à Costa Amalfitana</span>
    </h1>
    <p class="hero-sub">O roteiro em grupo mais completo pela Itália, com guia desde o Brasil: 16 dias por Milão, Cinque Terre, Toscana, Roma e Vaticano, Nápoles, Capri, Costa Amalfitana, Assis e Veneza.</p>
    <div class="hero-cta">
      <button class="btn btn-orange btn-lg" data-action="scroll-to" data-target="#s-form">Quero Receber os Detalhes</button>
    </div>
    <div class="hero-data">
      <div class="hero-data-item"><span>Duração</span><strong>16 dias</strong></div>
      <div class="hero-data-item"><span>Saídas</span><strong>Maio · Junho · Setembro 2027</strong></div>
      <div class="hero-data-item"><span>A partir de</span><strong>10x R$ 3.424</strong></div>
    </div>
  </div></div>
</section>
```

- [ ] **Step 4: Bump cache-busting**

In `index.html`, change `<link rel="stylesheet" href="css/hero.css?v=1">` — already `v=1` since this is the first write, no bump needed yet (bump only applies to *edits* of already-referenced files, per `DIRETRIZES.md` §4.5).

- [ ] **Step 5: Test locally**

Refresh `http://127.0.0.1:5500/` — expected: full-viewport hero with headline "Da Toscana a Roma, de Veneza à Costa Amalfitana" fading in word-by-word on load, orange CTA button, 3-item data strip at the bottom. If `circuito-italiano-hero.jpg` isn't in the folder yet, the hero shows solid `--blue-d` background with no crash (that's acceptable until the image is provided — flag to the user which exact file is still missing, per the image manifest).

---

## Task 3: La Dolce Vita (thematic section, strips.js)

**Files:**
- Create: `circuito-italiano/css/dolcevita.css`
- Copy: `minas-historica/js/strips.js` → `circuito-italiano/js/strips.js` (unchanged — reads `#ves-strips` / `.ves-strip` / `.ves-dot`, generic to any number of strips)
- Modify: `circuito-italiano/js/index.js`, `circuito-italiano/js/main.js` (add `initStrips`)
- Modify: `circuito-italiano/index.html` (fill `<section id="s-dolcevita">`)
- User action required: 5 images `circuito-italiano-strip-01.jpg` … `circuito-italiano-strip-05.jpg` (1200×500px) per the manifest

**Interfaces:**
- Consumes: `--cinema-bg`, `.overline--light`, `.rule--white` from `base.css`
- Produces: nothing consumed by later tasks — self-contained section

- [ ] **Step 1: Copy `strips.js`**

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages"
cp minas-historica/js/strips.js circuito-italiano/js/strips.js
```

- [ ] **Step 2: Write `css/dolcevita.css`**

```css
/* ══ LA DOLCE VITA — seção temática ═══════ */
#s-dolcevita {
  background: var(--cinema-bg); color: var(--white);
  padding: 100px 0 80px;
}
.dv-head { text-align: center; max-width: 720px; margin: 0 auto 56px; }
.dv-title {
  font-family: var(--ff-serif); font-size: 44px; font-weight: 700;
  color: var(--white); margin-bottom: 18px; line-height: 1.15;
}
.dv-sub { font-size: 16px; font-weight: 300; color: rgba(255,255,255,.7); line-height: 1.75; }

.ves-strips { display: flex; gap: 4px; height: 420px; }
.ves-strip {
  flex: 1; position: relative; background-size: cover; background-position: center;
  cursor: pointer; overflow: hidden;
  clip-path: inset(0 50% 0 50%);
  transition: flex 0.6s var(--ease-out), clip-path 0.9s var(--ease-out);
}
.ves-strip.open   { clip-path: inset(0 0 0 0); }
.ves-strip.act     { flex: 2.4; }
.ves-strip-info {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 20px 16px;
  background: linear-gradient(to top, rgba(0,0,0,.75), transparent);
  opacity: 0; transition: opacity 0.3s ease;
}
.ves-strip.act .ves-strip-info { opacity: 1; }
.ves-strip-title { font-family: var(--ff-serif); font-size: 18px; color: var(--white); }
.ves-strip-sub { font-size: 11px; color: rgba(255,255,255,.6); margin-top: 2px; }

.ves-dots { display: flex; justify-content: center; gap: 8px; margin-top: 24px; }
.ves-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,.25); cursor: pointer; transition: background 0.2s ease;
}
.ves-dot.act { background: var(--orange); }
```

- [ ] **Step 3: Append mobile override to `css/responsive.css`**

```css
@media (max-width: 768px) {
  .ves-strips { height: 280px; flex-direction: column; }
  .dv-title { font-size: 30px; }
}
```

- [ ] **Step 4: Fill `<section id="s-dolcevita">` in `index.html`**

```html
<section id="s-dolcevita">
  <div class="wrap">
    <div class="dv-head">
      <span class="overline overline--light">La Dolce Vita</span>
      <h2 class="dv-title from-left">Viver a Itália, não só visitá-la</h2>
      <p class="dv-sub from-right">Mais do que um roteiro de lugares, uma imersão em séculos de história, arte e sabor — dos vinhedos da Toscana às ruelas de Veneza, do Vaticano à Costa Amalfitana ao entardecer.</p>
    </div>
    <div class="ves-strips" id="ves-strips">
      <div class="ves-strip" style="background-image:url('circuito-italiano-strip-01.jpg')">
        <div class="ves-strip-info"><div class="ves-strip-title">Toscana</div><div class="ves-strip-sub">Vinhedos e Renascença</div></div>
      </div>
      <div class="ves-strip" style="background-image:url('circuito-italiano-strip-02.jpg')">
        <div class="ves-strip-info"><div class="ves-strip-title">Roma</div><div class="ves-strip-sub">Vaticano e Capela Sistina</div></div>
      </div>
      <div class="ves-strip" style="background-image:url('circuito-italiano-strip-03.jpg')">
        <div class="ves-strip-info"><div class="ves-strip-title">Costa Amalfitana</div><div class="ves-strip-sub">Penhascos sobre o Mediterrâneo</div></div>
      </div>
      <div class="ves-strip" style="background-image:url('circuito-italiano-strip-04.jpg')">
        <div class="ves-strip-info"><div class="ves-strip-title">Veneza</div><div class="ves-strip-sub">Canais e gôndolas</div></div>
      </div>
      <div class="ves-strip" style="background-image:url('circuito-italiano-strip-05.jpg')">
        <div class="ves-strip-info"><div class="ves-strip-title">Cinque Terre</div><div class="ves-strip-sub">Vilarejos coloridos à beira-mar</div></div>
      </div>
    </div>
    <div class="ves-dots">
      <div class="ves-dot" data-strip-index="0"></div>
      <div class="ves-dot" data-strip-index="1"></div>
      <div class="ves-dot" data-strip-index="2"></div>
      <div class="ves-dot" data-strip-index="3"></div>
      <div class="ves-dot" data-strip-index="4"></div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Wire `initStrips` into `js/index.js` and `js/main.js`**

`js/index.js` — add line:
```js
export { initStrips } from './strips.js';
```

`js/main.js` — replace full contents with:
```js
import {
  initHeader,
  initReveal,
  initSmoothScroll,
  initStrips
} from './index.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initReveal();
  initStrips();
  initSmoothScroll();
});
```

- [ ] **Step 6: Test locally**

Refresh page, scroll to La Dolce Vita section — expected: dark terracota background, 5 vertical strips that curtain-open on scroll-into-view, first strip auto-expands and title fades in, strips auto-rotate every 4s, hover pauses rotation and expands that strip, dots at bottom reflect current strip. No console errors even without the real strip images (broken `background-image` just shows the strip's dark fallback, non-fatal).

---

## Task 4: Data section (3 departure dates + countdown to nearest)

**Files:**
- Create: `circuito-italiano/css/data.css`
- Create: `circuito-italiano/js/countdown.js` (adapted — Minas hardcodes ONE date; here we compute the nearest **future** date among 3)
- Modify: `circuito-italiano/js/index.js`, `circuito-italiano/js/main.js` (add `initCountdown`)
- Modify: `circuito-italiano/index.html` (fill `<section id="s-data">`)
- User action required: `circuito-italiano-data.jpg` (1920×1200px)

**Interfaces:**
- Consumes: `--blue`, `--cream`, `.wrap`, `.overline` from `base.css`
- Produces: `#countdown-timer` element with `[data-value="days|hours|minutes|seconds"]` children — no other task depends on this

- [ ] **Step 1: Write `js/countdown.js`**

```js
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
```

- [ ] **Step 2: Write `css/data.css`**

```css
/* ══ DATA MODULE ════════════════════════ */
#s-data {
  background: var(--cream);
  padding: 88px 0;
}
.dt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.dt-title { font-family: var(--ff-serif); font-size: 38px; color: var(--blue); margin-bottom: 16px; }
.dt-list { list-style: none; margin: 24px 0; }
.dt-list li {
  display: flex; justify-content: space-between;
  padding: 14px 0; border-bottom: 1px solid var(--border);
  font-size: 15px;
}
.dt-list li strong { color: var(--blue); }
.dt-img { border-radius: 4px; overflow: hidden; }
.dt-img img { width: 100%; height: 100%; object-fit: cover; }

.cd-timer { display: flex; gap: 16px; margin-top: 28px; }
.cd-unit { text-align: center; }
.cd-unit strong {
  display: block; font-family: var(--ff-serif); font-size: 32px; color: var(--orange);
}
.cd-unit span { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
.cd-expired { font-size: 14px; color: var(--orange); font-weight: 700; }
```

- [ ] **Step 3: Append mobile override to `css/responsive.css`**

```css
@media (max-width: 768px) {
  .dt-grid { grid-template-columns: 1fr; gap: 32px; }
}
```

- [ ] **Step 4: Fill `<section id="s-data">` in `index.html`**

```html
<section id="s-data">
  <div class="wrap dt-grid">
    <div>
      <span class="overline">Saídas de São Paulo · 2027</span>
      <h2 class="dt-title from-left">Escolha a sua data</h2>
      <ul class="dt-list">
        <li><span>Maio</span><strong>05 a 20/05/27</strong></li>
        <li><span>Junho</span><strong>09 a 24/06/27</strong></li>
        <li><span>Setembro</span><strong>01 a 16/09/27</strong></li>
      </ul>
      <div class="cd-timer" id="countdown-timer">
        <div class="cd-unit"><strong data-value="days">00</strong><span>Dias</span></div>
        <div class="cd-unit"><strong data-value="hours">00</strong><span>Horas</span></div>
        <div class="cd-unit"><strong data-value="minutes">00</strong><span>Min</span></div>
        <div class="cd-unit"><strong data-value="seconds">00</strong><span>Seg</span></div>
      </div>
    </div>
    <div class="dt-img scale-up"><img src="circuito-italiano-data.jpg" alt="Circuito Italiano"></div>
  </div>
</section>
```

- [ ] **Step 5: Wire `initCountdown`**

`js/index.js` — add:
```js
export { initCountdown } from './countdown.js';
```

`js/main.js` — add `initCountdown` to the import list and call it inside `DOMContentLoaded`.

- [ ] **Step 6: Test locally**

Refresh, scroll to Data section — expected: 3 dates listed, a 4-unit countdown ticking down once per second toward 05/05/2027 (since today, per system context, is before that date — verify the days count is a large positive number, not negative/expired).

---

## Task 5: Roteiro section — 7-panel pin-scroll carousel

**Files:**
- Create: `circuito-italiano/css/roteiro.css` (adapted from Minas — `.rot-track` recalculated for 7 panels)
- Copy: `minas-historica/js/roteiro.js` → `circuito-italiano/js/roteiro.js` (**unchanged** — `total = panels.length` is already dynamic, only the CSS is hardcoded)
- Modify: `circuito-italiano/js/index.js`, `circuito-italiano/js/main.js` (add `initRoteiro`)
- Modify: `circuito-italiano/index.html` (add `.rot-dots` nav near top of `<body>`, fill `<section id="s-rot">`)
- User action required: 7 images per manifest, 1200×700px, filenames `roteiro-milao.jpg`, `roteiro-cinque-terre.jpg`, `roteiro-toscana.jpg`, `roteiro-roma-vaticano.jpg`, `roteiro-napoles-capri-amalfitana.jpg`, `roteiro-assis.jpg`, `roteiro-veneza-verona-garda.jpg`

**Interfaces:**
- Consumes: `--orange`, `--ff-serif`, `--ease-out` from `base.css`; `roteiro.js`'s `initRoteiro()` reads `.rot-pin-outer`, `.rot-track`, `.rot-panel`, `.rot-dot-item`, `.rot-dots`, `.rot-scroll-hint`, `.rot-counter span` by class/id only — no parameters, works with any panel count
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Copy `roteiro.js` unchanged**

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages"
cp minas-historica/js/roteiro.js circuito-italiano/js/roteiro.js
```

- [ ] **Step 2: Write `css/roteiro.css`** — same as Minas's, with `.rot-track` and `.rot-pin-outer` recalculated for **7 panels** (Minas hardcodes 5: `500vw`/`400vh`; here `700vw`/`560vh`, keeping 80vh-per-panel)

```css
/* ══ ROTEIRO — PINNED HORIZONTAL SCROLL ══
   7 painéis (Circuito Italiano) — Minas usa 5.
   .rot-track e .rot-pin-outer recalculados abaixo;
   roteiro.js não muda (total = panels.length é dinâmico).
════════════════════════════════════════ */

#s-rot { position: relative; }
.rot-pin-outer {
  height: 560vh; /* 7 painéis × 80vh */
}
.rot-pin-inner {
  position: sticky; top: 0;
  height: 100vh; overflow: hidden;
  z-index: 6;
}

.rot-track {
  display: flex; height: 100%;
  width: 700vw; /* 7 capítulos */
  will-change: transform;
  transition: transform 0.05s linear;
}

.rot-panel {
  width: 100vw; height: 100vh; flex-shrink: 0;
  position: relative; overflow: hidden;
  display: flex; align-items: flex-end;
}
.rot-panel-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  transform: scale(1.08);
  transition: transform 0.8s var(--ease-out);
}
.rot-panel.active .rot-panel-bg { transform: scale(1); }
.rot-panel-ov {
  position: absolute; inset: 0;
  background: linear-gradient(
    to top,
    rgba(14,22,50,.95) 0%,
    rgba(14,22,50,.6)  40%,
    rgba(14,22,50,.15) 75%,
    transparent 100%
  );
}

.rot-content {
  position: relative; z-index: 2;
  padding: 0 80px 72px;
  width: 100%; max-width: 860px;
  margin: 0 auto;
  text-align: center;
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.7s var(--ease-out) 0.2s,
              transform 0.7s var(--ease-out) 0.2s;
}
.rot-panel.active .rot-content { opacity: 1; transform: none; }
.rot-panel-desc { margin-left: auto; margin-right: auto; }
.rot-panel-exp  { justify-content: center; }

.rot-panel-day {
  font-size: 11px; font-weight: 700; letter-spacing: .18em;
  text-transform: uppercase; color: var(--orange); margin-bottom: 12px; display: block;
}
.rot-panel-name {
  font-family: var(--ff-serif); font-size: 72px; font-weight: 700;
  color: var(--white); line-height: 1; margin-bottom: 16px;
  text-shadow: 0 2px 40px rgba(0,0,0,.5);
}
.rot-panel-desc {
  font-size: 16px; font-weight: 300; line-height: 1.75;
  color: rgba(255,255,255,.72); margin-bottom: 24px;
  max-width: 560px;
}
.rot-panel-exp { display: flex; flex-wrap: wrap; gap: 8px; }
.rot-panel-tag {
  font-size: 11px; font-weight: 600; letter-spacing: .04em;
  color: rgba(255,255,255,.75);
  border: 1px solid rgba(255,255,255,.22);
  padding: 5px 14px;
}
.rot-panel-tag--hl { background: var(--orange); color: var(--white); border-color: var(--orange); }

.rot-counter {
  position: absolute; top: 48px; right: 80px; z-index: 10;
  font-family: var(--ff-serif); font-size: 14px;
  color: rgba(255,255,255,.45); letter-spacing: .06em;
}
.rot-counter span { color: var(--white); font-weight: 700; }

.rot-intro {
  background: var(--cream);
  padding: 96px var(--pad) 72px;
  max-width: var(--max); margin: 0 auto;
}
.rot-title {
  font-family: var(--ff-serif); font-size: 52px; font-weight: 700;
  color: var(--blue); line-height: 1.08; margin-bottom: 12px;
}
.rot-sub { font-size: 16px; color: var(--muted); font-weight: 300; }

.rot-scroll-hint {
  position: absolute; bottom: 28px; left: 50%;
  transform: translateX(-50%); z-index: 10;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  opacity: 0; transition: opacity 0.4s ease;
  color: rgba(255,255,255,.4); font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
}
.rot-scroll-hint.show { opacity: 1; }
.rot-scroll-line {
  width: 1px; height: 36px;
  background: linear-gradient(to bottom, var(--orange), transparent);
  animation: scroll-pulse 2s ease-in-out infinite;
}
@keyframes scroll-pulse {
  0%, 100% { opacity: 0.4; transform: scaleY(1); }
  50%       { opacity: 1; transform: scaleY(1.2); }
}

/* Dots nav (fixed, top-level in body — see index.html) */
.rot-dots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 999; display: flex; flex-direction: column; gap: 10px;
  opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
}
.rot-dots.visible { opacity: 1; pointer-events: auto; }
.rot-dot-item {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,.35); cursor: pointer;
  border: 1px solid rgba(255,255,255,.5);
  transition: background 0.2s ease, transform 0.2s ease;
}
.rot-dot-item.active { background: var(--orange); border-color: var(--orange); transform: scale(1.3); }
```

- [ ] **Step 3: Append mobile override to `css/responsive.css`** (per QA checklist: "Roteiro empilhado verticalmente no mobile" — pin-scroll horizontal doesn't work well on touch, so mobile gets a simplified stacked fallback)

```css
@media (max-width: 768px) {
  .rot-pin-outer { height: auto; }
  .rot-pin-inner { position: static; height: auto; }
  .rot-track { flex-direction: column; width: 100%; transform: none !important; }
  .rot-panel { width: 100%; height: 70vh; }
  .rot-panel-name { font-size: 40px; }
  .rot-dots { display: none; }
  .rot-counter { display: none; }
}
```

- [ ] **Step 4: Add `.rot-dots` nav to `index.html`** (right after `<div id="scroll-bar"></div>`, before `<header>`)

```html
<nav class="rot-dots" aria-label="Navegação do roteiro">
  <div class="rot-dot-item active" title="Milão"></div>
  <div class="rot-dot-item" title="Cinque Terre"></div>
  <div class="rot-dot-item" title="Toscana"></div>
  <div class="rot-dot-item" title="Roma e Vaticano"></div>
  <div class="rot-dot-item" title="Nápoles, Capri e Amalfitana"></div>
  <div class="rot-dot-item" title="Assis"></div>
  <div class="rot-dot-item" title="Veneza"></div>
</nav>
```

- [ ] **Step 5: Fill `<section id="s-rot">` in `index.html`** — 7 panels, day ranges and copy from PRD §7.1

```html
<section id="s-rot">
  <div class="rot-intro">
    <h2 class="rot-title from-left">O Roteiro</h2>
    <p class="rot-sub from-right">16 dias, 7 capítulos de uma Itália que vai da moda de Milão à espiritualidade de Assis.</p>
  </div>
  <div class="rot-pin-outer">
    <div class="rot-pin-inner">
      <div class="rot-counter"><span>01</span> / 07</div>
      <div class="rot-track">

        <div class="rot-panel active">
          <div class="rot-panel-bg" style="background-image:url('roteiro-milao.jpg')"></div>
          <div class="rot-panel-ov"></div>
          <div class="rot-content">
            <span class="rot-panel-day">Dia 1-2</span>
            <h3 class="rot-panel-name">Milão</h3>
            <p class="rot-panel-desc">Chegada e a elegância da capital da moda — city tour, Duomo e Galeria Vittorio Emanuele.</p>
            <div class="rot-panel-exp">
              <span class="rot-panel-tag rot-panel-tag--hl">Chegada</span>
              <span class="rot-panel-tag">City Tour</span>
            </div>
          </div>
        </div>

        <div class="rot-panel">
          <div class="rot-panel-bg" style="background-image:url('roteiro-cinque-terre.jpg')"></div>
          <div class="rot-panel-ov"></div>
          <div class="rot-content">
            <span class="rot-panel-day">Dia 3</span>
            <h3 class="rot-panel-name">Cinque Terre</h3>
            <p class="rot-panel-desc">Riviera Ligure — Gênova e os vilarejos coloridos suspensos sobre o Mediterrâneo.</p>
            <div class="rot-panel-exp">
              <span class="rot-panel-tag">Gênova</span>
              <span class="rot-panel-tag rot-panel-tag--hl">Cinque Terre</span>
            </div>
          </div>
        </div>

        <div class="rot-panel">
          <div class="rot-panel-bg" style="background-image:url('roteiro-toscana.jpg')"></div>
          <div class="rot-panel-ov"></div>
          <div class="rot-content">
            <span class="rot-panel-day">Dia 3-6</span>
            <h3 class="rot-panel-name">Toscana</h3>
            <p class="rot-panel-desc">Renascença, vinhedos e a Torre Inclinada — Lucca, Pisa, Florença, San Gimignano e Siena.</p>
            <div class="rot-panel-exp">
              <span class="rot-panel-tag">Florença</span>
              <span class="rot-panel-tag">Pisa</span>
              <span class="rot-panel-tag rot-panel-tag--hl">Siena</span>
            </div>
          </div>
        </div>

        <div class="rot-panel">
          <div class="rot-panel-bg" style="background-image:url('roteiro-roma-vaticano.jpg')"></div>
          <div class="rot-panel-ov"></div>
          <div class="rot-content">
            <span class="rot-panel-day">Dia 6-8</span>
            <h3 class="rot-panel-name">Roma Eterna</h3>
            <p class="rot-panel-desc">Vaticano e Capela Sistina — ingressos inclusos para dois dos maiores tesouros da humanidade.</p>
            <div class="rot-panel-exp">
              <span class="rot-panel-tag rot-panel-tag--hl">Vaticano</span>
              <span class="rot-panel-tag">Capela Sistina</span>
            </div>
          </div>
        </div>

        <div class="rot-panel">
          <div class="rot-panel-bg" style="background-image:url('roteiro-napoles-capri-amalfitana.jpg')"></div>
          <div class="rot-panel-ov"></div>
          <div class="rot-content">
            <span class="rot-panel-day">Dia 9-12</span>
            <h3 class="rot-panel-name">Nápoles &amp; Costa Amalfitana</h3>
            <p class="rot-panel-desc">Nápoles, Capri, Sorrento, a deslumbrante Costa Amalfitana e as ruínas de Pompeia.</p>
            <div class="rot-panel-exp">
              <span class="rot-panel-tag">Capri</span>
              <span class="rot-panel-tag rot-panel-tag--hl">Costa Amalfitana</span>
              <span class="rot-panel-tag">Pompeia</span>
            </div>
          </div>
        </div>

        <div class="rot-panel">
          <div class="rot-panel-bg" style="background-image:url('roteiro-assis.jpg')"></div>
          <div class="rot-panel-ov"></div>
          <div class="rot-content">
            <span class="rot-panel-day">Dia 12-13</span>
            <h3 class="rot-panel-name">Assis</h3>
            <p class="rot-panel-desc">Espiritualidade no coração da Úmbria, na cidade de São Francisco.</p>
            <div class="rot-panel-exp">
              <span class="rot-panel-tag rot-panel-tag--hl">Úmbria</span>
            </div>
          </div>
        </div>

        <div class="rot-panel">
          <div class="rot-panel-bg" style="background-image:url('roteiro-veneza-verona-garda.jpg')"></div>
          <div class="rot-panel-ov"></div>
          <div class="rot-content">
            <span class="rot-panel-day">Dia 13-16</span>
            <h3 class="rot-panel-name">Veneza</h3>
            <p class="rot-panel-desc">O grand finale romântico — Pádua, os canais de Veneza, Verona e o Lago di Garda, antes do retorno ao Brasil.</p>
            <div class="rot-panel-exp">
              <span class="rot-panel-tag rot-panel-tag--hl">Veneza</span>
              <span class="rot-panel-tag">Verona</span>
              <span class="rot-panel-tag">Lago di Garda</span>
            </div>
          </div>
        </div>

      </div>
      <div class="rot-scroll-hint">
        <div class="rot-scroll-line"></div>
        <span>Role para navegar</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Wire `initRoteiro`**

`js/index.js` — add:
```js
export { initRoteiro } from './roteiro.js';
```

`js/main.js` — add `initRoteiro` to imports and call inside `DOMContentLoaded`, **before** `initStrips`/`initCountdown` order doesn't matter but must be after `initHeader`.

- [ ] **Step 7: Test locally**

Refresh, scroll into the Roteiro section on **desktop** — expected: section pins for a long scroll distance (560vh), 7 panels slide horizontally left-to-right as you scroll, counter top-right updates `01/07` → `07/07`, dots on the right edge become visible and highlight the active panel, clicking a dot jumps to that panel. Then resize the browser to ≤768px width and refresh — expected: panels stack vertically at 70vh each, no horizontal pin/scroll-jacking, dots hidden (per the QA checklist item "Roteiro empilhado verticalmente no mobile").

---

## Task 6: Grupo section

**Files:**
- Create: `circuito-italiano/css/grupo.css`
- Modify: `circuito-italiano/index.html` (fill `<section id="s-grupo">`)
- User action required: `fotos-grupo01.jpg` … `fotos-grupo06.jpg` (800×600px each)

**Interfaces:**
- Consumes: `--blue`, `.wrap`, `.overline` from `base.css`
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Write `css/grupo.css`**

```css
/* ══ GRUPO MODULE ═══════════════════════ */
#s-grupo { padding: 96px 0; background: var(--white); }
.gp-head { text-align: center; max-width: 640px; margin: 0 auto 48px; }
.gp-title { font-family: var(--ff-serif); font-size: 38px; color: var(--blue); margin-bottom: 14px; }
.gp-sub { font-size: 15px; color: var(--muted); font-weight: 300; }
.gp-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 220px);
  gap: 8px;
}
.gp-grid img { width: 100%; height: 100%; object-fit: cover; }
```

- [ ] **Step 2: Append mobile override to `css/responsive.css`**

```css
@media (max-width: 768px) {
  .gp-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(3, 160px); }
}
```

- [ ] **Step 3: Fill `<section id="s-grupo">` in `index.html`**

```html
<section id="s-grupo">
  <div class="wrap">
    <div class="gp-head">
      <span class="overline">Grupo Girotrip</span>
      <h2 class="gp-title from-left">Você não viaja sozinho</h2>
      <p class="gp-sub from-right">Grupos de viajantes reais, guia acompanhante do Brasil e suporte completo do início ao fim.</p>
    </div>
    <div class="gp-grid">
      <img src="fotos-grupo01.jpg" alt="Grupo Girotrip em viagem" class="scale-up">
      <img src="fotos-grupo02.jpg" alt="Grupo Girotrip em viagem" class="scale-up">
      <img src="fotos-grupo03.jpg" alt="Grupo Girotrip em viagem" class="scale-up">
      <img src="fotos-grupo04.jpg" alt="Grupo Girotrip em viagem" class="scale-up">
      <img src="fotos-grupo05.jpg" alt="Grupo Girotrip em viagem" class="scale-up">
      <img src="fotos-grupo06.jpg" alt="Grupo Girotrip em viagem" class="scale-up">
    </div>
  </div>
</section>
```

- [ ] **Step 4: Test locally**

Refresh, scroll to Grupo — expected: 3×2 photo grid (or 2×3 on mobile widths), each tile scaling in on scroll entry.

---

## Task 7: Exclusividades section (tickers.js, text/icon cards — no images)

**Files:**
- Create: `circuito-italiano/css/exclusividades.css`
- Copy: `minas-historica/js/tickers.js` → `circuito-italiano/js/tickers.js` (unchanged — generic to any `#ex-track`/`#dep-track` content)
- Modify: `circuito-italiano/js/index.js`, `circuito-italiano/js/main.js` (add `initTickers`)
- Modify: `circuito-italiano/index.html` (fill `<section id="s-excl">` — the `#ex-track` half of the ticker; `#dep-track` gets filled in Task 8)

**Interfaces:**
- Consumes: `--blue`, `.wrap`, `.overline` from `base.css`
- Produces: `#ex-track` element (consumed only by `tickers.js`, already copied)

- [ ] **Step 1: Copy `tickers.js`**

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages"
cp minas-historica/js/tickers.js circuito-italiano/js/tickers.js
```

- [ ] **Step 2: Write `css/exclusividades.css`**

```css
/* ══ EXCLUSIVIDADES MODULE ══════════════
   Ticker de texto/ícone via requestAnimationFrame
   (tickers.js) — sem imagem própria.
═══════════════════════════════════════ */
#s-excl { background: var(--off); padding: 80px 0; overflow: hidden; }
.ex-head { text-align: center; max-width: 640px; margin: 0 auto 40px; }
.ex-title { font-family: var(--ff-serif); font-size: 34px; color: var(--blue); }
.ex-track { display: flex; gap: 16px; width: max-content; }
.ex-card {
  flex-shrink: 0; width: 280px;
  background: var(--white); border: 1px solid var(--border);
  padding: 28px 24px;
}
.ex-card-icon { font-size: 28px; margin-bottom: 14px; }
.ex-card-title { font-family: var(--ff-serif); font-size: 17px; color: var(--blue); margin-bottom: 8px; }
.ex-card-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
```

- [ ] **Step 3: Fill `<section id="s-excl">` in `index.html`**

```html
<section id="s-excl">
  <div class="wrap">
    <div class="ex-head">
      <span class="overline">Exclusividades</span>
      <h2 class="ex-title from-left">Por que o Circuito Italiano é diferente</h2>
    </div>
  </div>
  <div class="ex-track" id="ex-track">
    <div class="ex-card"><div class="ex-card-icon">🇮🇹</div><div class="ex-card-title">Roteiro mais completo</div><div class="ex-card-desc">16 dias, 7 regiões — da Toscana a Veneza, numa única viagem em grupo.</div></div>
    <div class="ex-card"><div class="ex-card-icon">🧑‍✈️</div><div class="ex-card-title">Guia acompanhante do Brasil</div><div class="ex-card-desc">Do embarque ao desembarque, alguém da Girotrip cuida de cada detalhe com você.</div></div>
    <div class="ex-card"><div class="ex-card-icon">⛪</div><div class="ex-card-title">Vaticano e Capela Sistina inclusos</div><div class="ex-card-desc">Ingressos garantidos, sem filas nem organização por conta própria.</div></div>
    <div class="ex-card"><div class="ex-card-icon">🏆</div><div class="ex-card-title">Mais de 10 anos de experiência</div><div class="ex-card-desc">A Girotrip já levou centenas de viajantes brasileiros à Europa em grupo.</div></div>
    <div class="ex-card"><div class="ex-card-icon">🛡️</div><div class="ex-card-title">Seguro viagem incluso</div><div class="ex-card-desc">Cobertura Protec Travel com cancelamento involuntário de até €30.000.</div></div>
  </div>
</section>
```

- [ ] **Step 4: Wire `initTickers`**

`js/index.js` — add:
```js
export { initTickers } from './tickers.js';
```

`js/main.js` — add `initTickers` to imports and call inside `DOMContentLoaded`.

- [ ] **Step 5: Test locally**

Refresh, scroll to Exclusividades — expected: horizontal row of 5 cards scrolling smoothly and continuously leftward on its own (no jank, no flicker), never stopping, seamless loop (cards clone via `cloneTrackChildren`).

---

## Task 8: Para Você + Depoimentos sections (dep-track completes the ticker pair from Task 7)

**Files:**
- Create: `circuito-italiano/css/para-voce.css`
- Create: `circuito-italiano/css/depoimentos.css`
- Copy: `minas-historica/dep-*.jpg` (5 files) → `circuito-italiano/` root
- Copy: `minas-historica/depoimento0*.JPG` (5 files, the small avatar/round photos referenced alongside names — verify actual usage in Minas markup during Step 1 below) → `circuito-italiano/` root
- Modify: `circuito-italiano/index.html` (fill `<section id="s-pv">` and `<section id="s-dep">`)
- User action required: `circuito-italiano-para-voce.jpg` (1600×900px)

**Interfaces:**
- Consumes: `#dep-track` is read by the already-wired `tickers.js` from Task 7 (`runTicker(depTrack, 32000, true)`) — no new JS needed
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Check how Minas references the depoimento images** (avoid guessing markup for a component we haven't read yet)

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages/minas-historica"
grep -n "dep-track\|dep-dalva\|depoimento0" index.html | head -20
```
Read the output and use the exact class names found (expected: a `.dep-card` pattern feeding `#dep-track`, similar structure to `.ex-card`/`#ex-track`). If the structure differs from what Step 4 below assumes, adapt Step 4's HTML to match exactly what Minas actually does — do not invent a new pattern.

- [ ] **Step 2: Copy depoimento images**

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages"
cp minas-historica/dep-dalva.jpg minas-historica/dep-jacqueline.jpg minas-historica/dep-marilia.jpg minas-historica/dep-sandra.jpg minas-historica/dep-sidio.jpg circuito-italiano/
```

- [ ] **Step 3: Write `css/para-voce.css`**

```css
/* ══ PARA VOCÊ MODULE ═══════════════════ */
#s-pv {
  position: relative; padding: 100px 0;
  background-image: url('../circuito-italiano-para-voce.jpg');
  background-size: cover; background-position: center;
}
#s-pv::before {
  content: ''; position: absolute; inset: 0;
  background: rgba(22,58,115,.88);
}
.pv-content { position: relative; z-index: 2; max-width: 680px; margin: 0 auto; text-align: center; }
.pv-title { font-family: var(--ff-serif); font-size: 40px; color: var(--white); margin-bottom: 20px; }
.pv-text { font-size: 16px; color: rgba(255,255,255,.8); font-weight: 300; line-height: 1.8; }
```

Append to `css/responsive.css`:
```css
@media (max-width: 768px) {
  #s-pv { background-attachment: scroll; }
}
```

- [ ] **Step 4: Write `css/depoimentos.css`** (mirrors `exclusividades.css` pattern — reverse-direction ticker, per `tickers.js`'s `runTicker(depTrack, 32000, true)`)

```css
/* ══ DEPOIMENTOS MODULE ═════════════════ */
#s-dep { background: var(--white); padding: 80px 0; overflow: hidden; }
.dep-head { text-align: center; max-width: 640px; margin: 0 auto 40px; }
.dep-title { font-family: var(--ff-serif); font-size: 34px; color: var(--blue); }
.dep-track { display: flex; gap: 16px; width: max-content; }
.dep-card {
  flex-shrink: 0; width: 320px;
  background: var(--cream); border: 1px solid var(--border);
  padding: 28px 24px;
}
.dep-card-stars { color: var(--orange); font-size: 13px; margin-bottom: 12px; }
.dep-card-text { font-size: 14px; color: var(--text); line-height: 1.7; margin-bottom: 16px; font-style: italic; }
.dep-card-author { display: flex; align-items: center; gap: 10px; }
.dep-card-author img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.dep-card-name { font-size: 13px; font-weight: 700; color: var(--blue); }
.dep-card-trip { font-size: 11px; color: var(--muted); }
```

- [ ] **Step 5: Fill `<section id="s-pv">` in `index.html`**

```html
<section id="s-pv">
  <div class="wrap pv-content">
    <h2 class="pv-title word-reveal"><span>Feito para quem já sabe viajar bem</span></h2>
    <p class="pv-text from-left">Se você valoriza conforto, organização e companhia de qualidade, o Circuito Italiano foi desenhado pensando em você: roteiro sem correria, suporte completo e a segurança de viajar com quem entende do assunto há mais de 10 anos.</p>
  </div>
</section>
```

- [ ] **Step 6: Fill `<section id="s-dep">` in `index.html`** (real testimonials, verbatim from `depoimentos textos.txt`)

```html
<section id="s-dep">
  <div class="wrap">
    <div class="dep-head">
      <span class="overline">Depoimentos</span>
      <h2 class="dep-title from-left">Veja os depoimentos de quem escolheu a Girotrip</h2>
    </div>
  </div>
  <div class="dep-track" id="dep-track">
    <div class="dep-card">
      <div class="dep-card-stars">★★★★★</div>
      <p class="dep-card-text">"Tenho 71 anos e adoro viajar. Não tenho medo nenhum de viajar sozinho — pego, bato a minha porta e vou na companhia da Girotrip. Sou apaixonado por música clássica. A Girotrip tem me ajudado muito. Nem eu sabia que era o meu sonho."</p>
      <div class="dep-card-author">
        <img src="dep-sidio.jpg" alt="Sidio Abel Trindade">
        <div><div class="dep-card-name">Sidio Abel Trindade</div><div class="dep-card-trip">35 países visitados · Canal do Panamá</div></div>
      </div>
    </div>
    <div class="dep-card">
      <div class="dep-card-stars">★★★★★</div>
      <p class="dep-card-text">"O grupo foi fantástico — um grupo excelente. Fui bem atendida pela Girotrip em todos os momentos. Não tive problema nenhum."</p>
      <div class="dep-card-author">
        <img src="dep-sandra.jpg" alt="Sandra Regina Ferreira">
        <div><div class="dep-card-name">Sandra Regina Ferreira</div><div class="dep-card-trip">Leste Europeu</div></div>
      </div>
    </div>
    <div class="dep-card">
      <div class="dep-card-stars">★★★★★</div>
      <p class="dep-card-text">"Esta foi a viagem dos meus sonhos. A gente foi muito bem atendido em todos os momentos. Já estou programando a próxima viagem com a Girotrip."</p>
      <div class="dep-card-author">
        <img src="dep-dalva.jpg" alt="Dalva Figueiredo">
        <div><div class="dep-card-name">Dalva Figueiredo</div><div class="dep-card-trip">3ª viagem com a Girotrip · Egito</div></div>
      </div>
    </div>
    <div class="dep-card">
      <div class="dep-card-stars">★★★★★</div>
      <p class="dep-card-text">"Adorei a viagem, os lugares são lindos! Foi tudo muito bem organizado. Com certeza viajarei outras vezes com a Girotrip!"</p>
      <div class="dep-card-author">
        <img src="dep-jacqueline.jpg" alt="Jacqueline Constance">
        <div><div class="dep-card-name">Jacqueline Constance</div><div class="dep-card-trip">Holanda, Flórida, Bélgica e França</div></div>
      </div>
    </div>
    <div class="dep-card">
      <div class="dep-card-stars">★★★★★</div>
      <p class="dep-card-text">"Viagem ótima, guias excelentes, hotéis com ótima localização. A viagem cumpriu com minhas expectativas. Vamos combinar a próxima!"</p>
      <div class="dep-card-author">
        <img src="dep-marilia.jpg" alt="Marilia Cristina Duarde de Mayo">
        <div><div class="dep-card-name">Marilia Cristina Duarde de Mayo</div><div class="dep-card-trip">Leste Europeu</div></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 7: Test locally**

Refresh, scroll to Para Você (dark blue overlay on background photo, centered emotional copy) then Depoimentos (5 cards ticking smoothly **rightward**, opposite direction from Exclusividades above — confirms `tickers.js`'s `reverse=true` branch is running on `#dep-track`, already wired in Task 7's `initTickers()` call, no new JS wiring needed here).

---

## Task 9: Investimento section (value stack → price)

**Files:**
- Create: `circuito-italiano/css/investimento.css`
- Modify: `circuito-italiano/index.html` (fill `<section id="s-inv">`)

**Interfaces:**
- Consumes: `--blue`, `--orange`, `.wrap`, `.overline` from `base.css`
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Write `css/investimento.css`**

```css
/* ══ INVESTIMENTO MODULE ════════════════
   Value stack primeiro, preço depois —
   estratégia definida no PRD §7.2/§2.
═══════════════════════════════════════ */
#s-inv { background: var(--cream); padding: 96px 0; }
.inv-head { text-align: center; max-width: 640px; margin: 0 auto 48px; }
.inv-title { font-family: var(--ff-serif); font-size: 40px; color: var(--blue); margin-bottom: 14px; }
.inv-items {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 32px;
  max-width: 920px; margin: 0 auto 56px;
}
.inv-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 0; }
.inv-item-icon { font-size: 20px; flex-shrink: 0; }
.inv-item-text { font-size: 14px; color: var(--text); line-height: 1.5; }
.inv-price-box {
  max-width: 560px; margin: 0 auto; text-align: center;
  background: var(--white); border: 1px solid var(--border);
  padding: 44px 32px;
}
.inv-price-label { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
.inv-price-main { font-family: var(--ff-serif); font-size: 48px; color: var(--orange); margin-bottom: 6px; }
.inv-price-alt { font-size: 14px; color: var(--muted); margin-bottom: 28px; }
```

- [ ] **Step 2: Append mobile override to `css/responsive.css`**

```css
@media (max-width: 768px) {
  .inv-items { grid-template-columns: 1fr; }
  .inv-price-main { font-size: 36px; }
}
```

- [ ] **Step 3: Fill `<section id="s-inv">` in `index.html`** — 11-item value stack from PRD §5/§7.2, then price

```html
<section id="s-inv">
  <div class="wrap">
    <div class="inv-head">
      <span class="overline">Investimento</span>
      <h2 class="inv-title from-left">O que está incluso</h2>
    </div>
    <div class="inv-items">
      <div class="inv-item scale-up"><span class="inv-item-icon">✈️</span><span class="inv-item-text">Passagem aérea ida e volta</span></div>
      <div class="inv-item scale-up"><span class="inv-item-icon">🏨</span><span class="inv-item-text">Hospedagem em hotéis turísticos durante os 16 dias de viagem</span></div>
      <div class="inv-item scale-up"><span class="inv-item-icon">🥐</span><span class="inv-item-text">Café da manhã</span></div>
      <div class="inv-item scale-up"><span class="inv-item-icon">🚐</span><span class="inv-item-text">Transferes e traslados</span></div>
      <div class="inv-item scale-up"><span class="inv-item-icon">🧑‍✈️</span><span class="inv-item-text">Guia local durante toda a viagem</span></div>
      <div class="inv-item scale-up"><span class="inv-item-icon">🎟️</span><span class="inv-item-text">Ingressos: Pompeia, Vaticano e Capela Sistina</span></div>
      <div class="inv-item scale-up"><span class="inv-item-icon">⛴️</span><span class="inv-item-text">Passeios de barco: Veneza, Capri e Lago di Garda</span></div>
      <div class="inv-item scale-up"><span class="inv-item-icon">🧳</span><span class="inv-item-text">Bagagem 23kg + mala de mão 10kg</span></div>
      <div class="inv-item scale-up"><span class="inv-item-icon">🛡️</span><span class="inv-item-text">Seguro Protec Travel (cancelamento involuntário até €30.000)</span></div>
      <div class="inv-item scale-up"><span class="inv-item-icon">🇧🇷</span><span class="inv-item-text">Guia acompanhante do Brasil</span></div>
      <div class="inv-item scale-up"><span class="inv-item-icon">🎁</span><span class="inv-item-text">Kit viagem (bolsa, porta-dinheiro, etiqueta)</span></div>
    </div>
    <div class="inv-price-box scale-up">
      <div class="inv-price-label">Viagem completa a partir de</div>
      <div class="inv-price-main">10x R$ 3.424</div>
      <div class="inv-price-alt">ou R$ 33.213 à vista (3% de desconto)</div>
      <button class="btn btn-orange btn-full" data-action="scroll-to" data-target="#s-form">Quero Garantir Minha Vaga</button>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Test locally**

Refresh, scroll to Investimento — expected: 11-item icon+text grid appears before any price is shown, then the price box with "10x R$ 3.424" in large orange serif type and the CTA button beneath it.

---

## Task 10: FAQ section (faq.js)

**Files:**
- Create: `circuito-italiano/css/faq.css`
- Copy: `minas-historica/js/faq.js` → `circuito-italiano/js/faq.js` (unchanged)
- Modify: `circuito-italiano/js/index.js`, `circuito-italiano/js/main.js` (add `initFAQ`)
- Modify: `circuito-italiano/index.html` (fill `<section id="s-faq">`)
- User action required: `circuito-italiano-faq.jpg` (1920×1200px, used as a subtle section background per PRD manifest — optional low-opacity treatment, page must still work if this image is missing)

**Interfaces:**
- Consumes: `.faq-q` click targets, toggles `.faq-item.open` (read by `faq.js`)
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Copy `faq.js`**

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages"
cp minas-historica/js/faq.js circuito-italiano/js/faq.js
```

- [ ] **Step 2: Write `css/faq.css`**

```css
/* ══ FAQ MODULE ═════════════════════════ */
#s-faq { background: var(--white); padding: 96px 0; }
.faq-head { text-align: center; max-width: 640px; margin: 0 auto 48px; }
.faq-title { font-family: var(--ff-serif); font-size: 38px; color: var(--blue); }
.faq-list { max-width: 760px; margin: 0 auto; }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-q {
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  padding: 22px 0; background: none; border: none; text-align: left;
  font-family: var(--ff-sans); font-size: 16px; font-weight: 600; color: var(--text);
}
.faq-q-icon { font-size: 20px; color: var(--orange); transition: transform 0.3s ease; }
.faq-item.open .faq-q-icon { transform: rotate(45deg); }
.faq-a {
  max-height: 0; overflow: hidden;
  transition: max-height 0.35s var(--ease-out);
  font-size: 14px; color: var(--muted); line-height: 1.7;
}
.faq-item.open .faq-a { max-height: 240px; padding-bottom: 22px; }
```

- [ ] **Step 3: Fill `<section id="s-faq">` in `index.html`**

```html
<section id="s-faq">
  <div class="wrap">
    <div class="faq-head">
      <span class="overline">Dúvidas Frequentes</span>
      <h2 class="faq-title from-left">Perguntas sobre o Circuito Italiano</h2>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q"><span>Preciso de visto para a Itália?</span><span class="faq-q-icon">+</span></button>
        <div class="faq-a">Não. Brasileiros com passaporte válido não precisam de visto para turismo na Itália/Europa (Espaço Schengen) por até 90 dias.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q"><span>O que está incluso no valor anunciado?</span><span class="faq-q-icon">+</span></button>
        <div class="faq-a">Passagem aérea, hospedagem, café da manhã, transferes, guia local durante toda a viagem, ingressos de Pompeia/Vaticano/Capela Sistina, passeios de barco, bagagem, seguro viagem e guia acompanhante do Brasil. Veja a lista completa na seção Investimento.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q"><span>Como funciona o pagamento?</span><span class="faq-q-icon">+</span></button>
        <div class="faq-a">10x sem juros de R$ 3.424, ou R$ 33.213 à vista com 3% de desconto. Fale com a gente pelo formulário para conhecer as formas de pagamento disponíveis.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q"><span>Viajo sozinho(a) — tem problema?</span><span class="faq-q-icon">+</span></button>
        <div class="faq-a">Nenhum. A maioria dos nossos viajantes parte sozinha e volta com novas amizades — o grupo e o guia acompanhante do Brasil garantem companhia e segurança do início ao fim.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q"><span>Quantas pessoas vão no grupo?</span><span class="faq-q-icon">+</span></button>
        <div class="faq-a">O Circuito Italiano tem grupo mínimo de 25 adultos, com guia acompanhante do Brasil durante toda a viagem.</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Wire `initFAQ`**

`js/index.js` — add:
```js
export { initFAQ } from './faq.js';
```

`js/main.js` — add `initFAQ` to imports and call inside `DOMContentLoaded`.

- [ ] **Step 5: Test locally**

Refresh, scroll to FAQ, click each question — expected: only one answer open at a time (opening a second closes the first), `+` icon rotates 45° into an `×` shape when open, smooth height transition.

---

## Task 11: Formulário section (form.js — adapted webhook, form id, saída field)

**Files:**
- Create: `circuito-italiano/css/form.css`
- Create: `circuito-italiano/js/form.js` (adapted from Minas — new `WEBHOOK`, new form `id`, new "saída preferida" field, new payload identifiers)
- Modify: `circuito-italiano/js/index.js`, `circuito-italiano/js/main.js` (add `initFormActions`)
- Modify: `circuito-italiano/index.html` (fill `<section id="s-form">`)

**Interfaces:**
- Consumes: values from inputs `#nome`, `#email`, `#wpp`, `#pss`, `#saida`, `#ori`
- Produces: nothing consumed by later tasks — this is the funnel's terminal step

- [ ] **Step 1: Write `js/form.js`**

```js
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
```

- [ ] **Step 2: Write `css/form.css`**

```css
/* ══ FORM MODULE ════════════════════════ */
#s-form { background: var(--blue-d); padding: 96px 0; color: var(--white); }
.f-head { text-align: center; max-width: 560px; margin: 0 auto 40px; }
.f-title { font-family: var(--ff-serif); font-size: 34px; color: var(--white); margin-bottom: 12px; }
.f-sub { font-size: 14px; color: rgba(255,255,255,.7); }

.f-progress { display: flex; justify-content: center; gap: 12px; margin-bottom: 32px; }
.f-pd {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  background: rgba(255,255,255,.15); color: rgba(255,255,255,.5);
}
.f-pd.act { background: var(--orange); color: var(--white); }
.f-pd.dn { background: var(--orange); color: var(--white); }

.f-box { max-width: 440px; margin: 0 auto; background: var(--white); padding: 36px 32px; color: var(--text); }
.f-step { display: none; flex-direction: column; gap: 16px; }
.f-step.act { display: flex; }
.f-field { display: flex; flex-direction: column; gap: 6px; }
.f-field label { font-size: 12px; font-weight: 600; color: var(--muted); }
.f-field input, .f-field select {
  padding: 12px 14px; border: 1px solid var(--border); font-family: var(--ff-sans); font-size: 14px;
}
.f-tel-wrap { display: flex; align-items: center; border: 1px solid var(--border); }
.f-tel-prefix { padding: 12px 10px; color: var(--muted); font-size: 14px; border-right: 1px solid var(--border); }
.f-tel-wrap input { border: none; flex: 1; }
.f-back { background: none; border: none; color: var(--muted); font-size: 13px; text-align: center; margin-top: 4px; }
```

Append to `css/responsive.css`:
```css
@media (max-width: 768px) {
  .f-box { padding: 28px 20px; margin: 0 var(--pad); }
}
```

- [ ] **Step 3: Fill `<section id="s-form">` in `index.html`** — same 2-step pattern as Minas, `id`/`action` per PRD §7.3, plus the new "saída preferida" `<select>` in step 2

```html
<section id="s-form">
  <div class="wrap">
    <div class="f-head">
      <h2 class="f-title from-left">Complete o formulário</h2>
      <p class="f-sub from-right">Vamos dar início à nossa conversa via WhatsApp. Estamos animados para atendê-lo!</p>
    </div>
    <div class="f-progress">
      <div class="f-pd act" id="pd1">1</div>
      <div class="f-pd" id="pd2">2</div>
    </div>
    <form id="form-lead-circuito-italiano" method="get" action="https://girotripturismo.com.br/lps/circuito-italiano-obrigado/">
      <input type="hidden" id="h-utm_source" name="utm_source">
      <input type="hidden" id="h-utm_medium" name="utm_medium">
      <input type="hidden" id="h-utm_campaign" name="utm_campaign">
      <input type="hidden" id="h-utm_content" name="utm_content">
      <input type="hidden" id="h-utm_term" name="utm_term">
      <input type="hidden" id="h-gclid" name="gclid">
      <input type="hidden" id="h-fbclid" name="fbclid">
      <input type="hidden" id="h-campaign_id" name="campaign_id">
      <input type="hidden" id="h-adgroup_id" name="adgroup_id">
      <input type="hidden" id="h-creative_id" name="creative_id">
      <input type="hidden" id="h-keyword" name="keyword">
      <input type="hidden" id="h-device" name="device">
      <input type="hidden" id="h-page_url" name="page_url">
      <input type="hidden" id="h-referrer" name="referrer">

      <div class="f-box">
        <div class="f-step act" id="fs1">
          <div class="f-field"><label for="nome">Nome</label><input type="text" id="nome" name="nome" required></div>
          <div class="f-field"><label for="email">E-mail</label><input type="email" id="email" name="email" required></div>
          <div class="f-field">
            <label for="wpp">WhatsApp</label>
            <div class="f-tel-wrap"><span class="f-tel-prefix">+55</span><input type="tel" id="wpp" name="wpp" placeholder="(11) 91234-5678" required></div>
          </div>
          <button class="btn btn-orange btn-full" type="button" data-action="next-step">Quero receber as informações</button>
        </div>

        <div class="f-step" id="fs2">
          <div class="f-field">
            <label for="pss">Quantas pessoas vão viajar?</label>
            <select id="pss" name="quantas_pessoas" required>
              <option value="">Selecione</option>
              <option value="1">1 pessoa</option>
              <option value="2">2 pessoas</option>
              <option value="3+">3 ou mais</option>
            </select>
          </div>
          <div class="f-field">
            <label for="saida">Qual saída prefere?</label>
            <select id="saida" name="saida_preferida" required>
              <option value="">Selecione</option>
              <option value="maio-2027">Maio 2027 (05 a 20/05)</option>
              <option value="junho-2027">Junho 2027 (09 a 24/06)</option>
              <option value="setembro-2027">Setembro 2027 (01 a 16/09)</option>
              <option value="ainda-nao-sei">Ainda não sei</option>
            </select>
          </div>
          <div class="f-field">
            <label for="ori">Como ficou sabendo da Girotrip?</label>
            <select id="ori" name="como_ficou_sabendo" required>
              <option value="">Selecione</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="google">Google</option>
              <option value="indicacao">Indicação de amigo/familiar</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <button class="btn btn-orange btn-full" type="submit" data-action="send-form">Quero receber valores e detalhes</button>
          <button class="f-back" type="button" data-action="prev-step">← Voltar</button>
        </div>
      </div>
    </form>
  </div>
</section>
```

- [ ] **Step 4: Wire `initFormActions`**

`js/index.js` — add:
```js
export { initFormActions, nextStep, prevStep, send } from './form.js';
```

`js/main.js` — final full contents (all modules from every task, in the same call order as Minas's `main.js`, minus `initMesasReservadas` which is Minas-specific and not part of this LP):

```js
import {
  initHeader,
  initReveal,
  initStrips,
  initRoteiro,
  initCountdown,
  initFAQ,
  initSmoothScroll,
  initFormActions,
  initTickers
} from './index.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initReveal();
  initStrips();
  initRoteiro();
  initCountdown();
  initFAQ();
  initSmoothScroll();
  initFormActions();
  initTickers();
});
```

- [ ] **Step 5: Test locally — full form flow**

Refresh, scroll to Formulário, fill step 1 (nome/email/whatsapp) and click "Quero receber as informações" — expected: advances to step 2, progress dot 1 turns into a green/orange checkmark, `InitiateCheckout` fires (check via Meta Pixel Helper browser extension or `window.fbq` calls in the console). Fill step 2 including the new "Qual saída prefere?" field, click submit — expected: button shows "Enviando...", browser navigates to `circuito-italiano-obrigado/` (404 is fine locally, that page doesn't exist yet — the point is the navigation is attempted, proving native submit fired), `Lead` event fires before navigation. Click "← Voltar" from step 2 — expected: returns to step 1 with data preserved.

---

## Task 12: Full-page QA pass against DIRETRIZES checklist

**Files:** none created — verification only, fixes applied inline to whichever file has the defect

- [ ] **Step 1: Run the local server fresh**

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages/circuito-italiano"
npx http-server . -p 5500
```

- [ ] **Step 2: Walk the DIRETRIZES.md §8 checklist end to end** in a real browser at `http://127.0.0.1:5500/`, checking each item:

**Visual:**
- [ ] Hero carrega com imagem de fundo (não só degradê) — se `circuito-italiano-hero.jpg` ainda não foi fornecida, anotar como pendência, não como falha de código
- [ ] Logo aparece no header (branca e colorida) — trocando de `#logo-w` para `#logo-c` ao rolar
- [ ] Todas as 11 seções visíveis na ordem correta
- [ ] Ticker de Exclusividades e Depoimentos em movimento contínuo, sem travar
- [ ] Carrossel do Roteiro navegável pelos 7 pontos
- [ ] Depoimentos com fotos carregadas (dep-*.jpg copiados no Task 8)

**Comportamento:**
- [ ] CTA "Receber detalhes" no header rola até o formulário
- [ ] Formulário avança da etapa 1 para etapa 2
- [ ] Botão "Voltar" retorna à etapa 1 com dados preservados
- [ ] FAQ abre e fecha sem erro, um item por vez
- [ ] Scroll suave entre seções (links `href="#s-*"`)

**Mobile** (resize DevTools para 390×844, iPhone real se disponível):
- [ ] Hero com imagem visível
- [ ] Roteiro empilhado verticalmente (não pin-scroll horizontal)
- [ ] Texto não cortado na borda direita em nenhuma seção
- [ ] Formulário usável no teclado mobile (campos não cobertos pelo teclado virtual)

**Tracking:**
- [ ] Meta Pixel Helper (extensão Chrome) detecta `PageView` no load
- [ ] `InitiateCheckout` dispara ao avançar etapa 1→2
- [ ] `Lead` dispara ao enviar o formulário
- [ ] GTM container `GTM-57G5D65H` detectado (Tag Assistant)

**Console:**
- [ ] Zero erros 404 (todas as imagens do manifesto que já foram fornecidas devem carregar; imagens ainda pendentes são esperadas como 404 até o usuário fornecer os arquivos — não é bug de código)
- [ ] Zero erros JS no console

- [ ] **Step 3: Fix any failing item inline**, re-test only the fixed section, then move to Step 4.

- [ ] **Step 4: List remaining pending images** by cross-referencing the manifest in `docs/PRD-circuito-italiano.md` §8 against what actually exists in the folder:

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages/circuito-italiano"
ls *.jpg *.png 2>/dev/null
```

Report to the user exactly which filenames from the manifest are still missing before deploying — the page will work without them (broken `background-image`/`<img>` just shows blank/fallback, no crash) but must not go live incomplete.

---

## Task 13: Git init, GitHub repo, Vercel deploy (isolated — does not touch existing repos)

**Files:** none — infrastructure only

- [ ] **Step 1: Confirm we're not inside another repo's working tree**

```bash
cd "/c/Users/mkt02/Desktop/Claude-Work/Landing Pages/circuito-italiano"
git rev-parse --show-toplevel 2>&1
```
Expected: either an error ("not a git repository") or a path that is NOT `Landing Pages` and NOT `Landing Pages/mexico-cultural-colonial`. If it prints one of those two paths, **stop** — it means `circuito-italiano/` is being tracked by an existing repo, which contradicts the isolated-deploy decision. Report to the user before proceeding.

- [ ] **Step 2: Init the new repo and set the required git email**

```bash
git init
git config user.email "girotripturismo@gmail.com"
git config user.name "Girotrip Turismo"
```

- [ ] **Step 3: Create `.gitignore`**

```bash
cat > .gitignore << 'EOF'
.vercel
node_modules/
EOF
```

- [ ] **Step 4: First commit**

```bash
git add .
git commit -m "feat: primeira versão da LP Circuito Italiano"
```

- [ ] **Step 5: Create the GitHub repo** (ask the user to confirm the exact org/repo name before running — this creates a real, visible remote resource)

```bash
gh repo create girotripturismo-collab/circuito-italiano --private --source=. --remote=origin
git push -u origin main
```

If `gh` isn't authenticated for the `girotripturismo-collab` org, stop and ask the user to run `gh auth login` or create the repo manually on github.com and provide the remote URL to add with `git remote add origin <url>`.

- [ ] **Step 6: Report Vercel setup as a manual step for the user**

This plan does not run `vercel` CLI commands automatically (creating a new Vercel project links a real account/billing entity, which needs explicit user action per the project's own risk profile — same caution applied when a new GitHub repo was created above). Tell the user:

> Repositório `girotripturismo-collab/circuito-italiano` criado e com o primeiro push feito. Para o deploy: acesse vercel.com → New Project → importe esse repo → Root Directory deixe **vazio** (não aponte para subpasta) → nenhuma build command → Deploy. Depois de confirmar que está no ar, valide a página real (não só localhost) contra o checklist do Task 12 mais uma vez antes de apontar tráfego de anúncio.

---

## Self-Review Notes (completed during plan writing, not a separate pass)

- **Spec coverage:** all 11 sections from PRD §7 have a task (Hero=T2, La Dolce Vita=T3, Data=T4, Roteiro=T5, Grupo=T6, Exclusividades=T7, Para Você+Depoimentos=T8, Investimento=T9, FAQ=T10, Formulário=T11); all PRD §9 reuse/adapt items are accounted for (`header.js`/`reveal.js`/`smooth-scroll.js` reused untouched in T1, `strips.js`/`tickers.js`/`faq.js`/`roteiro.js` reused untouched in their section tasks, `countdown.js`/`form.js`/`roteiro.css` explicitly adapted); integrations from PRD §10 (Meta Pixel, GTM, webhook, RD Station form name) are wired in T1 (head tags) and T11 (form logic); deploy plan from PRD §11 is T13.
- **Placeholder scan:** no TBD/TODO — every task has complete, real code. The one open PRD pendency (hospedagem nights count) was already resolved by the user before this plan was written (PRD §5, "16 dias" confirmed as definitive).
- **Type/naming consistency:** `form-lead-circuito-italiano` id used identically in T11's HTML and JS; `#countdown-timer`/`[data-value=...]` identical between T4's HTML and JS; `.rot-*` class names identical between T5's CSS, JS (unchanged from Minas), and HTML; webhook URL identical in T11 code block and the Global Constraints header.
- **Scope check:** single subsystem (one landing page), not decomposed further — matches the PRD's own scope.
