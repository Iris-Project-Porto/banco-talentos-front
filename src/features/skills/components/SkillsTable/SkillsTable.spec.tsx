import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillsTable } from './SkillsTable';
import { type Skill } from '../../types/skills';

const mockSkills: Skill[] = [
    {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'React',
        type: 'HARD',
        active: true,
        importanceWeight: 9.5,
    },
    {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        name: 'Comunicação',
        type: 'SOFT',
        active: true,
        importanceWeight: 8.0,
    },
    {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
        name: 'Python',
        type: 'HARD',
        active: false,
        importanceWeight: 7.5,
    },
];

describe('Componente SkillsTable', () => {
    it('deve renderizar a tabela com os dados das skills', () => {
        render(<SkillsTable data={mockSkills} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('Comunicação')).toBeInTheDocument();
    });

    it('deve exibir o peso de importância corretamente', () => {
        render(<SkillsTable data={mockSkills} />);

        expect(screen.getByText('9.5')).toBeInTheDocument();
        expect(screen.getByText('8.0')).toBeInTheDocument();
        expect(screen.getByText('7.5')).toBeInTheDocument();
    });

    it('deve exibir estado de carregamento', () => {
        render(<SkillsTable data={[]} loading={true} />);

        expect(screen.getByText('Carregando skills...')).toBeInTheDocument();
    });

    it('deve exibir mensagem quando não houver dados', () => {
        render(<SkillsTable data={[]} />);

        expect(screen.getByText('Nenhuma skill encontrada')).toBeInTheDocument();
    });

    it('deve chamar onEdit ao clicar no botão de editar', () => {
        const handleEdit = vi.fn();
        render(<SkillsTable data={mockSkills} onEdit={handleEdit} />);

        fireEvent.click(screen.getAllByTitle('Editar skill')[0]);

        expect(handleEdit).toHaveBeenCalledWith(mockSkills[0]);
    });

    it('deve chamar onDelete ao clicar no botão de excluir skill ativa', () => {
        const handleDelete = vi.fn();
        render(<SkillsTable data={mockSkills} onDelete={handleDelete} />);

        fireEvent.click(screen.getAllByTitle('Excluir skill')[0]);

        expect(handleDelete).toHaveBeenCalledWith(mockSkills[0]);
    });

    it('não deve exibir botão de excluir para skills inativas', () => {
        render(<SkillsTable data={[mockSkills[2]]} onDelete={vi.fn()} />);

        expect(screen.queryByTitle('Excluir skill')).not.toBeInTheDocument();
        expect(screen.getByTitle('Editar skill')).toBeInTheDocument();
    });

    it('deve desabilitar o botão de excluir quando a skill estiver sendo excluída', () => {
        render(
            <SkillsTable
                data={mockSkills}
                deletingSkillId={mockSkills[0].id}
                onDelete={vi.fn()}
            />
        );

        const deleteButtons = screen.getAllByTitle('Excluir skill');

        expect(deleteButtons[0]).toBeDisabled();
        expect(deleteButtons[1]).not.toBeDisabled();
    });

    it('deve exibir badges de tipo de skill', () => {
        render(<SkillsTable data={mockSkills} />);

        expect(screen.getAllByText('Hard Skill')).toHaveLength(2);
        expect(screen.getByText('Soft Skill')).toBeInTheDocument();
    });

    it('deve exibir badges de status', () => {
        render(<SkillsTable data={mockSkills} />);

        expect(screen.getAllByText('Ativa')).toHaveLength(2);
        expect(screen.getByText('Inativa')).toBeInTheDocument();
    });

    it('deve renderizar as colunas na ordem correta', () => {
        const { container } = render(<SkillsTable data={mockSkills} />);

        const headers = container.querySelectorAll('th');
        expect(headers[0]).toHaveTextContent('SKILL');
        expect(headers[1]).toHaveTextContent('TIPO');
        expect(headers[2]).toHaveTextContent('IMPORTÂNCIA');
        expect(headers[3]).toHaveTextContent('STATUS');
        expect(headers[4]).toHaveTextContent('AÇÕES');
    });

    it('deve preencher linhas vazias para manter altura mínima da tabela', () => {
        const { container } = render(<SkillsTable data={[mockSkills[0]]} minRows={3} />);

        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(3);
    });
});
