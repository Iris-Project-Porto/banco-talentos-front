import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectsTable } from './ProjectsTable';
import type { Project } from '../../types/types';

const mockProjects: Project[] = [
    {
        id: '1',
        name: 'Migração de Cloud',
        description: 'Projeto de migração',
        active: true,
        createdAt: '2026-01-15T00:00:00.000Z',
        updatedAt: '2026-02-01T00:00:00.000Z',
    },
    {
        id: '2',
        name: 'Legado',
        active: false,
        createdAt: '2026-01-10T00:00:00.000Z',
    },
];

describe('Componente ProjectsTable', () => {
    it('deve renderizar a tabela com os dados dos projetos', () => {
        render(<ProjectsTable data={mockProjects} />);

        expect(screen.getByText('Migração de Cloud')).toBeInTheDocument();
        expect(screen.getByText('Legado')).toBeInTheDocument();
        expect(screen.getByText('Projeto de migração')).toBeInTheDocument();
    });

    it('deve exibir status ativo e inativo', () => {
        render(<ProjectsTable data={mockProjects} />);

        expect(screen.getByText('Ativo')).toBeInTheDocument();
        expect(screen.getByText('Inativo')).toBeInTheDocument();
    });

    it('deve exibir mensagem quando não houver dados', () => {
        render(<ProjectsTable data={[]} />);

        expect(screen.getByText('Nenhum projeto encontrado')).toBeInTheDocument();
    });

    it('deve chamar onView ao clicar no botão de visualizar', () => {
        const handleView = vi.fn();
        render(<ProjectsTable data={mockProjects} onView={handleView} />);

        fireEvent.click(screen.getAllByTitle('Visualizar')[0]);

        expect(handleView).toHaveBeenCalledWith(mockProjects[0]);
    });

    it('deve chamar onEdit ao clicar no botão de editar', () => {
        const handleEdit = vi.fn();
        render(<ProjectsTable data={mockProjects} onEdit={handleEdit} />);

        fireEvent.click(screen.getAllByTitle('Editar')[0]);

        expect(handleEdit).toHaveBeenCalledWith(mockProjects[0]);
    });

    it('deve renderizar as colunas na ordem correta', () => {
        const { container } = render(<ProjectsTable data={mockProjects} />);

        const headers = container.querySelectorAll('th');
        expect(headers[0]).toHaveTextContent('Projeto');
        expect(headers[1]).toHaveTextContent('Status');
        expect(headers[2]).toHaveTextContent('Criado em');
        expect(headers[3]).toHaveTextContent('Atualizado em');
        expect(headers[4]).toHaveTextContent('Ações');
    });
});
