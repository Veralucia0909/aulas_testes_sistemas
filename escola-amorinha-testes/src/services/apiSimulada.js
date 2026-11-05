// API falsa usada só no "npm run dev". Os dados ficam na memória e voltam ao início ao recarregar a página.
const banco = {
  turmas: [
    {
      "id": 1,
      "nome": "Berçário II",
      "turno": "Manhã"
    },
    {
      "id": 2,
      "nome": "Maternal I",
      "turno": "Tarde"
    },
    {
      "id": 3,
      "nome": "Jardim II",
      "turno": "Manhã"
    },
    {
      "id": 4,
      "nome": "Pré I",
      "turno": "Tarde"
    }
  ],
  alunos: [
    {
      "id": 10,
      "nome": "Arthur Lima",
      "dataNascimento": "2024-09-30",
      "turmaId": 1,
      "nomeResponsavel": "Renata Lima",
      "telefoneResponsavel": "(11) 98123-4504",
      "telefoneEmergencia": "",
      "restricoesAlimentares": "",
      "observacoes": "",
      "autorizaFotos": true,
      "autorizados": [
        {
          "nome": "José Lima",
          "parentesco": "Avô"
        }
      ]
    },
    {
      "id": 11,
      "nome": "Bernardo Ribeiro",
      "dataNascimento": "2023-06-19",
      "turmaId": 2,
      "nomeResponsavel": "Luciana Ribeiro",
      "telefoneResponsavel": "(11) 98123-4510",
      "telefoneEmergencia": "",
      "restricoesAlimentares": "Intolerância à lactose",
      "observacoes": "",
      "autorizaFotos": true,
      "autorizados": [
        {
          "nome": "Gustavo Ribeiro",
          "parentesco": "Pai"
        }
      ]
    },
    {
      "id": 12,
      "nome": "Cecília Araújo",
      "dataNascimento": "2021-03-21",
      "turmaId": 3,
      "nomeResponsavel": "Mônica Araújo",
      "telefoneResponsavel": "(11) 98123-4515",
      "telefoneEmergencia": "",
      "restricoesAlimentares": "",
      "observacoes": "",
      "autorizaFotos": true,
      "autorizados": [
        {
          "nome": "Ricardo Araújo",
          "parentesco": "Pai"
        },
        {
          "nome": "Helena Araújo",
          "parentesco": "Tia"
        }
      ]
    },
    {
      "id": 13,
      "nome": "Davi Almeida",
      "dataNascimento": "2023-02-25",
      "turmaId": 2,
      "nomeResponsavel": "Roberto Almeida",
      "telefoneResponsavel": "(11) 98123-4508",
      "telefoneEmergencia": "",
      "restricoesAlimentares": "",
      "observacoes": "",
      "autorizaFotos": false,
      "autorizados": [
        {
          "nome": "Cláudia Almeida",
          "parentesco": "Avó"
        }
      ]
    },
    {
      "id": 14,
      "nome": "Gabriel Santos",
      "dataNascimento": "2023-05-17",
      "turmaId": 2,
      "nomeResponsavel": "Aline Santos",
      "telefoneResponsavel": "(11) 98123-4506",
      "telefoneEmergencia": "",
      "restricoesAlimentares": "",
      "observacoes": "",
      "autorizaFotos": true,
      "autorizados": [
        {
          "nome": "Rafael Santos",
          "parentesco": "Pai"
        }
      ]
    },
    {
      "id": 15,
      "nome": "Heitor Martins",
      "dataNascimento": "2021-07-28",
      "turmaId": 3,
      "nomeResponsavel": "André Martins",
      "telefoneResponsavel": "(11) 98123-4512",
      "telefoneEmergencia": "",
      "restricoesAlimentares": "",
      "observacoes": "",
      "autorizaFotos": true,
      "autorizados": [
        {
          "nome": "Priscila Martins",
          "parentesco": "Mãe"
        }
      ]
    },
    {
      "id": 16,
      "nome": "Helena Souza",
      "dataNascimento": "2025-02-14",
      "turmaId": 1,
      "nomeResponsavel": "Juliana Souza",
      "telefoneResponsavel": "(11) 98123-4501",
      "telefoneEmergencia": "",
      "restricoesAlimentares": "Alergia a amendoim",
      "observacoes": "",
      "autorizaFotos": true,
      "autorizados": [
        {
          "nome": "Marcos Souza",
          "parentesco": "Pai"
        },
        {
          "nome": "Regina Souza",
          "parentesco": "Avó"
        }
      ]
    },
    {
      "id": 17,
      "nome": "Laura Mendes",
      "dataNascimento": "2025-01-22",
      "turmaId": 1,
      "nomeResponsavel": "Patrícia Mendes",
      "telefoneResponsavel": "(11) 98123-4503",
      "telefoneEmergencia": "",
      "restricoesAlimentares": "",
      "observacoes": "",
      "autorizaFotos": false,
      "autorizados": [
        {
          "nome": "Pedro Mendes",
          "parentesco": "Padrinho"
        },
        {
          "nome": "Maria Mendes",
          "parentesco": "Tia"
        }
      ]
    },
    {
      "id": 18,
      "nome": "Lívia Barbosa",
      "dataNascimento": "2021-01-15",
      "turmaId": 3,
      "nomeResponsavel": "Fábio Barbosa",
      "telefoneResponsavel": "(11) 98123-4513",
      "telefoneEmergencia": "",
      "restricoesAlimentares": "Sem glúten",
      "observacoes": "",
      "autorizaFotos": false,
      "autorizados": [
        {
          "nome": "Simone Barbosa",
          "parentesco": "Mãe"
        },
        {
          "nome": "Carla Nunes",
          "parentesco": "Madrinha"
        }
      ]
    },
    {
      "id": 19,
      "nome": "Manuela Costa",
      "dataNascimento": "2021-04-05",
      "turmaId": 3,
      "nomeResponsavel": "Daniela Costa",
      "telefoneResponsavel": "(11) 98123-4511",
      "telefoneEmergencia": "",
      "restricoesAlimentares": "",
      "observacoes": "",
      "autorizaFotos": true,
      "autorizados": [
        {
          "nome": "Felipe Costa",
          "parentesco": "Pai"
        },
        {
          "nome": "Teresa Costa",
          "parentesco": "Avó"
        }
      ]
    }
  ],
  proximoId: 100,
};

const resposta = (status, corpo) =>
  new Response(corpo === null ? null : JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function tratar(metodo, caminho, corpo) {
  const [, recurso, idTexto] = caminho.split('/');
  const lista = banco[recurso];
  if (!lista) return resposta(404, { mensagem: 'Rota não encontrada' });
  const id = Number(idTexto);

  if (metodo === 'GET') return resposta(200, lista);

  if (metodo === 'POST') {
    const novo = { ...corpo, id: banco.proximoId++ };
    lista.push(novo);
    return resposta(201, novo);
  }

  const indice = lista.findIndex((item) => item.id === id);
  if (indice === -1) return resposta(404, { mensagem: 'Registro não encontrado' });

  if (metodo === 'PUT') {
    lista[indice] = { ...corpo, id };
    return resposta(200, lista[indice]);
  }

  if (metodo === 'DELETE') {
    // RF05: turma com alunos não pode ser excluída
    if (recurso === 'turmas' && banco.alunos.some((a) => String(a.turmaId) === String(id))) {
      return resposta(409, { mensagem: 'Não é possível excluir a turma, pois ela possui alunos vinculados' });
    }
    lista.splice(indice, 1);
    return resposta(204, null);
  }

  return resposta(405, { mensagem: 'Método não permitido' });
}

export function instalarApiSimulada() {
  window.fetch = async (url, opcoes = {}) => {
    await new Promise((r) => setTimeout(r, 300)); // simula a demora da rede
    const caminho = new URL(url).pathname;
    const corpo = opcoes.body ? JSON.parse(opcoes.body) : undefined;
    return tratar(opcoes.method || 'GET', caminho, corpo);
  };
}
