# percorre_setup_board_encerramento_pelo_estado_emitido

```gherkin
Funcionalidade: Raiz do app
  Cenário: o app percorre setup, board e encerramento pelo estado emitido
    Dado o App montado com o cliente no estado de setup
    Então a tela mostra o setup "Luta casada"
    Quando o backend emite o estado de board
    Então o placar do branco mostra "2" e o botão "+2 Queda / raspagem" existe nos dois lados
    Quando o backend emite o estado de encerramento
    Então a tela mostra "Vencedor: Ana"
```
