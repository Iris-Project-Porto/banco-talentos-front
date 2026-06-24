import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkillsFilters } from './SkillsFilters';

describe('Componente SkillsFilters', () => {
    const defaultProps = {
        search: '',
        selectedCategory: '',
        onSearchChange: vi.fn(),
        onCategoryChange: vi.fn(),
        onClear: vi.fn(),
    };

    it('deve renderizar os campos de filtro', () => {
        render(<SkillsFilters {...defaultProps} />);

        expect(screen.getByText('NOME DA SKILL')).toBeInTheDocument();
        expect(screen.getByText('CATEGORIA')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Ex: React, Python, Scrum...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Limpar Filtros' })).toBeInTheDocument();
    });

    it('deve exibir o valor de busca informado', () => {
        render(<SkillsFilters {...defaultProps} search="React" />);

        expect(screen.getByPlaceholderText('Ex: React, Python, Scrum...')).toHaveValue('React');
    });

    it('deve exibir a categoria selecionada', () => {
        render(<SkillsFilters {...defaultProps} selectedCategory="FRONTEND" />);

        expect(screen.getByRole('combobox')).toHaveValue('FRONTEND');
    });

    it('deve listar categorias em português no select', () => {
        render(<SkillsFilters {...defaultProps} />);

        expect(screen.getByRole('option', { name: 'Todas as Categorias' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Frontend' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Ciência de Dados' })).toBeInTheDocument();
    });

    it('deve chamar onSearchChange ao digitar no campo de busca', async () => {
        const onSearchChange = vi.fn();
        render(<SkillsFilters {...defaultProps} onSearchChange={onSearchChange} />);

        await userEvent.type(screen.getByPlaceholderText('Ex: React, Python, Scrum...'), 'Py');

        expect(onSearchChange).toHaveBeenCalled();
    });

    it('deve chamar onCategoryChange ao alterar a categoria', () => {
        const onCategoryChange = vi.fn();
        render(<SkillsFilters {...defaultProps} onCategoryChange={onCategoryChange} />);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'BACKEND' } });

        expect(onCategoryChange).toHaveBeenCalledWith('BACKEND');
    });

    it('deve chamar onClear ao clicar em Limpar Filtros', () => {
        const onClear = vi.fn();
        render(<SkillsFilters {...defaultProps} onClear={onClear} />);

        fireEvent.click(screen.getByRole('button', { name: 'Limpar Filtros' }));

        expect(onClear).toHaveBeenCalledTimes(1);
    });
});
