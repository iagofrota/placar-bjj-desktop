# Checklist de release — verificação manual do PE

Itens que **não** bloqueiam a PR e **não** são simulados no CI: dependem de um
Windows real, com hardware e DPI de verdade. O PE roda antes da 1ª tag.

O gate automatizado da PR já cobre a escala **emulada** no Chromium (matriz de
layout de P8, via `deviceScaleFactor`) **e** a escala **real do GTK** no binário
Tauri real no Linux (`GDK_SCALE=1` e `GDK_SCALE=2`, confirmada pelo
`window.devicePixelRatio`). O que falta aqui é o **DPI real do SO** (Windows) e as
escalas intermediárias do GTK no Linux, que nenhum runner headless reproduz com
fidelidade.

## DPI real do SO (tarefa `app`)

Abrir o app no Windows e, para cada escala do sistema, conferir que todos os
controles do board cabem na janela, nenhum some ou transborda, e o texto fica
legível:

- [ ] Escala do Windows em **100%** — board completo visível, sem barra de rolagem.
- [ ] Escala do Windows em **125%** — idem.
- [ ] Escala do Windows em **150%** — idem.
- [ ] Escala do Windows em **200%** — idem.

## Escala real do GTK no Linux — intermediárias (tarefa `app`)

O CI já prova `GDK_SCALE=1` (100%) e `GDK_SCALE=2` (200%) no binário real. As
intermediárias que o GTK também aceita ficam para conferência manual, abrindo o
app com a variável no ambiente e conferindo que o board completo cabe, nada some
ou transborda, e o texto fica legível:

- [ ] `GDK_SCALE=1.25` (125%) — board completo visível, sem barra de rolagem.
- [ ] `GDK_SCALE=1.5` (150%) — idem.

## Janela entre monitores com DPI diferente (tarefa `app`)

- [ ] Com dois monitores em DPI diferentes (ex.: 100% e 150%), abrir o app num e
      **arrastar** a janela para o outro. O layout se reajusta sozinho ao novo DPI,
      **sem reabrir** o app, e nenhum controle fica cortado.

> As tarefas de distribuição (onda 4) acrescentam os itens de instalação, updater
> e AUR a este mesmo arquivo.
