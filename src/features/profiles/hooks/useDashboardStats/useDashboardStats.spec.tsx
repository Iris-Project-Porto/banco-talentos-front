import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDashboardStats } from './useDashboardStats';
import { profilesApi } from '../../api/profiles.api';

vi.mock('../../api/profiles.api', () => ({
    profilesApi: {
        getDashboard: vi.fn(),
        getAllProfiles: vi.fn()
    }
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('Hook useDashboardStats', () => {
    const mockDashData = {
        total: 10,
        ativos: 8,
        pendentes: 2,
        skillsCount: 15,
        topSkillsByProficiency: [
            { name: "React", score: 90 },
            { name: "TypeScript", score: 80 }
        ],
        topSkillsByImportance: [
            { name: "Node.js", score: 95 },
            { name: "Docker", score: 85 }
        ],
        levelCount: {
            Jr: 1,
            Pleno: 2,
            Sr: 1
        }
    };

    const mockAllProfiles = [
        { id: "1", allocationStatus: "Disponível (Bench)", nivel: "Jr", levelOverride: null },
        { id: "2", allocationStatus: "Alocado Integral (100%)", nivel: "Pleno", levelOverride: null },
        { id: "3", allocationStatus: "Disponível (Bench)", nivel: "Jr", levelOverride: "Sr" },
        { id: "4", allocationStatus: "Em Transição (saindo de projeto)", nivel: "Pleno", levelOverride: null }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(profilesApi.getDashboard).mockResolvedValue(mockDashData);
        vi.mocked(profilesApi.getAllProfiles).mockResolvedValue({ content: mockAllProfiles } as any);
    });

    it('deve indicar loading enquanto as chamadas estão em curso', () => {
        const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });
        expect(result.current.loading).toBe(true);
        expect(result.current.stats).toBeNull();
    });

    it('deve agregar corretamente as contagens de alocação e níveis ao terminar de carregar', async () => {
        const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.allProfilesLength).toBe(4);

        const stats = result.current.stats!;
        expect(stats).not.toBeNull();
        expect(stats.alocacaoMap['Disponível (Bench)']).toBe(2);
        expect(stats.alocacaoMap['Alocado Integral (100%)']).toBe(1);
        expect(stats.disponiveisBench).toBe(2);

        expect(stats.nivelCalculado).toEqual({
            Jr: 1,
            Pleno: 2,
            Sr: 1
        });
    });

    it('deve exibir inicialmente as Top Skills por "proficiency" e permitir mudar para "importance"', async () => {
        const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.skillView).toBe("proficiency");
        expect(result.current.stats!.skillsToRender).toEqual(mockDashData.topSkillsByProficiency);
        expect(result.current.stats!.maxSkill).toBe(90);

        act(() => {
            result.current.setSkillView("importance");
        });

        expect(result.current.skillView).toBe("importance");
        expect(result.current.stats!.skillsToRender).toEqual(mockDashData.topSkillsByImportance);
        expect(result.current.stats!.maxSkill).toBe(95);
    });
});