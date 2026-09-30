# tem_exatamente_os_26_controles_com_os_rotulos_da_fixture

```gherkin
Funcionalidade: Tela do board
  Cenário: o board tem exatamente os 26 controles com os rótulos da fixture
    Dado o board renderizado com um estado de placar e diálogos fechados
    Quando se contam os botões
    Então há exatamente 26
    E cada rótulo do contrato existe (o do tempo casa pelo prefixo "Tempo restante:")
```
