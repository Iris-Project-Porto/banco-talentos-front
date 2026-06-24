import { describe, it, expect } from 'vitest';
import { getCategoryBadgeStyle, getSkillCategoryLabel } from './skillDisplay';

describe('skillDisplay', () => {
    it('deve retornar rótulo em português para cada categoria da API', () => {
        expect(getSkillCategoryLabel('FRONTEND')).toBe('Frontend');
        expect(getSkillCategoryLabel('BACKEND')).toBe('Backend');
        expect(getSkillCategoryLabel('DATA_SCIENCE')).toBe('Ciência de Dados');
        expect(getSkillCategoryLabel('MANAGEMENT')).toBe('Gestão');
    });

    it('deve retornar classe de badge para a categoria', () => {
        expect(getCategoryBadgeStyle('FRONTEND')).toContain('bg-blue-50');
        expect(getCategoryBadgeStyle('DESIGN')).toContain('bg-green-50');
    });
});
