# layout_real_no_webkitgtk_cabe_e_mede_44px_na_escala_do_gtk

```gherkin
Funcionalidade: Layout no binário real (P8 b)
  Cenário: o layout no WebKitGTK real cabe e mede ≥ 44 px na escala do GTK
    Dado o app Tauri real no board, sob GDK_SCALE=1 ou GDK_SCALE=2 (escala real do GTK, não zoom CSS)
    Quando a janela é ajustada para 1366×768, 1920×1080, 2560×1440 e 1366×500
    Então em cada viewport o window.devicePixelRatio reportado é exatamente a escala do GDK_SCALE
    E há 26 controles, cada um mede ≥ 44 px nas duas dimensões e nenhum transborda o viewport (por getBoundingClientRect)
```
