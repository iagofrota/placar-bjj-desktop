# tabela_traz_os_valores_exatos_da_identidade_do_placar

Teste: `frontend/src/styles/design-tokens.test.ts`

```gherkin
Funcionalidade: Tokens de cor do placar
  Como operador de mesa
  Eu quero as cores exatas da identidade da plataforma
  Para que o placar seja reconhecível e sem cor solta no código

  Cenário: A tabela traz os valores exatos da plataforma
    Dado a tabela de docs/design-tokens.md
    Quando converto o hex de cada token principal em RGB
    Então o resultado é o esperado: lados Branco e Azul, pontos, vantagem, punição, arena, paper e ink
```
