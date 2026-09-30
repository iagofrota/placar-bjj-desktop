# delta_e_ajuste_e_metodo_convertem

```gherkin
Funcionalidade: Marshalling de IPC (dto.rs)
  Cenário: delta, ajuste de relógio e método convertem para o domínio
    Dado os DTOs de delta, ajuste de relógio e método de encerramento
    Quando se converte Remove, Minus10 e Wo para o domínio
    Então viram Delta::Remove, ClockAdjust::Minus10 e EndMethod::Wo
    E "plus10" e "submission" desserializam como Plus10 e Submission
```
