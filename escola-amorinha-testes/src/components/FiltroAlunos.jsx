import { formatarTurma } from '../utils/formatar';

export default function FiltroAlunos({ filtro, turmas, onChange }) {
  const temFiltro = filtro.nome || filtro.turmaId;
  return (
    <div role="search" className="filtros">
      <div>
        <span className="rotulo">Nome do aluno</span>
        <input
          aria-label="Buscar por nome"
          placeholder="Buscar por nome..."
          value={filtro.nome}
          onChange={(e) => onChange({ ...filtro, nome: e.target.value })}
        />
      </div>
      <div>
        <span className="rotulo">Turma</span>
        <select
          aria-label="Filtrar por turma"
          value={filtro.turmaId}
          onChange={(e) => onChange({ ...filtro, turmaId: e.target.value })}
        >
          <option value="">Todas</option>
          {turmas.map((t) => (
            <option key={t.id} value={String(t.id)}>{formatarTurma(t)}</option>
          ))}
        </select>
      </div>
      {temFiltro && (
        <button type="button" className="link" onClick={() => onChange({ nome: '', turmaId: '' })}>Limpar filtros</button>
      )}
    </div>
  );
}

export function filtrarAlunos(alunos, filtro) {
  const termo = filtro.nome.trim().toLowerCase();
  return alunos.filter(
    (a) =>
      (!termo || a.nome.toLowerCase().includes(termo)) &&
      (!filtro.turmaId || String(a.turmaId) === String(filtro.turmaId))
  );
}
