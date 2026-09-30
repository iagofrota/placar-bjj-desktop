# beta_ignora_tags_de_outro_alvo

Critério: L4 · Teste: `scripts/version/test/beta.test.mjs`

```gherkin
Funcionalidade: Canal beta a partir de dev
  Como mantenedor do projeto
  Eu quero soltar betas numerados a partir de dev
  Para testar antes de liberar sem afetar o canal estável

  Cenário: beta_ignora_tags_de_outro_alvo — Tags de outro alvo não contam
    Dado existem v0.1.1-beta.3, v0.2.0-beta.1, v0.2.0-beta.10, v0.2.0 e v0.2.0-rc.4
    Quando o próximo número de beta é pedido para 0.2.0 e para 0.3.0
    Então sai 11 para 0.2.0 e 1 para 0.3.0
```
