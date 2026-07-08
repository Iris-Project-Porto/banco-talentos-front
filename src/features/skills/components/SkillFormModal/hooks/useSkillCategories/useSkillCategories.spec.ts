import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSkillCategories } from './useSkillCategories';

describe('Hook useSkillCategories', () => {
    it('deve retornar opções filtradas pelo tipo selecionado', () => {
        const setValue = vi.fn();
        const { result } = renderHook(() => useSkillCategories('HARD', '', setValue));

        expect(result.current.categoryOptions).toEqual(
            expect.arrayContaining([{ value: 'FRONTEND', label: 'Frontend' }]),
        );
        expect(result.current.categoryOptions.some((o) => o.value === 'COMMUNICATION')).toBe(false);
    });

    it('deve limpar categoria incompatível ao trocar o tipo', () => {
        const setValue = vi.fn();
        const { rerender } = renderHook(
            ({ type, category }) => useSkillCategories(type, category, setValue),
            { initialProps: { type: 'HARD', category: 'FRONTEND' } },
        );

        rerender({ type: 'SOFT', category: 'FRONTEND' });

        expect(setValue).toHaveBeenCalledWith('category', '', { shouldValidate: false });
    });
});
