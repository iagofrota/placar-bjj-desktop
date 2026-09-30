# as_acoes_chamam_os_comandos_do_cliente

```gherkin
Funcionalidade: Hook do placar
  Cenário: as ações do hook chamam os comandos do cliente
    Dado o hook montado no board
    Quando se chamam as ações mark, toggleClock, adjustClock, cancel e start
    Então o cliente recebe mark ("white","point2","add"), adjustClock ("plus10") e start ("Ana","Bia","5")
```
