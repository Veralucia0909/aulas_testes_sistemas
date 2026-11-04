import { render, screen } from '@testing-library/react';
import EstruturaDaPagina from "./EstruturaDaPagina";

describe('Teste da Estrutura de Página', () => {
    it('Deve conter o título correto da página', () => {
        render(<EstruturaDaPagina title="Título da Página" />);

        const titulo = screen.getByText('Título da Página');
        expect(titulo).toBeInTheDocument();
    })

    it('Deve conter o nome da aplicação', () => {
        render(<EstruturaDaPagina />);

        const titulo = screen.getByText('Dev In House React App');
        expect(titulo).toBeInTheDocument();
        // expect(screen.getByRole('h2', {
        //     name: 'Dev In House React App'
        // })).toBeInTheDocument();
    })
})