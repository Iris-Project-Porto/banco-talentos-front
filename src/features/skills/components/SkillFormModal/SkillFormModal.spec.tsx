import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkillFormModal } from './SkillFormModal';

describe('Componente SkillFormModal', () => {
    it('deve renderizar o cabeçalho de Nova skill quando não houver ID inicial', () => {
        render(<SkillFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);
        expect(screen.getByText('Nova skill')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Criar skill' })).toBeInTheDocument();
    });

    it('deve renderizar os campos do formulário com labels', () => {
        render(<SkillFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        expect(screen.getByText('NOME DA SKILL')).toBeInTheDocument();
        expect(screen.getByText('TIPO')).toBeInTheDocument();
        expect(screen.getByText('CATEGORIA')).toBeInTheDocument();
        expect(screen.getByText('DESCRIÇÃO DA COMPETÊNCIA')).toBeInTheDocument();
    });

    it('deve renderizar o cabeçalho de Editar skill quando um ID inicial for fornecido', () => {
        render(
            <SkillFormModal
                initial={{
                    id: 'skill-1',
                    name: 'React',
                    type: 'HARD',
                    category: 'FRONTEND',
                    description: 'Biblioteca JS',
                }}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />
        );
        expect(screen.getByText('Editar skill')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument();
    });

    it('deve invocar onClose ao clicar no botão de fechar', async () => {
        const handleClose = vi.fn();
        render(<SkillFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={handleClose} />);

        await userEvent.click(screen.getByRole('button', { name: '×' }));
        expect(handleClose).toHaveBeenCalled();
    });

    it('deve exibir erros de validação ao submeter formulário vazio', async () => {
        render(<SkillFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        await userEvent.click(screen.getByRole('button', { name: 'Criar skill' }));

        expect(screen.getByText('Nome da skill é obrigatório')).toBeInTheDocument();
        expect(screen.getByText('Tipo é obrigatório')).toBeInTheDocument();
        expect(screen.getByText('Categoria é obrigatória')).toBeInTheDocument();
    });

    it('deve exibir erro ao tentar cadastrar skill com nome duplicado', async () => {
        render(
            <SkillFormModal
                initial={{}}
                existingSkills={[{ id: '1', name: 'React' }]}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />
        );

        const nameInput = screen.getByPlaceholderText(/Ex: Kubernetes, Lógica de Programação/);
        const selects = screen.getAllByRole('combobox');

        await userEvent.type(nameInput, 'React');
        await userEvent.selectOptions(selects[0], 'HARD');
        await userEvent.selectOptions(selects[1], 'FRONTEND');
        await userEvent.click(screen.getByRole('button', { name: 'Criar skill' }));

        expect(screen.getByText('Já existe uma skill com este nome')).toBeInTheDocument();
    });

    it('deve chamar onSave com os dados corretos quando o formulário for válido', async () => {
        const handleSave = vi.fn();
        render(<SkillFormModal initial={{}} saving={false} onSave={handleSave} onClose={vi.fn()} />);

        const nameInput = screen.getByPlaceholderText(/Ex: Kubernetes, Lógica de Programação/);
        const selects = screen.getAllByRole('combobox');

        await userEvent.type(nameInput, 'React');
        await userEvent.selectOptions(selects[0], 'HARD');
        await userEvent.selectOptions(selects[1], 'FRONTEND');
        await userEvent.click(screen.getByRole('button', { name: 'Criar skill' }));

        expect(handleSave).toHaveBeenCalledWith({
            name: 'React',
            type: 'HARD',
            category: 'FRONTEND',
            description: undefined,
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

        expect(screen.getByRole('button', { name: 'Criar skill' })).toBeDisabled();
    });

    it('deve preencher os campos ao editar uma skill', () => {
        render(
            <SkillFormModal
                initial={{
                    id: '1',
                    name: 'React',
                    type: 'HARD',
                    category: 'FRONTEND',
                    description: 'Biblioteca JS',
                }}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />
        );

        const nameInput = screen.getByPlaceholderText(
            /Ex: Kubernetes, Lógica de Programação/
        ) as HTMLInputElement;
        const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];

        expect(nameInput.value).toBe('React');
        expect(selects[0].value).toBe('HARD');
        expect(selects[1].value).toBe('FRONTEND');
    });
});
