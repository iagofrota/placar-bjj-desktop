# Versões e releases do Placar BJJ Desktop

Este é o manual de como uma versão nova do app nasce. Ninguém escolhe o número da
versão à mão: ele é calculado a partir das mensagens de commit. Quem mantém o
projeto só decide **quando**, em dois portões:

1. **Promover**: levar o que está em `dev` para `main`.
2. **Liberar**: aprovar o PR de release que aparece em `main`. Só aí nasce a versão.

E, quando quiser testar antes de liberar, dá para soltar um **beta** a partir de `dev`.

```text
 PR (título "feat: …")                        PR de release (automático)
        │ squash                                      │ merge = LIBERAR
        ▼                                             ▼
      dev ── PROMOVER (merge commit) ──▶ main ──▶ tag vX.Y.Z + GitHub Release
        │
        └── beta (manual) ──▶ tag vX.Y.Z-beta.N (pre-release, nunca "latest")
```

## 1. O dia a dia: títulos de PR

Todo PR para `dev` precisa de um título no formato `tipo: descrição`. O check
**`commits`** do PR fica vermelho se o título estiver fora do formato, e volta a
rodar sozinho quando você edita o título.

O título importa porque, no merge por **squash**, ele vira a mensagem do commit em
`dev`, e é dessa mensagem que a versão sai:

| Título do PR | Efeito na próxima versão (antes da 1.0) | Aparece no CHANGELOG |
|---|---|---|
| `fix: relógio não pausa ao zerar` | patch: `0.1.0` → `0.1.1` | Correções |
| `feat: seletor de idioma` | minor: `0.1.0` → `0.2.0` | Novidades |
| `feat!: novo formato de configuração` | minor: `0.1.0` → `0.2.0` (antes da 1.0, mudança incompatível **não** vira `1.0.0`) | Novidades + aviso de incompatibilidade |
| `perf: …` / `revert: …` | patch | Desempenho / Reversões |
| `docs:`, `chore:`, `refactor:`, `test:`, `build:`, `ci:`, `style:` | nenhum: sozinhos não geram versão | não aparecem |

Um escopo entre parênteses é opcional: `fix(placar): punição não fica negativa`.

**Merge dos PRs para `dev`: use "Squash and merge".** Assim cada PR vira um commit
com o título do PR.

## 2. Portão "promover": `dev` → `main`

Quando `dev` tiver um lote que você quer transformar em versão:

1. Abra um PR de `dev` para `main`.
2. Dê a ele o título **`chore: promove dev para main`**. Não use `feat:` nem `fix:`
   nesse título: o GitHub copia o título do PR para dentro do merge commit, e a
   ferramenta o leria como mais uma mudança (um `feat:` ali soma um minor que não
   existiu).
3. Faça o merge com **"Create a merge commit"**.

> **Nunca use "Squash and merge" na promoção.** O squash junta todos os commits de
> `dev` em um só, e as mensagens `feat:`/`fix:` viram uma lista dentro do texto
> desse commit, que a ferramenta não lê. Resultado: a versão sai errada ou nem sai,
> e o CHANGELOG fica vazio. Pelo mesmo motivo, não use "Rebase and merge" aqui.

Promover **não** cria versão. Só faz aparecer (ou atualizar) o PR de release.

## 3. Portão "liberar": o PR de release

Depois de cada promoção, o workflow **release-please** abre ou atualiza em `main` um
PR chamado `chore(main): release X.Y.Z`. Ele já traz:

- o número da versão nova, calculado dos commits desde a última versão;
- a entrada nova do `CHANGELOG.md`;
- a versão atualizada em todos os arquivos que a carregam.

Para liberar:

1. Abra o PR de release e confira o número da versão e o texto do CHANGELOG.
2. Confira o status **`sincronia-de-versao`** verde no PR (ele prova que todos os
   arquivos ficaram com a mesma versão).
3. Faça o merge (o "Squash and merge" padrão serve).

No merge, o mesmo workflow cria a tag `vX.Y.Z` e o GitHub Release, que passa a ser o
**latest**. Se você não fizer o merge, nada é liberado: o PR fica lá, acumulando as
próximas promoções.

Hoje o Release sai só com as notas. Os instaladores serão anexados por um job de
build que ainda vai ser ligado neste mesmo workflow (ver "Para quem mexer nos
workflows", abaixo).

## 4. Soltar um beta

Um beta é uma versão de teste tirada de `dev`, antes de promover.

1. No GitHub, vá em **Actions → beta → Run workflow**.
2. Em "Use workflow from", escolha **`dev`** (de qualquer outra branch ele recusa).
3. Clique em **Run workflow**.

O workflow calcula a próxima versão estável a partir dos commits de `dev` desde a
última versão liberada, e cria o pre-release `vX.Y.Z-beta.N`. O `N` começa em 1 e
cresce a cada beta do mesmo alvo: `v0.2.0-beta.1`, depois `v0.2.0-beta.2`.

- O beta aparece nos Releases marcado como **pre-release** e **nunca** como latest.
  Quem está no canal estável não o recebe.
- O beta não mexe em nenhum arquivo nem no CHANGELOG, e não conta para o cálculo da
  versão estável.
- Se desde a última versão só entraram `docs:`/`chore:` e afins, o workflow falha
  avisando que não há nada para soltar.

## 5. Antes da 1.0, e a 1.0

- A versão começou em `0.1.0` (entrada de partida no CHANGELOG, nunca publicada).
  A primeira versão liberada será calculada a partir dela, por exemplo `0.2.0` se
  houver algum `feat:`.
- Antes da 1.0, uma mudança incompatível sobe o **minor** (`0.4.2` → `0.5.0`).
- Chegar à `1.0.0` é uma decisão sua. Para isso, acrescente
  `"release-as": "1.0.0"` dentro de `packages["."]` em `release-please-config.json`,
  libere o PR de release, e depois **remova** a linha (senão toda versão seguinte
  tenta ser `1.0.0`). O mesmo vale se quiser que a primeira tag seja exatamente
  `v0.1.0`: `"release-as": "0.1.0"`, uma vez só.

## 6. Depois de liberar: trazer a versão de volta para `dev`

O PR de release muda os arquivos só em `main`. Para `dev` também ficar com a versão
e o CHANGELOG novos, abra um PR de `main` para `dev` com o título
`chore: traz a versão X.Y.Z para dev` e faça o merge com "Create a merge commit".
Não é obrigatório para o beta funcionar (ele parte da última tag estável), mas evita
que `dev` fique mostrando uma versão velha.

## 7. Configurações do GitHub (uma vez só)

Estas não estão no código; são ajustes em **Settings** do repositório:

- [ ] **Actions → General → Workflow permissions**: marcar *Allow GitHub Actions to
      create and approve pull requests*. Sem isso o PR de release não é aberto
      (hoje está desmarcado).
- [ ] **General → Pull Requests → Allow squash merging → Default commit message**:
      *Pull request title*. Com o padrão atual ("default message"), um PR de um
      commit só usa a mensagem do commit em vez do título, e o check `commits` não
      protegeria nada.
- [ ] **General → Pull Requests**: manter *Allow merge commits* ligado (é o método
      da promoção).
- [ ] Opcional: em **Branches**, exigir o check `commits` nos PRs para `dev`.

## 8. O que é verificado automaticamente

| Onde | O quê |
|---|---|
| PR para `dev`, check `commits` | título em conventional commits |
| PR para `dev`, check `versao (sincronia e cálculo)` | todos os arquivos com a versão do `.release-please-manifest.json`; testes do cálculo de versão e do beta sobre históricos de exemplo |
| PR de release em `main`, status `sincronia-de-versao` | a mesma sincronia, sobre os arquivos que o PR de release alterou |

Para rodar localmente:

```sh
cd scripts/version
npm ci
npm test            # cálculo de versão, beta, sincronia, título de PR
npm run sincronia   # só a sincronia
```

## Para quem mexer nos workflows

- A versão vive em `.release-please-manifest.json`. Os arquivos que a seguem são os
  `extra-files` de `release-please-config.json`: `src-tauri/Cargo.toml`,
  `crates/placar-core/Cargo.toml`, as duas entradas do workspace no `Cargo.lock`,
  `frontend/package.json`, `frontend/package-lock.json` e
  `src-tauri/tauri.conf.json`. Um crate novo no workspace precisa entrar ali; um
  teste reprova se faltar.
- Nunca edite a versão à mão nesses arquivos: o check de sincronia reprova.
- Tag e Release criados com o `GITHUB_TOKEN` **não disparam** outro workflow, e este
  projeto não usa token pessoal (PAT). Por isso o build de release tem de entrar
  como um job **dentro** de `release-please.yml` e de `beta.yml`, chamando
  `release.yml` via `workflow_call`. Os dois workflows já expõem as saídas
  (`release_created`, `tag_name`, `version`; e `tag`, `version`, `prerelease` no
  beta) e trazem, em comentário, o job pronto para descomentar.
- O cálculo local usa a mesma versão do release-please que a action (fixada por SHA
  em `release-please.yml`). Ao atualizar a action, atualize também
  `scripts/version/package.json`; um teste reprova se as duas divergirem.
