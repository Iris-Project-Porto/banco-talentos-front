import { describe, it, expect } from 'vitest';
import { createSkillSchema, skillSchema } from './validations';

describe('Skills Validations', () => {
    const dadosBase = {
        name: 'React',
        type: 'HARD' as const,
        category: 'FRONTEND' as const,
        description: 'Biblioteca JavaScript para interfaces',
    };

    const existingSkills = [
        { id: '1', name: 'React' },
        { id: '2', name: 'Python' },
    ];
    it('deve aprovar dados de skill válidos', () => {
        const result = skillSchema.safeParse(dadosBase);
        expect(result.success).toBe(true);
    });

    it('deve rejeitar skill sem nome', () => {
        const result = skillSchema.safeParse({
            ...dadosBase,
            name: '',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Nome da skill é obrigatório');
        }
    });

    it('deve rejeitar tipo inválido', () => {
        const result = skillSchema.safeParse({
            ...dadosBase,
            type: 'INVALIDO',
        });
        expect(result.success).toBe(false);
    });

    it('deve rejeitar categoria inválida', () => {
        const result = skillSchema.safeParse({
            ...dadosBase,
            category: 'INVALIDO',
        });
        expect(result.success).toBe(false);
    });

    it('deve aceitar descrição vazia', () => {
        const result = skillSchema.safeParse({
            name: 'Scrum',
            type: 'SOFT',
            category: 'MANAGEMENT',
            description: '',
        });
        expect(result.success).toBe(true);
    });

    it('deve rejeitar descrição acima de 500 caracteres', () => {
        const result = skillSchema.safeParse({
            ...dadosBase,
            description: 'a'.repeat(501),
        });
        expect(result.success).toBe(false);
    });

    it('deve rejeitar criação com nome duplicado', () => {
        const result = createSkillSchema(existingSkills).safeParse(dadosBase);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Já existe uma skill com este nome');
        }
    });

    it('deve ignorar duplicidade ao editar a mesma skill', () => {
        const result = createSkillSchema(existingSkills, '1').safeParse(dadosBase);
        expect(result.success).toBe(true);
    });

    it('deve comparar nomes sem diferenciar maiúsculas e espaços', () => {
        const result = createSkillSchema(existingSkills).safeParse({
            ...dadosBase,
            name: '  react  ',
        });
        expect(result.success).toBe(false);
    });
});