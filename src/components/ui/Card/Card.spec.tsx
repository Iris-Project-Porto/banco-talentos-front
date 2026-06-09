import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
    it('deve renderizar o conteúdo (children)', () => {
        render(<Card>Conteúdo do Card</Card>);
        expect(screen.getByText('Conteúdo do Card')).toBeInTheDocument();
    });

    it('deve aplicar o padding médio (md) por padrão (classe p-6)', () => {
        const { container } = render(<Card>Card MD</Card>);
        expect(container.firstChild).toHaveClass('p-6');
    });

    it('deve aplicar o padding pequeno (sm) quando especificado (classe p-5)', () => {
        const { container } = render(<Card padding="sm">Card SM</Card>);
        expect(container.firstChild).toHaveClass('p-5');
    });

    it('deve permitir a injeção de classes customizadas (className)', () => {
        const { container } = render(<Card className="min-h-screen custom-class">Card Custom</Card>);
        expect(container.firstChild).toHaveClass('min-h-screen');
        expect(container.firstChild).toHaveClass('custom-class');
    });
});