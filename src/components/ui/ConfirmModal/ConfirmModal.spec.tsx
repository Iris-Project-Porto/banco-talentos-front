import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from './ConfirmModal';

describe('Componente ConfirmModal', () => {
    it('deve renderizar título e mensagem', () => {
        render(
            <ConfirmModal
                title="Excluir skill"
                message="Deseja realmente excluir este item?"
                onConfirm={vi.fn()}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByText('Excluir skill')).toBeInTheDocument();
        expect(screen.getByText('Deseja realmente excluir este item?')).toBeInTheDocument();
    });

    it('deve invocar onClose ao clicar em Cancelar', () => {
        const handleClose = vi.fn();
        render(
            <ConfirmModal
                title="Excluir skill"
                message="Deseja realmente excluir este item?"
                onConfirm={vi.fn()}
                onClose={handleClose}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
        expect(handleClose).toHaveBeenCalled();
    });

    it('deve invocar onConfirm ao clicar no botão de confirmação', () => {
        const handleConfirm = vi.fn();
        render(
            <ConfirmModal
                title="Excluir skill"
                message="Deseja realmente excluir este item?"
                confirmLabel="Excluir"
                onConfirm={handleConfirm}
                onClose={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
        expect(handleConfirm).toHaveBeenCalled();
    });
});
