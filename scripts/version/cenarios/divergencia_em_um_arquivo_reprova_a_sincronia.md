# divergencia_em_um_arquivo_reprova_a_sincronia

Critério: L2 · Teste: `scripts/version/test/sincronia.test.mjs`

```gherkin
Funcionalidade: Sincronia de versão
  Como mantenedor do projeto
  Eu quero que a versão viva num lugar só
  Para o app, o frontend e o Cargo nunca divergirem

  Cenário: divergencia_em_um_arquivo_reprova_a_sincronia — Divergência em um arquivo reprova a sincronia
    Dado uma cópia do repositório
    E a versão alterada para 9.9.9 em só um arquivo de cada vez
    Quando a sincronia é checada
    Então ela reprova apontando exatamente o arquivo alterado
```
