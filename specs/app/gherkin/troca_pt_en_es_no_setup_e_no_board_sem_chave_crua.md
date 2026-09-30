# troca_pt_en_es_no_setup_e_no_board_sem_chave_crua

```gherkin
Funcionalidade: i18n das telas (P9)
  Cenário: troca pt/en/es no setup e no board, sem chave crua (binário real)
    Dado o app Tauri real aberto no setup
    Quando o idioma muda entre pt_BR, en e es no setup
    Então o texto acompanha ("Luta casada" → "Ad-hoc match" → "Combate libre")
    Quando uma luta é iniciada e o idioma muda no board
    Então o botão de encerrar acompanha ("Encerrar luta" → "End match" → "Finalizar combate")
    E em nenhum momento vaza "app_mesa." ou "undefined" no DOM
```
