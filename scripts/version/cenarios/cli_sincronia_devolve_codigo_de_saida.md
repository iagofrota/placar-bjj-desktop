# cli_sincronia_devolve_codigo_de_saida

Critério: L2 · Teste: `scripts/version/test/sincronia.test.mjs`

```gherkin
Funcionalidade: Sincronia de versão
  Como mantenedor do projeto
  Eu quero que a versão viva num lugar só
  Para o app, o frontend e o Cargo nunca divergirem

  Cenário: cli_sincronia_devolve_codigo_de_saida — O comando de sincronia devolve código de saída
    Dado o repositório em sincronia e uma cópia com frontend/package.json em 9.9.9
    Quando o comando de sincronia roda nos dois
    Então sai 0 no primeiro e 1 no segundo, citando o arquivo e o valor divergente
```
