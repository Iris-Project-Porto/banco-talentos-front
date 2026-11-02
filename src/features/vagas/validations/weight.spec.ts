import { describe, expect, it } from 'vitest';
import { jobSkillSchema, vagaSchema } from './validations';

describe('Peso da skill', () => {
    const weightSchema = jobSkillSchema.shape.importanceWeight;

    it.each([1, 50, 100])('aceita o inteiro %s', (value) => {
        expect(weightSchema.parse(value)).toBe(value);
    });

    it.each(['', undefined, NaN, 'abc', 0, -1, 101, 1.5, Infinity])(
        'exibe uma mensagem clara para o peso inválido %s', (value) => {
            const result = weightSchema.safeParse(value);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Informe um peso inteiro de 1 a 100');
            }
        },
    );

    it.each([
        { weights: [50, 50], valid: true },
        { weights: [30, 30, 40], valid: true },
        { weights: [20, 30], valid: true },
        { weights: [50, 50, 50], valid: false },
        { weights: [50, 51], valid: false },
    ])('valida o total dos pesos $weights', ({ weights, valid }) => {
        const result = vagaSchema.safeParse({
            vacancyCode: 'VAG-001', title: 'Desenvolvedor', projectId: 'proj-123',
            squadId: 'squad-123', experienceLevel: 'PLENO', modality: 'REMOTO',
            recruiter: 'Maria', estimatedAllocationWeeks: 12, status: 'OPEN', openingDate: '2026-11-02',
            skills: weights.map((importanceWeight, index) => ({
                name: `Skill ${index}`, type: 'MANDATORY', minLevel: 'BASIC', importanceWeight,
            })),
        });
        expect(result.success).toBe(valid);
        if (!result.success) {
            expect(result.error.issues).toContainEqual(expect.objectContaining({
                path: ['skills'], message: 'A soma dos pesos das skills não pode ultrapassar 100%',
            }));
        }
    });
});