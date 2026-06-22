import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Outlet: () => <div data-testid="outlet">Mocked Outlet</div>,
    };
});

const mockLogout = vi.fn();
vi.mock('@/features/auth', () => ({
    useAuth: () => ({
        user: { name: 'Admin Silva', email: 'admin@vilt-group.com' },
        logout: mockLogout,
    }),
}));

describe('AdminLayout Component', () => {
    it('deve renderizar as informações do utilizador administrador na sidebar', () => {
        render(
            <MemoryRouter>
                <AdminLayout />
            </MemoryRouter>
        );
        expect(screen.getAllByText('Admin Silva').length).toBeGreaterThan(0);
        expect(screen.getAllByText('admin@vilt-group.com').length).toBeGreaterThan(0);
    });

    it('deve renderizar todos os links de navegação específicos de Admin', () => {
        render(
            <MemoryRouter>
                <AdminLayout />
            </MemoryRouter>
        );

        expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Fila de revisão').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Recursos').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Alocados').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Usuários').length).toBeGreaterThan(0);

        expect(screen.getAllByText('Vagas').length).toBeGreaterThan(0);
    });

    it('deve invocar o logout e reencaminhar para /login ao clicar no botão "Sair"', () => {
        render(
            <MemoryRouter>
                <AdminLayout />
            </MemoryRouter>
        );
        const logoutButtons = screen.getAllByRole('button', { name: /Sair/i });
        fireEvent.click(logoutButtons[0]);

        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('deve renderizar o Outlet (onde as rotas filhas são injetadas)', () => {
        render(
            <MemoryRouter>
                <AdminLayout />
            </MemoryRouter>
        );
        expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });
});