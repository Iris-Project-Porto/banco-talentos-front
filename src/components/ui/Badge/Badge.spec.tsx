import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
    it('deve renderizar o texto passado como children', () => {
        render(<Badge variant="senior">Sênior</Badge>);
        expect(screen.getByText('Sênior')).toBeInTheDocument();
    });

    it('deve aplicar as classes corretas de acordo com a variante', () => {
        render(<Badge variant="danger">Erro</Badge>);
        const badge = screen.getByText('Erro');

        // Verifica as classes estáticas base e as inseridas via objeto styles
        expect(badge.className).toContain('inline-flex');
        expect(badge.className).toContain('bg-status-danger-bg');
        expect(badge.className).toContain('text-status-danger-text');
    });

    it('deve aceitar uma className adicional', () => {
        render(<Badge variant="pleno" className="mt-2">Pleno</Badge>);
        const badge = screen.getByText('Pleno');
        expect(badge.className).toContain('mt-2');
    });
});