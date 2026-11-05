import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alunos from '../components/Alunos';
import FormularioAluno from '../components/FormularioAluno';
import ListaAutorizados from '../components/ListaAutorizados';
import * as api from '../services/api';

jest.mock('../services/api');

const TURMAS = [
  { id: 1, nome: 'Maternal I' },
  { id: 2, nome: 'Jardim II' },
];

const ALUNOS = [
  {
    id: 10, nome: 'Ana Souza', turmaId: 2, nomeResponsavel: 'Paula Souza',
    telefoneResponsavel: '(48) 99999-0000', telefoneEmergencia: '', dataNascimento: '',
    restricoesAlimentares: '', observacoes: '', autorizaFotos: false,
    autorizados: [{ nome: 'Rita', parentesco: 'Avó' }],
  },
  {
    id: 11, nome: 'Lucas Lima', turmaId: 2, nomeResponsavel: 'Marcos Lima',
    telefoneResponsavel: '(48) 98888-0000', telefoneEmergencia: '', dataNascimento: '',
    restricoesAlimentares: '', observacoes: '', autorizaFotos: true,
    autorizados: [{ nome: 'Jorge', parentesco: 'Tio' }],
  },
  {
    id: 12, nome: 'Pedro Reis', turmaId: 1, nomeResponsavel: 'Sara Reis',
    telefoneResponsavel: '(48) 97777-0000', telefoneEmergencia: '', dataNascimento: '',
    restricoesAlimentares: '', observacoes: '', autorizaFotos: false,
    autorizados: [{ nome: 'Leo', parentesco: 'Pai' }],
  },
];

const linhaDo = (nome) => screen.getByText(nome).closest('tr');

async function renderizarTela() {
  render(<Alunos />);
  await screen.findByText('Ana Souza');
}

async function adicionarAutorizado(nome, parentesco) {
  await userEvent.type(screen.getByLabelText('Nome do autorizado'), nome);
  await userEvent.type(screen.getByLabelText('Grau de parentesco'), parentesco);
  await userEvent.click(screen.getByRole('button', { name: 'Adicionar autorizado' }));
}

async function preencherObrigatorios() {
  await userEvent.type(screen.getByLabelText('Nome'), 'Maria Oliveira');
  await userEvent.type(screen.getByLabelText('Nome do Responsável'), 'Carla Oliveira');
  await userEvent.type(screen.getByLabelText('Telefone do Responsável'), '(48) 99999-1111');
  await adicionarAutorizado('Pedro', 'Padrinho');
}

beforeEach(() => {
  jest.clearAllMocks();
  api.listarTurmas.mockResolvedValue(TURMAS);
  api.listarAlunos.mockResolvedValue(ALUNOS);
});

afterEach(() => jest.restoreAllMocks());

describe('RF06 - Listar Alunos', () => {
  test('CT12 - lista os alunos com nome, turma e responsável', async () => {
    await renderizarTela();

    const linha = linhaDo('Ana Souza');
    expect(within(linha).getByText('Jardim II')).toBeInTheDocument();
    expect(within(linha).getByText('Paula Souza')).toBeInTheDocument();
    expect(screen.getByText('Lucas Lima')).toBeInTheDocument();
  });

  test('CT13 - exibe mensagem quando não há alunos', async () => {
    api.listarAlunos.mockResolvedValue([]);
    render(<Alunos />);

    expect(await screen.findByText('Nenhum aluno cadastrado')).toBeInTheDocument();
  });
});

describe('RF07 - Filtrar Alunos', () => {
  test('CT14 - filtra pelo nome', async () => {
    await renderizarTela();

    await userEvent.type(screen.getByLabelText('Buscar por nome'), 'Ana');

    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.queryByText('Lucas Lima')).not.toBeInTheDocument();
  });

  test('CT15 - filtra pela turma', async () => {
    await renderizarTela();

    await userEvent.selectOptions(screen.getByLabelText('Filtrar por turma'), 'Maternal I');

    expect(screen.getByText('Pedro Reis')).toBeInTheDocument();
    expect(screen.queryByText('Ana Souza')).not.toBeInTheDocument();
    expect(screen.queryByText('Lucas Lima')).not.toBeInTheDocument();
  });

  test('CT16 - filtra por nome e turma ao mesmo tempo', async () => {
    await renderizarTela();

    await userEvent.type(screen.getByLabelText('Buscar por nome'), 'Lu');
    await userEvent.selectOptions(screen.getByLabelText('Filtrar por turma'), 'Jardim II');

    expect(screen.getByText('Lucas Lima')).toBeInTheDocument();
    expect(screen.queryByText('Ana Souza')).not.toBeInTheDocument();
    expect(screen.queryByText('Pedro Reis')).not.toBeInTheDocument();
  });

  test('CT17 - exibe mensagem quando o filtro não encontra alunos', async () => {
    await renderizarTela();

    await userEvent.type(screen.getByLabelText('Buscar por nome'), 'Zzz');

    expect(screen.getByText('Nenhum aluno encontrado')).toBeInTheDocument();
  });

  test('CT18 - limpa os filtros e mostra todos os alunos', async () => {
    await renderizarTela();
    await userEvent.selectOptions(screen.getByLabelText('Filtrar por turma'), 'Maternal I');

    await userEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));

    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.getByText('Lucas Lima')).toBeInTheDocument();
    expect(screen.getByText('Pedro Reis')).toBeInTheDocument();
  });
});

describe('RF08 - Inserir Aluno', () => {
  test('CT19 - cadastra um aluno com todos os campos', async () => {
    api.criarAluno.mockImplementation(async (aluno) => ({ id: 20, ...aluno }));
    await renderizarTela();

    await userEvent.click(screen.getByRole('button', { name: '+ Novo aluno' }));
    await userEvent.type(screen.getByLabelText('Nome'), 'Maria Oliveira');
    await userEvent.type(screen.getByLabelText('Data de Nascimento'), '2022-03-10');
    await userEvent.type(screen.getByLabelText('Nome do Responsável'), 'Carla Oliveira');
    await userEvent.type(screen.getByLabelText('Telefone do Responsável'), '(48) 99999-1111');
    await userEvent.type(screen.getByLabelText('Telefone para Emergências'), '(48) 98888-2222');
    await userEvent.type(screen.getByLabelText('Restrições Alimentares'), 'Intolerância à lactose');
    await userEvent.type(screen.getByLabelText('Observações'), 'Usa óculos');
    await userEvent.click(screen.getByLabelText('Autoriza fotos e vídeos para uso escolar'));
    await userEvent.selectOptions(screen.getByLabelText('Turma'), 'Maternal I');
    await adicionarAutorizado('Pedro', 'Padrinho');
    await adicionarAutorizado('Maria', 'Tia');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(api.criarAluno).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Maria Oliveira',
        dataNascimento: '2022-03-10',
        autorizaFotos: true,
        turmaId: '1',
        autorizados: [
          { nome: 'Pedro', parentesco: 'Padrinho' },
          { nome: 'Maria', parentesco: 'Tia' },
        ],
      })
    );
    expect(await screen.findByText('Aluno cadastrado com sucesso')).toBeInTheDocument();
    expect(screen.getByText('Maria Oliveira')).toBeInTheDocument();
  });

  test('CT20 - cadastra um aluno só com os campos obrigatórios', async () => {
    api.criarAluno.mockImplementation(async (aluno) => ({ id: 21, ...aluno }));
    await renderizarTela();

    await userEvent.click(screen.getByRole('button', { name: '+ Novo aluno' }));
    await preencherObrigatorios();
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Aluno cadastrado com sucesso')).toBeInTheDocument();
  });

  test('CT21 - adiciona e remove autorizados a buscar (unitário)', async () => {
    // Componente controlado: guardamos a lista num "pai" de teste
    function Pai() {
      const [lista, setLista] = useState([]);
      return <ListaAutorizados autorizados={lista} onChange={setLista} />;
    }
    render(<Pai />);

    await adicionarAutorizado('Pedro', 'Padrinho');
    await adicionarAutorizado('Maria', 'Tia');
    const lista = screen.getByRole('list', { name: 'Lista de autorizados' });
    expect(within(lista).getAllByRole('listitem')).toHaveLength(2);

    await userEvent.click(screen.getByRole('button', { name: 'Remover Pedro' }));

    expect(within(lista).getAllByRole('listitem')).toHaveLength(1);
    expect(within(lista).getByText(/Maria - Tia/)).toBeInTheDocument();
  });

  test('CT22 - exibe as turmas disponíveis no campo Turma (unitário)', () => {
    render(<FormularioAluno turmas={TURMAS} onSalvar={jest.fn()} onCancelar={jest.fn()} />);

    const select = screen.getByLabelText('Turma');
    expect(within(select).getByRole('option', { name: 'Maternal I' })).toBeInTheDocument();
    expect(within(select).getByRole('option', { name: 'Jardim II' })).toBeInTheDocument();
  });

  test('CT23 - opção de fotos e vídeos vem desmarcada (unitário)', () => {
    render(<FormularioAluno turmas={TURMAS} onSalvar={jest.fn()} onCancelar={jest.fn()} />);

    expect(screen.getByLabelText('Autoriza fotos e vídeos para uso escolar')).not.toBeChecked();
  });
});

describe('RF09 - Bloquear inserção sem campos obrigatórios', () => {
  test.each([
    ['Nome', 'O nome do aluno é obrigatório'],
    ['Nome do Responsável', 'O nome do responsável é obrigatório'],
    ['Telefone do Responsável', 'O telefone do responsável é obrigatório'],
  ])('CT24 - bloqueia cadastro com "%s" vazio', async (campo, mensagem) => {
    const onSalvar = jest.fn();
    render(<FormularioAluno turmas={TURMAS} onSalvar={onSalvar} onCancelar={jest.fn()} />);

    await preencherObrigatorios();
    await userEvent.clear(screen.getByLabelText(campo));
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText(mensagem)).toBeInTheDocument();
    expect(onSalvar).not.toHaveBeenCalled();
  });

  test('CT25 - bloqueia cadastro sem autorizados a buscar', async () => {
    const onSalvar = jest.fn();
    render(<FormularioAluno turmas={TURMAS} onSalvar={onSalvar} onCancelar={jest.fn()} />);

    await userEvent.type(screen.getByLabelText('Nome'), 'Maria Oliveira');
    await userEvent.type(screen.getByLabelText('Nome do Responsável'), 'Carla Oliveira');
    await userEvent.type(screen.getByLabelText('Telefone do Responsável'), '(48) 99999-1111');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText('Informe ao menos uma pessoa autorizada a buscar a criança')).toBeInTheDocument();
    expect(onSalvar).not.toHaveBeenCalled();
  });

  test('CT26 - mostra as 4 mensagens e destaca os campos com o formulário vazio', async () => {
    render(<FormularioAluno turmas={TURMAS} onSalvar={jest.fn()} onCancelar={jest.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getAllByRole('alert')).toHaveLength(4);
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Nome do Responsável')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Telefone do Responsável')).toHaveAttribute('aria-invalid', 'true');
  });

  test('CT27 - não adiciona autorizado sem grau de parentesco', async () => {
    const onChange = jest.fn();
    render(<ListaAutorizados autorizados={[]} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Nome do autorizado'), 'Pedro');
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar autorizado' }));

    expect(screen.getByText('Informe o grau de parentesco')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('RF10 - Atualizar Aluno', () => {
  test('CT28 - edita os dados de um aluno', async () => {
    api.atualizarAluno.mockImplementation(async (id, aluno) => ({ ...aluno, id }));
    await renderizarTela();

    await userEvent.click(within(linhaDo('Ana Souza')).getByRole('button', { name: 'Editar' }));
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana Souza');
    expect(screen.getByLabelText('Turma')).toHaveValue('2');
    expect(screen.getByText(/Rita - Avó/)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Telefone para Emergências'), '(48) 97777-3333');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(api.atualizarAluno).toHaveBeenCalledWith(
      10,
      expect.objectContaining({ telefoneEmergencia: '(48) 97777-3333' })
    );
    expect(await screen.findByText('Aluno atualizado com sucesso')).toBeInTheDocument();
  });

  test('CT29 - troca a turma de um aluno', async () => {
    api.atualizarAluno.mockImplementation(async (id, aluno) => ({ ...aluno, id }));
    await renderizarTela();

    await userEvent.click(within(linhaDo('Ana Souza')).getByRole('button', { name: 'Editar' }));
    await userEvent.selectOptions(screen.getByLabelText('Turma'), 'Maternal I');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await screen.findByText('Aluno atualizado com sucesso');
    expect(within(linhaDo('Ana Souza')).getByText('Maternal I')).toBeInTheDocument();
  });

  test('CT30 - bloqueia edição ao apagar campo obrigatório', async () => {
    await renderizarTela();

    await userEvent.click(within(linhaDo('Ana Souza')).getByRole('button', { name: 'Editar' }));
    await userEvent.clear(screen.getByLabelText('Nome do Responsável'));
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText('O nome do responsável é obrigatório')).toBeInTheDocument();
    expect(api.atualizarAluno).not.toHaveBeenCalled();
  });
});

describe('RF11 - Excluir Aluno', () => {
  test('CT31 - exclui um aluno após confirmação', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    api.excluirAluno.mockResolvedValue(null);
    await renderizarTela();

    await userEvent.click(within(linhaDo('Lucas Lima')).getByRole('button', { name: 'Excluir' }));

    expect(window.confirm).toHaveBeenCalledWith('Deseja excluir este aluno?');
    expect(api.excluirAluno).toHaveBeenCalledWith(11);
    expect(await screen.findByText('Aluno excluído com sucesso')).toBeInTheDocument();
    expect(screen.queryByText('Lucas Lima')).not.toBeInTheDocument();
  });

  test('CT32 - cancela a exclusão de um aluno', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    await renderizarTela();

    await userEvent.click(within(linhaDo('Lucas Lima')).getByRole('button', { name: 'Excluir' }));

    expect(api.excluirAluno).not.toHaveBeenCalled();
    expect(screen.getByText('Lucas Lima')).toBeInTheDocument();
  });
});
