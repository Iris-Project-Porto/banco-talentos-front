import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { SkillsSection } from './SkillsSection';
import { skillsApi } from '@/features/skills';
import { type VagaFormData } from '../../validations/validations';

vi.mock('@/features/skills', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/features/skills')>();
    return {
        ...actual,
        skillsApi: {
            ...actual.skillsApi,
            getActiveSkills: vi.fn(),
            create: vi.fn(),
        },
    };
});

const mockSkills = [
    { id: 'React', name: 'React', type: 'HARD', category: 'FRONTEND', active: true, resourcesCount: 0, averageProficiency: 0 },
    { id: 'Node', name: 'Node', type: 'HARD', category: 'BACKEND', active: true, resourcesCount: 0, averageProficiency: 0 },
];

const FormWrapper = ({ children, defaultValues = { skills: [] } }: { children: React.ReactNode, defaultValues?: any }) => {
    const methods = useForm<VagaFormData>({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
};

const renderSection = (props: { canEdit?: boolean; defaultValues?: any } = {}) => {
    const { canEdit = true, defaultValues } = props;
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <FormWrapper defaultValues={defaultValues}>
                <SkillsSection canEdit={canEdit} />
            </FormWrapper>
        </QueryClientProvider>
    );
};

describe('SkillsSection Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(skillsApi.getActiveSkills).mockResolvedValue({ content: mockSkills } as any);
    });

    it('deve renderizar a mensagem de lista vazia inicialmente', () => {
        renderSection();
        expect(screen.getByText('Nenhuma skill adicionada para esta vaga.')).toBeInTheDocument();

        const sumElement = screen.getByText(/Soma dos Pesos:/i);
        expect(sumElement).toHaveTextContent('0%');
    });

    it('deve permitir adicionar uma nova skill ao clicar no botão', () => {
        renderSection();

        const addButton = screen.getByRole('button', { name: 'Selecionar Skill' });
        fireEvent.click(addButton);

        expect(screen.queryByText('Nenhuma skill adicionada para esta vaga.')).not.toBeInTheDocument();
        expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
    });

    it('deve calcular corretamente a soma dos pesos das skills', async () => {
        renderSection({
            defaultValues: {
                skills: [
                    { name: 'React', importanceWeight: 60, type: 'MANDATORY', minLevel: 'ADVANCED' },
                    { name: 'Node', importanceWeight: 40, type: 'DESIRABLE', minLevel: 'INTERMEDIATE' }
                ]
            }
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('60')).toBeInTheDocument();
            expect(screen.getByDisplayValue('40')).toBeInTheDocument();
            expect(screen.getByText('Peso validado')).toBeInTheDocument();

            const sumElement = screen.getByText(/Soma dos Pesos:/i);
            expect(sumElement).toHaveTextContent('100%');
        });
    });

    it('deve bloquear a fieldset quando canEdit for false', () => {
        renderSection({ canEdit: false });
        expect(screen.getByRole('group')).toBeDisabled();
    });
});
