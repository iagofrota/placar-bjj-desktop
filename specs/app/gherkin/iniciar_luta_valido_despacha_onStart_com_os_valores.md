# iniciar_luta_valido_despacha_onStart_com_os_valores

```gherkin
Funcionalidade: Tela de setup
  Cenário: "Iniciar luta" válido despacha onStart com os valores
    Dado a tela de setup preenchida com "Ana", "Bia" e "5"
    Quando o botão "Iniciar luta" (habilitado) é clicado
    Então onStart é chamado com ("Ana", "Bia", "5")
```
