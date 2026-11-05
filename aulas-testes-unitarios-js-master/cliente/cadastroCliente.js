const salvarCliente = cliente => {
    console.log("Cliente: ", cliente);

    if (!cliente.cpf) {
        return "O CPF é obrigatório;"
    }

    return "Cliente Salvo;"
}

module.exports = salvarCliente;