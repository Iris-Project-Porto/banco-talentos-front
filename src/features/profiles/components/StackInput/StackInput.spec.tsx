import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StackInput } from './StackInput';

describe('Componente StackInput', () => {
    it('deve renderizar o input vazio e a legenda descritiva de escala', () => {
        render(<StackInput value={[]} onChange={vi.fn()} />);

        expect(screen.getByPlaceholderText('Ex: React, Python, Docker...')).toBeInTheDocument();
        expect(screen.getByText('Escala de nível')).toBeInTheDocument();
    });

    it('deve mostrar a lista de sugestões filtradas ao digitar um valor correspondente', () => {
        render(<StackInput value={[]} onChange={vi.fn()} />);

        const input = screen.getByPlaceholderText('Ex: React, Python, Docker...');
        fireEvent.change(input, { target: { value: 'Java' } });

        // Deve sugerir 'JavaScript' e 'Java' das sugestões pré-definidas
        expect(screen.getByRole('button', { name: 'Java' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'JavaScript' })).toBeInTheDocument();
    });

    it('deve exibir o slider de nível e disparar o onChange ao adicionar uma nova skill', () => {
        const handleChange = vi.fn();
        render(<StackInput value={[]} onChange={handleChange} />);

        const input = screen.getByPlaceholderText('Ex: React, Python, Docker...');
        fireEvent.change(input, { target: { value: 'Docker' } });

        // Ajusta o slider de proficiência para nível 8
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '8' } });

        // Clica no botão de adição
        const addButton = screen.getByRole('button', { name: '+ Adicionar' });
        fireEvent.click(addButton);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith([{ name: 'Docker', level: 8 }]);
    });

    it('deve renderizar as skills já existentes e permitir a remoção ao clicar no X', () => {
        const handleChange = vi.fn();
        const existingStacks = [{ name: 'Vue.js', level: 6 }];

        render(<StackInput value={existingStacks} onChange={handleChange} />);

        expect(screen.getByText('Vue.js')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();

        // Clica no botão de remoção (X)
        const removeButton = screen.getByTitle('Remover');
        fireEvent.click(removeButton);

        expect(handleChange).toHaveBeenCalledWith([]);
    });
});