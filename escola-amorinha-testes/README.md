# Escola Amorinha – Cadastro de Alunos e Turmas

Frontend em **React** do sistema de cadastro da Escola Amorinha (Educação Infantil), com **testes de frontend** escritos em JSX usando **Jest** e **React Testing Library**.

Projeto desenvolvido para a Atividade de Fixação de Conteúdos – Testes no Frontend.

## Funcionalidades

**Turmas**
- Listar, incluir, editar e excluir turmas (nome e turno)
- Bloqueio da exclusão de turmas que possuem alunos vinculados

**Alunos**
- Listar alunos com nascimento, turma, responsável, telefone, autorizados e autorização de fotos
- Filtrar por nome do aluno e por turma
- Cadastrar, editar e excluir alunos
- Lista de autorizados a buscar a criança com grau de parentesco (ex.: Pedro – Padrinho, Maria – Tia)
- Validação dos campos obrigatórios

### Dados do aluno

| Campo | Obrigatório |
| --- | :---: |
| Nome | ✔ |
| Data de Nascimento | |
| Nome do Responsável | ✔ |
| Telefone do Responsável | ✔ |
| Telefone para Emergências | |
| Restrições Alimentares | |
| Autorização de fotos e vídeos | |
| Lista de autorizados a buscar | ✔ (ao menos 1) |
| Turma | |
| Observações | |

## Tecnologias

- React 18
- Vite (servidor de desenvolvimento)
- Jest + React Testing Library + user-event + jest-dom

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) (versão LTS).

```bash
# instalar as dependências
npm install --legacy-peer-deps

# abrir a aplicação no navegador (http://localhost:5173)
npm run dev

# rodar os testes
npm test

# rodar os testes mostrando cada cenário
npx jest --verbose

# rodar só a suíte de renderização
npm run test:renderizacao
```

> A aplicação usa uma **API simulada** (`src/services/apiSimulada.js`), então não precisa de backend. Os dados voltam ao início quando a página é recarregada.

## Estrutura do projeto

```
├── index.html
├── package.json
├── vite.config.mjs
├── jest.setup.js
└── src
    ├── main.jsx                  # ponto de entrada da aplicação
    ├── App.jsx                   # navegação entre Alunos e Turmas
    ├── estilos.css
    ├── components
    │   ├── Alunos.jsx            # tela de alunos
    │   ├── FormularioAluno.jsx   # cadastro/edição e validação
    │   ├── ListaAutorizados.jsx  # autorizados a buscar
    │   ├── FiltroAlunos.jsx      # filtro por nome e turma
    │   ├── Turmas.jsx            # tela de turmas
    │   ├── FormularioTurma.jsx
    │   ├── Mensagem.jsx
    │   └── Modal.jsx
    ├── services
    │   ├── api.js                # chamadas à API
    │   └── apiSimulada.js        # dados em memória para o npm run dev
    ├── utils
    │   └── formatar.js
    └── __tests__
        ├── Turmas.test.jsx       # CT01 a CT10
        ├── Alunos.test.jsx       # CT12 a CT32
        └── Renderizacao.test.jsx # CR01 a CR31
```

## Testes

São **74 testes** divididos em três suítes:

- `Turmas.test.jsx` e `Alunos.test.jsx`: 33 testes funcionais, unitários (um componente isolado) e de integração (tela completa com a API simulada por `jest.mock`).
- `Renderizacao.test.jsx`: 41 testes de renderização que conferem se os componentes mostram na tela o que devem.

### Suíte de renderização

| Grupo | Cenários | O que verifica |
| --- | --- | --- |
| Listagem de alunos | CR01 a CR10 | Título, botão de novo aluno, carregamento, 8 colunas, uma linha por aluno, dados formatados, autorizados, selo de restrição alimentar, botões Editar/Excluir, lista vazia |
| Filtro e mensagem | CR11 a CR14 | Campo de nome, turmas no select, botão Limpar filtros, mensagem de sucesso e ausência de mensagem |
| Cadastro de aluno | CR15 a CR24 | Janela Novo aluno, os 11 campos, campos vazios, tipos de campo, asterisco nos obrigatórios, turmas com turno, lista de autorizados, botões, sem erros antes de salvar |
| Edição de aluno | CR25 a CR31 | Janela Editar aluno, campos preenchidos, turma selecionada, flag de fotos, restrição e autorizados, dados do aluno clicado, modal |

### Suítes funcionais

| Requisito | Cenários |
| --- | --- |
| RF01 – Listar Turmas | CT01, CT02, CT03 |
| RF02 – Incluir Turma | CT04, CT05 |
| RF03 – Atualizar Turma | CT06, CT07 |
| RF04 – Excluir Turma | CT08, CT09 |
| RF05 – Bloquear exclusão de Turma com Alunos | CT10 |
| RF06 – Listar Alunos | CT12, CT13 |
| RF07 – Filtrar Alunos por nome e turma | CT14 a CT18 |
| RF08 – Inserir Aluno | CT19 a CT23 |
| RF09 – Bloquear inserção sem campos obrigatórios | CT24 a CT27 |
| RF10 – Atualizar Aluno | CT28, CT29, CT30 |
| RF11 – Excluir Aluno | CT31, CT32 |

Os cenários CT11 e CT33 são testes **E2E** (fluxo completo com frontend e API reais) e estão descritos no Plano de Testes para execução com Cypress ou Playwright.

Exemplo de teste:

```jsx
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
```
