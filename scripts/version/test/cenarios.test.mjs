// T3 — todo teste tem um cenário Gherkin em cenarios/<nome_do_teste>.md, e vice-versa.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PASTA_VERSAO } from './apoio.mjs';

function nomesDeTeste() {
  const pasta = path.join(PASTA_VERSAO, 'test');
  return fs
    .readdirSync(pasta)
    .filter((arquivo) => arquivo.endsWith('.test.mjs'))
    .flatMap((arquivo) => [...fs.readFileSync(path.join(pasta, arquivo), 'utf8').matchAll(/^test\('([^']+)'/gm)])
    .map((m) => m[1]);
}

test('cada_teste_tem_cenario_gherkin', () => {
  const testes = nomesDeTeste().sort();
  const cenarios = fs
    .readdirSync(path.join(PASTA_VERSAO, 'cenarios'))
    .filter((arquivo) => arquivo.endsWith('.md'))
    .map((arquivo) => arquivo.replace(/\.md$/, ''))
    .sort();
  assert.deepEqual(cenarios, testes);
  for (const nome of cenarios) {
    const conteudo = fs.readFileSync(path.join(PASTA_VERSAO, 'cenarios', `${nome}.md`), 'utf8');
    assert.match(conteudo, new RegExp(`Cenário: ${nome}\\b`), `${nome}.md tem que nomear o cenário igual ao teste`);
    for (const passo of ['Dado ', 'Quando ', 'Então ']) {
      assert.ok(conteudo.includes(passo), `${nome}.md sem "${passo.trim()}"`);
    }
  }
});
