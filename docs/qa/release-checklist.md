# Checklist de release — verificação manual do PE

Itens que **não** bloqueiam a PR e **não** são simulados no CI: dependem de um
Windows real, com hardware e DPI de verdade. O PE roda antes da 1ª tag.

O gate automatizado da PR já cobre a escala **emulada** (matriz de layout de P8,
via `deviceScaleFactor` no Chromium). O que falta aqui é o **DPI real do SO**, que
nenhum runner headless reproduz com fidelidade.

## DPI real do SO (tarefa `app`)

Abrir o app no Windows e, para cada escala do sistema, conferir que todos os
controles do board cabem na janela, nenhum some ou transborda, e o texto fica
legível:

- [ ] Escala do Windows em **100%** — board completo visível, sem barra de rolagem.
- [ ] Escala do Windows em **125%** — idem.
- [ ] Escala do Windows em **150%** — idem.
- [ ] Escala do Windows em **200%** — idem.

## Janela entre monitores com DPI diferente (tarefa `app`)

- [ ] Com dois monitores em DPI diferentes (ex.: 100% e 150%), abrir o app num e
      **arrastar** a janela para o outro. O layout se reajusta sozinho ao novo DPI,
      **sem reabrir** o app, e nenhum controle fica cortado.

> As tarefas de distribuição (onda 4) acrescentam os itens de instalação, updater
> e AUR a este mesmo arquivo.
