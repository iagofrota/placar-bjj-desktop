#!/usr/bin/env node
// Check `commits`: recusa PR para dev cujo título não é conventional commit.
// Uso no CI: PR_TITLE="<título>" node scripts/version/bin/checar-titulo-pr.mjs
import { fileURLToPath } from 'node:url';
import { validarTitulo, EXEMPLOS } from '../lib/titulo-pr.mjs';

export function main({ titulo, saida = console.log, erro = console.error }) {
  const resultado = validarTitulo(titulo);
  if (resultado.ok) {
    saida(`Título em conventional commits: "${titulo}"`);
    return 0;
  }
  erro(`Título do PR recusado: ${resultado.motivo}.`);
  erro('Esse título vira a mensagem do commit em dev, e a versão do app é calculada dessas mensagens.');
  erro(`Exemplos: ${EXEMPLOS.join(' | ')}`);
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main({ titulo: process.env.PR_TITLE });
}
