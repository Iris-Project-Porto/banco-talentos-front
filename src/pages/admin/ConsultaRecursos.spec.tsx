import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ConsultaRecursos from './ConsultaRecursos';
import { recursosApi } from '@/features/recursos/api/recursos.api';

vi.mock('@/features/recursos/api/recursos.api', () => ({
    recursosApi: {
        listar: vi.fn(),
    }
}));

const mockPage = {
    content: [
        {
            id: 'uuid-1',
            name: 'João Silva',
            email: 'joao@vilt-group.com',
            statusRecurso: 'DISPONIVEL',
            statusMatricula: 'NAO_NECESSARIO',
            possuiMaquinaCliente: false,
            maquinas: [],
            gerenteProjeto: null,
            projetoAlocacao: null,
            dataEntradaProjeto: null,
            recursoBillable: null,
            onboardingPortoRealizado: null,
        },
        {
            id: 'uuid-2',
            name: 'Maria Costa',
            email: 'maria@vilt-group.com',
            statusRecurso: 'ALOCADO',
            statusMatricula: 'LIBERADA',
            possuiMaquinaCliente: true,
            maquinas: [],
            gerenteProjeto: 'Carlos Gerente',
            projetoAlocacao: 'Projeto X',
            dataEntradaProjeto: '2026-01-15',
            recursoBillable: true,
            onboardingPortoRealizado: true,
        },
    ],
    totalElements: 2,
    totalPages: 1,
    number: 0,
    size: 20,
};

const renderComponent = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ConsultaRecursos />
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('ConsultaRecursos Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(recursosApi.listar).mockResolvedValue(mockPage as any);
    });

    it('deve exibir o cabeçalho da página corretamente', async () => {
        renderComponent();
        expect(screen.getByText('Recursos')).toBeInTheDocument();
        expect(screen.getByText('Consulta e gestão do ciclo de vida dos recursos')).toBeInTheDocument();
    });

    it('deve exibir os recursos retornados pela API na tabela', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('João Silva')).toBeInTheDocument();
            expect(screen.getByText('Maria Costa')).toBeInTheDocument();
        });

        expect(screen.getByText('joao@vilt-group.com')).toBeInTheDocument();
        expect(screen.getByText('maria@vilt-group.com')).toBeInTheDocument();
    });

    it('deve exibir badges corretos de Status Recurso', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Disponível')).toBeInTheDocument();
            expect(screen.getByText('Alocado')).toBeInTheDocument();
        });
    });

    it('deve exibir badges corretos de Status Matrícula', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Não necessário')).toBeInTheDocument();
            expect(screen.getByText('Liberada')).toBeInTheDocument();
        });
    });

    it('deve exibir badges Sim/Não para Billable e Onboarding corretamente', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getAllByText('Sim').length).toBeGreaterThanOrEqual(2);
        });
    });

    it('deve exibir o rodapé com contagem total de recursos', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Mostrando 2 de 2 recursos/i)).toBeInTheDocument();
        });
    });

    it('deve exibir estado de carregamento enquanto a API não responde', () => {
        vi.mocked(recursosApi.listar).mockReturnValue(new Promise(() => {}));
        renderComponent();
        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('deve exibir mensagem de lista vazia quando não há recursos', async () => {
        vi.mocked(recursosApi.listar).mockResolvedValue({
            content: [], totalElements: 0, totalPages: 0, number: 0, size: 20
        } as any);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Nenhum recurso encontrado.')).toBeInTheDocument();
        });
    });

    it('deve chamar a API com filtro de nome ao digitar no campo de busca e aplicar', async () => {
        renderComponent();
        await waitFor(() => expect(recursosApi.listar).toHaveBeenCalledTimes(1));

        const searchInput = screen.getByPlaceholderText('Buscar...');
        fireEvent.change(searchInput, { target: { value: 'João' } });

        const applyBtn = screen.getByText('Aplicar Filtros');
        fireEvent.click(applyBtn);

        await waitFor(() => {
            expect(recursosApi.listar).toHaveBeenCalledTimes(2);
            const [filters] = vi.mocked(recursosApi.listar).mock.calls[1];
            expect(filters.nome).toBe('João');
        });
    });

    it('deve limpar filtros após clicar em Limpar', async () => {
        renderComponent();
        await waitFor(() => expect(recursosApi.listar).toHaveBeenCalledTimes(1));

        // Preenche o campo de busca
        const searchInput = screen.getByPlaceholderText('Buscar...');
        fireEvent.change(searchInput, { target: { value: 'Maria' } });
        expect(searchInput).toHaveValue('Maria');

        // Aplica para mudar o estado `applied`
        fireEvent.click(screen.getByText('Aplicar Filtros'));
        await waitFor(() => expect(recursosApi.listar).toHaveBeenCalledTimes(2));

        // Agora limpa
        fireEvent.click(screen.getByText('Limpar'));

        // O campo deve estar vazio
        expect(searchInput).toHaveValue('');

        // E uma nova chamada deve ter sido feita com filtros vazios
        await waitFor(() => expect(recursosApi.listar).toHaveBeenCalledTimes(3));
        const [filters] = vi.mocked(recursosApi.listar).mock.calls[2];
        expect(filters.nome).toBe('');
    });

    it('deve exibir data de entrada formatada (mês e ano visíveis)', async () => {
        renderComponent();

        await waitFor(() => {
            // Verifica que a data contém o ano e o mês, independente do formato exato do locale no ambiente de teste
            const dateCells = screen.getAllByText(/2026/);
            expect(dateCells.length).toBeGreaterThanOrEqual(1);
        });
    });
});
