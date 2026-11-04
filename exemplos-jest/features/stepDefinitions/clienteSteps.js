const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require('expect');

Given('um cliente {object}', function (cliente) {
  // Write code here that turns the phrase above into concrete actions
  this.cliente = cliente
});

When('salvar um cliente', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('O resultado deve ser {string}', function (string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});