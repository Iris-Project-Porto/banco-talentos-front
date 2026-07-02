import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectFormModal } from './ProjectFormModal';

describe('Componente ProjectFormModal', () => {
    it('deve renderizar o cabeçalho de Novo projeto quando não houver ID inicial', () => {
        render(<ProjectFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        expect(screen.getByText('Novo projeto')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Criar projeto' })).toBeInTheDocument();
    });

    it('deve renderizar os campos do formulário com labels', () => {
        render(<ProjectFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        expect(screen.getByText('NOME DO PROJETO')).toBeInTheDocument();
        expect(screen.getByText('DESCRIÇÃO')).toBeInTheDocument();
    });

    it('deve renderizar o cabeçalho de Editar projeto e o campo de status', () => {
        render(
            <ProjectFormModal
                initial={{
                    id: 'project-1',
                    name: 'Migração de Cloud',
                    description: 'Desc',
                    active: false,
                }}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />,
        );

        expect(screen.getByText('Editar projeto')).toBeInTheDocument();
        expect(screen.getByText('STATUS')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument();
    });

    it('deve invocar onClose ao clicar no botão de fechar', async () => {
        const handleClose = vi.fn();
        render(<ProjectFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={handleClose} />);

        await userEvent.click(screen.getByRole('button', { name: '×' }));
        expect(handleClose).toHaveBeenCalled();
    });

    it('deve exibir erro de validação ao submeter formulário vazio', async () => {
        render(<ProjectFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        await userEvent.click(screen.getByRole('button', { name: 'Criar projeto' }));

        expect(screen.getByText('Nome do projeto é obrigatório')).toBeInTheDocument();
    });

    it('deve exibir erro ao tentar cadastrar projeto com nome duplicado', async () => {
        render(
            <ProjectFormModal
                initial={{}}
                existingProjects={[{ id: '1', name: 'Migração de Cloud' }]}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />,
        );

        await userEvent.type(
            screen.getByPlaceholderText('Ex: Migração de Cloud, Portal do Cliente...'),
            'Migração de Cloud',
        );
        await userEvent.type(
            screen.getByPlaceholderText('Descreva brevemente o objetivo do projeto'),
            'Descrição do projeto',
        );
        await userEvent.click(screen.getByRole('button', { name: 'Criar projeto' }));

        expect(screen.getByText('Já existe um projeto cadastrado com este nome.')).toBeInTheDocument();
    });

    it('deve chamar onSave com os dados corretos ao criar projeto', async () => {
        const handleSave = vi.fn();
        render(<ProjectFormModal initial={{}} saving={false} onSave={handleSave} onClose={vi.fn()} />);

        await userEvent.type(
            screen.getByPlaceholderText('Ex: Migração de Cloud, Portal do Cliente...'),
            'Portal do Cliente',
        );
        await userEvent.type(
            screen.getByPlaceholderText('Descreva brevemente o objetivo do projeto'),
            'Portal web para clientes',
        );
        await userEvent.click(screen.getByRole('button', { name: 'Criar projeto' }));

        expect(handleSave).toHaveBeenCalledWith({
            name: 'Portal do Cliente',
            description: 'Portal web para clientes',
        });
    });

    it('deve chamar onSave com status ao editar projeto inativo para ativo', async () => {
        const handleSave = vi.fn();
        render(
            <ProjectFormModal
                initial={{
                    id: 'project-1',
                    name: 'Legado',
                    description: 'Sistema legado',
                    active: false,
                }}
                saving={false}
                onSave={handleSave}
                onClose={vi.fn()}
            />,
        );

        const statusSelect = screen.getByRole('combobox');
        await userEvent.selectOptions(statusSelect, 'ACTIVE');
        await userEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

        expect(handleSave).toHaveBeenCalledWith({
            name: 'Legado',
            description: 'Sistema legado',
            id: 'project-1',
            active: true,
            initialActive: false,
        });
    });

    it('deve invocar onClose ao clicar em Cancelar', async () => {
        const handleClose = vi.fn();
        render(<ProjectFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={handleClose} />);

        await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
        expect(handleClose).toHaveBeenCalled();
    });

    it('deve desabilitar o botão de salvar durante o envio', () => {
        render(<ProjectFormModal initial={{}} saving={true} onSave={vi.fn()} onClose={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Criar projeto' })).toBeDisabled();
    });
});
