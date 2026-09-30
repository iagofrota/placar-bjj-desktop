// Lê do git local o que o cálculo do beta precisa: tags, a última estável e os commits depois dela.
import { execFileSync } from 'node:child_process';
import { bootstrapSha, versaoDoManifest } from './config.mjs';
import { baseEstavel } from './beta.mjs';

const FIM_DE_COMMIT = '\x1e';
const SEPARADOR = '\x1f';

function git(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

export function lerHistoricoGit(cwd) {
  const tags = git(cwd, ['tag', '--list']).split('\n').filter(Boolean);
  const base = baseEstavel(versaoDoManifest(cwd), tags);
  const marco = bootstrapSha(cwd);
  let intervalo = ['HEAD'];
  if (base.tag) intervalo = [`${base.tag}..HEAD`];
  else if (marco) intervalo = [`${marco}..HEAD`];
  const commits = git(cwd, ['log', `--format=%H${SEPARADOR}%B${FIM_DE_COMMIT}`, ...intervalo])
    .split(FIM_DE_COMMIT)
    .map((bloco) => bloco.replace(/^\n/, ''))
    .filter(Boolean)
    .map((bloco) => {
      const [sha, message] = bloco.split(SEPARADOR);
      return { sha, message };
    });
  const releases = base.tag ? [{ tagName: base.tag, sha: git(cwd, ['rev-list', '-n1', base.tag]).trim() }] : [];
  return { tags, commits, releases, versaoPublicada: base.versao, tagBase: base.tag };
}
