# titulo_conventional_e_aceito

Critério: L1 · Teste: `scripts/version/test/titulo-pr.test.mjs`

```gherkin
Funcionalidade: Título de PR em conventional commits
  Como mantenedor do projeto
  Eu quero recusar PR para dev com título fora do padrão
  Porque o título vira a mensagem de onde a versão é calculada

  Cenário: titulo_conventional_e_aceito — Título conventional é aceito
    Dado títulos como "feat: …", "fix(placar): …", "feat!: …" e "chore: promove dev para main"
    Quando cada título é validado
    Então todos são aceitos
```
