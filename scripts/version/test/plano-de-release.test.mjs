// L3 — cálculo da próxima versão com a biblioteca do release-please, sobre históricos fixture.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { planejarRelease } from '../lib/plano-de-release.mjs';
import { checarSincronia } from '../lib/sincronia.mjs';
import { RAIZ_REPO, carregarFixture, copiarRepoParaTemp } from './apoio.mjs';

async function versaoDoFixture(nome) {
  const plano = await planejarRelease({ raiz: RAIZ_REPO, ...carregarFixture(nome) });
  return plano.versao;
}

test('fix_gera_patch', async () => {
  assert.equal(await versaoDoFixture('so-fix'), '0.1.1');
});

test('feat_gera_minor', async () => {
  assert.equal(await versaoDoFixture('com-feat'), '0.2.0');
});

test('breaking_com_exclamacao_antes_de_1_0_gera_minor', async () => {
  assert.equal(await versaoDoFixture('breaking-exclamacao'), '0.2.0');
});

test('breaking_change_no_rodape_antes_de_1_0_gera_minor', async () => {
  assert.equal(await versaoDoFixture('breaking-rodape'), '0.2.0');
});

test('perf_e_revert_geram_patch', async () => {
  assert.equal(await versaoDoFixture('perf-revert'), '0.1.1');
});

test('so_chore_e_docs_nao_gera_versao', async () => {
  assert.equal(await versaoDoFixture('so-chore-docs'), null);
});

test('commits_anteriores_ao_ultimo_release_nao_contam', async () => {
  assert.equal(await versaoDoFixture('apos-release'), '0.2.1');
});

test('beta_publicado_nao_altera_a_versao_estavel', async () => {
  // Se o beta contasse como último release, só o fix depois dele entraria (0.3.0-beta.x → patch).
  assert.equal(await versaoDoFixture('beta-publicado'), '0.3.0');
});

test('promocao_por_merge_commit_preserva_os_commits_de_dev', async () => {
  assert.equal(await versaoDoFixture('promocao-merge-commit'), '0.2.0');
});

test('promocao_por_squash_perde_a_versao', async () => {
  // Mesmos commits do fixture de merge commit, mas achatados num squash: a versão some.
  assert.equal(await versaoDoFixture('promocao-squash'), null);
});

test('titulo_feat_no_pr_de_promocao_soma_um_minor', async () => {
  // Só havia um fix, mas o título "feat: …" do PR de promoção entra no corpo do merge commit.
  assert.equal(await versaoDoFixture('promocao-titulo-feat'), '0.2.0');
});

test('sem_release_publicado_o_historico_comeca_no_bootstrap', async () => {
  // Sem nenhuma versão publicada, o que veio antes do marco da 0.1.0 (bootstrap-sha) já é a 0.1.0.
  const config = JSON.parse(fs.readFileSync(path.join(RAIZ_REPO, 'release-please-config.json'), 'utf8'));
  const marco = config['bootstrap-sha'];
  assert.match(marco ?? '', /^[0-9a-f]{40}$/, 'a config precisa de bootstrap-sha');
  const commits = [
    { sha: 'c2', message: 'fix: relógio não pausa ao zerar' },
    { sha: marco, message: 'Merge pull request #2 from iagofrota/fix/scaffold-dev-dependencies' },
    { sha: 'c1', message: 'feat: scaffold do app desktop' },
  ];
  const plano = await planejarRelease({ raiz: RAIZ_REPO, commits, versaoPublicada: '0.1.0' });
  assert.equal(plano.versao, '0.1.1');
});

test('pr_de_release_atualiza_todos_os_arquivos_de_versao', async () => {
  // Parte da versão real do manifest (sem override), para os arquivos mudarem de fato.
  const raiz = copiarRepoParaTemp();
  const atual = checarSincronia(raiz).versao;
  const [maior, menor] = atual.split('.').map(Number);
  const esperada = maior === 0 ? `0.${menor + 1}.0` : `${maior}.${menor + 1}.0`;
  const { commits } = carregarFixture('com-feat');
  const plano = await planejarRelease({ raiz, commits });
  assert.equal(plano.versao, esperada);
  const config = JSON.parse(fs.readFileSync(path.join(raiz, 'release-please-config.json'), 'utf8'));
  const esperados = new Set([
    '.release-please-manifest.json',
    'CHANGELOG.md',
    ...config.packages['.']['extra-files'].map((extra) => extra.path),
  ]);
  const alterados = new Set();
  for (const { caminho, antes, depois } of plano.atualizacoes) {
    if (antes !== depois) alterados.add(caminho);
    fs.writeFileSync(path.join(raiz, caminho), depois);
  }
  assert.deepEqual([...alterados].sort(), [...esperados].sort());
  const sincronia = checarSincronia(raiz);
  assert.equal(sincronia.versao, esperada);
  assert.deepEqual(sincronia.divergencias, []);
});

test('changelog_usa_secoes_em_portugues', async () => {
  const plano = await planejarRelease({ raiz: RAIZ_REPO, ...carregarFixture('com-feat') });
  const changelog = plano.atualizacoes.find((a) => a.caminho === 'CHANGELOG.md');
  // O cabeçalho e a introdução ficam no topo; a entrada nova entra antes da 0.1.0.
  assert.match(changelog.depois, /^# Changelog\n\nTodas as mudanças relevantes/);
  assert.ok(changelog.depois.indexOf('## [0.2.0]') < changelog.depois.indexOf('## 0.1.0'));
  assert.match(changelog.depois, /## \[0\.2\.0\]/);
  assert.match(changelog.depois, /### Novidades\n\n\* seletor de idioma/);
  assert.match(changelog.depois, /### Correções\n\n\* relógio não pausa ao zerar/);
  assert.doesNotMatch(changelog.depois, /atualiza dependências/);
});
