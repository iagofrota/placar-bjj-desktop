// Leitura da config e do manifest do release-please: a única lista de arquivos de versão.
import fs from 'node:fs';
import path from 'node:path';

export const ARQUIVO_CONFIG = 'release-please-config.json';
export const ARQUIVO_MANIFEST = '.release-please-manifest.json';
export const CAMINHO_RAIZ = '.';

export function lerJson(raiz, relativo) {
  return JSON.parse(fs.readFileSync(path.join(raiz, relativo), 'utf8'));
}

export function versaoDoManifest(raiz) {
  const versao = lerJson(raiz, ARQUIVO_MANIFEST)[CAMINHO_RAIZ];
  if (typeof versao !== 'string') {
    throw new Error(`${ARQUIVO_MANIFEST} não tem a versão do pacote "${CAMINHO_RAIZ}"`);
  }
  return versao;
}

export function arquivosDeVersao(raiz) {
  const pacote = lerJson(raiz, ARQUIVO_CONFIG).packages?.[CAMINHO_RAIZ];
  const extras = pacote?.['extra-files'] ?? [];
  return extras.map((extra) => {
    if (typeof extra !== 'object' || !['json', 'toml'].includes(extra.type)) {
      throw new Error(`extra-file sem suporte na sincronia: ${JSON.stringify(extra)}`);
    }
    return { caminho: extra.path, tipo: extra.type, jsonpath: extra.jsonpath };
  });
}

// Marco da versão de partida (0.1.0): enquanto não houver versão publicada, só o que veio
// depois dele conta. Depois do primeiro release o release-please ignora a chave.
export function bootstrapSha(raiz) {
  return lerJson(raiz, ARQUIVO_CONFIG)['bootstrap-sha'] ?? null;
}
