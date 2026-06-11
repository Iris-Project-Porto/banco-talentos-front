import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag Component', () => {
    it('deve renderizar o texto da tag', () => {
        render(<Tag kind="area">Frontend</Tag>);
        expect(screen.getByText('Frontend')).toBeInTheDocument();
    });

    it('deve aplicar as classes corretas consoante a prop kind', () => {
        render(<Tag kind="status-success">Ativo</Tag>);
        const tagElement = screen.getByText('Ativo');
        // Verifica se possui as classes mapeadas no objeto styles do componente
        expect(tagElement.className).toContain('bg-status-success-bg');
        expect(tagElement.className).toContain('text-status-success-text');
    });
});