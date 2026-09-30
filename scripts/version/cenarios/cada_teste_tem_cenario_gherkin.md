# cada_teste_tem_cenario_gherkin

Critério: T3 · Teste: `scripts/version/test/cenarios.test.mjs`

```gherkin
Funcionalidade: Documentação dos cenários
  Como QA
  Eu quero um cenário Gherkin para cada teste
  Para ler a regra sem abrir o código

  Cenário: cada_teste_tem_cenario_gherkin — Cada teste tem cenário
    Dado os testes em scripts/version/test e os arquivos em scripts/version/cenarios
    Quando os nomes são comparados
    Então há exatamente um cenário por teste, com o mesmo nome
    E e cada cenário tem Dado, Quando e Então
```
