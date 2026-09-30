# bootstrap_sha_da_config_esta_no_historico

Critério: L3 · Teste: `scripts/version/test/historico-git.test.mjs`

```gherkin
Funcionalidade: Beta calculado do git local
  Como mantenedor do projeto
  Eu quero que o marco da 0.1.0 exista de verdade no histórico
  Para um SHA digitado errado não fazer o cálculo ler o repositório inteiro

  Cenário: bootstrap_sha_da_config_esta_no_historico — O marco é ancestral do HEAD
    Dado o bootstrap-sha de release-please-config.json
    Quando o git confere se ele é ancestral do HEAD
    Então a conferência passa
```
