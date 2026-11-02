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
        expect(screen.queryByText(/Soma dos Pesos:/i)).not.toBeInTheDocument();
    });

    it('deve permitir adicionar uma nova skill ao clicar no botão', () => {
        renderSection();

        const addButton = screen.getByRole('button', { name: 'Selecionar Skill' });
        fireEvent.click(addButton);

        expect(screen.queryByText('Nenhuma skill adicionada para esta vaga.')).not.toBeInTheDocument();
        expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
    });

    it('deve exibir os pesos individuais das skills', async () => {
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
            expect(screen.queryByText(/Soma dos Pesos:/i)).not.toBeInTheDocument();
        });
    });

    it('deve bloquear a fieldset quando canEdit for false', () => {
        renderSection({ canEdit: false });
        expect(screen.getByRole('group')).toBeDisabled();
    });
});

describe('Máscara e total dos pesos', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(skillsApi.getActiveSkills).mockResolvedValue({ content: mockSkills } as any);
    });

    it('permite limpar o peso e aceita apenas inteiros de 1 a 100', () => {
        renderSection();
        fireEvent.click(screen.getByRole('button', { name: 'Selecionar Skill' }));
        const input = screen.getByRole('textbox', { name: 'Peso da skill 1' });
        expect(input).toHaveValue('1');
        fireEvent.change(input, { target: { value: '' } });
        expect(input).toHaveValue('');
        for (const value of ['0', '101', '-1', '1.5', '1,5', '1e2', 'abc']) {
            fireEvent.change(input, { target: { value } });
            expect(input).toHaveValue('');
        }
        for (const value of ['1', '50', '100']) {
            fireEvent.change(input, { target: { value } });
            expect(input).toHaveValue(value);
        }
    });

    it('limita a soma a 100% e libera espaço ao reduzir ou remover uma skill', () => {
        renderSection({ defaultValues: { skills: [
            { name: 'React', importanceWeight: 50, type: 'MANDATORY', minLevel: 'BASIC' },
            { name: 'Node', importanceWeight: 50, type: 'DESIRABLE', minLevel: 'BASIC' },
        ] } });
        const weight = screen.getByRole('textbox', { name: 'Peso da skill 2' });
        const selectSkill = screen.getByRole('button', { name: 'Selecionar Skill' });
        expect(selectSkill).toBeDisabled();
        expect(screen.getByRole('button', { name: '+ Adicionar Skill' })).toBeDisabled();
        fireEvent.change(weight, { target: { value: '51' } });
        expect(weight).toHaveValue('50');
        fireEvent.change(weight, { target: { value: '40' } });
        expect(weight).toHaveValue('40');
        expect(selectSkill).toBeEnabled();
        fireEvent.click(selectSkill);
        const thirdWeight = screen.getByRole('textbox', { name: 'Peso da skill 3' });
        fireEvent.change(thirdWeight, { target: { value: '50' } });
        expect(thirdWeight).toHaveValue('1');
        fireEvent.change(thirdWeight, { target: { value: '10' } });
        expect(thirdWeight).toHaveValue('10');
        expect(selectSkill).toBeDisabled();
        fireEvent.click(screen.getAllByTitle('Excluir')[0]);
        expect(selectSkill).toBeEnabled();
        expect(screen.getByText(/Total dos pesos: 50%/)).toBeInTheDocument();
    });
});
