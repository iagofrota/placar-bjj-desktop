# Feature Specification: Identidade visual e textos do placar

**Feature Branch**: `feat/identidade-visual`

**Created**: 2026-09-30

**Status**: Approved

**Input**: Aprovado pelo PE fora deste comando, antes do início da implementação.

## Objetivo

O app tem a identidade visual exata da plataforma de origem (tokens de cor, quatro
fontes embutidas, botão base) e os textos em pt_BR, en e es. Tudo funciona sem rede e
sem nenhum literal de cor fora dos tokens. As telas (tarefa seguinte) só montam estas
peças. Fora de escopo: telas, regras de placar, IPC.

## Requisitos

- **FR-001**: `docs/design-tokens.md` é a tabela única de tokens, com o mesmo hex da
  plataforma (`resources/css/app.css`, linhas 69-94, convertido de HSL). As CSS vars em
  `frontend/src/styles/tokens.css` derivam só dela.
- **FR-002**: nenhum literal de cor (`#hex`, `rgb(`, `hsl(`) em `frontend/src`, fora de
  `styles/tokens.css`.
- **FR-003**: quatro famílias em `.woff2` locais, só com os pesos usados: Bebas Neue 400;
  JetBrains Mono 400/500/700; Inter 400/500/600; Cormorant Garamond 500 itálico. Nenhuma
  requisição de rede para fonte.
- **FR-004**: dicionários pt_BR, en e es em `frontend/src/i18n/`, só com as chaves que o
  placar avulso usa, e um teste de completude com par de falsificação.
- **FR-005**: botão base com variantes de cor (`primary`, `green`, `gold`, `red`, `ghost`) e
  alturas de 44 px ou mais (`mesa` = 52 px), usando só tokens.

## Cenários de aceite

1. **Given** a tabela de tokens, **When** o CSS é lido, **Then** nome e hex coincidem.
2. **Given** o código do frontend, **When** se procura literal de cor, **Then** só o arquivo
   de tokens tem.
3. **Given** o build do frontend, **When** se inspeciona o `dist`, **Then** há um `.woff2`
   por família e peso, e nenhuma URL externa nos estilos.
4. **Given** os três dicionários, **When** se pede cada chave do placar, **Then** nenhuma
   falta; remover uma chave de um idioma faz o teste falhar.
5. **Given** o botão em cada variante, **When** renderizado, **Then** a altura é 44 px ou mais
   e a cor vem de token.

Os cenários por teste estão em `gherkin/`, um `.md` por nome de teste.
