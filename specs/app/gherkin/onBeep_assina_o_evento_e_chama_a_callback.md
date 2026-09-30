# onBeep_assina_o_evento_e_chama_a_callback

```gherkin
Funcionalidade: Cliente Tauri (tauri-client.ts)
  Cenário: onBeep assina o evento e chama a callback
    Dado o cliente Tauri com listen mockado
    Quando onBeep registra um callback
    Então assina o evento "scoreboard://beep"
    E ao disparar o evento a callback é chamada
    E a função de retorno desassina exatamente uma vez
```
