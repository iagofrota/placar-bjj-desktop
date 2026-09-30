# beta_parte_da_ultima_tag_estavel_mesmo_sem_back_merge

Critério: L4 · Teste: `scripts/version/test/beta.test.mjs`

```gherkin
Funcionalidade: Canal beta a partir de dev
  Como mantenedor do projeto
  Eu quero soltar betas numerados a partir de dev
  Para testar antes de liberar sem afetar o canal estável

  Cenário: beta_parte_da_ultima_tag_estavel_mesmo_sem_back_merge — O beta parte da última tag estável
    Dado o manifest de dev ainda diz 0.1.0
    E main já liberou v0.2.0 e v0.3.0
    Quando a base estável é calculada
    Então a base é 0.3.0, da tag v0.3.0
    E e o manifest só vence quando é maior que todas as tags
```
