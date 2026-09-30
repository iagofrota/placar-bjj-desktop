# fluxo_completo_espelha_o_placar_core

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: o fluxo completo espelha o placar-core (oráculo)
    Dado uma sessão iniciada com "Ana", "Bia" e 5 minutos
    Quando marca +2 e +3 no branco, vantagem no azul, corrige −2 no branco e +punição no azul
    Então o branco tem 3 pontos (+2 +3 −2), o azul tem 1 vantagem e 1 punição
    E o mesmo resultado sai aplicando a mesma sequência direto no domínio (o oráculo)
```
