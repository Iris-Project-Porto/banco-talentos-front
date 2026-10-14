import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Skill } from '@/features/skills';
import { StackInput } from './StackInput';

const hardSkills: Skill[] = [
    {
        id: 'react',
        name: 'React',
        type: 'HARD',
        active: true,
        category: 'FRONTEND',
        resourcesCount: 0,
        averageProficiency: 0,
    },
];
const softSkills: Skill[] = [
    {
        id: 'communication',
        name: 'Comunicação',
        type: 'SOFT',
        active: true,
        category: 'COMMUNICATION',
        resourcesCount: 0,
        averageProficiency: 0,
    },
];

describe('Componente StackInput', () => {
    it('deve renderizar o input vazio e a legenda descritiva de escala', () => {
        render(<StackInput value={[]} onChange={vi.fn()} />);

        expect(screen.getByPlaceholderText('Ex: React, Python, Docker...')).toBeInTheDocument();
        expect(screen.getByText('Escala de nível')).toBeInTheDocument();
    });

    it('deve mostrar a lista de sugestões filtradas ao digitar um valor correspondente', () => {
        render(<StackInput value={[]} onChange={vi.fn()} skills={hardSkills} />);

        const input = screen.getByPlaceholderText('Ex: React, Python, Docker...');
        fireEvent.change(input, { target: { value: 'Rea' } });

        expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
        expect(screen.queryByText('Nível de conhecimento em')).not.toBeInTheDocument();
    });

    it('deve exibir o nível e permitir adicionar somente após selecionar uma sugestão', () => {
        const handleChange = vi.fn();
        render(<StackInput value={[]} onChange={handleChange} skills={hardSkills} />);

        const input = screen.getByPlaceholderText('Ex: React, Python, Docker...');
        fireEvent.change(input, { target: { value: 'Skill inexistente' } });

        expect(screen.queryByRole('slider')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: '+ Adicionar' })).not.toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'React' } });
        fireEvent.mouseDown(screen.getByRole('button', { name: 'React' }));

        expect(screen.getByText(/Nível de conhecimento em/)).toBeInTheDocument();
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '8' } });
        const addButton = screen.getByRole('button', { name: '+ Adicionar' });
        fireEvent.click(addButton);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith([{ name: 'React', level: 8 }]);
    });

    it('deve permitir avaliar soft skills recebidas como sugestões', () => {
        const handleChange = vi.fn();
        render(<StackInput value={[]} onChange={handleChange} skills={softSkills} />);

        const input = screen.getByPlaceholderText('Ex: React, Python, Docker...');
        fireEvent.change(input, { target: { value: 'Com' } });
        fireEvent.mouseDown(screen.getByRole('button', { name: 'Comunicação' }));
        fireEvent.click(screen.getByRole('button', { name: '+ Adicionar' }));

        expect(handleChange).toHaveBeenCalledWith([{ name: 'Comunicação', level: 5 }]);
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
