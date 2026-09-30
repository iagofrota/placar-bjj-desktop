// Implementação em memória da interface `Scm` do release-please, para rodar o cálculo
// real da ferramenta (Manifest.buildPullRequests) sem rede e sobre históricos fixture.
// Commits, releases e tags vêm do fixture; arquivos vêm do repositório em `raiz`.
import fs from 'node:fs';
import path from 'node:path';
import { FileNotFoundError } from 'release-please/build/src/errors/index.js';
import { ARQUIVO_MANIFEST, CAMINHO_RAIZ } from './config.mjs';

export const REPOSITORIO = { owner: 'iagofrota', repo: 'placar-bjj-desktop', defaultBranch: 'main' };

export class ScmFixture {
  constructor({ raiz, commits = [], releases = [], versaoPublicada }) {
    this.repository = REPOSITORIO;
    this.raiz = raiz;
    this.commits = commits.map(({ sha, message }) => ({ sha, message, files: [] }));
    this.releases = releases;
    this.versaoPublicada = versaoPublicada;
  }

  lerTexto(relativo) {
    const arquivo = path.join(this.raiz, relativo);
    if (!fs.existsSync(arquivo)) throw new FileNotFoundError(relativo);
    return fs.readFileSync(arquivo, 'utf8');
  }

  async getFileJson(relativo) {
    const json = JSON.parse(this.lerTexto(relativo));
    // O fixture pode fixar a última versão publicada, independente do manifest do repositório.
    if (relativo === ARQUIVO_MANIFEST && this.versaoPublicada) {
      return { ...json, [CAMINHO_RAIZ]: this.versaoPublicada };
    }
    return json;
  }

  async getFileContentsOnBranch(relativo) {
    const texto = this.lerTexto(relativo);
    return { parsedContent: texto, content: Buffer.from(texto).toString('base64'), sha: '', mode: '100644' };
  }

  async getFileContents(relativo) {
    return this.getFileContentsOnBranch(relativo);
  }

  async *releaseIterator() {
    for (const { tagName, sha } of this.releases) {
      yield { id: 0, name: tagName, tagName, sha, notes: '', url: '' };
    }
  }

  async *tagIterator() {
    for (const { tagName, sha } of this.releases) yield { name: tagName, sha };
  }

  async *mergeCommitIterator() {
    yield* this.commits;
  }

  async findFilesByGlobAndRef() {
    return [];
  }
}

// Qualquer outro método do `Scm` escreve no GitHub ou não tem uso no cálculo: falha alto.
for (const metodo of [
  'createPullRequest',
  'updatePullRequest',
  'createRelease',
  'commentOnIssue',
  'addIssueLabels',
  'removeIssueLabels',
  'pullRequestIterator',
  'getPullRequest',
  'generateReleaseNotes',
  'createFileOnNewBranch',
  'buildChangeSet',
  'commitsSince',
  'findFilesByFilename',
  'findFilesByFilenameAndRef',
  'findFilesByGlob',
  'findFilesByExtension',
  'findFilesByExtensionAndRef',
]) {
  ScmFixture.prototype[metodo] = function naoSuportado() {
    throw new Error(`ScmFixture.${metodo} não faz parte do dry-run`);
  };
}
