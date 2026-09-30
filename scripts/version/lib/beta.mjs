// Canal beta: vX.Y.Z-beta.N, onde X.Y.Z é a próxima versão estável calculada pelo
// release-please e N é o maior beta já existente para esse alvo + 1.
import { planejarRelease } from './plano-de-release.mjs';
import { compararVersoes, paraNumeros, versaoDaTagEstavel } from './semver.mjs';

export function proximoNumeroBeta(alvo, tags) {
  const prefixo = `v${alvo}-beta.`;
  const numeros = tags
    .filter((tag) => tag.startsWith(prefixo) && /^\d+$/.test(tag.slice(prefixo.length)))
    .map((tag) => Number(tag.slice(prefixo.length)));
  return Math.max(0, ...numeros) + 1;
}

// Última versão estável conhecida: a maior entre o manifest e as tags vX.Y.Z.
// A tag vence quando main já liberou e ainda não voltou para dev.
export function baseEstavel(versaoManifest, tags) {
  let melhor = { versao: versaoManifest, tag: null, numeros: paraNumeros(versaoManifest) };
  for (const tag of tags) {
    const numeros = versaoDaTagEstavel(tag);
    if (numeros && compararVersoes(numeros, melhor.numeros) >= 0) {
      melhor = { versao: numeros.join('.'), tag, numeros };
    }
  }
  return { versao: melhor.versao, tag: melhor.tag };
}

export async function planejarBeta({ raiz, commits, releases = [], versaoPublicada, tags }) {
  const { versao: alvo } = await planejarRelease({ raiz, commits, releases, versaoPublicada });
  if (!alvo) return null;
  const versao = `${alvo}-beta.${proximoNumeroBeta(alvo, tags)}`;
  return { versao, tag: `v${versao}`, alvo };
}
