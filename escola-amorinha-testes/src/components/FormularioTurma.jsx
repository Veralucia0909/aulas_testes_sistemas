import { useState } from 'react';

export const TURNOS = ['Manhã', 'Tarde', 'Integral'];

export default function FormularioTurma({ turmaInicial, onSalvar, onCancelar }) {
  const [nome, setNome] = useState(turmaInicial?.nome ?? '');
  const [turno, setTurno] = useState(turmaInicial?.turno ?? 'Manhã');
  const [erro, setErro] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) {
      setErro('Informe o nome da turma');
      return;
    }
    onSalvar({ nome: nome.trim(), turno });
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Formulário de turma" noValidate>
      <label htmlFor="nomeTurma" className="requerido">Nome da Turma</label>
      <input id="nomeTurma" value={nome} onChange={(e) => setNome(e.target.value)} aria-invalid={erro ? 'true' : 'false'} />
      {erro && <p role="alert">{erro}</p>}

      <label htmlFor="turno">Turno</label>
      <select id="turno" value={turno} onChange={(e) => setTurno(e.target.value)}>
        {TURNOS.map((t) => <option key={t}>{t}</option>)}
      </select>

      <div className="acoes-form">
        <button type="button" className="secundario" onClick={onCancelar}>Cancelar</button>
        <button type="submit">Salvar</button>
      </div>
    </form>
  );
}
