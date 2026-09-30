# trocar_idioma_muda_todo_o_texto_sem_chave_crua

```gherkin
Funcionalidade: Raiz do app
  Cenário: trocar o idioma muda todo o texto, sem chave crua
    Dado o App no board em pt_BR, com o botão "Encerrar luta"
    Quando o idioma muda para en
    Então o botão passa a "End match"
    Quando o idioma muda para es
    Então o botão passa a "Finalizar combate"
    E o DOM não contém "app_mesa" nem "undefined"
```
