// Camada de comunicação com a API. Nos testes este módulo é substituído por um mock (jest.mock).
const BASE_URL = 'http://localhost:3000';

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });
  const dados = resposta.status === 204 ? null : await resposta.json();
  if (!resposta.ok) throw new Error(dados?.mensagem || 'Erro ao comunicar com o servidor');
  return dados;
}

export const listarTurmas = () => requisicao('/turmas');
export const criarTurma = (turma) => requisicao('/turmas', { method: 'POST', body: JSON.stringify(turma) });
export const atualizarTurma = (id, turma) => requisicao(`/turmas/${id}`, { method: 'PUT', body: JSON.stringify(turma) });
export const excluirTurma = (id) => requisicao(`/turmas/${id}`, { method: 'DELETE' });

export const listarAlunos = () => requisicao('/alunos');
export const criarAluno = (aluno) => requisicao('/alunos', { method: 'POST', body: JSON.stringify(aluno) });
export const atualizarAluno = (id, aluno) => requisicao(`/alunos/${id}`, { method: 'PUT', body: JSON.stringify(aluno) });
export const excluirAluno = (id) => requisicao(`/alunos/${id}`, { method: 'DELETE' });
