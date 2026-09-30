# Implementation Plan: Identidade visual e textos do placar

**Branch**: `feat/identidade-visual` | **Date**: 2026-09-30 | **Spec**: [spec.md](./spec.md)

## Abordagem

- **Tokens**: `docs/design-tokens.md` é a fonte. `styles/tokens.css` tem as variáveis;
  `styles/arena.css` as expõe ao Tailwind v4 (`@theme inline`) como `bg-score-points`,
  `text-ink` etc., e importa `styles/fonts.css`. Testes ao lado do código (`*.test.ts`) leem os arquivos e comparam.
- **Fontes**: os `.woff2` (subconjunto `latin`) vêm dos pacotes `@fontsource/*` 5.3.0,
  copiados uma vez para `frontend/src/assets/fonts/`. Nenhum pacote de fonte entra nas
  dependências, e o Vite empacota cada arquivo no build. Licença OFL 1.1 em `LICENSES/`.
- **i18n**: os dicionários são TypeScript portado de `lang/*/app_mesa.php` da plataforma
  (script único, valores idênticos). `keys.ts` lista as 64 chaves usadas por `avulso.tsx` e
  pelos componentes dele. `translate` troca `:placeholders` como o `__()` do Laravel e lança
  erro em chave inexistente.
- **Botão**: `components/ui/button.tsx` sem dependência nova (sem cva/radix). Variantes e
  tamanhos são mapas de classes Tailwind só com tokens. Os tamanhos de 36 px da plataforma
  não foram portados.

## Dependências

Só `@types/node` (devDependency, tipos para os testes que leem arquivos). Não sobe o
engine mínimo de Node.

## Ligação ao app

Esta tarefa não altera `index.css` nem `main.tsx`. A tela que consumir as peças importa
`styles/arena.css` depois de `@import "tailwindcss"`. Sem esse import o Vite não empacota
as fontes.

## Verificação

`npm test`, `npm run build` e `tsc --noEmit` em `frontend/`; provas de mutação por critério
descritas no PR.
