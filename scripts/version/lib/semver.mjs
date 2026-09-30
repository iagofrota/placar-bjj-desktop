// Só o pedaço de semver que o canal beta precisa: tags vX.Y.Z e vX.Y.Z-beta.N.
const ESTAVEL = /^v(\d+)\.(\d+)\.(\d+)$/;

export function versaoDaTagEstavel(tag) {
  const partes = ESTAVEL.exec(tag);
  return partes ? partes.slice(1, 4).map(Number) : null;
}

export function compararVersoes(a, b) {
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

export function paraNumeros(versao) {
  const partes = /^(\d+)\.(\d+)\.(\d+)$/.exec(versao);
  if (!partes) throw new Error(`versão estável inválida: ${versao}`);
  return partes.slice(1, 4).map(Number);
}
