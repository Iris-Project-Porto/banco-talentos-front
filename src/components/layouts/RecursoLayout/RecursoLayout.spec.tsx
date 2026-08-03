import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecursoLayout from './RecursoLayout';

// 1. Fazer o mock do useNavigate e Outlet do react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Outlet: () => <div data-testid="outlet">Mocked Outlet</div>,
    };
});

// 2. Fazer o mock do useAuth
const mockLogout = vi.fn().mockResolvedValue(undefined);
vi.mock('@/features/auth', () => ({
    useAuth: () => ({
        user: { name: 'João Utilizador', email: 'joao@vilt-group.com' },
        logout: mockLogout,
    }),
}));

describe('RecursoLayout Component', () => {
    it('deve renderizar as informações do utilizador na sidebar', () => {
        render(
            <MemoryRouter>
                <RecursoLayout />
            </MemoryRouter>
        );

        // Como a sidebar renderiza para desktop e mobile, o nome e email podem aparecer duplicados no DOM. 
        // Usamos getAllByText e verificamos se existem na tela.
        expect(screen.getAllByText('João Utilizador').length).toBeGreaterThan(0);
        expect(screen.getAllByText('joao@vilt-group.com').length).toBeGreaterThan(0);
    });

    it('deve renderizar os links de navegação', () => {
        render(
            <MemoryRouter>
                <RecursoLayout />
            </MemoryRouter>
        );
        // Verifica os links presentes em navItems
        expect(screen.getAllByText('Meu Perfil').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Meu Histórico').length).toBeGreaterThan(0);
    });

    it('deve chamar a função de logout e navegar para /login ao clicar em Sair', async () => {
        render(
            <MemoryRouter>
                <RecursoLayout />
            </MemoryRouter>
        );

        // Clicar no botão Sair (pegamos o primeiro que aparecer)
        const logoutButtons = screen.getAllByRole('button', { name: /Sair/i });
        fireEvent.click(logoutButtons[0]);

        // Verifica se a função de contexto foi chamada
        expect(mockLogout).toHaveBeenCalledTimes(1);
        // O logout é assíncrono: a navegação só ocorre após a promise resolver
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
    });

    it('deve renderizar o Outlet (conteúdo filho)', () => {
        render(
            <MemoryRouter>
                <RecursoLayout />
            </MemoryRouter>
        );
        expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });
});