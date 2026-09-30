# format_clock_usa_dois_digitos

```gherkin
Funcionalidade: Retrato de estado (view.rs)
  Cenário: format_clock usa sempre dois dígitos
    Dado a função format_clock (segundos → mm:ss)
    Quando recebe 300, 59, 0, 600 e 605
    Então devolve "05:00", "00:59", "00:00", "10:00" e "10:05"
```
