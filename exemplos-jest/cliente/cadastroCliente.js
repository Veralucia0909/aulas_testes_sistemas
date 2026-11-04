const salvarCliente = cliente => {
    //console.log("Cliente: ", cliente);

    if (!cliente.tipoPessoa) {
        return "O Tipo de Pessoa é Obrigatório."
    }

    let mensagemValidacao = "";

    if ("FISICA" === cliente.tipoPessoa) {
        mensagemValidacao = validarCPF(cliente);
    } else {
        mensagemValidacao = validarCNPJ(cliente);
    }

    return !mensagemValidacao ? "Cliente Salvo." : mensagemValidacao;
}

const validarCPF = cliente => {
    if (!cliente.cpf) {
        return "O CPF é Obrigatório.";
    }

    if (cliente.cpf.length !== 11) {
        return "O CPF deve conter 11 caracteres.";
    }

    return "";
}

const validarCNPJ = cliente => {
    if (!cliente.cnpj) {
        return "O CNPJ é Obrigatório.";
    }

    if (cliente.cnpj.length !== 14) {
        return "O CNPJ deve conter 14 caracteres.";
    }

    return "";
}

module.exports = salvarCliente;