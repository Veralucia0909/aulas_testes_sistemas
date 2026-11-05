const salvarCliente = require('../cadastroCliente')

test("Salvar Cliente", () => {
    const cliente = {
        nome: "Biazus",
        cpf: "12345678901",
        dataNascimento: "01/01/1970"
    }

    const clienteSalvo = salvarCliente(cliente);

    expect(clienteSalvo).toBe("Cliente Salvo;");
})

test("Salvar Cliente sem CPF", () => {
    const cliente = {
        nome: "Biazus",
        cpf: null,
        dataNascimento: "01/01/1970"
    }

    const clienteSalvo = salvarCliente(cliente);

    expect(clienteSalvo).toBe("O CPF é obrigatório;");
})