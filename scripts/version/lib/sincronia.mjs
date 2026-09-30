// Sincronia de versão: todo arquivo listado em extra-files tem a versão do manifest.
// Lê cada valor com o mesmo parser e o mesmo JSONPath que o release-please usa para atualizá-lo.
import fs from 'node:fs';
import path from 'node:path';
import { JSONPath } from 'jsonpath-plus';
import { parseWith } from 'release-please/build/src/util/toml-edit.js';
import { arquivosDeVersao, versaoDoManifest } from './config.mjs';

function desembrulhar(valor) {
  // O parser TOML do release-please embrulha cada valor como { value, start, end }.
  return valor !== null && typeof valor === 'object' && 'value' in valor ? valor.value : valor;
}

export function lerValores(raiz, { caminho, tipo, jsonpath }) {
  const conteudo = fs.readFileSync(path.join(raiz, caminho), 'utf8');
  const dados = tipo === 'toml' ? parseWith(conteudo) : JSON.parse(conteudo);
  return JSONPath({ path: jsonpath, json: dados, wrap: true }).map(desembrulhar);
}

export function checarSincronia(raiz) {
  const versao = versaoDoManifest(raiz);
  const arquivos = arquivosDeVersao(raiz).map((arquivo) => ({ ...arquivo, valores: lerValores(raiz, arquivo) }));
  const divergencias = arquivos
    .filter(({ valores }) => valores.length === 0 || valores.some((valor) => valor !== versao))
    .map(({ caminho, jsonpath, valores }) => ({ caminho, jsonpath, encontrado: valores }));
  return { versao, arquivos, divergencias };
}
