// L2 — a versão vive no manifest; todos os arquivos de versão da config a seguem.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { checarSincronia } from '../lib/sincronia.mjs';
import { main as checarSincroniaCli } from '../bin/checar-sincronia.mjs';
import { RAIZ_REPO, copiarRepoParaTemp, saidaEmMemoria, trocarTexto } from './apoio.mjs';

test('arquivos_de_versao_em_sincronia_no_repositorio', () => {
  const resultado = checarSincronia(RAIZ_REPO);
  assert.deepEqual(resultado.divergencias, []);
  assert.ok(resultado.arquivos.length >= 6, 'a config precisa listar os arquivos de versão');
});

test('divergencia_em_um_arquivo_reprova_a_sincronia', () => {
  const versao = checarSincronia(RAIZ_REPO).versao;
  const casos = [
    ['src-tauri/Cargo.toml', `version = "${versao}"`],
    ['crates/placar-core/Cargo.toml', `version = "${versao}"`],
    ['Cargo.lock', `name = "placar-core"\nversion = "${versao}"`],
    ['frontend/package.json', `"version": "${versao}"`],
    ['frontend/package-lock.json', `"version": "${versao}"`],
    ['src-tauri/tauri.conf.json', `"version": "${versao}"`],
  ];
  for (const [arquivo, trecho] of casos) {
    const raiz = copiarRepoParaTemp();
    trocarTexto(raiz, arquivo, trecho, trecho.replace(versao, '9.9.9'));
    const resultado = checarSincronia(raiz);
    assert.deepEqual(
      resultado.divergencias.map((d) => d.caminho),
      [arquivo],
      `mudar só ${arquivo} tem que reprovar só ${arquivo}`,
    );
  }
});

test('jsonpath_sem_correspondencia_reprova_a_sincronia', () => {
  const raiz = copiarRepoParaTemp();
  trocarTexto(raiz, 'release-please-config.json', '"$.version"', '"$.versao"');
  const resultado = checarSincronia(raiz);
  assert.ok(resultado.divergencias.length > 0);
  assert.deepEqual(resultado.divergencias[0].encontrado, []);
});

test('config_cobre_os_arquivos_de_versao_do_workspace', () => {
  const config = JSON.parse(fs.readFileSync(path.join(RAIZ_REPO, 'release-please-config.json'), 'utf8'));
  const extras = config.packages['.']['extra-files'];
  const caminhos = new Set(extras.map((extra) => extra.path));
  // Os quatro arquivos que o contrato "Fonte única de versão" nomeia.
  for (const exigido of ['src-tauri/Cargo.toml', 'Cargo.lock', 'frontend/package.json', 'src-tauri/tauri.conf.json']) {
    assert.ok(caminhos.has(exigido), `${exigido} fora da config`);
  }
  // Todo membro do workspace Cargo: o Cargo.toml dele e a entrada dele no Cargo.lock.
  const workspace = fs.readFileSync(path.join(RAIZ_REPO, 'Cargo.toml'), 'utf8');
  const membros = JSON.parse(workspace.match(/members\s*=\s*(\[[^\]]*\])/)[1]);
  for (const membro of membros) {
    const manifesto = fs.readFileSync(path.join(RAIZ_REPO, membro, 'Cargo.toml'), 'utf8');
    const nome = manifesto.match(/^name\s*=\s*"([^"]+)"/m)[1];
    assert.ok(caminhos.has(`${membro}/Cargo.toml`), `${membro}/Cargo.toml fora da config`);
    assert.ok(
      extras.some((extra) => extra.path === 'Cargo.lock' && extra.jsonpath.includes(`'${nome}'`)),
      `entrada de ${nome} no Cargo.lock fora da config`,
    );
  }
  assert.ok(caminhos.has('frontend/package-lock.json'), 'frontend/package-lock.json fora da config');
});

test('cli_sincronia_devolve_codigo_de_saida', () => {
  const ok = saidaEmMemoria();
  assert.equal(checarSincroniaCli({ raiz: RAIZ_REPO, saida: ok.escrever, erro: ok.escrever }), 0);
  assert.match(ok.texto(), /em sincronia/);

  const versao = checarSincronia(RAIZ_REPO).versao;
  const raiz = copiarRepoParaTemp();
  trocarTexto(raiz, 'frontend/package.json', `"version": "${versao}"`, '"version": "9.9.9"');
  const falha = saidaEmMemoria();
  assert.equal(checarSincroniaCli({ raiz, saida: falha.escrever, erro: falha.escrever }), 1);
  assert.match(falha.texto(), /frontend\/package\.json/);
  assert.match(falha.texto(), /9\.9\.9/);
});
