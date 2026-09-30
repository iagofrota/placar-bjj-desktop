# submission_vazio_nao_confirma_preenchido_encerra

```gherkin
Funcionalidade: Diálogo de encerramento
  Cenário: finalização vazia não confirma e preenchida encerra
    Dado o diálogo de encerramento aberto no modo finalização
    Quando o campo do golpe está vazio
    Então o botão "Confirmar" fica desabilitado
    Quando o golpe é preenchido com "Armlock"
    Então "Confirmar" habilita, onEnd é chamado com ("submission", "white", "Armlock") e o diálogo fecha
```
