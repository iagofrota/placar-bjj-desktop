# Placar BJJ Desktop

Placar de Jiu-Jitsu Brasileiro para desktop, com a mesma identidade visual do
placar público da plataforma. É só um placar: marca pontos, vantagens,
punições e controla o tempo de uma luta avulsa. Não tem conta, login,
histórico nem qualquer conexão com a plataforma — é um app independente,
pensado para rodar numa mesa durante o evento.

Nesta primeira etapa (`scaffold`) o app ainda não tem as regras do placar —
só a janela abrindo com o frontend React. As próximas tarefas constroem o
placar em cima desta base.

## Pré-requisitos

- [Rust](https://www.rust-lang.org/tools/install) (toolchain `stable`, via `rustup`)
- [Node.js](https://nodejs.org/) 20 ou mais recente, com `npm`
- As [dependências de sistema do Tauri](https://tauri.app/start/prerequisites/)
  para o seu sistema operacional (no Linux, os pacotes de desenvolvimento do
  WebKitGTK; no Windows, o WebView2 — já vem instalado no Windows 10/11
  atualizados)
- O Tauri CLI: `cargo install tauri-cli --version "^2.0.0" --locked`

## Rodando em modo dev

```sh
cargo tauri dev
```

(Rode a partir da raiz do repositório — o Tauri CLI encontra `src-tauri/`
sozinho.)

Isso instala as dependências do frontend automaticamente na primeira vez,
sobe o Vite e abre a janela `Placar BJJ`.

## Testes

```sh
# Rust (workspace inteiro: crates/placar-core + src-tauri)
cargo test --workspace

# Frontend
cd frontend
npm install
npm test
```

## Estrutura do repositório

```text
crates/placar-core/   # domínio puro do placar (regras, cronômetro) — zero I/O, zero Tauri
src-tauri/            # app Tauri: janela, comandos IPC, ponte com o domínio
frontend/             # React + TypeScript + Vite + Tailwind — nunca calcula o placar
docs/                 # documentação de arquitetura, QA e analytics
LICENSES/             # licenças de terceiros (fontes e ícones)
```

## Licença

Código sob [MIT](./LICENSE), copyright Iago Olímpio Frota. As fontes e o
conjunto de ícones embutidos têm suas próprias licenças — ver
[`LICENSES/`](./LICENSES/README.md).
