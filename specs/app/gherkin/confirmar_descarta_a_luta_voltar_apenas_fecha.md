# confirmar_descarta_a_luta_voltar_apenas_fecha

```gherkin
Funcionalidade: Diálogo de cancelar
  Cenário: confirmar descarta a luta e "Voltar" apenas fecha
    Dado o diálogo de cancelar
    Quando se clica em "Cancelar" e o diálogo abre ("Cancelar esta luta?")
    E se clica em "Voltar"
    Então o diálogo fecha sem chamar onConfirm
    Quando se reabre e se clica em "Cancelar luta"
    Então onConfirm é chamado uma vez e o diálogo fecha
```
