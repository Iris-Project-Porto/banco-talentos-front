import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input Component', () => {
    it('deve renderizar o input corretamente', () => {
        render(<Input placeholder="Insira o seu nome" />);
        expect(screen.getByPlaceholderText('Insira o seu nome')).toBeInTheDocument();
    });

    it('deve renderizar a label se fornecida', () => {
        render(<Input label="Email" id="email" />);
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('deve renderizar a mensagem de erro e aplicar estilos de erro', () => {
        render(<Input error="O email é obrigatório" />);
        expect(screen.getByText('O email é obrigatório')).toBeInTheDocument();

        const input = screen.getByRole('textbox');
        expect(input.className).toContain('border-red-400'); // Verifica a classe de erro Tailwind
    });

    it('deve renderizar o labelRight (ex: link de esqueci a password)', () => {
        render(<Input labelRight={<span>Esqueceu a password?</span>} />);
        expect(screen.getByText('Esqueceu a password?')).toBeInTheDocument();
    });
});