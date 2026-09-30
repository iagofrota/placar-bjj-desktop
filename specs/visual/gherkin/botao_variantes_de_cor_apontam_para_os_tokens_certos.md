# botao_variantes_de_cor_apontam_para_os_tokens_certos

Teste: `frontend/src/components/ui/button.test.tsx`

```gherkin
Funcionalidade: Botão base
  Como operador de mesa
  Eu quero botões grandes e coloridos pelos tokens
  Para acertar o toque na mesa

  Cenário: Cada variante aponta para o token certo
    Dado as variantes green, gold, red e primary
    Quando leio as classes
    Então usam score-points, score-advantage, score-penalty e ink, e o dourado usa texto arena-black
```
