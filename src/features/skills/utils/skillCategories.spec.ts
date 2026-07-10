import { describe, it, expect } from 'vitest';
import {
    HARD_SKILL_CATEGORIES,
    SOFT_SKILL_CATEGORIES,
    getSkillCategoriesByType,
    isCategoryCompatibleWithType,
    buildCategorySelectOptions,
} from './skillCategories';

describe('skillCategories', () => {
    it('deve retornar categorias por tipo', () => {
        expect(getSkillCategoriesByType('HARD')).toEqual(HARD_SKILL_CATEGORIES);
        expect(getSkillCategoriesByType('SOFT')).toEqual(SOFT_SKILL_CATEGORIES);
        expect(SOFT_SKILL_CATEGORIES).toHaveLength(20);
    });

    it('deve validar compatibilidade entre tipo e categoria', () => {
        expect(isCategoryCompatibleWithType('HARD', 'FRONTEND')).toBe(true);
        expect(isCategoryCompatibleWithType('SOFT', 'FRONTEND')).toBe(false);
        expect(isCategoryCompatibleWithType('', 'FRONTEND')).toBe(false);
    });

    it('deve montar opções com placeholder e rótulo', () => {
        const options = buildCategorySelectOptions(['FRONTEND']);

        expect(options[0]).toEqual({ value: '', label: 'Selecione a categoria' });
        expect(options[1]).toEqual({ value: 'FRONTEND', label: 'Frontend' });
    });
});
