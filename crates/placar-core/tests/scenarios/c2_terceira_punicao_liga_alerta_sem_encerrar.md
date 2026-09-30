# C2 — Terceira punição liga alerta, sem encerrar

Oráculo: `avulso.tsx:328-336` (punição com clamp) e a regra de alerta na 3ª punição
(sinal, sem desclassificação automática — Orientation Spec, tarefa `placar-core`).

```gherkin
Funcionalidade: Alerta de terceira punição
  A partir da 3ª punição de um lado o estado sinaliza alerta naquele lado, sem
  declarar vencedor e sem encerrar a luta. Voltando a 2 punições, o alerta some.

  Cenário: alerta liga na 3ª punição e desliga ao corrigir para 2
    Dado uma luta no board com placar zerado
    Quando dou 3 punições ao azul
    Então o azul está em alerta
    E o branco não está em alerta
    E ninguém foi declarado vencedor e a luta continua no board
    Quando corrijo uma punição do azul
    Então o azul não está mais em alerta
```
