# Design tokens

Identidade visual do placar, portada da plataforma de origem (`resources/css/app.css`,
linhas 69-94, bloco `:root` "Arena design tokens"). A plataforma guarda os valores em HSL;
aqui eles estão em hex, convertidos e arredondados para o inteiro mais próximo por canal.

Esta tabela é a **fonte única** dos valores. `frontend/src/styles/tokens.css` deriva dela, e um
teste (`tokens_css_espelha_tabela_de_design_tokens`) falha se os dois divergirem. Fora
de `tokens.css` não pode existir literal de cor em `frontend/src` (teste
`nenhum_literal_de_cor_fora_do_arquivo_de_tokens`).

## Cores

| Token | Hex | HSL na plataforma | Uso |
|---|---|---|---|
| `--side-white` | `#F8FAFC` | `210 40% 98%` | fundo do lado Branco |
| `--side-white-fg` | `#0F1729` | `222 47% 11%` | texto do lado Branco |
| `--side-blue` | `#0B64F4` | `217 91% 50%` | fundo do lado Azul |
| `--side-blue-fg` | `#FFFFFF` | `0 0% 100%` | texto do lado Azul |
| `--score-points` | `#1F7A40` | `142 60% 30%` | botões +2/+3/+4 |
| `--score-advantage` | `#CB920B` | `42 90% 42%` | vantagem |
| `--score-penalty` | `#C11F1F` | `0 72% 44%` | punição e relógio nos 30 s finais |
| `--score-submission` | `#DB5E06` | `25 95% 44%` | acento do "vs" na tela de resultado |
| `--arena-black` | `#0A0A0A` | `0 0% 4%` | barra inferior; texto sobre dourado |
| `--paper` | `#F8F8F7` | `60 9% 97%` | fundo da tela de setup |
| `--ink` | `#121621` | `222 30% 10%` | texto da tela de setup; botão primário |
| `--ink-faint` | `#89909F` | `222 10% 58%` | texto secundário; botão desabilitado |
| `--card` | `#FFFFFF` | `0 0% 100%` | superfícies; texto sobre botões de cor sólida |
| `--line` | `#DCDFE5` | `222 14% 88%` | bordas |
| `--line-soft` | `#E8E9ED` | `222 14% 92%` | fundo de botão desabilitado e de hover |

Só entram os tokens que o placar avulso usa (`avulso.tsx` e `components/arena/mesa/**`,
`components/ui/{button,input,label,dialog}.tsx`). Os de faixa (`--belt-*`), tatame
(`--mat-*`) e `--ink-soft`, `--arena-kimono` ficam de fora.

## Tipografia

Quatro famílias, todas SIL OFL 1.1 (texto em `LICENSES/OFL-1.1.txt`), embutidas como `.woff2`
em `frontend/src/assets/fonts/` (subconjunto `latin`), sem nenhuma requisição de rede.

| Família | Papel | Pesos embutidos | Variável |
|---|---|---|---|
| Bebas Neue | display (títulos, botões) | 400 | `--font-display` |
| JetBrains Mono | placar e relógio, com `tabular-nums` | 400, 500, 700 | `--font-mono` |
| Inter | corpo | 400, 500, 600 | `--font-sans` |
| Cormorant Garamond | acento do "vs" | 500 itálico | `--font-accent` |

Origem dos arquivos: pacotes `@fontsource/{bebas-neue,jetbrains-mono,inter,cormorant-garamond}`
5.3.0 (redistribuição dos arquivos oficiais), copiados uma vez para o repositório. Nenhum
pacote entra nas dependências do frontend.

Tamanhos-chave da plataforma, para a tela consumir: placar `clamp(64px, 14vw, 170px)`, nome do
atleta `clamp(24px, 4vw, 44px)`; ambos colapsam sob `@media (max-height: 500px)`.

## Botão base

`frontend/src/components/ui/button.tsx`. Variantes de cor, todas só com tokens:

| Variante | Fundo | Texto |
|---|---|---|
| `primary` | `--ink` | `--card` |
| `green` | `--score-points` | `--card` |
| `gold` | `--score-advantage` | `--arena-black` |
| `red` | `--score-penalty` | `--card` |
| `ghost` | transparente, borda `--line` | `--ink` |

Alturas (alvo de toque mínimo de 44 px):

| Tamanho | Altura | Equivale, na plataforma, a |
|---|---|---|
| `compact` | 44 px | `sm` (36 px) com `h-11`, como o botão de correção do pad |
| `default` | 46 px | `default` |
| `mesa` | 52 px | `mesa` |

`sm` (36 px) e `icon` (36 px) da plataforma não foram portados: ficam abaixo de 44 px.
