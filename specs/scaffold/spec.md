# Feature Specification: Scaffold do Placar BJJ Desktop

**Feature Branch**: `feat/scaffold-desktop-app`

**Created**: 2026-09-28

**Status**: Approved

**Input**: Aprovado pelo PE fora deste comando, antes do início da implementação.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clonar e rodar em modo dev (Priority: P1)

Uma pessoa clona o repositório público e, seguindo só o `README.md`, consegue
rodar o app em modo desenvolvimento e ver a janela do placar abrir com o
frontend React renderizado.

**Why this priority**: sem isso não há projeto — é o requisito mínimo para
qualquer trabalho posterior (dev interno ou contribuição externa).

**Independent Test**: num clone limpo, seguir o README do zero
(pré-requisitos → instalar → rodar) e chegar na janela sem nenhum passo que
não esteja escrito.

**Acceptance Scenarios**:

1. **Given** um clone limpo do branch do PR, **When** a pessoa roda a suíte de
   testes Rust e a do frontend, **Then** as duas terminam com zero falhas e
   exit 0.
2. **Given** o app em modo dev, **When** `cargo tauri dev` (ou o comando do
   README) é executado, **Then** abre uma única janela com o título
   `Placar BJJ`, renderizando texto vindo do React (não uma página em
   branco).

---

### User Story 2 - Janela se adapta ao redimensionamento (Priority: P2)

A janela do app tem um tamanho mínimo e continua redimensionável para cima,
podendo ser maximizada — sem travar em um tamanho fixo.

**Why this priority**: o app precisa se adaptar a telas de desktop
diferentes; é um requisito de produto explícito do PE.

**Independent Test**: com o app aberto, arrastar a borda da janela até o
menor tamanho possível e depois maximizar.

**Acceptance Scenarios**:

1. **Given** a janela aberta, **When** o usuário encolhe a janela pela borda,
   **Then** ela para num tamanho mínimo definido e não encolhe além dele.
2. **Given** a janela no tamanho mínimo, **When** o usuário a maximiza,
   **Then** ela ocupa a tela normalmente (continua redimensionável para
   cima).

---

### User Story 3 - Política de rede restritiva por padrão (Priority: P2)

O WebView do app só pode se conectar à origem de telemetria prevista
(PostHog) — nenhuma outra origem externa é liberada, nem por curinga.

**Why this priority**: o app não tem nenhuma conexão com a plataforma nem
qualquer outro serviço; a política de segurança precisa refletir isso desde
o scaffold, porque as tarefas de telemetria e distribuição dependem deste
contrato para não colidir no mesmo arquivo depois.

**Independent Test**: do DevTools do app em dev, tentar `fetch()` para a
origem do PostHog e para uma origem qualquer não relacionada.

**Acceptance Scenarios**:

1. **Given** o app em modo dev, **When** o WebView tenta `fetch` para
   `https://us.i.posthog.com`, **Then** a requisição não é bloqueada pela
   política de segurança do app (erro de rede/HTTP é aceitável; erro de CSP
   não é).
2. **Given** o app em modo dev, **When** o WebView tenta `fetch` para
   qualquer origem não prevista, **Then** a política de segurança bloqueia a
   chamada e isso aparece como violação de CSP no console.

---

### User Story 4 - CI bloqueia código quebrado (Priority: P1)

Todo PR para `dev` passa por um CI que roda formatação, lint, testes (Rust e
frontend) e cobertura, e falha visivelmente quando algo quebra.

**Why this priority**: sem isso, nada garante que as próximas cinco tarefas
(que dependem deste scaffold) não regridam silenciosamente.

**Independent Test**: abrir um PR para `dev` e observar o CI rodando; num
commit à parte (descartável, fora do histórico do PR), introduzir um teste
vermelho de propósito e confirmar que o CI daquele commit falha.

**Acceptance Scenarios**:

1. **Given** um PR aberto contra `dev`, **When** o CI roda, **Then** todos os
   jobs (formato, lint, testes Rust, testes frontend, cobertura, build
   Windows) terminam verdes.
2. **Given** um commit com um teste vermelho de propósito numa branch
   descartável, **When** o CI roda nele, **Then** o job de teste
   correspondente falha.

---

### User Story 5 - Repositório nasce com as licenças corretas (Priority: P3)

O repositório público tem a licença do código (MIT) e as licenças de
terceiros (fontes e ícones) corretas desde o primeiro commit.

**Why this priority**: é um requisito legal/de higiene para um repositório
público, mas não bloqueia o uso técnico do app.

**Independent Test**: abrir `LICENSE` e `LICENSES/` e conferir o conteúdo.

**Acceptance Scenarios**:

1. **Given** o repositório clonado, **When** alguém abre `LICENSE`, **Then**
   o texto é MIT em nome de Iago Olímpio Frota.
2. **Given** o repositório clonado, **When** alguém abre `LICENSES/`,
   **Then** encontra o texto completo da OFL-1.1 (associado às 4 fontes que
   o app vai usar) e da ISC (associada aos ícones Lucide).

### Edge Cases

- O que acontece se a pessoa não tiver as dependências de sistema do Tauri
  instaladas? → O README lista os pré-requisitos antes do passo de rodar; não
  é responsabilidade do app detectar isso em tempo de execução nesta tarefa.
- O que acontece se alguém tentar liberar uma origem de rede nova sem alterar
  o CSP? → A requisição é bloqueada por padrão (postura restritiva, allowlist
  explícita).
- O que acontece se o instalador de licenças de fonte mudar antes da tarefa
  `visual` chegar? → Fora de escopo aqui; esta tarefa só entrega os textos de
  licença, não os arquivos `.woff2`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O repositório MUST ter um workspace Cargo com dois membros:
  `crates/placar-core` (biblioteca vazia, compilando, sem dependência de
  Tauri) e `src-tauri` (o app Tauri).
- **FR-002**: O app MUST abrir exatamente uma janela, com título
  `Placar BJJ`, carregando um frontend React/TypeScript/Vite/Tailwind
  servido de `frontend/`.
- **FR-003**: A janela MUST ter um tamanho mínimo configurado
  (`minWidth`/`minHeight`), continuar redimensionável para cima e permitir
  maximização.
- **FR-004**: A política de segurança (CSP) do app MUST liberar
  `connect-src` apenas para `https://us.i.posthog.com` (além do necessário
  para o próprio IPC do Tauri) e MUST NOT usar curinga (`*`) em nenhuma
  diretiva de origem.
- **FR-005**: O repositório MUST ter um workflow de CI que rode, em todo PR
  e push para `dev`: formatação (`cargo fmt --check`), lint
  (`cargo clippy -D warnings`), testes Rust (`cargo test --workspace`),
  testes de frontend (Vitest), cobertura de ambos, e uma compilação do app
  Tauri no Windows (sem empacotar).
- **FR-006**: O job de cobertura MUST falhar se a cobertura geral (Rust +
  frontend) cair abaixo de 80%.
- **FR-007**: O repositório MUST ter `LICENSE` (MIT, Iago Olímpio Frota) e
  `LICENSES/` com os textos da OFL-1.1 (Bebas Neue, JetBrains Mono, Inter,
  Cormorant Garamond) e da ISC (Lucide).
- **FR-008**: O repositório MUST ter um `README.md` que, seguido do início ao
  fim por alguém sem contexto prévio, leve à janela do app rodando em modo
  dev sem nenhum passo não documentado.
- **FR-009**: Nenhum código deste scaffold MUST conter regra de negócio do
  placar (pontuação, cronômetro, desempate) — isso é escopo da tarefa
  `placar-core`.
- **FR-010**: O histórico git, a branch remota, o PR e os arquivos versionados
  MUST NOT conter nenhum identificador do ferramental usado para construir o
  repositório (nomes de agente, de journey, etc.) — autoria de commit sempre
  `Iago Olímpio Frota <iagofrota10@gmail.com>`.

### Key Entities

Esta tarefa não introduz entidades de domínio — o domínio do placar
(estágios da luta, pontuação por lado, cronômetro) é escopo da tarefa
`placar-core` (onda 2). O scaffold só define a **estrutura de pastas** que as
próximas tarefas vão preencher (`crates/placar-core/`, `src-tauri/`,
`frontend/`, `e2e/`, `docs/`, `LICENSES/`, `.github/workflows/`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Num clone limpo, `cargo test --workspace` e `npm test` (em
  `frontend/`) terminam com exit 0 e zero falhas.
- **SC-002**: `cargo tauri dev` abre a janela `Placar BJJ` em menos de 60
  segundos num ambiente com as dependências já instaladas.
- **SC-003**: 100% dos PRs para `dev` rodam o CI completo antes de poderem
  ser mesclados, sem exceção manual.
- **SC-004**: A cobertura de testes relatada pelo CI é ≥ 80% geral (Rust +
  frontend) — o job falha automaticamente abaixo disso.
- **SC-005**: Uma pessoa sem contexto prévio do projeto consegue ir do clone
  à janela aberta seguindo só o README, sem precisar adivinhar nenhum passo.

## Assumptions

- O app roda em modo dev no Linux (ambiente do time) mesmo sendo distribuído
  só para Windows — a compilação Windows do CI valida que o binário compila
  para o alvo final, mas não substitui verificação manual em Windows real
  (fica registrada em `docs/qa/release-checklist.md` nas tarefas seguintes).
- `src-tauri/src/main.rs` e `src-tauri/src/lib.rs` são, nesta tarefa, puro
  bootstrap do Tauri sem lógica de negócio — por isso ficam fora da medição
  de cobertura de linha (ver `docs/qa/cobertura.md`). Isso é revisitado
  quando ganharem código real nas tarefas `app` e `telemetria`.
- O ícone do app usa o padrão gerado pelo template do Tauri; um ícone próprio
  é escopo da tarefa `distribuicao`.
- As fontes `.woff2` e os tokens de design não fazem parte desta tarefa
  (tarefa `visual`) — aqui só entram os textos de licença correspondentes.
