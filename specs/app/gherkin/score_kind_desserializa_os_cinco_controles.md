# score_kind_desserializa_os_cinco_controles

```gherkin
Funcionalidade: Marshalling de IPC (dto.rs)
  Cenário: ScoreKind desserializa os cinco tipos de marcação
    Dado o DTO de tipo de marcação
    Quando se desserializa "point2", "point3", "point4", "advantage" e "penalty"
    Então cada um vira o ScoreKindDto correspondente
    E a conversão para o domínio preserva o tipo
```
