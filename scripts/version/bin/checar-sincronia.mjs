#!/usr/bin/env node
// Teste de sincronia: falha se algum arquivo de versão divergir do .release-please-manifest.json.
// Uso: node scripts/version/bin/checar-sincronia.mjs [raiz-do-repositório]
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checarSincronia } from '../lib/sincronia.mjs';

export function main({ raiz, saida = console.log, erro = console.error }) {
  const { versao, arquivos, divergencias } = checarSincronia(raiz);
  if (divergencias.length === 0) {
    saida(`Versão ${versao} em sincronia em ${arquivos.length} lugares:`);
    for (const { caminho, jsonpath } of arquivos) saida(`  ok  ${caminho}  ${jsonpath}`);
    return 0;
  }
  erro(`Versão fora de sincronia. O manifest diz ${versao}, mas:`);
  for (const { caminho, jsonpath, encontrado } of divergencias) {
    const achado = encontrado.length === 0 ? 'nenhum valor (JSONPath sem correspondência)' : encontrado.join(', ');
    erro(`  ${caminho}  ${jsonpath}  →  ${achado}`);
  }
  erro('A versão só muda pelo PR de release. Veja docs/release/versioning.md.');
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const padrao = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
  process.exitCode = main({ raiz: path.resolve(process.argv[2] ?? padrao) });
}
