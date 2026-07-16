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
            queries: { retry: false },
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
        vi.mocked(vagasApi.getProjects).mockResolvedValue({ content: mockProjects } as any);
        vi.mocked(vagasApi.getSquads).mockResolvedValue({ content: mockSquads } as any);
    });

    it('deve renderizar o cabeçalho de Nova Vaga quando não houver ID inicial', () => {
        renderWithClient(<VagaModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);
        expect(screen.getByText('Nova vaga')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Criar vaga' })).toBeInTheDocument();
    });

    it('deve renderizar o cabeçalho de Editar Vaga quando um ID inicial for fornecido', () => {
        renderWithClient(<VagaModal initial={{ id: 'vaga-123', status: 'OPEN' }} saving={false} onSave={vi.fn()} onClose={vi.fn()} />);
        expect(screen.getByText('Editar vaga')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument();
    });

    it('deve bloquear a edição e esconder o botão de salvar caso o status da vaga não permita edição', async () => {
        renderWithClient(
            <VagaModal
                initial={{ id: 'vaga-123', status: 'FILLED' }}
                saving={false}
                onSave={vi.fn()}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByText(/Vagas com status/i)).toBeInTheDocument();
        expect(screen.getByText('FILLED')).toBeInTheDocument();
        expect(screen.getByText(/não podem ser editadas/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Salvar alterações' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
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
            expect(screen.queryAllByText('Carregando...')).toHaveLength(0);
        });

        const selects = screen.getAllByRole('combobox');
        const projectSelect = selects[0];

        expect(screen.getByText('Nenhuma squad neste projeto')).toBeInTheDocument();

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
            expect(screen.queryAllByText('Carregando...')).toHaveLength(0);
        });

        const submitButton = screen.getByRole('button', { name: 'Criar vaga' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Código da vaga é obrigatório')).toBeInTheDocument();
            expect(screen.getByText('Título da vaga é obrigatório')).toBeInTheDocument();
            expect(screen.getByText('Selecione o projeto')).toBeInTheDocument();
            expect(screen.getByText('Selecione a squad')).toBeInTheDocument();
            expect(screen.getByText('A modalidade é obrigatória')).toBeInTheDocument();
            expect(screen.getByText('Informe o recrutador responsável')).toBeInTheDocument();
        });
    });

    it('deve invocar onSave com o payload correto e tratado após preenchimento válido', async () => {
        const handleSave = vi.fn();
        const { container } = renderWithClient(
            <VagaModal
                initial={{
                    skills: [
                        { name: 'React', type: 'MANDATORY', minLevel: 'BASIC', importanceWeight: 100 },
                    ],
                }}
                saving={false}
                onSave={handleSave}
                onClose={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.queryAllByText('Carregando...')).toHaveLength(0);
        });

        const selects = screen.getAllByRole('combobox');
        fireEvent.change(selects[0], { target: { value: 'proj-1' } });

        await waitFor(() => {
            expect(screen.getByText('Squad A1')).toBeInTheDocument();
        });

        fireEvent.change(selects[1], { target: { value: 'sq-1' } });
        fireEvent.change(selects[2], { target: { value: 'SENIOR' } });
        fireEvent.change(selects[3], { target: { value: 'REMOTO' } });
        fireEvent.change(selects[4], { target: { value: 'OPEN' } });

        fireEvent.change(screen.getByPlaceholderText('Ex: VAG-001'), { target: { value: 'VAG-123' } });
        fireEvent.change(screen.getByPlaceholderText('Ex: Desenvolvedor React Sênior'), { target: { value: 'Frontend Developer' } });
        fireEvent.change(screen.getByPlaceholderText('Nome do recrutador'), { target: { value: 'Paula RH' } });
        fireEvent.change(container.querySelector('input[name="estimatedAllocationWeeks"]')!, { target: { value: '12' } });
        fireEvent.change(screen.getByPlaceholderText('Conteúdo principal...'), { target: { value: 'Desenvolvedor Frontend' } });
        fireEvent.change(screen.getByPlaceholderText('Notas de alinhamento...'), { target: { value: 'Urgente' } });

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
                vacancyCode: 'VAG-123',
                title: 'Frontend Developer',
                projectId: 'proj-1',
                squadId: 'sq-1',
                experienceLevel: 'SENIOR',
                modality: 'REMOTO',
                recruiter: 'Paula RH',
                estimatedAllocationWeeks: 12,
                status: 'OPEN',
                description: 'Desenvolvedor Frontend',
                requirements: '',
                notes: 'Urgente',
                isUrgent: true,
                openingDate: expect.stringContaining('2026-07-01')
            }));
        });
    });

    it('deve acionar onClose ao clicar nos botões de fechar, cancelar ou fora do modal (backdrop)', () => {
        const handleClose = vi.fn();
        const { container } = renderWithClient(
            <VagaModal initial={{}} saving={false} onSave={vi.fn()} onClose={handleClose} />
        );

        const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelBtn);
        expect(handleClose).toHaveBeenCalledTimes(1);

        const backdrop = container.querySelector('.bg-slate-900\\/40') || container.querySelector('.backdrop-blur-sm');
        if (backdrop) {
            fireEvent.click(backdrop);
            expect(handleClose).toHaveBeenCalledTimes(2);
        }

        const closeX = screen.getByText('×');
        if (closeX) {
            fireEvent.click(closeX);
            expect(handleClose).toHaveBeenCalledTimes(3);
        }
    });

    it('deve desativar os botões e renderizar o indicador de carregamento quando saving for true', () => {
        renderWithClient(<VagaModal initial={{}} saving={true} onSave={vi.fn()} onClose={vi.fn()} />);

        const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
        const submitBtn = screen.getByRole('button', { name: 'Criar vaga' });

        expect(cancelBtn).toBeDisabled();
        expect(submitBtn).toBeDisabled();
        expect(submitBtn.querySelector('svg')).toBeInTheDocument();
    });

    it('deve resetar o campo de squad se o projeto mudar e a squad anterior se tornar inválida', async () => {

        renderWithClient(
            <VagaModal initial={{}} saving={false} onSave={vi.fn()} onClose={vi.fn()} />
        );

        await waitFor(() => {
            expect(screen.queryAllByText('Carregando...')).toHaveLength(0);
        });

        const selects = screen.getAllByRole('combobox');
        const projectSelect = selects[0] as HTMLSelectElement;
        const squadSelect = selects[1] as HTMLSelectElement;

        fireEvent.change(projectSelect, { target: { value: 'proj-1' } });

        await waitFor(() => {
            expect(screen.getByText('Squad A1')).toBeInTheDocument();
        });

        fireEvent.change(squadSelect, { target: { value: 'sq-1' } });

        await waitFor(() => {
            expect(squadSelect.value).toBe('sq-1');
        });

        fireEvent.change(projectSelect, { target: { value: 'proj-2' } });

        await waitFor(() => {
            expect(squadSelect.value).toBe('');
        });
    });
});