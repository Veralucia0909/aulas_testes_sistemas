export function formatarTurma(turma) {
  if (!turma) return '-';
  return turma.turno ? `${turma.nome} - ${turma.turno}` : turma.nome;
}

export function formatarData(iso) {
  if (!iso) return '-';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}
