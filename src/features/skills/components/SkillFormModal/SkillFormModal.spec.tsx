import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkillFormModal } from './SkillFormModal';

describe('Componente SkillFormModal', () => {
    it('deve renderizar o cabeçalho de Cadastrar Skill quando não houver ID inicial', () => {
        render(<SkillFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);
        expect(screen.getByText('Cadastrar Skill')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Salvar Skill' })).toBeInTheDocument();
    });

    it('deve renderizar o cabeçalho de Editar Skill quando um ID inicial for fornecido', () => {
        render(
            <SkillFormModal
                initial={{ id: 'skill-1', name: 'React', type: 'HARD', importanceWeight: 8 }}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />
        );
        expect(screen.getByText('Editar Skill')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument();
    });

    it('deve invocar onClose ao clicar no botão de fechar', async () => {
        const handleClose = vi.fn();
        render(<SkillFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={handleClose} />);

        await userEvent.click(screen.getByLabelText('Fechar modal'));
        expect(handleClose).toHaveBeenCalled();
    });

    it('deve exibir erros de validação ao submeter formulário vazio', async () => {
        render(<SkillFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        await userEvent.click(screen.getByRole('button', { name: 'Salvar Skill' }));

        expect(screen.getByText('Nome da skill é obrigatório')).toBeInTheDocument();
        expect(screen.getByText('Tipo é obrigatório')).toBeInTheDocument();
    });

    it('deve chamar onSave com os dados corretos quando o formulário for válido', async () => {
        const handleSave = vi.fn();
        render(<SkillFormModal initial={{}} saving={false} onSave={handleSave} onClose={vi.fn()} />);

        const nameInput = screen.getByPlaceholderText(/Ex: Kubernetes, Lógica de Programação/);
        const typeSelect = screen.getByRole('combobox');

        await userEvent.type(nameInput, 'React');
        await userEvent.selectOptions(typeSelect, 'HARD');
        await userEvent.click(screen.getByRole('button', { name: 'Salvar Skill' }));

        expect(handleSave).toHaveBeenCalledWith({
            name: 'React',
            type: 'HARD',
            importanceWeight: 5,
        });
    });

    it('deve invocar onClose ao clicar em Cancelar', async () => {
        const handleClose = vi.fn();
        render(<SkillFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={handleClose} />);

        await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
        expect(handleClose).toHaveBeenCalled();
    });

    it('deve desabilitar o botão de salvar durante o envio', () => {
        render(<SkillFormModal initial={{}} saving={true} onSave={vi.fn()} onClose={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Salvar Skill' })).toBeDisabled();
    });

    it('deve preencher os campos ao editar uma skill', () => {
        render(
            <SkillFormModal
                initial={{ id: '1', name: 'React', type: 'HARD', importanceWeight: 8 }}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />
        );

        const nameInput = screen.getByPlaceholderText(
            /Ex: Kubernetes, Lógica de Programação/
        ) as HTMLInputElement;
        expect(nameInput.value).toBe('React');
    });
});
