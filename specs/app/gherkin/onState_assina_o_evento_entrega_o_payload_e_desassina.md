# onState_assina_o_evento_entrega_o_payload_e_desassina

```gherkin
Funcionalidade: Cliente Tauri (tauri-client.ts)
  Cenário: onState assina o evento, entrega o payload e desassina
    Dado o cliente Tauri com listen mockado
    Quando onState registra um callback
    Então assina o evento "scoreboard://state"
    E ao disparar o evento o payload chega ao callback
    E chamar a função de retorno desassina exatamente uma vez
```
