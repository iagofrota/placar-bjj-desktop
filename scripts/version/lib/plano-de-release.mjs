// Dry-run do PR de release: roda o release-please de verdade (Manifest.buildPullRequests)
// sobre um histórico fixture e aplica os updaters dele aos arquivos de `raiz`, sem gravar nada.
import fs from 'node:fs';
import path from 'node:path';
import { Manifest, setLogger } from 'release-please';
import { mergeUpdates } from 'release-please/build/src/updaters/composite.js';
import { ARQUIVO_CONFIG, ARQUIVO_MANIFEST } from './config.mjs';
import { ScmFixture } from './scm-fixture.mjs';

const SILENCIOSO = { error() {}, warn() {}, info() {}, debug() {}, trace() {} };

function aplicar(raiz, updates) {
  const atualizacoes = [];
  for (const update of mergeUpdates(updates)) {
    const arquivo = path.join(raiz, update.path);
    const existe = fs.existsSync(arquivo);
    if (!existe && !update.createIfMissing) continue; // igual ao GitHub.buildChangeSet
    const antes = existe ? fs.readFileSync(arquivo, 'utf8') : null;
    const depois = update.updater.updateContent(antes ?? undefined, SILENCIOSO);
    atualizacoes.push({ caminho: update.path, antes, depois });
  }
  return atualizacoes;
}

export async function planejarRelease({ raiz, commits, releases = [], versaoPublicada }) {
  if (!process.env.VERSAO_DEBUG) setLogger(SILENCIOSO);
  const scm = new ScmFixture({ raiz, commits, releases, versaoPublicada });
  const manifest = await Manifest.fromManifest(scm, 'main', ARQUIVO_CONFIG, ARQUIVO_MANIFEST);
  const [pr] = await manifest.buildPullRequests();
  if (!pr) return { versao: null, titulo: null, atualizacoes: [] };
  return {
    versao: pr.version ? pr.version.toString() : null,
    titulo: pr.title.toString(),
    atualizacoes: aplicar(raiz, pr.updates),
  };
}
