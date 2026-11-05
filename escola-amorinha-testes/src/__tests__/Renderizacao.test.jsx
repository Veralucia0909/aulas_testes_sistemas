// Suíte de testes de RENDERIZAÇÃO
// Verifica se os componentes da listagem, do cadastro e da edição de alunos
// mostram na tela (DOM) exatamente o que devem mostrar.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alunos from '../components/Alunos';
import FiltroAlunos from '../components/FiltroAlunos';
import FormularioAluno from '../components/FormularioAluno';
import ListaAutorizados from '../components/ListaAutorizados';
import Mensagem from '../components/Mensagem';
import Modal from '../components/Modal';
import * as api from '../services/api';

jest.mock('../services/api');

const TURMAS = [
  { id: 1, nome: 'Berçário II', turno: 'Manhã' },
  { id: 2, nome: 'Maternal I', turno: 'Tarde' },
];

const ARTHUR = {
  id: 10,
  nome: 'Arthur Lima',
  dataNascimento: '2024-09-30',
  turmaId: 1,
  nomeResponsavel: 'Renata Lima',
  telefoneResponsavel: '(11) 98123-4504',
  telefoneEmergencia: '(11) 97777-0000',
  restricoesAlimentares: '',
  observacoes: 'Dorme depois do almoço',
  autorizaFotos: true,
  autorizados: [{ nome: 'José Lima', parentesco: 'Avô' }],
};

const BERNARDO = {
  id: 11,
  nome: 'Bernardo Ribeiro',
  dataNascimento: '2023-06-19',
  turmaId: 2,
  nomeResponsavel: 'Luciana Ribeiro',
  telefoneResponsavel: '(11) 98123-4510',
  telefoneEmergencia: '',
  restricoesAlimentares: 'Intolerância à lactose',
  observacoes: '',
  autorizaFotos: false,
  autorizados: [
    { nome: 'Gustavo Ribeiro', parentesco: 'Pai' },
    { nome: 'Helena Ribeiro', parentesco: 'Tia' },
  ],
};

const linhaDo = (nome) => screen.getByText(nome).closest('tr');

beforeEach(() => {
  jest.clearAllMocks();
  api.listarTurmas.mockResolvedValue(TURMAS);
  api.listarAlunos.mockResolvedValue([ARTHUR, BERNARDO]);
});

// ---------------------------------------------------------------------------
describe('Renderização da listagem de alunos', () => {
  test('CR01 - renderiza o título e o botão "+ Novo aluno"', async () => {
    render(<Alunos />);
    await screen.findByText('Arthur Lima');

    expect(screen.getByRole('heading', { name: 'Alunos', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Novo aluno' })).toBeInTheDocument();
  });

  test('CR02 - renderiza "Carregando..." antes da resposta da API', () => {
    api.listarAlunos.mockReturnValue(new Promise(() => {}));
    render(<Alunos />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('CR03 - renderiza a tabela com as 8 colunas', async () => {
    render(<Alunos />);
    await screen.findByText('Arthur Lima');

    const colunas = screen.getAllByRole('columnheader').map((th) => th.textContent);
    expect(colunas).toEqual([
      'Nome', 'Nascimento', 'Turma', 'Responsável', 'Telefone', 'Autorizados', 'Fotos', 'Ações',
    ]);
  });

  test('CR04 - renderiza uma linha para cada aluno', async () => {
    render(<Alunos />);
    await screen.findByText('Arthur Lima');

    // 1 linha de cabeçalho + 2 alunos
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  test('CR05 - renderiza os dados do aluno formatados na linha', async () => {
    render(<Alunos />);
    await screen.findByText('Arthur Lima');
    const linha = within(linhaDo('Arthur Lima'));

    expect(linha.getByText('30/09/2024')).toBeInTheDocument();
    expect(linha.getByText('Berçário II - Manhã')).toBeInTheDocument();
    expect(linha.getByText('Renata Lima')).toBeInTheDocument();
    expect(linha.getByText('(11) 98123-4504')).toBeInTheDocument();
    expect(linha.getByText('José Lima – Avô')).toBeInTheDocument();
    expect(linha.getByText('Sim')).toBeInTheDocument();
  });

  test('CR06 - renderiza vários autorizados separados por vírgula e "Não" para fotos', async () => {
    render(<Alunos />);
    await screen.findByText('Bernardo Ribeiro');
    const linha = within(linhaDo('Bernardo Ribeiro'));

    expect(linha.getByText('Gustavo Ribeiro – Pai, Helena Ribeiro – Tia')).toBeInTheDocument();
    expect(linha.getByText('Não')).toBeInTheDocument();
  });

  test('CR07 - renderiza o selo "Restrição alimentar" só para quem tem restrição', async () => {
    render(<Alunos />);
    await screen.findByText('Arthur Lima');

    const selo = within(linhaDo('Bernardo Ribeiro')).getByText('Restrição alimentar');
    expect(selo).toHaveAttribute('title', 'Intolerância à lactose');
    expect(within(linhaDo('Arthur Lima')).queryByText('Restrição alimentar')).not.toBeInTheDocument();
  });

  test('CR08 - renderiza os botões Editar e Excluir em cada linha', async () => {
    render(<Alunos />);
    await screen.findByText('Arthur Lima');

    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Excluir' })).toHaveLength(2);
  });

  test('CR09 - renderiza "Nenhum aluno cadastrado" sem tabela quando a lista está vazia', async () => {
    api.listarAlunos.mockResolvedValue([]);
    render(<Alunos />);

    expect(await screen.findByText('Nenhum aluno cadastrado')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('CR10 - não renderiza mensagem nem formulário ao abrir a tela', async () => {
    render(<Alunos />);
    await screen.findByText('Arthur Lima');

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Renderização do filtro de alunos', () => {
  test('CR11 - renderiza o campo de nome e o select de turmas', () => {
    render(<FiltroAlunos filtro={{ nome: '', turmaId: '' }} turmas={TURMAS} onChange={jest.fn()} />);

    expect(screen.getByText('Nome do aluno')).toBeInTheDocument();
    expect(screen.getByLabelText('Buscar por nome')).toHaveAttribute('placeholder', 'Buscar por nome...');
    const opcoes = within(screen.getByLabelText('Filtrar por turma')).getAllByRole('option');
    expect(opcoes.map((o) => o.textContent)).toEqual(['Todas', 'Berçário II - Manhã', 'Maternal I - Tarde']);
  });

  test('CR12 - renderiza "Limpar filtros" só quando há filtro aplicado', () => {
    const { rerender } = render(
      <FiltroAlunos filtro={{ nome: '', turmaId: '' }} turmas={TURMAS} onChange={jest.fn()} />
    );
    expect(screen.queryByRole('button', { name: 'Limpar filtros' })).not.toBeInTheDocument();

    rerender(<FiltroAlunos filtro={{ nome: 'Ana', turmaId: '' }} turmas={TURMAS} onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Limpar filtros' })).toBeInTheDocument();
  });
});

describe('Renderização da mensagem', () => {
  test('CR13 - renderiza mensagem de sucesso com botão de fechar', () => {
    render(<Mensagem mensagem={{ texto: 'Aluno cadastrado com sucesso', tipo: 'sucesso' }} onFechar={jest.fn()} />);

    expect(screen.getByRole('status')).toHaveClass('mensagem-sucesso');
    expect(screen.getByText('Aluno cadastrado com sucesso')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fechar mensagem' })).toBeInTheDocument();
  });

  test('CR14 - não renderiza nada quando não há mensagem', () => {
    const { container } = render(<Mensagem mensagem={null} onFechar={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });
});

// ---------------------------------------------------------------------------
describe('Renderização do cadastro de aluno', () => {
  const renderizarCadastro = () =>
    render(<FormularioAluno turmas={TURMAS} onSalvar={jest.fn()} onCancelar={jest.fn()} />);

  test('CR15 - abre a janela "Novo aluno" ao clicar em "+ Novo aluno"', async () => {
    render(<Alunos />);
    await screen.findByText('Arthur Lima');

    await userEvent.click(screen.getByRole('button', { name: '+ Novo aluno' }));

    const janela = screen.getByRole('dialog', { name: 'Novo aluno' });
    expect(within(janela).getByRole('heading', { name: 'Novo aluno' })).toBeInTheDocument();
    expect(within(janela).getByRole('form', { name: 'Formulário de aluno' })).toBeInTheDocument();
  });

  test.each([
    'Nome',
    'Data de Nascimento',
    'Nome do Responsável',
    'Telefone do Responsável',
    'Telefone para Emergências',
    'Turma',
    'Restrições Alimentares',
    'Observações',
    'Autoriza fotos e vídeos para uso escolar',
    'Nome do autorizado',
    'Grau de parentesco',
  ])('CR16 - renderiza o campo "%s"', (rotulo) => {
    renderizarCadastro();

    expect(screen.getByLabelText(rotulo)).toBeInTheDocument();
  });

  test('CR17 - renderiza os campos vazios e a flag de fotos desmarcada', () => {
    renderizarCadastro();

    expect(screen.getByLabelText('Nome')).toHaveValue('');
    expect(screen.getByLabelText('Nome do Responsável')).toHaveValue('');
    expect(screen.getByLabelText('Telefone do Responsável')).toHaveValue('');
    expect(screen.getByLabelText('Observações')).toHaveValue('');
    expect(screen.getByLabelText('Turma')).toHaveValue('');
    expect(screen.getByLabelText('Autoriza fotos e vídeos para uso escolar')).not.toBeChecked();
  });

  test('CR18 - renderiza os tipos corretos de campo', () => {
    renderizarCadastro();

    expect(screen.getByLabelText('Data de Nascimento')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Telefone do Responsável')).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText('Telefone para Emergências')).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText('Autoriza fotos e vídeos para uso escolar')).toHaveAttribute('type', 'checkbox');
    expect(screen.getByLabelText('Observações').tagName).toBe('TEXTAREA');
  });

  test('CR19 - marca os campos obrigatórios com asterisco (classe "requerido")', () => {
    renderizarCadastro();

    ['Nome', 'Nome do Responsável', 'Telefone do Responsável'].forEach((rotulo) => {
      expect(screen.getByText(rotulo, { selector: 'label' })).toHaveClass('requerido');
    });
    expect(screen.getByText('Autorizados a buscar')).toHaveClass('requerido');
    expect(screen.getByText('Data de Nascimento', { selector: 'label' })).not.toHaveClass('requerido');
  });

  test('CR20 - renderiza o select de turma com "Selecione" e as turmas com turno', () => {
    renderizarCadastro();

    const opcoes = within(screen.getByLabelText('Turma')).getAllByRole('option');
    expect(opcoes.map((o) => o.textContent)).toEqual(['Selecione', 'Berçário II - Manhã', 'Maternal I - Tarde']);
  });

  test('CR21 - renderiza a lista de autorizados vazia e o botão de adicionar', () => {
    renderizarCadastro();

    const lista = screen.getByRole('list', { name: 'Lista de autorizados' });
    expect(within(lista).queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Adicionar autorizado' })).toBeInTheDocument();
  });

  test('CR22 - renderiza os botões Salvar e Cancelar', () => {
    renderizarCadastro();

    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute('type', 'submit');
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveAttribute('type', 'button');
  });

  test('CR23 - não renderiza mensagens de erro antes de salvar', () => {
    renderizarCadastro();

    expect(screen.queryAllByRole('alert')).toHaveLength(0);
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-invalid', 'false');
  });
});

describe('Renderização da lista de autorizados', () => {
  test('CR24 - renderiza um item com botão "Remover" para cada autorizado', () => {
    render(<ListaAutorizados autorizados={BERNARDO.autorizados} onChange={jest.fn()} />);

    const itens = within(screen.getByRole('list', { name: 'Lista de autorizados' })).getAllByRole('listitem');
    expect(itens).toHaveLength(2);
    expect(itens[0]).toHaveTextContent('Gustavo Ribeiro - Pai');
    expect(itens[1]).toHaveTextContent('Helena Ribeiro - Tia');
    expect(screen.getByRole('button', { name: 'Remover Gustavo Ribeiro' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remover Helena Ribeiro' })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
describe('Renderização da edição de aluno', () => {
  const renderizarEdicao = (aluno = ARTHUR) =>
    render(
      <FormularioAluno
        alunoInicial={{ ...aluno, turmaId: String(aluno.turmaId) }}
        turmas={TURMAS}
        onSalvar={jest.fn()}
        onCancelar={jest.fn()}
      />
    );

  test('CR25 - abre a janela "Editar aluno" ao clicar em Editar', async () => {
    render(<Alunos />);
    await screen.findByText('Arthur Lima');

    await userEvent.click(within(linhaDo('Arthur Lima')).getByRole('button', { name: 'Editar' }));

    expect(screen.getByRole('dialog', { name: 'Editar aluno' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Editar aluno' })).toBeInTheDocument();
  });

  test('CR26 - renderiza todos os campos preenchidos com os dados do aluno', () => {
    renderizarEdicao();

    expect(screen.getByLabelText('Nome')).toHaveValue('Arthur Lima');
    expect(screen.getByLabelText('Data de Nascimento')).toHaveValue('2024-09-30');
    expect(screen.getByLabelText('Nome do Responsável')).toHaveValue('Renata Lima');
    expect(screen.getByLabelText('Telefone do Responsável')).toHaveValue('(11) 98123-4504');
    expect(screen.getByLabelText('Telefone para Emergências')).toHaveValue('(11) 97777-0000');
    expect(screen.getByLabelText('Observações')).toHaveValue('Dorme depois do almoço');
  });

  test('CR27 - renderiza a turma do aluno selecionada', () => {
    renderizarEdicao();

    expect(screen.getByLabelText('Turma')).toHaveValue('1');
    expect(screen.getByRole('option', { name: 'Berçário II - Manhã' }).selected).toBe(true);
  });

  test('CR28 - renderiza a flag de fotos conforme o cadastro', () => {
    const { unmount } = renderizarEdicao(ARTHUR);
    expect(screen.getByLabelText('Autoriza fotos e vídeos para uso escolar')).toBeChecked();
    unmount();

    renderizarEdicao(BERNARDO);
    expect(screen.getByLabelText('Autoriza fotos e vídeos para uso escolar')).not.toBeChecked();
  });

  test('CR29 - renderiza a restrição alimentar e os autorizados já cadastrados', () => {
    renderizarEdicao(BERNARDO);

    expect(screen.getByLabelText('Restrições Alimentares')).toHaveValue('Intolerância à lactose');
    const itens = within(screen.getByRole('list', { name: 'Lista de autorizados' })).getAllByRole('listitem');
    expect(itens).toHaveLength(2);
    expect(itens[0]).toHaveTextContent('Gustavo Ribeiro - Pai');
  });

  test('CR30 - a janela de edição mostra os dados do aluno clicado na listagem', async () => {
    render(<Alunos />);
    await screen.findByText('Bernardo Ribeiro');

    await userEvent.click(within(linhaDo('Bernardo Ribeiro')).getByRole('button', { name: 'Editar' }));
    const janela = within(screen.getByRole('dialog', { name: 'Editar aluno' }));

    expect(janela.getByLabelText('Nome')).toHaveValue('Bernardo Ribeiro');
    expect(janela.getByLabelText('Turma')).toHaveValue('2');
    expect(janela.getByText('Helena Ribeiro - Tia')).toBeInTheDocument();
  });
});

describe('Renderização do modal', () => {
  test('CR31 - renderiza o título e o conteúdo recebido', () => {
    render(<Modal titulo="Novo aluno"><p>Conteúdo do formulário</p></Modal>);

    const janela = screen.getByRole('dialog', { name: 'Novo aluno' });
    expect(janela).toHaveAttribute('aria-modal', 'true');
    expect(within(janela).getByText('Conteúdo do formulário')).toBeInTheDocument();
  });
});
