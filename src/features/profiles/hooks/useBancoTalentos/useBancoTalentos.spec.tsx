import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBancoTalentos } from './useBancoTalentos';
import { profilesApi } from '../../api/profiles.api';
import { act } from 'react';

// Mock do módulo de chamadas à API
vi.mock('../../api/profiles.api', () => ({
    profilesApi: {
        getAtivos: vi.fn()
    }
}));

const wrapperFactory = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
    );
};

describe('Hook useBancoTalentos', () => {
    const mockAtivos = [
        { id: '1', user: { name: 'Carlos Ramos' }, area: 'Backend', alocacaoStatus: 'Disponível (Bench)', skills: [{ skill: { name: 'Java' } }] },
        { id: '2', user: { name: 'Ana Costa' }, area: 'Frontend', alocacaoStatus: 'Disponível (Bench)', skills: [{ name: 'React' }] },
        { id: '3', user: { name: 'Rui Santos' }, area: 'DevOps', alocacaoStatus: 'Alocado Integral (100%)', skills: [{ name: 'Docker' }] }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(profilesApi.getAtivos).mockResolvedValue(mockAtivos);
    });

    it('deve carregar os perfis da API e filtrar apenas os que estão em situação de Bench', async () => {
        const { result } = renderHook(() => useBancoTalentos(), { wrapper: wrapperFactory() });

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // O Rui Santos (id: 3) está Alocado Integral, logo não deve constar na lista do Banco de Talentos (Bench)
        expect(result.current.filtered).toHaveLength(2);

        // Deve listar todas as áreas distintas dos ativos para alimentar as opções do select de BU
        expect(result.current.areas).toContain('Backend');
        expect(result.current.areas).toContain('Frontend');
        expect(result.current.areas).toContain('DevOps');
    });

    it('deve aplicar filtros corretamente por texto de pesquisa (nome ou skill)', async () => {
        const { result } = renderHook(() => useBancoTalentos(), { wrapper: wrapperFactory() });

        await waitFor(() => expect(result.current.loading).toBe(false));

        // Filtrar por nome
        act(() => {
            result.current.setSearch('Ana');
        });
        expect(result.current.filtered).toHaveLength(1);
        expect(result.current.filtered[0].user?.name).toBe('Ana Costa');

        // Filtrar por skill (Java)
        act(() => {
            result.current.setSearch('Java');
        });
        expect(result.current.filtered).toHaveLength(1);
        expect(result.current.filtered[0].user?.name).toBe('Carlos Ramos');
    });

    it('deve aplicar filtros corretamente por Business Unit (Área)', async () => {
        const { result } = renderHook(() => useBancoTalentos(), { wrapper: wrapperFactory() });

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.setArea('Backend');
        });

        expect(result.current.filtered).toHaveLength(1);
        expect(result.current.filtered[0].user?.name).toBe('Carlos Ramos');
    });
});