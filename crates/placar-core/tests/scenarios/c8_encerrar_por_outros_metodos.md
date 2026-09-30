# C8 — Encerrar por submission/decision/dq/wo

Oráculo: `avulso.tsx:351-373` (`endBout`), Orientation Spec ("API do domínio":
nos métodos que não são `points` o vencedor vem do operador; `submission` exige
texto não vazio).

```gherkin
Funcionalidade: Encerramento pelos demais métodos
  Cenário: o vencedor é o informado
    Dado uma luta no board
    Quando encerro por decision informando o azul
    Então o azul vence
    Quando encerro por dq informando o branco
    Então o branco vence
    Quando encerro por wo informando o azul
    Então o azul vence
  Cenário: submission exige texto
    Quando encerro por submission sem texto
    Então é recusado
    Quando encerro por submission só com espaços
    Então é recusado
    Quando encerro por submission com "armlock"
    Então encerra, guarda "armlock" e o vencedor informado vence
```
