# controles_cabem_e_medem_44px_em_toda_a_matriz_de_layout

```gherkin
Funcionalidade: Matriz de layout (P8)
  Cenário: os controles cabem e medem ≥ 44 px em toda a matriz de layout
    Dado a harness de layout do board no Chromium (motor do WebView2 do Windows)
    Quando é aberta em 1366×768, 1920×1080, 2560×1440 e 1366×500, cada um a 100, 125, 150 e 200% (deviceScaleFactor)
    Então em cada combinação há 26 controles e o devicePixelRatio bate com a escala
    E cada controle mede ≥ 44 px nas duas dimensões e nenhum transborda o viewport (por getBoundingClientRect)
```
