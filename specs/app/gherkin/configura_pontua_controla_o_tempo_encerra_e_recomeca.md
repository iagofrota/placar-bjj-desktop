# configura_pontua_controla_o_tempo_encerra_e_recomeca

```gherkin
Funcionalidade: Fluxo completo (P1)
  Cenário: configurar, pontuar, controlar o tempo, encerrar e recomeçar (binário real)
    Dado o app Tauri real aberto no setup
    Quando se inicia "Ana" x "Bia" por 5 min e se marca no branco +2, +3, +4 e corrige a passagem
    Então o placar do branco vai 2 → 5 → 9 → 6 (clamp e valores de placar-core)
    Quando no azul se marca +2, duas vantagens, punição e corrige a punição
    Então o azul fica com 2 pontos
    Quando se usa −10s e +10s com o relógio parado
    Então o relógio vai "05:00" → "04:50" → "05:00"
    Quando se pausa e retoma pela barra de espaço e se encerra por pontos
    Então vence "Ana" pelo desempate do domínio (6 > 2) e a tela mostra "Luta encerrada · Pontos" e "Vencedor: Ana"
    Quando se clica em "Nova luta"
    Então volta ao setup zerado, sem board
```
