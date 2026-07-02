import { describe, it, expect } from 'vitest';
import {
    createProjectEditSchema,
    createProjectSchema,
    normalizeProjectName,
    projectEditSchema,
    projectSchema,
} from './validations';

describe('Projects Validations', () => {
    const dadosBase = {
        name: 'Migração de Cloud',
        description: 'Projeto de migração para nuvem',
    };

    const existingProjects = [
        { id: '1', name: 'Migração de Cloud' },
        { id: '2', name: 'Portal do Cliente' },
    ];

    it('deve aprovar dados de projeto válidos', () => {
        const result = projectSchema.safeParse(dadosBase);
        expect(result.success).toBe(true);
    });

    it('deve rejeitar projeto sem nome', () => {
        const result = projectSchema.safeParse({ ...dadosBase, name: '' });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Nome do projeto é obrigatório');
        }
    });

    it('deve rejeitar descrição vazia', () => {
        const result = projectSchema.safeParse({ name: 'Novo Projeto', description: '' });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Descrição é obrigatória');
        }
    });

    it('deve rejeitar descrição acima de 500 caracteres', () => {
        const result = projectSchema.safeParse({
            ...dadosBase,
            description: 'a'.repeat(501),
        });
        expect(result.success).toBe(false);
    });

    it('deve rejeitar criação com nome duplicado', () => {
        const result = createProjectSchema(existingProjects).safeParse(dadosBase);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Já existe um projeto cadastrado com este nome.');
        }
    });

    it('deve ignorar duplicidade ao editar o mesmo projeto', () => {
        const result = createProjectSchema(existingProjects, '1').safeParse(dadosBase);
        expect(result.success).toBe(true);
    });

    it('deve comparar nomes sem diferenciar maiúsculas e espaços', () => {
        const result = createProjectSchema(existingProjects).safeParse({
            ...dadosBase,
            name: '  migração de cloud  ',
        });
        expect(result.success).toBe(false);
    });

    it('deve normalizar nome do projeto', () => {
        expect(normalizeProjectName('  Migração de Cloud  ')).toBe('migração de cloud');
    });

    it('deve aprovar schema de edição com status', () => {
        const result = projectEditSchema.safeParse({
            ...dadosBase,
            status: 'ACTIVE',
        });
        expect(result.success).toBe(true);
    });

    it('deve rejeitar status inválido na edição', () => {
        const result = projectEditSchema.safeParse({
            ...dadosBase,
            status: 'INVALIDO',
        });
        expect(result.success).toBe(false);
    });

    it('deve rejeitar nome duplicado no schema de edição', () => {
        const result = createProjectEditSchema(existingProjects).safeParse({
            ...dadosBase,
            status: 'INACTIVE',
        });
        expect(result.success).toBe(false);
    });
});
