// L1 — o título do PR para dev vira a mensagem do commit; tem que ser conventional commit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseConventionalCommits } from 'release-please/build/src/commit.js';
import { validarTitulo } from '../lib/titulo-pr.mjs';
import { main as checarTituloCli } from '../bin/checar-titulo-pr.mjs';
import { saidaEmMemoria } from './apoio.mjs';

const VALIDOS = [
  'feat: versionamento semver automático',
  'fix(placar): punição não fica negativa',
  'feat!: novo formato de configuração',
  'refactor(core)!: separa o relógio',
  'docs: explica o fluxo de release',
  'chore: promove dev para main',
  'revert: desfaz o seletor de idioma',
];

const INVALIDOS = [
  'ajusta versionamento',
  'Feat: versionamento',
  'feat:versionamento',
  'feat : versionamento',
  'feature: versionamento',
  'feat: ',
  'feat(): versionamento',
  '',
];

test('titulo_conventional_e_aceito', () => {
  for (const titulo of VALIDOS) {
    assert.equal(validarTitulo(titulo).ok, true, titulo);
  }
});

test('titulo_fora_do_padrao_e_recusado', () => {
  for (const titulo of INVALIDOS) {
    const resultado = validarTitulo(titulo);
    assert.equal(resultado.ok, false, JSON.stringify(titulo));
    assert.match(resultado.motivo, /\S/);
  }
});

test('titulo_aceito_e_entendido_pelo_release_please', () => {
  for (const titulo of VALIDOS) {
    const [commit, ...resto] = parseConventionalCommits([{ sha: 'x', message: titulo, files: [] }]);
    assert.equal(resto.length, 0, titulo);
    assert.equal(commit.type, titulo.match(/^[a-z]+/)[0], titulo);
    assert.equal(commit.breaking, titulo.includes('!:'), titulo);
  }
});

test('cli_titulo_pr_devolve_codigo_de_saida', () => {
  const ruim = saidaEmMemoria();
  assert.equal(checarTituloCli({ titulo: 'ajusta versionamento', saida: ruim.escrever, erro: ruim.escrever }), 1);
  assert.match(ruim.texto(), /ajusta versionamento/);
  assert.match(ruim.texto(), /feat: /);

  const bom = saidaEmMemoria();
  assert.equal(checarTituloCli({ titulo: 'feat: versionamento semver automático', saida: bom.escrever, erro: bom.escrever }), 0);

  const ausente = saidaEmMemoria();
  assert.equal(checarTituloCli({ titulo: undefined, saida: ausente.escrever, erro: ausente.escrever }), 1);
});
