# C3 — Validação do Setup (`can_start`)

Oráculo: `avulso.tsx:96-104` (`validDuration`) e `166-171` (`disabled` do botão).

```gherkin
Funcionalidade: Validação do Setup
  A luta só começa com nomes não vazios após trim e duração inteira de 1 a 20.

  Cenário: as sete entradas do critério
    Então nome branco vazio é recusado
    E nome só com espaços é recusado
    E duração 0 é recusada
    E duração 21 é recusada
    E duração 2.5 é recusada
    E nomes válidos com duração 1 são aceitos
    E nomes válidos com duração 20 são aceitos
```
