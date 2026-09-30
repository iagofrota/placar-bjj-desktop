# C7 — Encerrar por pontos, com desempate e empate total

Oráculo: `avulso.tsx:358-369` (`endBout` método `points`). Ordem: mais pontos →
mais vantagens → **menos** punições. Empate total devolve erro e a luta continua
aberta.

```gherkin
Funcionalidade: Encerramento por pontos
  Cenário: pontos diferentes
    Dado o branco com mais pontos que o azul
    Quando encerro por pontos
    Então o branco vence
  Cenário: pontos iguais, vantagens diferentes
    Dado pontos iguais e o azul com mais vantagens
    Quando encerro por pontos
    Então o azul vence
  Cenário: pontos e vantagens iguais, punições diferentes
    Dado pontos e vantagens iguais e o branco com menos punições
    Quando encerro por pontos
    Então o branco vence (menos punições)
  Cenário: empate total
    Dado tudo igual
    Quando encerro por pontos
    Então recebo erro de empate e a luta continua no board
```
