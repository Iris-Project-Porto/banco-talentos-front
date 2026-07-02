import { describe, it, expect } from 'vitest';
import { filterProjects, paginateLocally } from './projectsList';
import type { Project } from '../types/types';

const mockProjects: Project[] = [
    {
        id: '1',
        name: 'Migração de Cloud',
        description: 'Desc A',
        active: true,
        createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: '2',
        name: 'Portal do Cliente',
        description: 'Desc B',
        active: true,
        createdAt: '2026-01-02T00:00:00.000Z',
    },
    {
        id: '3',
        name: 'Legado',
        active: false,
        createdAt: '2026-01-03T00:00:00.000Z',
    },
];

describe('projectsList utils', () => {
    describe('filterProjects', () => {
        it('deve filtrar projetos ativos', () => {
            const result = filterProjects(mockProjects, { statusType: 'ACTIVE', search: '' });
            expect(result).toHaveLength(2);
            expect(result.every((project) => project.active)).toBe(true);
        });

        it('deve filtrar projetos inativos', () => {
            const result = filterProjects(mockProjects, { statusType: 'INACTIVE', search: '' });
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Legado');
        });

        it('deve filtrar por nome ignorando maiúsculas', () => {
            const result = filterProjects(mockProjects, {
                statusType: 'ACTIVE',
                search: 'portal',
            });
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Portal do Cliente');
        });

        it('deve retornar todos quando busca estiver vazia', () => {
            const result = filterProjects(mockProjects, { statusType: 'ACTIVE', search: '   ' });
            expect(result).toHaveLength(2);
        });
    });

    describe('paginateLocally', () => {
        it('deve paginar itens corretamente', () => {
            const items = Array.from({ length: 25 }, (_, index) => index + 1);
            const page0 = paginateLocally(items, 0, 10);

            expect(page0.content).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            expect(page0.totalPages).toBe(3);
            expect(page0.totalElements).toBe(25);
        });

        it('deve retornar página vazia quando não houver itens', () => {
            const result = paginateLocally([], 0, 10);
            expect(result.content).toEqual([]);
            expect(result.totalPages).toBe(1);
            expect(result.totalElements).toBe(0);
        });
    });
});
