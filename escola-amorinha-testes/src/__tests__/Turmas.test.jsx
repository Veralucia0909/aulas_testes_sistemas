import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Turmas from '../components/Turmas';
import FormularioTurma from '../components/FormularioTurma';
import * as api from '../services/api';

// A API é simulada: os testes verificam só o comportamento do frontend.
jest.mock('../services/api');

const TURMAS = [
  { id: 1, nome: 'Maternal I' },
  { id: 2, nome: 'Jardim II' },
];

// Encontra a linha da tabela que contém o nome da turma
const linhaDa = (nome) => screen.getByText(nome).closest('tr');

beforeEach(() => {
  jest.clearAllMocks();
  api.listarTurmas.mockResolvedValue(TURMAS);
});

afterEach(() => jest.restoreAllMocks());

describe('RF01 - Listar Turmas', () => {
  test('CT01 - lista todas as turmas cadastradas com os botões Editar e Excluir', async () => {
    render(<Turmas />);

    expect(await screen.findByText('Maternal I')).toBeInTheDocument();
    expect(screen.getByText('Jardim II')).toBeInTheDocument();
    expect(within(linhaDa('Maternal I')).getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    expect(within(linhaDa('Maternal I')).getByRole('button', { name: 'Excluir' })).toBeInTheDocument();
  });

  test('CT02 - exibe mensagem quando não há turmas', async () => {
    api.listarTurmas.mockResolvedValue([]);
    render(<Turmas />);

    expect(await screen.findByText('Nenhuma turma cadastrada')).toBeInTheDocument();
  });

  test('CT03 - exibe "Carregando..." enquanto a API não responde', () => {
    api.listarTurmas.mockReturnValue(new Promise(() => {})); // nunca resolve
    render(<Turmas />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});

describe('RF02 - Incluir Turma', () => {
  test('CT04 - inclui uma turma com sucesso', async () => {
    api.criarTurma.mockResolvedValue({ id: 3, nome: 'Pré I' });
    render(<Turmas />);
    await screen.findByText('Maternal I');

    await userEvent.click(screen.getByRole('button', { name: '+ Nova turma' }));
    await userEvent.type(screen.getByLabelText('Nome da Turma'), 'Pré I');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(api.criarTurma).toHaveBeenCalledWith({ nome: 'Pré I', turno: 'Manhã' });
    expect(await screen.findByText('Turma cadastrada com sucesso')).toBeInTheDocument();
    expect(screen.getByText('Pré I')).toBeInTheDocument();
  });

  test('CT05 - impede inclusão de turma sem nome (unitário)', async () => {
    const onSalvar = jest.fn();
    render(<FormularioTurma onSalvar={onSalvar} onCancelar={jest.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText('Informe o nome da turma')).toBeInTheDocument();
    expect(onSalvar).not.toHaveBeenCalled();
  });
});

describe('RF03 - Atualizar Turma', () => {
  test('CT06 - atualiza o nome de uma turma', async () => {
    api.atualizarTurma.mockResolvedValue({ id: 1, nome: 'Maternal II' });
    render(<Turmas />);
    await screen.findByText('Maternal I');

    await userEvent.click(within(linhaDa('Maternal I')).getByRole('button', { name: 'Editar' }));
    const campo = screen.getByLabelText('Nome da Turma');
    expect(campo).toHaveValue('Maternal I');

    await userEvent.clear(campo);
    await userEvent.type(campo, 'Maternal II');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(api.atualizarTurma).toHaveBeenCalledWith(1, expect.objectContaining({ nome: 'Maternal II' }));
    expect(await screen.findByText('Turma atualizada com sucesso')).toBeInTheDocument();
    expect(screen.getByText('Maternal II')).toBeInTheDocument();
    expect(screen.queryByText('Maternal I')).not.toBeInTheDocument();
  });

  test('CT07 - cancela a edição sem alterar a turma', async () => {
    render(<Turmas />);
    await screen.findByText('Maternal I');

    await userEvent.click(within(linhaDa('Maternal I')).getByRole('button', { name: 'Editar' }));
    await userEvent.clear(screen.getByLabelText('Nome da Turma'));
    await userEvent.type(screen.getByLabelText('Nome da Turma'), 'Teste');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByLabelText('Nome da Turma')).not.toBeInTheDocument();
    expect(screen.getByText('Maternal I')).toBeInTheDocument();
    expect(api.atualizarTurma).not.toHaveBeenCalled();
  });
});

describe('RF04 - Excluir Turma', () => {
  test('CT08 - exclui uma turma sem alunos após confirmação', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    api.excluirTurma.mockResolvedValue(null);
    render(<Turmas />);
    await screen.findByText('Maternal I');

    await userEvent.click(within(linhaDa('Maternal I')).getByRole('button', { name: 'Excluir' }));

    expect(window.confirm).toHaveBeenCalledWith('Deseja excluir esta turma?');
    expect(api.excluirTurma).toHaveBeenCalledWith(1);
    expect(await screen.findByText('Turma excluída com sucesso')).toBeInTheDocument();
    expect(screen.queryByText('Maternal I')).not.toBeInTheDocument();
  });

  test('CT09 - cancela a exclusão de uma turma', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    render(<Turmas />);
    await screen.findByText('Maternal I');

    await userEvent.click(within(linhaDa('Maternal I')).getByRole('button', { name: 'Excluir' }));

    expect(api.excluirTurma).not.toHaveBeenCalled();
    expect(screen.getByText('Maternal I')).toBeInTheDocument();
  });
});

describe('RF05 - Bloquear exclusão de Turma com Alunos', () => {
  test('CT10 - exibe erro e mantém a turma quando ela possui alunos', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    api.excluirTurma.mockRejectedValue(
      new Error('Não é possível excluir a turma, pois ela possui alunos vinculados')
    );
    render(<Turmas />);
    await screen.findByText('Jardim II');

    await userEvent.click(within(linhaDa('Jardim II')).getByRole('button', { name: 'Excluir' }));

    expect(
      await screen.findByText('Não é possível excluir a turma, pois ela possui alunos vinculados')
    ).toBeInTheDocument();
    expect(screen.getByText('Jardim II')).toBeInTheDocument();
  });
});
