import { useState } from 'react';
import ListaAutorizados from './ListaAutorizados';
import { formatarTurma } from '../utils/formatar';

const VAZIO = {
  nome: '',
  dataNascimento: '',
  nomeResponsavel: '',
  telefoneResponsavel: '',
  telefoneEmergencia: '',
  restricoesAlimentares: '',
  observacoes: '',
  autorizaFotos: false,
  turmaId: '',
  autorizados: [],
};

export function validarAluno(aluno) {
  const erros = {};
  if (!aluno.nome.trim()) erros.nome = 'O nome do aluno é obrigatório';
  if (!aluno.nomeResponsavel.trim()) erros.nomeResponsavel = 'O nome do responsável é obrigatório';
  if (!aluno.telefoneResponsavel.trim()) erros.telefoneResponsavel = 'O telefone do responsável é obrigatório';
  if (aluno.autorizados.length === 0) erros.autorizados = 'Informe ao menos uma pessoa autorizada a buscar a criança';
  return erros;
}

export default function FormularioAluno({ alunoInicial, turmas, onSalvar, onCancelar }) {
  const [aluno, setAluno] = useState({ ...VAZIO, ...alunoInicial });
  const [erros, setErros] = useState({});

  const alterar = (campo) => (e) =>
    setAluno({ ...aluno, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    const encontrados = validarAluno(aluno);
    setErros(encontrados);
    if (Object.keys(encontrados).length === 0) onSalvar(aluno);
  }

  const campo = (id, rotulo, chave, { tipo = 'text', obrigatorio = false, placeholder } = {}) => (
    <div>
      <label htmlFor={id} className={obrigatorio ? 'requerido' : undefined}>{rotulo}</label>
      <input
        id={id}
        type={tipo}
        placeholder={placeholder}
        value={aluno[chave]}
        onChange={alterar(chave)}
        aria-invalid={erros[chave] ? 'true' : 'false'}
      />
      {erros[chave] && <p role="alert">{erros[chave]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} aria-label="Formulário de aluno" noValidate>
      <div className="grade">
        {campo('nome', 'Nome', 'nome', { obrigatorio: true })}
        {campo('dataNascimento', 'Data de Nascimento', 'dataNascimento', { tipo: 'date' })}
        {campo('nomeResponsavel', 'Nome do Responsável', 'nomeResponsavel', { obrigatorio: true })}
        {campo('telefoneResponsavel', 'Telefone do Responsável', 'telefoneResponsavel', { tipo: 'tel', obrigatorio: true, placeholder: '(11) 98123-4567' })}
        {campo('telefoneEmergencia', 'Telefone para Emergências', 'telefoneEmergencia', { tipo: 'tel', placeholder: '(11) 98123-4567' })}
        <div>
          <label htmlFor="turma">Turma</label>
          <select id="turma" value={aluno.turmaId} onChange={alterar('turmaId')}>
            <option value="">Selecione</option>
            {turmas.map((t) => (
              <option key={t.id} value={String(t.id)}>{formatarTurma(t)}</option>
            ))}
          </select>
        </div>
      </div>

      {campo('restricoesAlimentares', 'Restrições Alimentares', 'restricoesAlimentares', { placeholder: 'Ex.: intolerância à lactose' })}

      <label htmlFor="observacoes">Observações</label>
      <textarea id="observacoes" rows={2} value={aluno.observacoes} onChange={alterar('observacoes')} />

      <label className="checkbox">
        <input type="checkbox" checked={aluno.autorizaFotos} onChange={alterar('autorizaFotos')} />
        Autoriza fotos e vídeos para uso escolar
      </label>

      <ListaAutorizados
        autorizados={aluno.autorizados}
        onChange={(lista) => setAluno({ ...aluno, autorizados: lista })}
      />
      {erros.autorizados && <p role="alert">{erros.autorizados}</p>}

      <div className="acoes-form">
        <button type="button" className="secundario" onClick={onCancelar}>Cancelar</button>
        <button type="submit">Salvar</button>
      </div>
    </form>
  );
}
