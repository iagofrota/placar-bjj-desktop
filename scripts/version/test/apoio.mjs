// Apoio compartilhado pelos testes: caminhos, fixtures e cópias temporárias do repositório.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PASTA_VERSAO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const RAIZ_REPO = path.resolve(PASTA_VERSAO, '..', '..');

export function carregarFixture(nome) {
  const arquivo = path.join(PASTA_VERSAO, 'fixtures', `${nome}.json`);
  return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

// Arquivos da raiz que o cálculo e a sincronia leem. Os de versão saem da própria config.
const ARQUIVOS_DE_CONTROLE = ['release-please-config.json', '.release-please-manifest.json', 'CHANGELOG.md'];

export function copiarRepoParaTemp() {
  const destino = fs.mkdtempSync(path.join(os.tmpdir(), 'versao-'));
  const config = JSON.parse(fs.readFileSync(path.join(RAIZ_REPO, 'release-please-config.json'), 'utf8'));
  const deVersao = config.packages['.']['extra-files'].map((extra) => extra.path);
  const workspace = ['Cargo.toml'];
  for (const relativo of new Set([...ARQUIVOS_DE_CONTROLE, ...deVersao, ...workspace])) {
    const alvo = path.join(destino, relativo);
    fs.mkdirSync(path.dirname(alvo), { recursive: true });
    fs.copyFileSync(path.join(RAIZ_REPO, relativo), alvo);
  }
  return destino;
}

export function trocarTexto(raiz, relativo, de, para) {
  const arquivo = path.join(raiz, relativo);
  const original = fs.readFileSync(arquivo, 'utf8');
  if (!original.includes(de)) throw new Error(`"${de}" não aparece em ${relativo}`);
  fs.writeFileSync(arquivo, original.replace(de, para));
}

export function saidaEmMemoria() {
  const linhas = [];
  return { escrever: (texto) => linhas.push(texto), texto: () => linhas.join('\n') };
}
