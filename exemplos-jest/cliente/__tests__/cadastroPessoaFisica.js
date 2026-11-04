const salvarCliente = require('../cadastroCliente')

describe("Cadastro de Pessoa Física", () => {
    it("Salvar Cliente Pessoa Física", () => {
        const cliente = {
            nome: "Biazus",
            tipoPessoa: "FISICA",
            cpf: "12345678901",
            dataNascimento: "01/01/1970"
        }

        const clienteSalvo = salvarCliente(cliente);

        expect(clienteSalvo).toBe("Cliente Salvo.");
    })

    it("Salvar Cliente Pessoa Física sem CPF", () => {
        const cliente = {
            nome: "Biazus",
            tipoPessoa: "FISICA",
            cpf: null,
            dataNascimento: "01/01/1970"
        }

        const clienteSalvo = salvarCliente(cliente);

        expect(clienteSalvo).toBe("O CPF é Obrigatório.");
    })

    it("Salvar Cliente Pessoa Física com CPF Inválido", () => {
        const cliente = {
            nome: "Biazus",
            tipoPessoa: "FISICA",
            cpf: "123456789012",
            dataNascimento: "01/01/1970"
        }

        const clienteSalvo = salvarCliente(cliente);

        expect(clienteSalvo).toBe("O CPF deve conter 11 caracteres.");
    })
});