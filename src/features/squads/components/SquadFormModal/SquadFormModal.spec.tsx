import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SquadFormModal } from './SquadFormModal';
import { squadsApi } from '../../api/squads.api';

vi.mock('../../api/squads.api', () => ({
    squadsApi: {
        activate: vi.fn(),
        inactivate: vi.fn(),
    }
}));

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('Componente SquadFormModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve renderizar o cabeçalho de Nova Squad quando não houver ID inicial', () => {
        renderWithQueryClient(<SquadFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);
        expect(screen.getByText('Nova Squad')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Criar squad' })).toBeInTheDocument();

        expect(screen.queryByRole('button', { name: /Inativar Squad/i })).not.toBeInTheDocument();
    });

    it('deve renderizar os campos do formulário', () => {
        renderWithQueryClient(<SquadFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        expect(screen.getByText('Nome da Squad *')).toBeInTheDocument();
        expect(screen.getByText('ID do Projeto *')).toBeInTheDocument();
        expect(screen.getByText('Project Manager *')).toBeInTheDocument();
        expect(screen.getByText('Coordenador Porto *')).toBeInTheDocument();
        expect(screen.getByText('Descrição *')).toBeInTheDocument();
    });

    it('deve renderizar o cabeçalho de Editar Squad quando um ID inicial for fornecido', () => {
        renderWithQueryClient(
            <SquadFormModal
                initial={{
                    id: '123',
                    name: 'Squad Alpha',
                    projectId: 'proj-1',
                    projectManager: 'João',
                    portoCoordinator: 'Maria',
                    description: 'Uma squad',
                    active: true
                }}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />
        );
        expect(screen.getByText('Editar Squad')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument();
        expect(screen.getByText('Ativa')).toBeInTheDocument(); // Badge de status
        expect(screen.getByRole('button', { name: 'Inativar Squad' })).toBeInTheDocument();
    });

    it('deve preencher os campos ao editar uma squad', () => {
        renderWithQueryClient(
            <SquadFormModal
                initial={{
                    id: '123',
                    name: 'Squad Alpha',
                    projectId: 'proj-1',
                    projectManager: 'João',
                    portoCoordinator: 'Maria',
                    description: 'Uma squad',
                }}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByDisplayValue('Squad Alpha')).toBeInTheDocument();
        expect(screen.getByDisplayValue('proj-1')).toBeInTheDocument();
        expect(screen.getByDisplayValue('João')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Maria')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Uma squad')).toBeInTheDocument();
    });

    it('deve invocar onClose ao clicar no botão de fechar ou cancelar', async () => {
        const handleClose = vi.fn();
        renderWithQueryClient(<SquadFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={handleClose} />);

        await userEvent.click(screen.getByRole('button', { name: '×' }));
        expect(handleClose).toHaveBeenCalledTimes(1);

        await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
        expect(handleClose).toHaveBeenCalledTimes(2);
    });

    it('deve exibir erros de validação ao submeter formulário vazio', async () => {
        renderWithQueryClient(<SquadFormModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        await userEvent.click(screen.getByRole('button', { name: 'Criar squad' }));

        expect(await screen.findByText('O nome da squad é obrigatório')).toBeInTheDocument();
        expect(await screen.findByText('O projeto é obrigatório')).toBeInTheDocument();
        expect(await screen.findByText('Project Manager é obrigatório')).toBeInTheDocument();
        expect(await screen.findByText('A descrição é obrigatória')).toBeInTheDocument();
    });

    it('deve chamar onSave com os dados corretos quando o formulário for válido', async () => {
        const handleSave = vi.fn();
        renderWithQueryClient(<SquadFormModal initial={{}} saving={false} onSave={handleSave} onClose={vi.fn()} />);

        const inputs = screen.getAllByRole('textbox');

        await userEvent.type(inputs[0], 'Nova Squad Teste');
        await userEvent.type(inputs[1], 'proj-xyz');
        await userEvent.type(inputs[2], 'Fulano PM');
        await userEvent.type(inputs[3], 'Ciclano Coord');
        await userEvent.type(inputs[4], 'Descrição da squad de testes');

        await userEvent.click(screen.getByRole('button', { name: 'Criar squad' }));

        expect(handleSave).toHaveBeenCalledWith({
            name: 'Nova Squad Teste',
            projectId: 'proj-xyz',
            projectManager: 'Fulano PM',
            portoCoordinator: 'Ciclano Coord',
            description: 'Descrição da squad de testes',
            id: undefined,
        });
    });

    it('deve chamar a mutação de inativar quando a squad for inativada', async () => {
        renderWithQueryClient(
            <SquadFormModal
                initial={{
                    id: '123',
                    name: 'Squad Alpha',
                    active: true
                }}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />
        );

        await userEvent.click(screen.getByRole('button', { name: 'Inativar Squad' }));
        expect(squadsApi.inactivate).toHaveBeenCalledWith('123');
    });

    it('deve desabilitar os botões de ação durante o salvamento', () => {
        renderWithQueryClient(<SquadFormModal initial={{}} saving={true} onSave={vi.fn()} onClose={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Criar squad' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    });
});
