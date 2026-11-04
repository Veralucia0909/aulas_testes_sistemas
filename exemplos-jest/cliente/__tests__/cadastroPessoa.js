const salvarCliente = require('../cadastroCliente')

describe("Cliente Sem Tipo de Pessoa", () => {
    it("Salvar Cliente sem Tipo de Pessoa", () => {
        const cliente = {
            nome: "Biazus",
            tipoPessoa: null,
            cpf: null,
            dataNascimento: "01/01/1970"
        }

        const clienteSalvo = salvarCliente(cliente);

        expect(clienteSalvo).toBe("O Tipo de Pessoa é Obrigatório.");
    })
});