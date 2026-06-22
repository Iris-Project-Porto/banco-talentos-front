import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSkillsQuery } from './useSkillsQuery';
import { skillsApi } from '../api/skills.api';

vi.mock('../api/skills.api', () => ({
    skillsApi: {
        getActiveSkills: vi.fn(),
        getInactiveSkills: vi.fn(),
    },
}));

const wrapperFactory = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('Hook useSkillsQuery', () => {
    const mockSkills = [
        {
            id: '1',
            name: 'React',
            type: 'HARD' as const,
            active: true,
            importanceWeight: 9,
        },
        {
            id: '2',
            name: 'Comunicação',
            type: 'SOFT' as const,
            active: true,
            importanceWeight: 7,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(skillsApi.getActiveSkills).mockResolvedValue({
            content: mockSkills,
            totalPages: 1,
            totalElements: 2,
        } as any);
        vi.mocked(skillsApi.getInactiveSkills).mockResolvedValue({
            content: [{ ...mockSkills[0], id: '3', name: 'Python', active: false }],
            totalPages: 1,
            totalElements: 1,
        } as any);
    });

    it('deve carregar skills ativas por padrão', async () => {
        const { result } = renderHook(() => useSkillsQuery(), { wrapper: wrapperFactory() });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(skillsApi.getActiveSkills).toHaveBeenCalledTimes(1);
        expect(skillsApi.getInactiveSkills).not.toHaveBeenCalled();
        expect(result.current.data).toHaveLength(2);
        expect(result.current.data?.[0].name).toBe('React');
    });

    it('deve carregar skills inativas quando inactive for true', async () => {
        const { result } = renderHook(() => useSkillsQuery(true), { wrapper: wrapperFactory() });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(skillsApi.getInactiveSkills).toHaveBeenCalledTimes(1);
        expect(skillsApi.getActiveSkills).not.toHaveBeenCalled();
        expect(result.current.data).toHaveLength(1);
        expect(result.current.data?.[0].name).toBe('Python');
    });
});
