// L4 e L6 — o que os workflows desta entrega podem e não podem fazer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { PASTA_VERSAO, RAIZ_REPO } from './apoio.mjs';

const WORKFLOWS = ['commits.yml', 'release-please.yml', 'beta.yml'];

function texto(nome) {
  return fs.readFileSync(path.join(RAIZ_REPO, '.github', 'workflows', nome), 'utf8');
}

function passos(nome) {
  const workflow = YAML.parse(texto(nome));
  return Object.values(workflow.jobs).flatMap((job) => job.steps ?? []);
}

test('workflow_beta_publica_como_pre_release_e_nunca_latest', () => {
  const criacao = passos('beta.yml').filter((passo) => /gh release create/.test(passo.run ?? ''));
  assert.equal(criacao.length, 1, 'um único passo cria o release beta');
  assert.match(criacao[0].run, /--prerelease(\s|$)/);
  assert.match(criacao[0].run, /--latest=false/);
  const config = JSON.parse(fs.readFileSync(path.join(RAIZ_REPO, 'release-please-config.json'), 'utf8'));
  assert.notEqual(config.prerelease, true, 'o canal estável não pode sair como pre-release');
  assert.notEqual(config.packages['.'].prerelease, true);
});

test('workflow_beta_so_roda_a_partir_de_dev', () => {
  const workflow = YAML.parse(texto('beta.yml'));
  assert.deepEqual(Object.keys(workflow.on), ['workflow_dispatch']);
  const guarda = passos('beta.yml').find((passo) => /refs\/heads\/dev/.test(passo.run ?? ''));
  assert.ok(guarda, 'um passo recusa o disparo fora de dev');
  assert.match(guarda.run, /exit 1/);
});

test('workflow_commits_reage_a_edicao_do_titulo', () => {
  const workflow = YAML.parse(texto('commits.yml'));
  const evento = workflow.on.pull_request;
  assert.deepEqual(evento.branches, ['dev']);
  for (const tipo of ['opened', 'edited', 'synchronize', 'reopened']) {
    assert.ok(evento.types.includes(tipo), `falta o tipo ${tipo}`);
  }
  assert.equal(workflow.jobs.commits.name, 'commits');
  const passo = workflow.jobs.commits.steps.find((p) => /checar-titulo-pr/.test(p.run ?? ''));
  // O título entra por variável de ambiente, nunca interpolado no script (injeção).
  assert.equal(passo.env.PR_TITLE, '${{ github.event.pull_request.title }}');
  assert.doesNotMatch(passo.run, /\$\{\{/);
});

test('workflows_so_usam_github_token', () => {
  for (const nome of WORKFLOWS) {
    const segredos = [...texto(nome).matchAll(/secrets\.([A-Za-z0-9_]+)/g)].map((m) => m[1]);
    assert.deepEqual([...new Set(segredos)].filter((s) => s !== 'GITHUB_TOKEN'), [], nome);
  }
});

test('workflows_nao_buildam_nem_publicam_artefato', () => {
  const proibidos = [/tauri build/, /tauri-action/, /upload-artifact/, /gh release upload/, /upload_url/, /uses:\s*\.\/\.github\/workflows\/release\.yml/];
  for (const nome of WORKFLOWS) {
    const conteudo = texto(nome)
      .split('\n')
      .filter((linha) => !linha.trim().startsWith('#'))
      .join('\n');
    for (const padrao of proibidos) {
      assert.doesNotMatch(conteudo, padrao, `${nome} não pode ter ${padrao}`);
    }
  }
});

test('release_please_expoe_saidas_para_o_build', () => {
  const workflow = YAML.parse(texto('release-please.yml'));
  const saidas = workflow.jobs['release-please'].outputs;
  for (const saida of ['release_created', 'tag_name', 'version']) {
    assert.ok(saidas[saida], `release-please.yml precisa expor ${saida}`);
  }
  const beta = YAML.parse(texto('beta.yml')).jobs.beta.outputs;
  for (const saida of ['tag', 'version', 'prerelease']) {
    assert.ok(beta[saida], `beta.yml precisa expor ${saida}`);
  }
});

test('action_do_release_please_fixada_na_mesma_versao_do_calculo', () => {
  const pacote = JSON.parse(fs.readFileSync(path.join(PASTA_VERSAO, 'package.json'), 'utf8'));
  const uso = texto('release-please.yml').match(
    /uses:\s*googleapis\/release-please-action@([0-9a-f]{40})\s*#\s*v[\d.]+ \(release-please ([\d.]+)\)/,
  );
  assert.ok(uso, 'a action tem que estar fixada por SHA, com a versão do release-please no comentário');
  assert.equal(uso[2], pacote.devDependencies['release-please']);
});
