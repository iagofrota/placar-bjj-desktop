# submission_vazio_recusa_preenchido_encerra

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: finalização vazia é recusada e preenchida encerra
    Dado uma sessão iniciada
    Quando se encerra por finalização com o texto só de espaços
    Então devolve Err(EmptySubmission)
    Quando se encerra por finalização com "Armlock"
    Então encerra e o resultado guarda a finalização "Armlock"
```
