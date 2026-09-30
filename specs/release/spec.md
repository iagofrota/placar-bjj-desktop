# Feature Specification: Versionamento semver automático

**Created**: 2026-09-30

**Status**: Approved

**Input**: Critérios L1–L6 aprovados pelo mantenedor antes da implementação.

## Contexto

Até aqui a versão do app (`0.1.0`) foi escrita à mão em quatro arquivos. A partir
desta entrega, a versão passa a ser **derivada dos conventional commits**, o
`CHANGELOG.md` é gerado, e o mantenedor tem dois portões explícitos (promover e liberar),
além de um canal beta disparado a partir de `dev`.

Esta entrega **não** builda nem publica artefato. O build de release é de outra
entrega, que vai se plugar nos pontos de extensão deixados aqui.

## User Scenarios & Testing

### User Story 1 - Título de PR padronizado (Priority: P1)

Quem abre um PR para `dev` precisa de um título em conventional commits, porque é
esse título que vira a mensagem do commit em `dev` (merge por squash), e a versão
sai dessas mensagens.

**Acceptance Scenarios**:

1. **Given** um PR para `dev` com título `ajusta versionamento`, **When** o check
   `commits` roda, **Then** ele falha e explica o formato esperado.
2. **Given** o mesmo PR, **When** o título é corrigido para
   `feat: versionamento semver automático`, **Then** o check `commits` roda de
   novo (evento `edited`) e passa.

### User Story 2 - Versão num lugar só (Priority: P1)

A versão vive em `.release-please-manifest.json`. `src-tauri/Cargo.toml`,
`crates/placar-core/Cargo.toml`, `Cargo.lock`, `frontend/package.json`,
`frontend/package-lock.json` e `src-tauri/tauri.conf.json` a seguem.

**Acceptance Scenarios**:

1. **Given** todos os arquivos na mesma versão, **When** o teste de sincronia roda,
   **Then** passa.
2. **Given** a versão alterada só em um dos arquivos, **When** o teste roda,
   **Then** falha e aponta o arquivo divergente.
3. **Given** a config da ferramenta, **When** o PR de release é simulado sobre o
   repositório real, **Then** todos os arquivos de versão mudam juntos e a
   sincronia continua passando.

### User Story 3 - Cálculo da próxima versão (Priority: P1)

**Acceptance Scenarios** (históricos fixture, versão atual `0.1.0`):

1. Só `fix:` → patch (`0.1.1`).
2. `feat:` → minor (`0.2.0`).
3. `feat!:` ou rodapé `BREAKING CHANGE:` antes de 1.0 → minor (`0.2.0`), nunca `1.0.0`.
4. Só `chore:`/`docs:` → nenhuma versão nova.
5. Promoção `dev → main` por merge commit preserva os commits de `dev`; por squash,
   o commit único não é conventional e a versão se perde.

### User Story 4 - Canal beta (Priority: P2)

O mantenedor dispara manualmente, a partir de `dev`, um pre-release `vX.Y.Z-beta.N`, onde
`X.Y.Z` é a próxima versão estável calculada dos commits desde a última versão
estável e `N` cresce a cada disparo sobre o mesmo alvo.

**Acceptance Scenarios**:

1. **Given** nenhum beta anterior do alvo `0.2.0`, **When** o beta é calculado,
   **Then** sai `0.2.0-beta.1`; calculado de novo depois dessa tag, sai `0.2.0-beta.2`.
2. **Given** o workflow de beta, **Then** o release é criado como pre-release e
   explicitamente **não** `latest`.
3. **Given** um beta publicado, **When** a versão estável é calculada em `main`,
   **Then** o beta é ignorado.

### User Story 5 - Manual do mantenedor (Priority: P2)

`docs/release/versioning.md` explica, para um leigo, os dois portões (promover
`dev → main` por **merge commit, nunca squash**, e liberar pelo merge do PR de
release), como disparar um beta e as ações de configuração que cabem ao mantenedor.

## Requirements

- **FR-001**: Check `commits` em PR para `dev`, reagindo a `opened`, `edited`,
  `synchronize` e `reopened`.
- **FR-002**: Teste de sincronia de versão no CI dos PRs para `dev`, e também sobre
  o PR de release em `main` (status no próprio PR, já que PR aberto com
  `GITHUB_TOKEN` não dispara o CI).
- **FR-003**: Pré-1.0, breaking change sobe minor.
- **FR-004**: Beta nunca vira `latest` e nunca é considerado pelo cálculo estável.
- **FR-005**: Só `GITHUB_TOKEN`. Nenhum PAT, nenhum build, nenhum upload de artefato.
- **FR-006**: Os workflows expõem `tag`/`version`/`release_created` para o build de
  release se plugar depois.

## Out of scope

- `release.yml`, bundles, updater e AUR (entrega de distribuição).
- Promover `dev → main` ou criar a primeira versão (decisão do mantenedor).
- Configurações do repositório no GitHub (ficam como checklist do mantenedor).
