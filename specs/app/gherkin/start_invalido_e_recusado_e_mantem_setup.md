# start_invalido_e_recusado_e_mantem_setup

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: start inválido é recusado e mantém o setup
    Dado uma sessão nova com o relógio em 0
    Quando start é chamado com o nome branco vazio
    Então devolve Err(InvalidSetup)
    E o estágio da sessão continua em Setup
```
