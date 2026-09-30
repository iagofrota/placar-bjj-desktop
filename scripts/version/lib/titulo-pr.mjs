// Validação do título de PR em conventional commits.
// Os tipos são os mesmos que o release-please reconhece ao separar commits aninhados
// (commit.js, splitMessages), para o título aceito aqui ser o que ele entende lá.
export const TIPOS = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'];

const FORMATO = new RegExp(`^(${TIPOS.join('|')})(\\([a-z0-9][a-z0-9._/-]*\\))?(!)?: \\S.*$`);

export const EXEMPLOS = ['feat: seletor de idioma', 'fix(placar): punição não fica negativa', 'feat!: novo formato de configuração'];

export function validarTitulo(titulo) {
  if (typeof titulo !== 'string' || titulo.trim() === '') {
    return { ok: false, motivo: 'o título está vazio' };
  }
  if (FORMATO.test(titulo)) {
    return { ok: true };
  }
  return {
    ok: false,
    motivo: `"${titulo}" não segue <tipo>[(escopo)][!]: <descrição>, com tipo em minúsculas entre ${TIPOS.join(', ')}`,
  };
}
