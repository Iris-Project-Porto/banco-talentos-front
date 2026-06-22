import { describe, it, expect } from 'vitest';
import { skillSchema } from './validations';

describe('Skills Validations', () => {
    const dadosBase = {
        name: 'React',
        type: 'HARD' as const,
        importanceWeight: 8,
    };

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

    it('deve rejeitar importância acima de 10', () => {
        const result = skillSchema.safeParse({
            ...dadosBase,
            importanceWeight: 11,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Deve ser entre 0 e 10');
        }
    });

    it('deve forçar importância padrão como 5 quando omitida', () => {
        const result = skillSchema.safeParse({
            name: 'Scrum',
            type: 'SOFT',
        });
        if (result.success) {
            expect(result.data.importanceWeight).toBe(5);
        }
    });
});
