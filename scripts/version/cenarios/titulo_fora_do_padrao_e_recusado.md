# titulo_fora_do_padrao_e_recusado

Critério: L1 · Teste: `scripts/version/test/titulo-pr.test.mjs`

```gherkin
Funcionalidade: Título de PR em conventional commits
  Como mantenedor do projeto
  Eu quero recusar PR para dev com título fora do padrão
  Porque o título vira a mensagem de onde a versão é calculada

  Cenário: titulo_fora_do_padrao_e_recusado — Título fora do padrão é recusado
    Dado títulos como "ajusta versionamento", "Feat: …", "feat:…", "feature: …" e vazio
    Quando cada título é validado
    Então todos são recusados com o motivo
```
