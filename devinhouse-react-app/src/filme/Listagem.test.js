import {render, screen } from '@testing-library/react'
import Listagem from './Listagem'

describe('Listagem de Filmes', () => {
    it('Deve conter a mensagem de filmes não encontrados quando a lista for vazia', () => {
        const filmes = [];

        render(<Listagem filmes={filmes} />)
        const mensagem = screen.getByText("Não existem filmes a ser listados.");
        expect(mensagem).toBeInTheDocument();
    })
})