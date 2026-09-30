# ajustes_e_toggle_despacham_os_comandos_do_relogio

```gherkin
Funcionalidade: Tela do board
  Cenário: ajustes e toggle despacham os comandos do relógio
    Dado o board renderizado com ações espiãs
    Quando se clica em "−10s" e depois em "+10s"
    Então adjustClock é chamado com "minus10" e "plus10"
    Quando se clica em "Iniciar cronômetro (espaço)"
    Então toggleClock é chamado
```
