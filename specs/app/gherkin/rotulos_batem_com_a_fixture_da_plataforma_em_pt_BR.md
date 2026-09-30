# rotulos_batem_com_a_fixture_da_plataforma_em_pt_BR

```gherkin
Funcionalidade: Contrato dos controles
  Cenário: os rótulos batem com a fixture da plataforma em pt_BR
    Dado a lista de nomes de controle do board em pt_BR
    Quando se confere contra os rótulos de scoreboard.fixture.ts:48-64
    Então cada um dos 10 rótulos de lado aparece duas vezes (branco e azul)
    E os 6 da página existem: "Iniciar cronômetro (espaço)", "−10s", "+10s", "Cancelar", "Encerrar luta" e um "Tempo restante:"
```
