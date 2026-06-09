import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from './Section';

describe('Section Component', () => {
    it('deve renderizar o título e o conteúdo (children)', () => {
        render(
            <Section title="Dados Pessoais">
                <p>Conteúdo da secção</p>
            </Section>
        );
        expect(screen.getByText('Dados Pessoais')).toBeInTheDocument();
        expect(screen.getByText('Conteúdo da secção')).toBeInTheDocument();
    });

    it('deve renderizar o subtítulo se for fornecido', () => {
        render(
            <Section title="Contactos" subtitle="Informações de contacto">
                <p>Email e Telefone</p>
            </Section>
        );
        expect(screen.getByText('Informações de contacto')).toBeInTheDocument();
    });

    it('não deve renderizar a tag de subtítulo se este não for passado', () => {
        const { container } = render(
            <Section title="Sem Subtítulo">Conteúdo</Section>
        );
        // O título é renderizado, mas apenas ele está no cabeçalho
        const headerDiv = container.querySelector('.px-5.py-3');
        expect(headerDiv?.children.length).toBe(1); // Apenas o <p> do título
    });
});