import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select } from './Select';

describe('Select Component', () => {
    const options = [
        { value: '1', label: 'Opção 1' },
        { value: '2', label: 'Opção 2' },
    ];

    it('deve renderizar as opções fornecidas', () => {
        render(<Select options={options} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('Opção 1')).toBeInTheDocument();
        expect(screen.getByText('Opção 2')).toBeInTheDocument();
    });

    it('deve exibir a label e o erro', () => {
        render(<Select label="Categoria" options={options} error="Selecione uma categoria" />);
        expect(screen.getByText('Categoria')).toBeInTheDocument();
        expect(screen.getByText('Selecione uma categoria')).toBeInTheDocument();

        const select = screen.getByRole('combobox');
        expect(select.className).toContain('border-red-400');
    });
});