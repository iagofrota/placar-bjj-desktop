# valor_desconhecido_e_recusado

```gherkin
Funcionalidade: Marshalling de IPC (dto.rs)
  Cenário: valor desconhecido é recusado na desserialização
    Dado os DTOs de lado e de método
    Quando se tenta desserializar "green" como lado e "tap" como método
    Então a desserialização falha nos dois casos
```
