# C5 — Ajuste de ±10 s, com reancoragem quando rodando

Oráculo: `avulso.tsx:294-301` (`adjustClock`): `next = Math.max(0, remaining +
delta)`; se rodando, reancora `startedAt` — logo, sem salto. O clamp em zero é
`Math.max(0, …)` na linha 295.

```gherkin
Funcionalidade: Ajuste de tempo em ±10 s
  Cenário: +10 e −10 parado e rodando, e −10 abaixo de 10 s
    Dado uma luta de 5 min no board, com relógio falso
    Quando aplico +10 s com o relógio parado
    Então restam 5:10
    Quando aplico −10 s com o relógio parado
    Então voltam 5:00
    Quando inicio, avanço 20 s e aplico +10 s
    Então restam 4:50
    Quando aplico −10 s rodando
    Então restam 4:40
    Quando avanço mais 30 s
    Então restam 4:10 (sem salto: a reancoragem manteve a contagem contínua)
    Dado uma luta de 1 min rodando com 6 s restantes
    Quando aplico −10 s
    Então o restante para em 0 (nunca negativo, `avulso.tsx:295`)
```
