# cada_comando_invoca_o_ipc_de_mesmo_nome_com_os_argumentos

```gherkin
Funcionalidade: Cliente Tauri (tauri-client.ts)
  Cenário: cada comando invoca o IPC de mesmo nome com os argumentos
    Dado o cliente Tauri sobre um invoke mockado
    Quando se chamam getState, canStart, start, mark, toggleClock, adjustClock, endBout, cancel e newBout
    Então cada um invoca o comando snake_case correspondente (get_state, can_start, start, mark, toggle_clock, adjust_clock, end_bout, cancel, new_bout)
    E os argumentos são repassados com os nomes esperados (side/kind/delta, adjust, method/winner/submission)
```
