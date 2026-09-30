# encerramento_por_submission_traz_texto_e_vencedor_do_operador

```gherkin
Funcionalidade: Retrato de estado (view.rs)
  Cenário: o encerramento por finalização traz o texto e o vencedor do operador
    Dado uma partida iniciada
    Quando é encerrada por finalização com o azul como vencedor e o golpe "Armlock"
    Então o método é "submission", o vencedor é "blue" (Bia) e a finalização é "Armlock"
```
