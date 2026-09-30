# empate_total_por_pontos_mostra_mensagem_e_nao_fecha

```gherkin
Funcionalidade: Diálogo de encerramento
  Cenário: empate total por pontos mostra a mensagem e não fecha
    Dado o diálogo de encerramento, com o backend respondendo "tie"
    Quando se abre e se confirma por pontos
    Então onEnd é chamado com ("points", null, null)
    E aparece "Empate total: encerre por Decisão e escolha o vencedor."
    E o diálogo continua aberto
```
