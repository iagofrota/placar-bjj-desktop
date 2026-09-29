# crate_compila_e_testes_rodam

Teste: `crates/placar-core/src/lib.rs` (`mod tests`)

```gherkin
Funcionalidade: Esqueleto do crate de domínio
  Como desenvolvedora que vai implementar as regras do placar na próxima onda
  Eu quero que o crate placar-core exista, compile e rode testes
  Para ter uma base sobre a qual construir sem I/O nem dependência de Tauri

  Cenário: Crate compila e a suíte de testes roda
    Dado que o crate placar-core faz parte do workspace Cargo
    Quando "cargo test --workspace" é executado
    Então o crate compila sem erros e ao menos um teste passa
```

