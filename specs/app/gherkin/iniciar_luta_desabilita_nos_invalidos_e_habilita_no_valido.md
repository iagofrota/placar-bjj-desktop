# iniciar_luta_desabilita_nos_invalidos_e_habilita_no_valido

```gherkin
Funcionalidade: Tela de setup
  Cenário: "Iniciar luta" desabilita nos inválidos e habilita no válido
    Dado a tela de setup
    Quando se digita nome vazio, nome só com espaços, duração "2.5", "0" ou "21"
    Então o botão "Iniciar luta" fica desabilitado em cada caso
    Quando se digita "Ana", "Bia" e "5"
    Então o botão fica habilitado
```
