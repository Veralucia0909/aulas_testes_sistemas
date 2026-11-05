import { useEffect, useState } from 'react';
import * as api from '../services/api';
import FormularioTurma from './FormularioTurma';
import Mensagem from './Mensagem';
import Modal from './Modal';

export default function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const [formAberto, setFormAberto] = useState(false);
  const [turmaEditando, setTurmaEditando] = useState(null);

  useEffect(() => {
    api.listarTurmas().then((dados) => {
      setTurmas(dados);
      setCarregando(false);
    });
  }, []);

  const sucesso = (texto) => setMensagem({ texto, tipo: 'sucesso' });
  const erro = (texto) => setMensagem({ texto, tipo: 'erro' });

  function abrirNova() {
    setTurmaEditando(null);
    setFormAberto(true);
  }

  function abrirEdicao(turma) {
    setTurmaEditando(turma);
    setFormAberto(true);
  }

  async function salvar(dados) {
    try {
      if (turmaEditando) {
        const atualizada = await api.atualizarTurma(turmaEditando.id, dados);
        setTurmas((lista) => lista.map((t) => (t.id === atualizada.id ? atualizada : t)));
        sucesso('Turma atualizada com sucesso');
      } else {
        const nova = await api.criarTurma(dados);
        setTurmas((lista) => [...lista, nova]);
        sucesso('Turma cadastrada com sucesso');
      }
      setFormAberto(false);
    } catch (e) {
      erro(e.message);
    }
  }

  async function excluir(turma) {
    if (!window.confirm('Deseja excluir esta turma?')) return;
    try {
      await api.excluirTurma(turma.id);
      setTurmas((lista) => lista.filter((t) => t.id !== turma.id));
      sucesso('Turma excluída com sucesso');
    } catch (e) {
      erro(e.message);
    }
  }

  return (
    <section>
      <div className="titulo">
        <h1>Turmas</h1>
        <button onClick={abrirNova}>+ Nova turma</button>
      </div>
      <Mensagem mensagem={mensagem} onFechar={() => setMensagem(null)} />

      {formAberto && (
        <Modal titulo={turmaEditando ? 'Editar turma' : 'Nova turma'}>
          <FormularioTurma
            key={turmaEditando?.id ?? 'nova'}
            turmaInicial={turmaEditando}
            onSalvar={salvar}
            onCancelar={() => setFormAberto(false)}
          />
        </Modal>
      )}

      {carregando ? (
        <p className="vazio">Carregando...</p>
      ) : turmas.length === 0 ? (
        <p className="vazio">Nenhuma turma cadastrada</p>
      ) : (
        <table>
          <thead>
            <tr><th>Nome</th><th>Turno</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {turmas.map((turma) => (
              <tr key={turma.id}>
                <td>{turma.nome}</td>
                <td>{turma.turno ?? '-'}</td>
                <td className="acoes">
                  <button className="link" onClick={() => abrirEdicao(turma)}>Editar</button>
                  <button className="link perigo" onClick={() => excluir(turma)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
