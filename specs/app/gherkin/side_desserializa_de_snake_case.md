# side_desserializa_de_snake_case

```gherkin
Funcionalidade: Marshalling de IPC (dto.rs)
  Cenário: Side desserializa de snake_case
    Dado o DTO de lado vindo do IPC
    Quando se desserializa "white" e "blue"
    Então viram SideDto::White e SideDto::Blue
    E a conversão para o domínio devolve o Side correspondente
```
