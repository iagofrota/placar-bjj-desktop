# C6 — Expiração pausa sozinha e bipa uma única vez

Oráculo: `avulso.tsx:252-262` (auto-pausa na expiração, com `expired` travando o
beep). O sinal de "últimos 30 s" liga em `remaining <= 30`.

```gherkin
Funcionalidade: Expiração do cronômetro
  Cenário: sinal de 30 s, auto-pausa e beep único
    Dado uma luta de 1 min no board, iniciada, com relógio falso
    Quando faltam 31 s
    Então o sinal de "últimos 30 s" está desligado
    Quando faltam 30 s
    Então o sinal de "últimos 30 s" está ligado
    Quando o tempo zera (tick)
    Então o beep soa uma vez, o relógio pausa e a expiração fica marcada
    Quando faço vários ticks depois de zerar
    Então o beep não soa de novo (uma única vez em N consultas) e segue pausado
```
