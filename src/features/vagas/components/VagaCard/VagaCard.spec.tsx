import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { JobPosting } from '../../types/types';
import { VagaCard } from './VagaCard';

describe('VagaCard Component', () => {
    const mockVaga: JobPosting = {
        id: "vaga-1",
        vacancyCode: "VAG-001",
        projectId: "proj-1",
        projectName: "Projeto Alpha",
        squadId: "sq-1",
        squadName: "Squad Beta",
        experienceLevel: "SENIOR",
        modality: "REMOTO",
        description: "Desenvolvedor React",
        requirements: "TypeScript, React",
        recruiter: "João RH",
        estimatedAllocationWeeks: 24,
        status: "SCREENING",
        notes: "",
        openingDate: "2024-05-01T00:00:00Z",
        isUrgent: true,
        active: true,
        skills: [],
        title: ''
    };

    it('deve renderizar o título, squad e recrutador', () => {
        render(<VagaCard vaga={mockVaga} onEdit={vi.fn()} onCancel={vi.fn()} />);
        expect(screen.getByText('Projeto Alpha')).toBeInTheDocument();
        expect(screen.getByText(/Squad Beta/i)).toBeInTheDocument();
        expect(screen.getByText(/João RH/i)).toBeInTheDocument();
    });

    it('deve exibir as tags corretas de senioridade e urgência', () => {
        render(<VagaCard vaga={mockVaga} onEdit={vi.fn()} onCancel={vi.fn()} />);
        expect(screen.getByText('Sênior')).toBeInTheDocument();
        expect(screen.getByText('Urgente')).toBeInTheDocument();
    });

    it('deve chamar onEdit ao clicar no botão de editar', () => {
        const handleEdit = vi.fn();
        render(<VagaCard vaga={mockVaga} onEdit={handleEdit} onCancel={vi.fn()} />);

        const editButton = screen.getByTitle('Detalhes/Editar');
        fireEvent.click(editButton);

        expect(handleEdit).toHaveBeenCalledTimes(1);
        expect(handleEdit).toHaveBeenCalledWith(mockVaga);
    });

    it('deve chamar onCancel ao clicar no botão de cancelar', () => {
        const handleCancel = vi.fn();
        render(<VagaCard vaga={mockVaga} onEdit={vi.fn()} onCancel={handleCancel} />);

        const cancelButton = screen.getByTitle('Cancelar Vaga');
        fireEvent.click(cancelButton);

        expect(handleCancel).toHaveBeenCalledTimes(1);
        expect(handleCancel).toHaveBeenCalledWith(mockVaga);
    });
});