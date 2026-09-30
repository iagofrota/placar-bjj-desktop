# cada_comando_invoca_o_ipc_de_mesmo_nome_com_os_argumentos

```gherkin
Funcionalidade: Cliente Tauri (tauri-client.ts)
  Cenário: cada comando invoca o ipc de mesmo nome com os argumentos
    Dado o cliente Tauri e o invoke mockado
    Quando o comportamento coberto pelo teste `cada_comando_invoca_o_ipc_de_mesmo_nome_com_os_argumentos` é exercido
    Então cada método chama o comando IPC de mesmo nome com os argumentos certos
```
