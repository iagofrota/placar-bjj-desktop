# cli_titulo_pr_devolve_codigo_de_saida

Critério: L1 · Teste: `scripts/version/test/titulo-pr.test.mjs`

```gherkin
Funcionalidade: Título de PR em conventional commits
  Como mantenedor do projeto
  Eu quero recusar PR para dev com título fora do padrão
  Porque o título vira a mensagem de onde a versão é calculada

  Cenário: cli_titulo_pr_devolve_codigo_de_saida — O check commits devolve código de saída
    Dado o título "ajusta versionamento", o título "feat: versionamento semver automático" e um título ausente
    Quando o comando do check roda com cada um
    Então sai 1, 0 e 1
    E e a recusa mostra o título e um exemplo válido
```
