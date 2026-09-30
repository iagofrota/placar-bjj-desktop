# workflow_beta_publica_como_pre_release_e_nunca_latest

Critério: L4/L6 · Teste: `scripts/version/test/workflows.test.mjs`

```gherkin
Funcionalidade: Limites dos workflows de versão
  Como mantenedor do projeto
  Eu quero workflows que só usam o GITHUB_TOKEN e não publicam artefato
  Para o build de release se plugar depois sem PAT

  Cenário: workflow_beta_publica_como_pre_release_e_nunca_latest — O beta sai como pre-release e nunca latest
    Dado o workflow beta.yml e a config do release-please
    Quando o passo que cria o release é lido
    Então ele usa --prerelease e --latest=false
    E e o canal estável não está configurado como pre-release
```
