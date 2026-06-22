import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { SkillsSection } from './SkillsSection';
import { type VagaFormData } from '../../validations/validations';

const FormWrapper = ({ children, defaultValues = { skills: [] } }: { children: React.ReactNode, defaultValues?: any }) => {
    const methods = useForm<VagaFormData>({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('SkillsSection Component', () => {
    it('deve renderizar a mensagem de lista vazia inicialmente', () => {
        render(
            <FormWrapper>
                <SkillsSection canEdit={true} />
            </FormWrapper>
        );
        expect(screen.getByText('Nenhuma skill adicionada para esta vaga.')).toBeInTheDocument();

        const sumElement = screen.getByText(/Soma dos Pesos:/i);
        expect(sumElement).toHaveTextContent('0%');
    });

    it('deve permitir adicionar uma nova skill ao clicar no botão', () => {
        render(
            <FormWrapper>
                <SkillsSection canEdit={true} />
            </FormWrapper>
        );

        const addButton = screen.getByRole('button', { name: '+ Adicionar Skill' });
        fireEvent.click(addButton);

        expect(screen.queryByText('Nenhuma skill adicionada para esta vaga.')).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText('Ex: Java')).toBeInTheDocument();
    });

    it('deve calcular corretamente a soma dos pesos das skills', async () => {
        render(
            <FormWrapper defaultValues={{
                skills: [
                    { name: 'React', importanceWeight: 60, type: 'MANDATORY', minLevel: 'ADVANCED' },
                    { name: 'Node', importanceWeight: 40, type: 'DESIRABLE', minLevel: 'INTERMEDIATE' }
                ]
            }}>
                <SkillsSection canEdit={true} />
            </FormWrapper>
        );


        await waitFor(() => {
            expect(screen.getByDisplayValue('React')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Node')).toBeInTheDocument();
            expect(screen.getByText('Peso validado')).toBeInTheDocument();


            const sumElement = screen.getByText(/Soma dos Pesos:/i);
            expect(sumElement).toHaveTextContent('100%');
        });
    });

    it('deve bloquear a fieldset quando canEdit for false', () => {
        render(
            <FormWrapper>
                <SkillsSection canEdit={false} />
            </FormWrapper>
        );
        expect(screen.getByRole('group')).toBeDisabled();
    });
});