#!/usr/bin/env node
// Calcula o próximo beta a partir do HEAD (dev) e imprime as saídas no formato do $GITHUB_OUTPUT.
// Uso no CI: node scripts/version/bin/versao-beta.mjs >> "$GITHUB_OUTPUT"
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { planejarBeta } from '../lib/beta.mjs';
import { lerHistoricoGit } from '../lib/historico-git.mjs';

export async function main({ raiz, saida = console.log, erro = console.error }) {
  const historico = lerHistoricoGit(raiz);
  const beta = await planejarBeta({ raiz, ...historico });
  if (!beta) {
    const desde = historico.tagBase ?? 'o início do repositório';
    erro(`Nenhum commit liberável (feat, fix, perf, revert ou breaking) desde ${desde}: não há beta a soltar.`);
    return 1;
  }
  saida(`version=${beta.versao}`);
  saida(`tag=${beta.tag}`);
  saida(`base_tag=${historico.tagBase ?? ''}`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const padrao = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
  process.exitCode = await main({ raiz: path.resolve(process.argv[2] ?? padrao) });
}
