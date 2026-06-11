import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';

describe('PageHeader Component', () => {
    it('deve renderizar o título corretamente', () => {
        render(<PageHeader title="Dashboard" />);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
    });

    it('deve renderizar o subtítulo se fornecido', () => {
        render(<PageHeader title="Vagas" subtitle="Gerir as vagas da empresa" />);
        expect(screen.getByText('Gerir as vagas da empresa')).toBeInTheDocument();
    });

    it('deve renderizar ações (botões) se fornecidos', () => {
        render(<PageHeader title="Perfis" actions={<button>Novo Perfil</button>} />);
        expect(screen.getByRole('button', { name: 'Novo Perfil' })).toBeInTheDocument();
    });
});