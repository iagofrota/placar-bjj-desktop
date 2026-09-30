# so_chore_e_docs_nao_gera_versao

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: so_chore_e_docs_nao_gera_versao — Só manutenção e documentação não gera versão
    Dado a última versão publicada é 0.1.0
    E desde ela só entraram commits "chore:" e "docs:"
    Quando o cálculo roda sobre o fixture "so-chore-docs"
    Então nenhum PR de release é proposto e não há versão nova
```
