# config_cobre_os_arquivos_de_versao_do_workspace

Critério: L2 · Teste: `scripts/version/test/sincronia.test.mjs`

```gherkin
Funcionalidade: Sincronia de versão
  Como mantenedor do projeto
  Eu quero que a versão viva num lugar só
  Para o app, o frontend e o Cargo nunca divergirem

  Cenário: config_cobre_os_arquivos_de_versao_do_workspace — A config cobre todo arquivo que carrega versão
    Dado os membros do workspace Cargo e os arquivos do frontend e do Tauri
    Quando a config do release-please é lida
    Então src-tauri/Cargo.toml, Cargo.lock, frontend/package.json e src-tauri/tauri.conf.json estão nela
    E cada membro do workspace tem o Cargo.toml e a entrada do Cargo.lock nela
```
