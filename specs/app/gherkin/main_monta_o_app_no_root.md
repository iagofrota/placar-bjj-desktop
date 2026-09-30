# main_monta_o_app_no_root

```gherkin
Funcionalidade: Bootstrap
  Cenário: o main monta o app no #root
    Dado um elemento #root no documento e os módulos do Tauri mockados
    Quando o módulo main é importado
    Então o app monta e a tela de setup ("Luta casada") aparece
```
