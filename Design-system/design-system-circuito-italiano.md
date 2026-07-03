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
