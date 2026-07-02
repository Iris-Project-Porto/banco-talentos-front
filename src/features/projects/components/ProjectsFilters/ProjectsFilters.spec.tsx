import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectsFilters } from './ProjectsFilters';

describe('Componente ProjectsFilters', () => {
    const defaultProps = {
        search: '',
        statusType: 'ACTIVE' as const,
        onSearchChange: vi.fn(),
        onStatusChange: vi.fn(),
        onClear: vi.fn(),
    };

    it('deve renderizar os campos de filtro', () => {
        render(<ProjectsFilters {...defaultProps} />);

        expect(screen.getByText('NOME DO PROJETO')).toBeInTheDocument();
        expect(screen.getByText('STATUS')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Buscar por nome do projeto...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Limpar Filtros' })).toBeInTheDocument();
    });

    it('deve exibir o valor de busca informado', () => {
        render(<ProjectsFilters {...defaultProps} search="Cloud" />);

        expect(screen.getByPlaceholderText('Buscar por nome do projeto...')).toHaveValue('Cloud');
    });

    it('deve exibir o status selecionado', () => {
        render(<ProjectsFilters {...defaultProps} statusType="INACTIVE" />);

        expect(screen.getByRole('combobox')).toHaveValue('INACTIVE');
    });

    it('deve chamar onSearchChange ao digitar no campo de busca', async () => {
        const onSearchChange = vi.fn();
        render(<ProjectsFilters {...defaultProps} onSearchChange={onSearchChange} />);

        await userEvent.type(screen.getByPlaceholderText('Buscar por nome do projeto...'), 'Mi');

        expect(onSearchChange).toHaveBeenCalled();
    });

    it('deve chamar onStatusChange ao alterar o status', () => {
        const onStatusChange = vi.fn();
        render(<ProjectsFilters {...defaultProps} onStatusChange={onStatusChange} />);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'INACTIVE' } });

        expect(onStatusChange).toHaveBeenCalledWith('INACTIVE');
    });

    it('deve chamar onClear ao clicar em Limpar Filtros', () => {
        const onClear = vi.fn();
        render(<ProjectsFilters {...defaultProps} onClear={onClear} />);

        fireEvent.click(screen.getByRole('button', { name: 'Limpar Filtros' }));

        expect(onClear).toHaveBeenCalledTimes(1);
    });
});
