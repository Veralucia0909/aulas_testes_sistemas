//const assert = require('assert');
const { expect } = require('expect');
const { Given, When, Then } = require('@cucumber/cucumber');
const ehSextaFeira = require('../diasDaSemana')

let hoje = null;
let hojeEhSextaFeira;

Given('hoje é {string}', function (diaDaSemana) {
  hoje = diaDaSemana;
});

When('Eu perguntar se já é sexta-feira', function () {
  // Write code here that turns the phrase above into concrete actions
  hojeEhSextaFeira = ehSextaFeira(hoje);
});

Then('A resposta deve ser {string}', function (esperado) {
  // Write code here that turns the phrase above into concrete actions
  const resultado = hojeEhSextaFeira ? 'Sim' : 'Não';
  //const resultadoBoolean = hojeEhSextaFeira;
  
  //assert.strictEqual(resultado, esperado)
  expect(resultado).toBe(esperado);
  //expect(resultadoBoolean).toBeTruthy();
});

//Given('hoje é Sexta-Feira', function () {
  // Write code here that turns the phrase above into concrete actions
//  hoje = 'Sexta-Feira';
//});