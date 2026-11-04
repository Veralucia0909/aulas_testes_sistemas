const salvarCliente = require('../cadastroCliente')

describe("Cadastro de Pessoa Física", () => {

    it("Salvar Cliente Pessoa Jurídica sem CNPJ", () => {
        const cliente = {
            nome: "Biazus",
            tipoPessoa: "JURIDIA",
            cnpj: null,
            dataFundacao: "01/01/1970"
        }

        const clienteSalvo = salvarCliente(cliente);

        expect(clienteSalvo).toBe("O CNPJ é Obrigatório.");
    })

    it("Salvar Cliente Pessoa Jurídica com CNPJ Inválido", () => {
        const cliente = {
            nome: "Biazus",
            tipoPessoa: "JURIDICA",
            cnpj: "123456789012",
            dataFundacao: "01/01/1970"
        }

        const clienteSalvo = salvarCliente(cliente);

        expect(clienteSalvo).toBe("O CNPJ deve conter 14 caracteres.");
    })

    it("Salvar Cliente Pessoa Jurídica", () => {
        const cliente = {
            nome: "Biazus",
            tipoPessoa: "JURIDICA",
            cnpj: "12345678000112",
            dataFundacao: "01/01/1970"
        }

        const clienteSalvo = salvarCliente(cliente);

        expect(clienteSalvo).toBe("Cliente Salvo.");
    })
});