# arquivos_de_versao_em_sincronia_no_repositorio

Critério: L2 · Teste: `scripts/version/test/sincronia.test.mjs`

```gherkin
Funcionalidade: Sincronia de versão
  Como mantenedor do projeto
  Eu quero que a versão viva num lugar só
  Para o app, o frontend e o Cargo nunca divergirem

  Cenário: arquivos_de_versao_em_sincronia_no_repositorio — Arquivos de versão em sincronia
    Dado o manifest e os arquivos listados em extra-files do repositório
    Quando a sincronia é checada
    Então não há divergência
```
