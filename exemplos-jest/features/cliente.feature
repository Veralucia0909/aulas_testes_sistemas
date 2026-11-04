Feature: Cadastro de cliente
  Todos querem saber quando é sexta-feira

  Scenario: Criar um Cliente
    Given o cliente 
    When salvar o cliente
    Then O resultado deve ser "Cliente Salvo"