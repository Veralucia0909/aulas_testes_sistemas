const soma = require('./calculadora')
const salvarCliente = require('./cliente/cadastroCliente');

console.log("Soma: ", soma(2, 3));

console.log("Salvar Cliente: ", salvarCliente({
    nome: "Leonardo",
    cpf: "",
    dataNascimento: '29/09/1988'
}));