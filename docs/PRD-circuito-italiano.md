# PRD - Landing Page Circuito Italiano

## 1. Visão geral
Nova landing page da Girotrip Turismo para o roteiro "Circuito Italiano" (saídas 2027), substituindo a LP atual (`girotripturismo.com.br/lps/circuito-italiano-grupo-2025/`, feita em WordPress/Elementor) por uma versão estática (vanilla HTML/CSS/JS), seguindo o padrão arquitetural documentado em `DIRETRIZES.md`. Vai rodar em teste A/B contra a página atual, com o tráfego dividido manualmente via campanhas de anúncio (cada versão com sua própria URL).

## 2. Objetivo do produto
- **Objetivo principal: leads mais qualificados**, não volume. O problema identificado na página atual é lead "fora de orçamento" — gente que preenche o formulário e desiste no WhatsApp ao saber o preço.
- Estratégia escolhida para resolver isso: **não** esconder nem perguntar orçamento no formulário. Em vez disso, construir percepção de valor (value stack) antes de mostrar o preço, para que o valor pedido pareça justificado a quem chega até a seção de Investimento.
- Validar a Girotrip como especialista em viagens culturais de alto valor.
- Página como padrão de excelência: aplicar o que há de mais atual em UX/design de páginas de vendas (ver seção 6), dentro dos limites técnicos do projeto (vanilla, sem build step).

## 3. Público-alvo
- Viajantes 50+, poder aquisitivo médio-alto — mesmo perfil já validado nas LPs Minas Histórica e México Cultural e Colonial.
- Buscam cultura, história e experiências guiadas, com conforto e segurança.

## 4. Proposta de valor / diferencial
- Único roteiro em grupo com guia desde o Brasil que percorre a Itália de ponta a ponta em 16 dias: Milão, Cinque Terre, Toscana, Roma e Vaticano, Nápoles/Capri/Costa Amalfitana, Assis e Veneza/Verona/Lago di Garda numa única viagem — atualizado nesta revisão para refletir o roteiro completo real (seção 5/7.1), não só o resumo "Toscana + Costa Amalfitana" de uma versão anterior deste PRD.
- Mais de 10 anos de experiência da Girotrip em viagens em grupo.
- **Não citar "grupo pequeno"** — os grupos da Girotrip são médios/grandes; esse não é um diferencial real e não deve ser usado na copy.

## 5. Dados do roteiro (confirmados pelo cliente — preço da página antiga, roteiro/inclusos do site oficial)
- **Saídas de São Paulo — Lançamento 2027:**
  - Maio: 05 a 20/05/27
  - Junho: 09 a 24/06/27
  - Setembro: 01 a 16/09/27
- **Valor:** 10x sem juros de R$ 3.424 (total parcelado R$ 34.240) *ou* **R$ 33.213 à vista (3% de desconto real sobre o parcelado)**. Tudo incluso, sem taxa separada (confirmado com o cliente — fonte: página antiga, não o site institucional, que tem uma oferta com números diferentes e taxa à parte; usamos a página antiga como definitiva por decisão do cliente). Cotação de referência: EUR R$ 6,09.
- **Itens inclusos (fonte: site oficial `girotrip.com.br/pacote/italia/circuito-italiano`, lista real e completa):** passagem aérea ida/volta, hospedagem em hotéis turísticos durante os 16 dias de viagem (número de dias confirmado pelo cliente como definitivo — o site oficial também citava "17 noites"/"14 diárias", números inconsistentes entre si, então a copy final usa "16 dias" e evita cravar uma contagem de noites), café da manhã, transferes e traslados, visitas guiadas com guia local durante toda a viagem, ingressos (Pompeia, Vaticano, Capela Sistina), passeios de barco (Veneza, Capri, Lago di Garda), bagagem (23kg + mala de mão 10kg), seguro Protec Travel (cancelamento involuntário €30.000), guia acompanhante do Brasil (grupo mínimo 25 adultos), kit viagem (bolsa, porta-dinheiro, etiqueta).
- **Roteiro completo (fonte: site oficial, 16 dias):** Brasil → Milão (d.1-2) → Gênova (d.3) → Cinque Terre (d.3) → Lucca (d.3-4) → Pisa (d.4) → Florença (d.4-5) → San Gimignano (d.6) → Siena (d.6) → Roma + Vaticano + Capela Sistina (d.6-8) → Nápoles (d.9-12) → Capri (d.10) → Sorrento (d.11) → Costa Amalfitana (d.11) → Pompeia (d.12) → Assis (d.12-13) → Pádua (d.13) → Veneza/Mestre (d.13-14) → Verona (d.15) → Lago di Garda (d.15) → Milão → Brasil (d.16).

## 6. Direção visual e de experiência
Baseado em pesquisa de tendências de landing pages de alta conversão para 2026 (ver referências ao fim deste documento), adaptado aos limites do projeto (vanilla JS, sem build step, mobile-first obrigatório):

- Hero estático (não carrossel) com tipografia grande/ousada e uma única foto cinematográfica de fundo — carrossel no hero reduz CTR comparado a hero estático com CTA único.
- Scroll-based storytelling: seções revelam suavemente no scroll (evolução do `reveal.js` já existente no padrão Girotrip).
- CTA contextual e sticky no mobile: barra fina fixa no rodapé após o Hero.
- Microinterações discretas (hover states, transições 200-300ms).
- Hierarquia limpa: uma ação primária por seção, espaço em branco generoso.
- Performance em primeiro lugar: `loading="lazy"` fora do hero, sem libs externas além do já padronizado.
- **Fora do escopo desta versão:** vídeo de fundo no hero (exige asset e otimização fora do padrão "zero dependências"; possível V2) e personalização via IA em tempo real (exige backend, incompatível com deploy estático).

### Seção temática ("La Dolce Vita")
Equivalente ao "Vesperata" (Minas) / "Civilizações" (México) — seção emocional/cinematográfica sobre viver a Itália, não só visitá-la. Cor de fundo própria: tom terracota-pôr-do-sol (`#3D2817` aprox.), evocando a Costa Amalfitana ao entardecer. Reaproveita os tokens de marca (`--blue #1f4c94`, `--orange #ff7f00`, tipografia Libre Baskerville + Montserrat) do `base.css` do `minas-historica/`.

## 7. Estrutura da landing page
Blocos modulares e independentes, na ordem:
1. Hero
2. La Dolce Vita (temática)
3. Data
4. Roteiro (carrossel em 7 capítulos narrativos, ver 7.1)
5. Grupo
6. Exclusividades (ticker)
7. Para Você
8. Depoimentos
9. Investimento (value stack → preço)
10. FAQ
11. Formulário

### 7.1 Seção Roteiro — 7 capítulos narrativos
O roteiro real tem 16 dias e ~19 paradas (ver seção 5) — grande demais para um carrossel de um ponto por parada (ruim pra mobile, sobrecarga cognitiva). Curadoria em 7 capítulos, agrupando paradas geograficamente próximas sob um nome mais emocional, sem inventar nenhuma parada nova — só reorganizando para storytelling:

1. **Milão — Chegada e a Elegância da Capital da Moda** (dia 1-2): Brasil → Milão
2. **Riviera Ligure & Cinque Terre — Vilarejos Coloridos à Beira-Mar** (dia 3): Gênova, Cinque Terre
3. **Toscana — Renascença, Vinhedos e a Torre Inclinada** (dia 3-6): Lucca, Pisa, Florença, San Gimignano, Siena
4. **Roma Eterna — Vaticano e Capela Sistina** (dia 6-8): Roma, Vaticano, Capela Sistina
5. **Nápoles, Capri e a Deslumbrante Costa Amalfitana** (dia 9-12): Nápoles, Capri, Sorrento, Costa Amalfitana, Pompeia
6. **Assis — Espiritualidade no Coração da Úmbria** (dia 12-13): Assis
7. **Pádua, Veneza, Verona e o Lago di Garda — o Grand Finale Romântico** (dia 13-16): Pádua, Veneza/Mestre, Verona, Lago di Garda, retorno Milão → Brasil

Correção nesta revisão: Pádua estava agrupada com Assis (capítulo 6) só por proximidade no calendário do dia 13, mas geograficamente Pádua fica a ~40km de Veneza, na região do Vêneto — nada a ver com a Úmbria (Assis). Movida para o capítulo 7, onde faz sentido geográfico.

**Arquitetura técnica do carrossel — decisão explícita (resolve ambiguidade encontrada na revisão):** Minas e México usam implementações diferentes e incompatíveis de `roteiro.js`/`roteiro.css`: Minas usa pin-scroll com navegação por pontos (`.rot-track`/`.rot-panel`, dots clicáveis); México usa um accordion vertical sem pontos. O checklist de QA do `DIRETRIZES.md` (seção 8) exige "Carrossel do Roteiro navegável pelos pontos" — **portanto esta LP usa a arquitetura de Minas (pin-scroll com dots), não a do México.** `roteiro.css` de Minas tem `.rot-track { width: 500vw; /* 5 cities */ }` e `.rot-pin-outer { height: 400vh; /* 80vh per panel */ }`, hardcoded para 5 painéis — para os 7 capítulos daqui, esses valores precisam ser recalculados para `700vw` e `560vh` (mantendo 80vh por painel). As imagens de painel em Minas são fundo full-bleed (`background-size: cover`) em arquivos ~1200×700px (`ves-strip-*.jpg`), não thumbnails pequenos — ver dimensão corrigida no manifesto de imagens (seção 8).

### 7.2 Seção Investimento — ordem de apresentação
1. "O que está incluso" primeiro, item por item com ícone — usar a lista completa e real da seção 5 (passagem aérea, hospedagem 17 noites, café da manhã, transferes, guia local, ingressos Vaticano/Capela Sistina/Pompeia, passeios de barco, bagagem, seguro Protec Travel €30.000, guia acompanhante do Brasil, kit viagem). Essa lista rica é o que sustenta a estratégia de value stack — 11 itens concretos, não um resumo genérico.
2. Só depois disso, o valor: "Viagem completa a partir de 10x sem juros de R$ 3.424 (ou R$ 33.213 à vista, 3% de desconto)".
3. Datas de saída ao lado, reforçando urgência sem agressividade.

### 7.3 Formulário
Mesmo formato já usado nas outras LPs (sem pergunta de qualificação por orçamento):
- Etapa 1: nome, e-mail, telefone/WhatsApp
- Etapa 2: quantas pessoas, **qual saída prefere (Maio/Junho/Setembro 2027)**, como ficou sabendo da Girotrip
- `<form id="form-lead-circuito-italiano" method="get" action="https://girotripturismo.com.br/lps/circuito-italiano-obrigado/">` — **id único obrigatório com slug da LP**: em 16/06/2026 duas LPs usando o mesmo `id="form-lead"` causaram conversões do México atribuídas à LP errada no RD Station (bug documentado no PRD do México); `js/form.js` deve usar `getElementById('form-lead-circuito-italiano')` correspondente
- Botão de avanço da etapa 1→2 com `type="button"` obrigatório (sem isso dispara submit nativo prematuro com formulário incompleto — regra 4.6 do DIRETRIZES)
- Submit **nativo** (nunca `preventDefault()` em sucesso — regra crítica do RD Station, ver `DIRETRIZES.md` 4.6)
- Webhook n8n via `fetch(..., { keepalive: true })`, sem `await`
- Campos hidden de tracking completos (UTMs, gclid, gbraid, wbraid, fbclid, campaign_id, adgroup_id, ad_id, creative_id, keyword, keyword_id, matchtype, device, network, placement, target, adposition, loc_physical_ms, loc_interest_ms, page_url, landing_page, referrer, user_agent), preenchidos via JS no load
- **Nome do formulário no RD Station: "Circuito Italiano Claude"** — usar esse nome no mapeamento de "Formulários Capturados" no painel RD Station (passo manual, fora do código)

## 8. Manifesto de imagens
Nenhuma imagem nova criada ainda — pasta pronta para receber os arquivos abaixo (dimensões baseadas nos arquivos reais já em produção na LP do México):

Nomenclatura corrigida nesta revisão para seguir o padrão real (campanha primeiro, ex: `mexico-hero.png`, não `hero-mexico.png`) — confirmado direto nos arquivos em produção do México. Dimensão do Roteiro também corrigida: os painéis usam fundo full-bleed (`background-size: cover`, arquitetura pin-scroll de Minas — ver decisão técnica na seção 7.1), não thumbnail pequeno; 1200×700px é a dimensão real usada em produção (`ves-strip-*.jpg` de Minas), substitui os 800×600px de uma versão anterior deste PRD.

| Seção | Arquivo | Dimensão | Conteúdo sugerido | Status |
|---|---|---|---|---|
| Hero | `circuito-italiano-hero.jpg` | 1600×1000px | Costa Amalfitana ou Toscana, luz dourada | pendente |
| La Dolce Vita (fundo) | `circuito-italiano-dolcevita.jpg` | 1920×1200px | Cena italiana ao entardecer, tom terroso | pendente |
| La Dolce Vita (tiras do carrossel via `strips.js`) | `circuito-italiano-strip-01.jpg` … `circuito-italiano-strip-05.jpg` | 1200×500px cada | Faixas largas para o carrossel temático (equivalente a `mexico-strip-0N.jpg`) | pendente |
| Data | `circuito-italiano-data.jpg` | 1920×1200px | Apoio visual da seção de datas | pendente |
| Roteiro (cap. 1) | `roteiro-milao.jpg` | 1200×700px | Milão — chegada, capital da moda | pendente |
| Roteiro (cap. 2) | `roteiro-cinque-terre.jpg` | 1200×700px | Cinque Terre / Riviera Ligure (Gênova) | pendente |
| Roteiro (cap. 3) | `roteiro-toscana.jpg` | 1200×700px | Toscana — Florença/Pisa/San Gimignano/Siena/Lucca | pendente |
| Roteiro (cap. 4) | `roteiro-roma-vaticano.jpg` | 1200×700px | Roma, Vaticano e Capela Sistina | pendente |
| Roteiro (cap. 5) | `roteiro-napoles-capri-amalfitana.jpg` | 1200×700px | Nápoles, Capri, Sorrento, Costa Amalfitana e Pompeia — imagem precisa representar a região como um todo (ex: vista da Costa Amalfitana ou Capri), não só um dos 5 locais | pendente |
| Roteiro (cap. 6) | `roteiro-assis.jpg` | 1200×700px | Assis — Úmbria | pendente |
| Roteiro (cap. 7) | `roteiro-veneza-verona-garda.jpg` | 1200×700px | Pádua, Veneza, Verona e Lago di Garda | pendente |
| Grupo | `fotos-grupo01.jpg` … `fotos-grupo06.jpg` (mín. 6) | 800×600px cada | Grupos reais Girotrip em viagem | pendente |
| Para Você | `circuito-italiano-para-voce.jpg` | 1600×900px | Conforto/experiência público 50+ | pendente |
| FAQ | `circuito-italiano-faq.jpg` | 1920×1200px | Imagem de apoio discreta | pendente |
| Depoimentos | `dep-dalva.jpg`, `dep-jacqueline.jpg`, `dep-marilia.jpg`, `dep-sandra.jpg`, `dep-sidio.jpg` | 1600×1600px | **Reaproveitado** do México/Minas | reaproveitado |
| Logo/Header | Logo Girotrip | — | **Reaproveitado** | reaproveitado |

Nota: Exclusividades (ticker de diferenciais) usa `tickers.js` com cards de texto/ícone — sem imagem própria, ao contrário do que uma versão anterior deste PRD sugeria. As imagens "strip" alimentam o carrossel da seção temática (La Dolce Vita), via `strips.js`, não Exclusividades — corrigido nesta revisão após conferir o código real de Minas/México.

## 9. O que é reaproveitado vs. novo
**Reaproveitado como está (sem alteração de lógica):**
- `css/base.css` (tokens, reset, tipografia, botões, container, animações) do `minas-historica/`
- Módulos JS genéricos: `tickers.js` (rAF, nunca CSS animation), `faq.js`, `smooth-scroll.js`, `reveal.js`, `header.js` (comportamento sticky/logo no scroll — presente em ambas as LPs de referência, omitido por engano na primeira versão deste PRD), `countdown.js` (contagem regressiva — usar sempre a próxima saída futura entre as 3 datas de 2027 como alvo)
- Lógica e estrutura do `form.js` (formulário 2 etapas, submit nativo, tracking Meta Pixel) — com `id` do form e URL de webhook trocados pro slug `circuito-italiano`
- Imagens de depoimentos e textos (`depoimentos textos.txt`)
- Logo Girotrip

**Reaproveitado com adaptação pontual:**
- `strips.js` (carrossel de tiras da seção temática — troca só as imagens/legendas)
- `roteiro.js`/`roteiro.css` — reaproveitar a versão de **Minas** (pin-scroll com pontos navegáveis), não a do México (que na verdade é um accordion vertical sem pontos — incompatível com o checklist de QA do DIRETRIZES, que exige "carrossel navegável pelos pontos"). Recalcular `.rot-track` de `500vw` (5 painéis) para `700vw` (7 capítulos) e `.rot-pin-outer` de `400vh` para `560vh`, mantendo 80vh por painel. Ver decisão técnica completa na seção 7.1.

**Novo por LP:**
- Conteúdo/copy do roteiro, datas, valores
- Imagens de destino (ver seção 8)
- Cor temática da seção "La Dolce Vita" (`--cinema-bg` equivalente)
- Webhook n8n específico e mapeamento de campos no RD Station

## 10. Integrações
### 10.1 Meta Pixel
- **ID:** `170983320269952` (mesma conta Girotrip, reaproveitado)
- Eventos: `PageView` (automático), `InitiateCheckout` (avanço etapa 1→2 do formulário), `Lead` (envio com sucesso)

### 10.2 Google Tag Manager
- **Container:** `GTM-57G5D65H` (reaproveitado)

### 10.3 Webhook n8n / RD Station
- **URL webhook (definitiva):** `https://automatik-n8n.t1prud.easypanel.host/webhook/circuito-italiano-claude`
- **Workflow:** `https://automatik-n8n.t1prud.easypanel.host/workflow/lAemPnlqmxofkMmA`
- **Nome do formulário no RD Station:** "Circuito Italiano Claude" — configurar no painel RD Station → Integrações → Formulários Capturados (mapeamento manual, fora do código, mesma lógica documentada em `DIRETRIZES.md` 5.4)
- Campos enviados: nome, email, telefone, whatsapp, quantas_pessoas, como_ficou_sabendo + todos os parâmetros de tracking (ver `DIRETRIZES.md` 5.4)
- **Pendência antes do lançamento com tráfego real:** confirmar que o workflow n8n está com o mapeamento de campos correto e testar o fluxo completo (webhook → RD Station PATCH) antes de apontar anúncios pra essa página. A URL de produção (`/webhook/...`, sem `-test`) já está configurada — só falta validar ponta a ponta.

## 11. Estrutura de pastas e deploy
```
Landing Pages/circuito-italiano/     ← pasta isolada, NÃO impacta minas-historica/ nem mexico-cultural-colonial/
├── index.html
├── css/  (base, hero, dolcevita, data, roteiro, grupo, exclusividades,
│          para-voce, depoimentos, investimento, faq, form, footer,
│          header, animations, responsive)
├── js/   (main, index, form, faq, roteiro, smooth-scroll, tickers, reveal,
│          header, countdown, strips)
├── docs/PRD-circuito-italiano.md
├── Design-system/design-system-circuito-italiano.md
└── (imagens na raiz)
```
- **Repositório novo e isolado:** `girotripturismo-collab/circuito-italiano` (a criar no GitHub) — não usa o monorepo `minas-historica-vesperata` nem o repo `mexico-cultural-colonial`.
- Projeto Vercel novo, Root Directory vazio, **sem** `vercel.json` de rewrites (mesmo padrão zero-config usado no México).
- `git config user.email "girotripturismo@gmail.com"` obrigatório antes do primeiro commit (bloqueio de deploy no Vercel se errado).
- Fluxo: criar pasta → construir → testar local (`npx http-server . -p 5500`) → `git init` → commit → criar repo GitHub → push → conectar projeto Vercel → validar no ar → só então apontar tráfego de anúncio.

## 12. Regras técnicas críticas (subconjunto do DIRETRIZES.md aplicável a esta LP — deploy/arquitetura de pastas segue a seção 11 acima, isolada do monorepo)
- `overflow-x: clip`, nunca `hidden`
- `background-attachment: fixed` sempre com override `scroll` em `max-width: 768px`
- Tickers via `requestAnimationFrame` (`tickers.js`), nunca CSS animation
- Cache-busting (`?v=N`) obrigatório após qualquer edição de CSS/JS
- Submit nativo obrigatório do formulário (regra 4.6 do DIRETRIZES) — `preventDefault()` só em caso de validação falha
- Máximo 500 linhas por arquivo CSS/JS

## 13. Critérios de aceitação
- Página carregando corretamente em `http://127.0.0.1:5500/circuito-italiano/`
- Todas as 11 seções presentes, na ordem definida, sem seção vazia/quebrada
- Formulário avança etapa 1→2, envia com sucesso, dispara `InitiateCheckout` e `Lead` no Meta Pixel
- Testado em mobile real (iPhone), não só DevTools
- Deploy isolado funcionando na Vercel, sem qualquer alteração nos repositórios/projetos existentes
- Nenhuma imagem faltando ou quebrada (todas as do manifesto da seção 8 substituídas pelos arquivos reais)

---

## Referências de pesquisa usadas neste PRD
- [9 Landing Page Trends For 2026 — involve.me](https://www.involve.me/blog/landing-page-trends)
- [Website Design Trends That Actually Increase Sales in 2026 — GoZoek](https://www.gozoek.com/post/website-design-trends-that-actually-increase-sales-in-2026)
- [Top Hero Section Examples for 2026 — Memorable](https://memorable.design/hero-section-examples/)
- [15 Travel Website Design Examples That Set New UX Standards — DesignMonks](https://www.designmonks.co/blog/travel-website-design-examples)
- [What is a Value Stack? — Tiny Giant Marketing](https://tinygiantmarketing.com/what-is-a-value-stack/)
- [Value Based Pricing — Copywriting Course](https://copywritingcourse.com/value-based-pricing/)

---

*Girotrip Turismo · PRD Circuito Italiano · Criado em 03/07/2026*
