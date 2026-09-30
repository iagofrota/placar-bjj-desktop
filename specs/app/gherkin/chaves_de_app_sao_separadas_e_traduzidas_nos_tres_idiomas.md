# chaves_de_app_sao_separadas_e_traduzidas_nos_tres_idiomas

```gherkin
Funcionalidade: i18n de app
  Cenário: as chaves de app são separadas e traduzidas nos três idiomas
    Dado o conjunto APP_KEYS (chaves próprias do app, fora as do placar)
    Quando se conferem os dicionários pt_BR, en e es
    Então APP_KEYS contém "app.language_label" e nenhum idioma tem chave de app faltando
    E o nome da língua "en" é "Inglês" em pt_BR, "English" em en e "Inglés" em es
```
