// L4 — beta a partir de dev: vX.Y.Z-beta.N, N crescente sobre o mesmo alvo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planejarBeta, proximoNumeroBeta, baseEstavel } from '../lib/beta.mjs';
import { RAIZ_REPO, carregarFixture } from './apoio.mjs';

test('beta_sem_tag_anterior_sai_beta_1', async () => {
  const beta = await planejarBeta({ raiz: RAIZ_REPO, ...carregarFixture('com-feat'), tags: [] });
  assert.deepEqual(beta, { versao: '0.2.0-beta.1', tag: 'v0.2.0-beta.1', alvo: '0.2.0' });
});

test('beta_repetido_no_mesmo_alvo_incrementa_n', async () => {
  const historico = carregarFixture('com-feat');
  const primeiro = await planejarBeta({ raiz: RAIZ_REPO, ...historico, tags: [] });
  const segundo = await planejarBeta({ raiz: RAIZ_REPO, ...historico, tags: [primeiro.tag] });
  assert.equal(primeiro.versao, '0.2.0-beta.1');
  assert.equal(segundo.versao, '0.2.0-beta.2');
});

test('beta_ignora_tags_de_outro_alvo', () => {
  const tags = ['v0.1.1-beta.3', 'v0.2.0-beta.1', 'v0.2.0-beta.10', 'v0.2.0', 'v0.2.0-rc.4', 'lixo'];
  assert.equal(proximoNumeroBeta('0.2.0', tags), 11);
  assert.equal(proximoNumeroBeta('0.3.0', tags), 1);
});

test('beta_sem_commits_liberaveis_nao_gera_versao', async () => {
  const beta = await planejarBeta({ raiz: RAIZ_REPO, ...carregarFixture('so-chore-docs'), tags: [] });
  assert.equal(beta, null);
});

test('beta_parte_da_ultima_tag_estavel_mesmo_sem_back_merge', () => {
  // dev ainda diz 0.1.0 no manifest, mas main já liberou v0.2.0 e v0.3.0.
  const tags = ['v0.2.0', 'v0.3.0-beta.2', 'v0.3.0', 'v0.10.0-beta.1', 'outra-coisa'];
  assert.deepEqual(baseEstavel('0.1.0', tags), { versao: '0.3.0', tag: 'v0.3.0' });
  assert.deepEqual(baseEstavel('0.4.0', tags), { versao: '0.4.0', tag: null });
  assert.deepEqual(baseEstavel('0.1.0', []), { versao: '0.1.0', tag: null });
});
