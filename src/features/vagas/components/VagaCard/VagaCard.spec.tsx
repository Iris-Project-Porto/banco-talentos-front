import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { JobPosting } from '../../types';
import { VagaCard } from './VagaCard';

describe('VagaCard Component', () => {
    const mockVaga: JobPosting = {
        id: "vaga-1",
        projectId: "proj-1",
        projectName: "Projeto Alpha",
        squadId: "sq-1",
        squadName: "Squad Beta",
        experienceLevel: "SENIOR",
        description: "Desenvolvedor React",
        requirements: "TypeScript, React",
        recruiter: "João RH",
        estimatedAllocationWeeks: 24,
        status: "Entrevistas",
        notes: "",
        openingDate: "2024-05-01T00:00:00Z",
        isUrgent: true,
        active: true
    };

    it('deve renderizar o título, squad e recrutador', () => {
        render(<VagaCard vaga={mockVaga} onEdit={vi.fn()} onToggleActive={vi.fn()} />);
        expect(screen.getByText('Projeto Alpha')).toBeInTheDocument();
        expect(screen.getByText(/Squad Beta/i)).toBeInTheDocument();
        expect(screen.getByText(/João RH/i)).toBeInTheDocument();
    });

    it('deve exibir as tags corretas de senioridade e urgência', () => {
        render(<VagaCard vaga={mockVaga} onEdit={vi.fn()} onToggleActive={vi.fn()} />);
        // Senioridade
        expect(screen.getByText('Sênior')).toBeInTheDocument();
        // Tag de Urgência
        expect(screen.getByText('Urgente')).toBeInTheDocument();
    });

    it('deve chamar onEdit ao clicar no botão de editar', () => {
        const handleEdit = vi.fn();
        render(<VagaCard vaga={mockVaga} onEdit={handleEdit} onToggleActive={vi.fn()} />);

        const editButton = screen.getByTitle('Editar vaga');
        fireEvent.click(editButton);

        expect(handleEdit).toHaveBeenCalledTimes(1);
        expect(handleEdit).toHaveBeenCalledWith(mockVaga);
    });

    it('deve chamar onToggleActive ao clicar no botão de ativar/desativar', () => {
        const handleToggle = vi.fn();
        render(<VagaCard vaga={mockVaga} onEdit={vi.fn()} onToggleActive={handleToggle} />);

        // Como a vaga está ativa, o botão deve ter o title "Desativar vaga"
        const toggleButton = screen.getByTitle('Desativar vaga');
        fireEvent.click(toggleButton);

        expect(handleToggle).toHaveBeenCalledTimes(1);
        expect(handleToggle).toHaveBeenCalledWith("vaga-1", true);
    });
});