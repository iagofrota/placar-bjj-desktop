# espaco_com_dialogo_aberto_nao_alterna

```gherkin
Funcionalidade: Atalho de espaço
  Cenário: espaço com diálogo aberto não alterna
    Dado o atalho de espaço registrado
    Quando a barra de espaço é pressionada com o foco dentro de um elemento role="dialog"
    Então o toggle não é chamado
```
