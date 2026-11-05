import { useEffect, useState } from 'react';
import * as api from '../services/api';
import FormularioAluno from './FormularioAluno';
import FiltroAlunos, { filtrarAlunos } from './FiltroAlunos';
import Mensagem from './Mensagem';
import Modal from './Modal';
import { formatarData, formatarTurma } from '../utils/formatar';

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState({ nome: '', turmaId: '' });
  const [mensagem, setMensagem] = useState(null);
  const [formAberto, setFormAberto] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);

  useEffect(() => {
    Promise.all([api.listarAlunos(), api.listarTurmas()]).then(([listaAlunos, listaTurmas]) => {
      setAlunos(listaAlunos);
      setTurmas(listaTurmas);
      setCarregando(false);
    });
  }, []);

  const turmaDo = (id) => turmas.find((t) => String(t.id) === String(id));

  async function salvar(dados) {
    try {
      if (alunoEditando) {
        const atualizado = await api.atualizarAluno(alunoEditando.id, dados);
        setAlunos((lista) => lista.map((a) => (a.id === atualizado.id ? atualizado : a)));
        setMensagem({ texto: 'Aluno atualizado com sucesso', tipo: 'sucesso' });
      } else {
        const novo = await api.criarAluno(dados);
        setAlunos((lista) => [...lista, novo]);
        setMensagem({ texto: 'Aluno cadastrado com sucesso', tipo: 'sucesso' });
      }
      setFormAberto(false);
    } catch (e) {
      setMensagem({ texto: e.message, tipo: 'erro' });
    }
  }

  async function excluir(aluno) {
    if (!window.confirm('Deseja excluir este aluno?')) return;
    try {
      await api.excluirAluno(aluno.id);
      setAlunos((lista) => lista.filter((a) => a.id !== aluno.id));
      setMensagem({ texto: 'Aluno excluído com sucesso', tipo: 'sucesso' });
    } catch (e) {
      setMensagem({ texto: e.message, tipo: 'erro' });
    }
  }

  const visiveis = filtrarAlunos(alunos, filtro).sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <section>
      <div className="titulo">
        <h1>Alunos</h1>
        <button onClick={() => { setAlunoEditando(null); setFormAberto(true); }}>+ Novo aluno</button>
      </div>
      <Mensagem mensagem={mensagem} onFechar={() => setMensagem(null)} />

      {formAberto && (
        <Modal titulo={alunoEditando ? 'Editar aluno' : 'Novo aluno'}>
          <FormularioAluno
            key={alunoEditando?.id ?? 'novo'}
            alunoInicial={alunoEditando ? { ...alunoEditando, turmaId: String(alunoEditando.turmaId ?? '') } : undefined}
            turmas={turmas}
            onSalvar={salvar}
            onCancelar={() => setFormAberto(false)}
          />
        </Modal>
      )}

      <FiltroAlunos filtro={filtro} turmas={turmas} onChange={setFiltro} />

      {carregando ? (
        <p className="vazio">Carregando...</p>
      ) : alunos.length === 0 ? (
        <p className="vazio">Nenhum aluno cadastrado</p>
      ) : visiveis.length === 0 ? (
        <p className="vazio">Nenhum aluno encontrado</p>
      ) : (
        <div className="tabela-rolagem">
          <table>
            <thead>
              <tr>
                <th>Nome</th><th>Nascimento</th><th>Turma</th><th>Responsável</th>
                <th>Telefone</th><th>Autorizados</th><th>Fotos</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((aluno) => (
                <tr key={aluno.id}>
                  <td>
                    <span className="nome">{aluno.nome}</span>
                    {aluno.restricoesAlimentares && (
                      <span className="selo" title={aluno.restricoesAlimentares}>Restrição alimentar</span>
                    )}
                  </td>
                  <td>{formatarData(aluno.dataNascimento)}</td>
                  <td>{formatarTurma(turmaDo(aluno.turmaId))}</td>
                  <td>{aluno.nomeResponsavel}</td>
                  <td className="sem-quebra">{aluno.telefoneResponsavel}</td>
                  <td>{aluno.autorizados.map((p) => `${p.nome} – ${p.parentesco}`).join(', ')}</td>
                  <td>{aluno.autorizaFotos ? 'Sim' : 'Não'}</td>
                  <td className="acoes">
                    <button className="link" onClick={() => { setAlunoEditando(aluno); setFormAberto(true); }}>Editar</button>
                    <button className="link perigo" onClick={() => excluir(aluno)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
