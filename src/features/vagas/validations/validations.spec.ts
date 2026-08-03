import { describe, it, expect } from 'vitest';
import { vagaSchema } from './validations';

describe('Vagas Validations', () => {
    const dadosBase = {
        vacancyCode: "VAG-001",
        title: "Desenvolvedor React",
        projectId: "proj-123",
        squadId: "sq-123",
        experienceLevel: "PLENO",
        modality: "REMOTO",
        recruiter: "Maria Silva",
        estimatedAllocationWeeks: 12,
        status: "OPEN",
        openingDate: "2024-01-01",
        skills: [
            { name: "React", type: "MANDATORY", minLevel: "BASIC", importanceWeight: 100 },
        ],
    };

    it('deve aprovar dados de vaga válidos', () => {
        const result = vagaSchema.safeParse(dadosBase);
        expect(result.success).toBe(true);
    });

    it('deve rejeitar semanas de alocação negativas', () => {
        const result = vagaSchema.safeParse({
            ...dadosBase,
            estimatedAllocationWeeks: -5
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("Deve ser zero ou maior");
        }
    });

    it('deve rejeitar um nível de experiência inválido', () => {
        const result = vagaSchema.safeParse({
            ...dadosBase,
            experienceLevel: "ESTAGIARIO"
        });
        expect(result.success).toBe(false);
    });

    it('deve forçar a urgência como falsa por defeito', () => {
        const result = vagaSchema.safeParse(dadosBase);
        if (result.success) {
            expect(result.data.isUrgent).toBe(false);
        }
    });
});