# beta_sem_tag_anterior_sai_beta_1

Critério: L4 · Teste: `scripts/version/test/beta.test.mjs`

```gherkin
Funcionalidade: Canal beta a partir de dev
  Como mantenedor do projeto
  Eu quero soltar betas numerados a partir de dev
  Para testar antes de liberar sem afetar o canal estável

  Cenário: beta_sem_tag_anterior_sai_beta_1 — Primeiro beta de um alvo
    Dado o próximo alvo estável é 0.2.0
    E não existe nenhum beta desse alvo
    Quando o beta é calculado
    Então sai 0.2.0-beta.1 com a tag v0.2.0-beta.1
```
