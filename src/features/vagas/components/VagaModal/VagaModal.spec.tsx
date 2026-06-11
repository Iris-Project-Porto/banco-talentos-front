import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VagaModal } from './VagaModal';
import { vagasApi } from '../../api/vagas.api';

vi.mock('../../api/vagas.api', () => ({
    vagasApi: {
        getProjects: vi.fn(),
        getSquads: vi.fn(),
    }
}));

const mockProjects = [
    { id: 'proj-1', name: 'Projeto Alpha' },
    { id: 'proj-2', name: 'Projeto Beta' },
];

const mockSquads = [
    { id: 'sq-1', projectId: 'proj-1', name: 'Squad A1' },
    { id: 'sq-2', projectId: 'proj-1', name: 'Squad A2' },
    { id: 'sq-3', projectId: 'proj-2', name: 'Squad B1' },
];

const renderWithClient = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('Componente VagaModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(vagasApi.getProjects).mockResolvedValue(mockProjects);
        vi.mocked(vagasApi.getSquads).mockResolvedValue(mockSquads);
    });

    it('deve renderizar o cabeçalho de Nova Vaga quando não houver ID inicial', () => {
        renderWithClient(<VagaModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        expect(screen.getByText('Nova vaga')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Criar vaga' })).toBeInTheDocument();
    });

    it('deve renderizar o cabeçalho de Editar Vaga quando um ID inicial for fornecido', () => {
        renderWithClient(<VagaModal initial={{ id: 'vaga-123' }} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        expect(screen.getByText('Editar vaga')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument();
    });

    it('deve carregar os projetos e squads vindos da API nos seletores', async () => {
        renderWithClient(<VagaModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        await waitFor(() => {
            expect(vagasApi.getProjects).toHaveBeenCalledTimes(1);
            expect(vagasApi.getSquads).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.getByText('Projeto Alpha')).toBeInTheDocument();
            expect(screen.getByText('Projeto Beta')).toBeInTheDocument();
        });
    });

    it('deve filtrar dinamicamente as squads com base no projeto selecionado', async () => {
        renderWithClient(<VagaModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        const selects = screen.getAllByRole('combobox');
        const projectSelect = selects[0]; // Primeiro <select> mapeado é o Projeto

        expect(screen.getByText('Selecione o projeto primeiro')).toBeInTheDocument();

        // Altera a seleção de projeto para "Projeto Alpha" (proj-1)
        fireEvent.change(projectSelect, { target: { value: 'proj-1' } });

        await waitFor(() => {
            expect(screen.getByText('Squad A1')).toBeInTheDocument();
            expect(screen.getByText('Squad A2')).toBeInTheDocument();
            expect(screen.queryByText('Squad B1')).not.toBeInTheDocument();
        });
    });

    it('deve exibir erros de validação do Zod ao submeter campos obrigatórios vazios', async () => {
        renderWithClient(<VagaModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);

        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        const submitButton = screen.getByRole('button', { name: 'Criar vaga' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('O ID do projeto é obrigatório')).toBeInTheDocument();
            expect(screen.getByText('O ID da squad é obrigatório')).toBeInTheDocument();
            expect(screen.getByText('O recrutador é obrigatório')).toBeInTheDocument();
        });
    });

    it('deve invocar onSave com o payload correto e tratado após preenchimento válido', async () => {
        const handleSave = vi.fn();
        const { container } = renderWithClient(
            <VagaModal initial={{}} saving={false} onSave={handleSave} onClose={vi.fn()} />
        );

        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        const selects = screen.getAllByRole('combobox');
        fireEvent.change(selects[0], { target: { value: 'proj-1' } }); // Projeto

        await waitFor(() => {
            expect(screen.getByText('Squad A1')).toBeInTheDocument();
        });

        fireEvent.change(selects[1], { target: { value: 'sq-1' } });   // Squad
        fireEvent.change(selects[2], { target: { value: 'SENIOR' } }); // Nível

        fireEvent.change(screen.getByPlaceholderText('Nome do recrutador'), { target: { value: 'Paula RH' } });
        fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '12' } });
        fireEvent.change(screen.getByPlaceholderText('Ex: Aberta, Entrevistas...'), { target: { value: 'Triagem' } });
        fireEvent.change(screen.getByPlaceholderText('Descrição da vaga'), { target: { value: 'Desenvolvedor Frontend' } });
        fireEvent.change(screen.getByPlaceholderText('Requisitos esperados'), { target: { value: 'React' } });
        fireEvent.change(screen.getByPlaceholderText('Notas...'), { target: { value: 'Urgente' } });

        // Checkbox usa nesting e label text vinculada corretamente
        const checkbox = screen.getByLabelText('Vaga Urgente');
        fireEvent.click(checkbox);

        const dateInput = container.querySelector('input[type="date"]');
        if (dateInput) {
            fireEvent.change(dateInput, { target: { value: '2026-07-01' } });
        }

        const submitButton = screen.getByRole('button', { name: 'Criar vaga' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleSave).toHaveBeenCalledTimes(1);
            expect(handleSave).toHaveBeenCalledWith(expect.objectContaining({
                projectId: 'proj-1',
                squadId: 'sq-1',
                experienceLevel: 'SENIOR',
                recruiter: 'Paula RH',
                estimatedAllocationWeeks: 12,
                status: 'Triagem',
                description: 'Desenvolvedor Frontend',
                requirements: 'React',
                notes: 'Urgente',
                isUrgent: true,
                openingDate: new Date('2026-07-01').toISOString()
            }));
        });
    });

    it('deve acionar onClose ao clicar nos botões de fechar, cancelar ou fora do modal (backdrop)', () => {
        const handleClose = vi.fn();
        const { container } = renderWithClient(
            <VagaModal initial={{}} saving={false} onSave={vi.fn()} onClose={handleClose} />
        );

        // 1. Clicar no botão "×" no canto superior
        const closeX = screen.getByRole('button', { name: '×' });
        fireEvent.click(closeX);
        expect(handleClose).toHaveBeenCalledTimes(1);

        // 2. Clicar no botão Cancelar
        const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelBtn);
        expect(handleClose).toHaveBeenCalledTimes(2);

        // 3. Clicar no fundo escurecido (backdrop)
        const backdrop = container.querySelector('.bg-slate-900\\/40');
        if (backdrop) {
            fireEvent.click(backdrop);
            expect(handleClose).toHaveBeenCalledTimes(3);
        }
    });

    it('deve desativar os botões e renderizar o indicador de carregamento quando saving for true', () => {
        renderWithClient(<VagaModal initial={{}} saving={true} onSave={vi.fn()} onClose={vi.fn()} />);

        const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
        const submitBtn = screen.getByRole('button', { name: 'Criar vaga' });

        expect(cancelBtn).toBeDisabled();
        expect(submitBtn).toBeDisabled();
        expect(submitBtn.querySelector('svg')).toBeInTheDocument(); // Valida o Spinner <Loader2 /> do componente Button customizado
    });

    it('deve resetar o campo de squad se o projeto mudar e a squad anterior se tornar inválida', async () => {
        renderWithClient(
            <VagaModal
                initial={{ projectId: 'proj-1', squadId: 'sq-1' }}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        const selects = screen.getAllByRole('combobox');
        const projectSelect = selects[0];
        const squadSelect = selects[1];

        await waitFor(() => {
            expect(projectSelect).toHaveValue('proj-1');
            expect(squadSelect).toHaveValue('sq-1');
        });

        // Modifica para o Projeto Beta (proj-2), onde a squad anterior (sq-1) não pertence
        fireEvent.change(projectSelect, { target: { value: 'proj-2' } });

        await waitFor(() => {
            expect(squadSelect).toHaveValue(''); // O useEffect deve redefinir para vazio
        });
    });
});