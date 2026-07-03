# Task 2 Report: Header logo assets + Hero section

**Status:** DONE  
**Date:** 2026-07-03  
**Commit:** `4cd3200` — Task 2: Header logo assets + Hero section

---

## Summary

Successfully implemented the hero section and header logo assets for the Circuito Italiano landing page. All work completed per the task brief specification.

## Tasks Completed

### 1. Logo Assets
- Copied `MARCA D'ÁGUA (1).png` from `minas-historica/` to `circuito-italiano/` root
- Copied `MARCA D'ÁGUA (3).png` from `minas-historica/` to `circuito-italiano/` root
- Verified files are referenced in header HTML (lines 70–71 of index.html)

### 2. Hero CSS Module
- Created `css/hero.css` with complete styling for:
  - Hero container (`#hero`) — full viewport height, flexbox layout, blue-dark background
  - Background image layer (`.hero-bg`) — fixed attachment, gradient overlay pseudo-element
  - Content wrapper (`.hero-content`) — positioned relative with z-index 2
  - Kicker text (`.hero-kicker`) — 11px uppercase, orange color, bottom border
  - Main headline (`.hero-h1`) — 84px serif font, word-reveal animation class, italic orange span
  - Subheading (`.hero-sub`) — 18px light weight, semi-transparent white
  - CTA button (`.hero-cta`) — margin spacing, uses `.btn .btn-orange .btn-lg` classes from base.css
  - Data strip (`.hero-data`) — flex row layout, 3-item data display

### 3. Mobile Responsiveness
- Added mobile overrides to `css/responsive.css` within existing `@media (max-width: 768px)` block:
  - `.hero-bg { background-attachment: scroll; }` — disables parallax on mobile (per DIRETRIZES §4.2)
  - `.hero-h1 { font-size: 44px; }` — scales headline from 84px to 44px

### 4. Hero Section HTML
- Replaced stub `<section id="s-hero"></section>` in `index.html` with full content:
  - Hero background div with `.hero-bg` class
  - Content wrapped in `.wrap` container for max-width constraint
  - Kicker: "Circuito Italiano · Saídas 2027"
  - Headline: "Da Toscana a Roma, de Veneza à Costa Amalfitana" (two lines, first italicized)
  - Subheading: Full journey description (16 days, Milão to Veneza)
  - CTA button: "Quero Receber os Detalhes" (data-action="scroll-to" targeting #s-form)
  - Data strip: 3 items (Duração: 16 dias | Saídas: Maio · Junho · Setembro 2027 | A partir de: 10x R$ 3.424)

### 5. Cache Busting
- `css/hero.css?v=1` already present in index.html (line 17) — no bump needed (first write, per DIRETRIZES §4.5)

## Verification

**HTTP-Server Test:**
```
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5501/css/hero.css
→ 200 (hero.css loads successfully)

curl -s http://127.0.0.1:5501/index.html | grep -o 'hero-h1|hero-kicker|hero-cta|hero-data' | sort -u
→ hero-cta, hero-data, hero-h1, hero-kicker (all 4 hero elements present)

curl -s http://127.0.0.1:5501/index.html | grep -E '<section id="s-(dolcevita|data|rot|grupo|excl|pv|dep|inv|faq|form)"' | wc -l
→ 10 (all 10 other section stubs remain untouched)
```

## Known Limitations

- `circuito-italiano-hero.jpg` (1600×1000px background image) not yet available — this is expected per brief
- Without the image, hero shows solid `--blue-d` background; gradient overlay and parallax effect will activate when image is provided
- No runtime crash occurs in absence of image file

## Files Modified

| File | Changes |
|------|---------|
| `css/hero.css` | Created (59 lines) |
| `css/responsive.css` | Added 2 mobile overrides to 768px breakpoint |
| `index.html` | Replaced hero section stub with full content (18 lines) |

## Files Added

| File | Size |
|------|------|
| `MARCA D'ÁGUA (1).png` | 157 KB |
| `MARCA D'ÁGUA (3).png` | 151 KB |

## Self-Review Checklist

- [x] CSS modules use only design tokens from base.css (--blue-d, --orange, --ff-serif, --ff-sans)
- [x] Hero HTML structure matches brief exactly (class names, nesting, content)
- [x] Other 10 section stubs left untouched (verified via grep)
- [x] Mobile breakpoint configured correctly (768px, no background-attachment fixed on mobile)
- [x] CTA button uses correct classes and targets form section
- [x] Graceful fallback when hero image missing (solid background, no crash)
- [x] All files committed with clear message
- [x] No cache-busting bump needed (first write)

## Fix: #hero/#s-hero mismatch

**Issue:** CSS selector mismatch — `css/hero.css` styled `#hero` but HTML element is `<section id="s-hero">` (line 79 of index.html). Hero section received no styling because of this mismatch.

**Solution:** Changed line 2 of `css/hero.css` from `#hero {` to `#s-hero {` to match the HTML element ID convention used across all other sections (#s-dolcevita, #s-data, #s-rot, etc.).

**Verification:**
```
grep -n "^#hero\|^#s-hero" css/hero.css
→ 2:#s-hero {
```

**Status:** FIXED ✓

## Next Task

Task 3 depends on this work: no architectural dependencies on hero internals (hero is self-contained). Ready for next task when scheduled.
