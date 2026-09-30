// L4 — o beta lê o histórico do git local: commits desde a última tag estável.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { lerHistoricoGit } from '../lib/historico-git.mjs';
import { main as versaoBetaCli } from '../bin/versao-beta.mjs';
import { RAIZ_REPO, saidaEmMemoria } from './apoio.mjs';

function repoGit() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'historico-'));
  const git = (...args) =>
    execFileSync('git', args, {
      cwd: dir,
      encoding: 'utf8',
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'Teste',
        GIT_AUTHOR_EMAIL: 'teste@example.com',
        GIT_COMMITTER_NAME: 'Teste',
        GIT_COMMITTER_EMAIL: 'teste@example.com',
        GIT_CONFIG_GLOBAL: '/dev/null',
        GIT_CONFIG_NOSYSTEM: '1',
      },
    }).trim();
  git('init', '-q', '-b', 'dev');
  for (const arquivo of ['release-please-config.json', '.release-please-manifest.json']) {
    fs.copyFileSync(path.join(RAIZ_REPO, arquivo), path.join(dir, arquivo));
  }
  // O manifest de dev fica em 0.1.0 de propósito: main já liberou v0.2.0 sem voltar para dev.
  fs.writeFileSync(path.join(dir, '.release-please-manifest.json'), '{\n  ".": "0.1.0"\n}\n');
  const commit = (mensagem) => git('commit', '-q', '--allow-empty', '-m', mensagem);
  git('add', '.');
  commit('chore: initial commit');
  commit('feat: seletor de idioma');
  git('tag', 'v0.2.0');
  commit('fix: relógio não pausa ao zerar');
  git('tag', 'v0.2.1-beta.1');
  commit('docs: explica o beta');
  return { dir, git };
}

test('historico_git_le_commits_desde_a_ultima_tag_estavel', () => {
  const { dir, git } = repoGit();
  const historico = lerHistoricoGit(dir);
  assert.deepEqual(
    historico.commits.map((c) => c.message.trim()),
    ['docs: explica o beta', 'fix: relógio não pausa ao zerar'],
  );
  assert.deepEqual(historico.releases, [{ tagName: 'v0.2.0', sha: git('rev-list', '-n1', 'v0.2.0') }]);
  assert.equal(historico.versaoPublicada, '0.2.0');
  assert.deepEqual([...historico.tags].sort(), ['v0.2.0', 'v0.2.1-beta.1']);
});

test('historico_git_sem_tag_estavel_comeca_no_bootstrap', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'historico-'));
  const git = (...args) =>
    execFileSync('git', args, {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, GIT_AUTHOR_NAME: 'T', GIT_AUTHOR_EMAIL: 't@example.com', GIT_COMMITTER_NAME: 'T', GIT_COMMITTER_EMAIL: 't@example.com', GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' },
    }).trim();
  git('init', '-q', '-b', 'dev');
  git('commit', '-q', '--allow-empty', '-m', 'feat: scaffold do app desktop');
  git('commit', '-q', '--allow-empty', '-m', 'chore: marco da 0.1.0');
  const marco = git('rev-parse', 'HEAD');
  const config = JSON.parse(fs.readFileSync(path.join(RAIZ_REPO, 'release-please-config.json'), 'utf8'));
  fs.writeFileSync(path.join(dir, 'release-please-config.json'), JSON.stringify({ ...config, 'bootstrap-sha': marco }));
  fs.writeFileSync(path.join(dir, '.release-please-manifest.json'), '{ ".": "0.1.0" }');
  git('add', '.');
  git('commit', '-q', '-m', 'fix: relógio não pausa ao zerar');
  const historico = lerHistoricoGit(dir);
  assert.deepEqual(historico.commits.map((c) => c.message.trim()), ['fix: relógio não pausa ao zerar']);
  assert.deepEqual(historico.releases, []);
  assert.equal(historico.tagBase, null);
});

test('bootstrap_sha_da_config_esta_no_historico', () => {
  const config = JSON.parse(fs.readFileSync(path.join(RAIZ_REPO, 'release-please-config.json'), 'utf8'));
  // Sai 0 só se o marco for ancestral do HEAD; um SHA digitado errado reprova aqui.
  execFileSync('git', ['merge-base', '--is-ancestor', config['bootstrap-sha'], 'HEAD'], { cwd: RAIZ_REPO });
});

test('cli_versao_beta_imprime_saidas_do_github', async () => {
  const { dir, git } = repoGit();
  const saida = saidaEmMemoria();
  const codigo = await versaoBetaCli({ raiz: dir, saida: saida.escrever, erro: saida.escrever });
  assert.equal(codigo, 0);
  assert.deepEqual(saida.texto().split('\n'), [
    'version=0.2.1-beta.2',
    'tag=v0.2.1-beta.2',
    'base_tag=v0.2.0',
  ]);

  // Sem nada liberável desde a última estável, o beta é recusado com erro explícito.
  git('tag', 'v0.2.1');
  const vazio = saidaEmMemoria();
  assert.equal(await versaoBetaCli({ raiz: dir, saida: vazio.escrever, erro: vazio.escrever }), 1);
  assert.match(vazio.texto(), /nenhum commit/i);
});
