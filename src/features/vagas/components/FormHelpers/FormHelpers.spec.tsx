import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorMsg, Field, INPUT_CLS } from './FormHelpers';

describe('FormHelpers Components', () => {

    describe('INPUT_CLS Constante', () => {
        it('deve exportar uma string com as classes CSS base', () => {
            expect(typeof INPUT_CLS).toBe('string');
            expect(INPUT_CLS).toContain('w-full');
            expect(INPUT_CLS).toContain('outline-none');
            expect(INPUT_CLS).toContain('focus:border-pink');
        });
    });

    describe('ErrorMsg Component', () => {
        it('não deve renderizar nada se a prop msg não for fornecida', () => {
            const { container } = render(<ErrorMsg />);
            expect(container.firstChild).toBeNull();
        });

        it('não deve renderizar nada se a prop msg for uma string vazia', () => {
            const { container } = render(<ErrorMsg msg="" />);
            expect(container.firstChild).toBeNull();
        });

        it('deve renderizar a mensagem de erro com a classe correta quando fornecida', () => {
            render(<ErrorMsg msg="Este campo é obrigatório" />);

            const spanElement = screen.getByText('Este campo é obrigatório');
            expect(spanElement).toBeInTheDocument();
            expect(spanElement.tagName).toBe('SPAN');
            expect(spanElement.className).toContain('text-red-500');
        });
    });

    describe('Field Component', () => {
        it('deve renderizar a label corretamente', () => {
            render(
                <Field label="Título da Vaga">
                    <input type="text" placeholder="Input de teste" />
                </Field>
            );

            const labelElement = screen.getByText('Título da Vaga');
            expect(labelElement).toBeInTheDocument();
            expect(labelElement.tagName).toBe('LABEL');
        });

        it('deve renderizar o conteúdo (children) passado para dentro do componente', () => {
            render(
                <Field label="Título da Vaga">
                    <input type="text" placeholder="Input injetado" />
                </Field>
            );

            expect(screen.getByPlaceholderText('Input injetado')).toBeInTheDocument();
        });
    });
});