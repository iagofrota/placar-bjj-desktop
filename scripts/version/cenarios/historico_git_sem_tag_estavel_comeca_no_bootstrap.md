# historico_git_sem_tag_estavel_comeca_no_bootstrap

Critério: L4 · Teste: `scripts/version/test/historico-git.test.mjs`

```gherkin
Funcionalidade: Beta calculado do git local
  Como mantenedor do projeto
  Eu quero que o beta leia o histórico real de dev
  Para o número sair dos commits desde a última versão estável

  Cenário: historico_git_sem_tag_estavel_comeca_no_bootstrap — Sem tag estável, o beta parte do marco da 0.1.0
    Dado um repositório git sem nenhuma tag estável
    E a config com bootstrap-sha apontando para o commit marco, depois de um "feat:" antigo
    Quando o histórico é lido
    Então só o "fix:" depois do marco entra
    E não há release nem tag de base
```
