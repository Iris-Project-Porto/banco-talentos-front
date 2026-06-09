import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
    it('deve renderizar o texto corretamente', () => {
        render(<Button>Clique Aqui</Button>);
        expect(screen.getByText('Clique Aqui')).toBeInTheDocument();
    });

    it('deve disparar o evento onClick quando clicado', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Ação</Button>);

        fireEvent.click(screen.getByText('Ação'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('deve mostrar estado de loading e desativar o botão', () => {
        render(<Button loading>Salvar</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        // Verifica se o texto ainda está lá
        expect(screen.getByText('Salvar')).toBeInTheDocument();
        // Verifica se renderizou o spinner (SVG)
        expect(button.querySelector('svg')).toBeInTheDocument();
    });
});