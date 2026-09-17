import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const mockLogout = vi.fn().mockResolvedValue(undefined);
vi.mock('@/features/auth', () => ({
    useAuth: () => ({
        user: { name: 'Admin Silva', email: 'admin@vilt-group.com' },
        logout: mockLogout,
    }),
}));

vi.mock('@/features/profiles', () => ({
    profilesApi: {
        getPendentes: vi.fn().mockResolvedValue({ totalElements: 3, content: [] }),
    },
}));

function renderLayout() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <AdminLayout />
            </MemoryRouter>
        </QueryClientProvider>,
    );
}

describe('AdminLayout Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve renderizar as informações do utilizador administrador na sidebar', () => {
        renderLayout();
        expect(screen.getAllByText('Admin Silva').length).toBeGreaterThan(0);
        expect(screen.getAllByText('admin@vilt-group.com').length).toBeGreaterThan(0);
    });

    it('deve renderizar todos os links de navegação específicos de Admin', () => {
        renderLayout();

        expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Fila de revisão').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Recursos').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Usuários').length).toBeGreaterThan(0);

        expect(screen.getAllByText('Vagas').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Skills').length).toBeGreaterThan(0);
    });

    it('deve exibir o badge de pendentes na Fila de revisão', async () => {
        renderLayout();

        await waitFor(() => {
            expect(screen.getAllByText('3 pendentes').length).toBeGreaterThan(0);
        });
    });

    it('deve invocar o logout e reencaminhar para /login ao clicar no botão "Sair"', async () => {
        renderLayout();
        const logoutButtons = screen.getAllByRole('button', { name: /Sair/i });
        fireEvent.click(logoutButtons[0]);

        expect(mockLogout).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
    });

    it('deve renderizar o Outlet (onde as rotas filhas são injetadas)', () => {
        renderLayout();
        expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });
});
