import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StatCard } from './StatCard';

describe('StatCard Component', () => {
    it('deve renderizar o label e o value', () => {
        render(<StatCard label="Total de Utilizadores" value={150} />);
        expect(screen.getByText('Total de Utilizadores')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('deve renderizar como um Link se a prop "to" for fornecida', () => {
        render(
            <MemoryRouter>
                <StatCard label="Ativos" value={42} to="/admin/ativos" />
            </MemoryRouter>
        );

        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveAttribute('href', '/admin/ativos');
    });

    it('não deve ser um Link se a prop "to" não for fornecida', () => {
        render(<StatCard label="Pendentes" value={5} />);
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
});