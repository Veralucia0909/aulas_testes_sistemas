Feature: Já é Sexta-Feira?
  Todos querem saber quando é sexta-feira

  Scenario: Domingo não é sexta-feira
    Given hoje é "Domingo"
    When Eu perguntar se já é sexta-feira
    Then A resposta deve ser "Não"

    Given hoje é "Sexta-Feira"
    When Eu perguntar se já é sexta-feira
    Then A resposta deve ser "Sim"