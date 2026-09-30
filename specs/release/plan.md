# Implementation Plan: Versionamento semver automático

**Date**: 2026-09-30 | **Spec**: [spec.md](./spec.md)

## Summary

release-please (`release-type: simple` + `extra-files`) calcula a versão e gera o
`CHANGELOG.md` a partir dos conventional commits de `main`. Três workflows:
`commits.yml` (título do PR para `dev` + testes de versão), `release-please.yml`
(PR de release em `main`) e `beta.yml` (pre-release manual a partir de `dev`). O
cálculo roda **localmente, com a própria biblioteca do release-please**, sobre
históricos fixture — o dry-run não é uma reimplementação da regra.

## Technical Context

**Language/Version**: Node 22 (CI), ESM, `node:test` sem framework extra

**Primary Dependencies**: `release-please` **17.6.0** fixado — a mesma versão
empacotada em `googleapis/release-please-action` v5.0.0, que o workflow usa fixada
por SHA. Um teste confere que os dois continuam casados.

**Testing**: `node --test` com cobertura (`--test-coverage-lines=80`)

**Constraints**: só `GITHUB_TOKEN`; nenhum build ou upload de artefato; nenhum
arquivo fora dos caminhos da entrega (por isso `scripts/version/` tem
`package.json` e `.gitignore` próprios, em vez de mexer nos da raiz).

## Escolha da ferramenta

| Opção | Por que sim / por que não |
|---|---|
| **release-please** (escolhida) | Modelo de PR de release = o portão "liberar" do mantenedor, sem PAT. Manifest como fonte única de versão. `bump-minor-pre-major` resolve o pré-1.0. Biblioteca importável, o que permite o dry-run real sobre fixtures |
| release-please `release-type: rust` | Descartada: com `Cargo.toml` raiz só de workspace (sem `[package]`), o updater lança `is not a package manifest` e o PR de release quebraria. Verificado lendo `updaters/rust/cargo-toml.js` |
| semantic-release | Publica direto no merge, sem PR de release: não há o segundo portão do mantenedor |
| release-plz | Focado em crates publicados no crates.io; não cobre `package.json` e `tauri.conf.json` |
| changesets | Versão vem de arquivos escritos à mão, não dos commits |

## Design

- **Fonte única**: `.release-please-manifest.json` (`{".": "0.1.0"}`). Os arquivos
  que a seguem são exatamente os `extra-files` de `release-please-config.json`;
  o teste de sincronia lê essa lista da config (a lista não é repetida em código).
  Um teste separado garante que a config cobre os membros do workspace Cargo, as
  entradas deles no `Cargo.lock` e os arquivos do frontend e do Tauri.
- **`Cargo.lock`**: `extra-files` do tipo `toml` com filtro por nome
  (`$.package[?(@.name.value=='placar-core')].version`). O `.value` existe porque o
  parser TOML do release-please embrulha cada valor com posição. É um detalhe
  interno; por isso a versão é fixada e o teste
  `pr_de_release_atualiza_todos_os_arquivos_de_versao` aplica os updaters reais ao
  repositório e reprova se algum arquivo não mudar (o release-please só loga
  `No entries modified`, não falha).
- **Dry-run**: `lib/scm-fixture.mjs` implementa a interface `Scm` do release-please
  em memória (commits, releases e tags do fixture; arquivos lidos do repositório).
  `Manifest.fromManifest(...).buildPullRequests()` roda sem rede.
- **Beta**: `bin/versao-beta.mjs` lê o git local (`git log <última estável>..HEAD`),
  roda o mesmo cálculo e acrescenta `-beta.N`, com `N` = maior beta existente do
  mesmo alvo + 1. A base é a maior entre a versão do manifest e a última tag
  estável, para não recalcular uma versão já liberada quando `main` ainda não
  voltou para `dev`. O `beta.yml` cria o release com `--prerelease --latest=false`.

## Armadilhas de dano silencioso

1. **Tag criada com `GITHUB_TOKEN` não dispara outro workflow** (e PAT é proibido).
   Os jobs expõem `outputs` (`release_created`, `tag_name`, `version`; no beta
   `tag`, `version`, `prerelease`) e um comentário marca onde o job que chama
   `release.yml` via `workflow_call` entra, no **mesmo** workflow. Pelo mesmo
   motivo o PR de release não roda o CI: `release-please.yml` roda a sincronia
   sobre a branch do PR e grava um status `sincronia-de-versao` no commit dele.
2. **Squash na promoção `dev → main` apaga os commits de onde a versão sai**: o
   commit único de squash tem título `Promove dev para main (#N)` e corpo com
   `* feat: …` (com asterisco), que não é conventional. Teste
   `promocao_por_squash_perde_a_versao` prova isso; o manual proíbe squash.
3. **Beta nunca vira `latest`**: `--prerelease --latest=false` no `beta.yml`, teste
   que lê o workflow, e teste de que um release beta não altera o cálculo estável
   (o release-please só casa o release cuja versão é a do manifest).
4. **Pré-1.0, breaking sobe minor**: `bump-minor-pre-major: true`; mutação que
   remove a chave derruba os testes de breaking.
5. **Título do PR é a mensagem em `dev`**: vale com squash **e** com
   "título do PR" como mensagem padrão de squash (hoje o repositório usa
   `COMMIT_OR_PR_TITLE`, que num PR de um commit só usa a mensagem do commit).
   Ajuste listado como ação do mantenedor no manual.
6. **Título do PR de promoção vira commit extra**: o corpo do merge commit traz o
   título do PR, e o release-please o lê como mais um commit. `feat: …` ali soma
   um minor indevido; o manual pede `chore: promove dev para main` (teste
   `titulo_feat_no_pr_de_promocao_soma_um_minor`).

## Ações do mantenedor (não simuladas)

- Habilitar "Allow GitHub Actions to create and approve pull requests" (hoje
  desligado: `can_approve_pull_request_reviews: false`). Sem isso o release-please
  não abre o PR de release.
- Mensagem padrão de squash = título do PR.
- Confirmar que merge commit continua permitido para a promoção `dev → main`.
- Primeira versão: calculada a partir de `0.1.0` (ex.: `0.2.0` se houver `feat`),
  só com os commits depois de `bootstrap-sha` (o último commit de `dev` antes desta
  entrega), para o scaffold, que já é a `0.1.0`, não entrar de novo no CHANGELOG. O
  beta usa o mesmo marco enquanto não houver tag estável.
  Se quiser que a primeira tag seja exatamente `v0.1.0`, usar `release-as` uma vez.

## Project Structure

```text
release-please-config.json
.release-please-manifest.json
CHANGELOG.md
docs/release/versioning.md
.github/workflows/{commits,release-please,beta}.yml
scripts/version/
  package.json, package-lock.json, .gitignore
  lib/        # scm-fixture, plano-de-release, beta, sincronia, titulo-pr, historico-git
  bin/        # checar-titulo-pr, checar-sincronia, versao-beta
  fixtures/   # históricos de commits
  test/       # node:test
  cenarios/   # Gherkin (.md), 1:1 com o nome de cada teste
```
