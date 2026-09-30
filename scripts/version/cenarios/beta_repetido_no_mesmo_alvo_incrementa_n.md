# beta_repetido_no_mesmo_alvo_incrementa_n

Critério: L4 · Teste: `scripts/version/test/beta.test.mjs`

```gherkin
Funcionalidade: Canal beta a partir de dev
  Como mantenedor do projeto
  Eu quero soltar betas numerados a partir de dev
  Para testar antes de liberar sem afetar o canal estável

  Cenário: beta_repetido_no_mesmo_alvo_incrementa_n — Beta repetido no mesmo alvo
    Dado o próximo alvo estável é 0.2.0
    Quando o beta é calculado duas vezes, com a tag do primeiro já criada
    Então sai 0.2.0-beta.1 e depois 0.2.0-beta.2
```
