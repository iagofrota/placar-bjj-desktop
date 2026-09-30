# beta_sem_commits_liberaveis_nao_gera_versao

Critério: L4 · Teste: `scripts/version/test/beta.test.mjs`

```gherkin
Funcionalidade: Canal beta a partir de dev
  Como mantenedor do projeto
  Eu quero soltar betas numerados a partir de dev
  Para testar antes de liberar sem afetar o canal estável

  Cenário: beta_sem_commits_liberaveis_nao_gera_versao — Sem commit liberável não há beta
    Dado desde a última estável só entraram "chore:" e "docs:"
    Quando o beta é calculado
    Então não há versão beta
```
