import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectDetailModal } from './ProjectDetailModal';
import type { Project } from '../../types/types';

const mockProject: Project = {
    id: 'project-1',
    name: 'Migração de Cloud',
    description: 'Projeto de migração',
    active: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-02-01T12:00:00.000Z',
    createdBy: 'Admin',
    updatedBy: 'Gestor',
};

describe('Componente ProjectDetailModal', () => {
    it('deve renderizar os detalhes do projeto', () => {
        render(<ProjectDetailModal project={mockProject} onClose={vi.fn()} onEdit={vi.fn()} />);

        expect(screen.getByText('Detalhes do projeto')).toBeInTheDocument();
        expect(screen.getByText('Migração de Cloud')).toBeInTheDocument();
        expect(screen.getByText('Projeto de migração')).toBeInTheDocument();
        expect(screen.getByText('Ativo')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('Gestor')).toBeInTheDocument();
    });

    it('deve exibir traço quando descrição estiver vazia', () => {
        render(
            <ProjectDetailModal
                project={{ ...mockProject, description: undefined }}
                onClose={vi.fn()}
                onEdit={vi.fn()}
            />,
        );

        expect(screen.getAllByText('—').length).toBeGreaterThan(0);
    });

    it('deve chamar onClose ao clicar em Fechar', () => {
        const handleClose = vi.fn();
        render(<ProjectDetailModal project={mockProject} onClose={handleClose} onEdit={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onEdit ao clicar em Editar projeto', () => {
        const handleEdit = vi.fn();
        render(<ProjectDetailModal project={mockProject} onClose={vi.fn()} onEdit={handleEdit} />);

        fireEvent.click(screen.getByRole('button', { name: 'Editar projeto' }));
        expect(handleEdit).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onClose ao clicar no botão ×', () => {
        const handleClose = vi.fn();
        render(<ProjectDetailModal project={mockProject} onClose={handleClose} onEdit={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: '×' }));
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
