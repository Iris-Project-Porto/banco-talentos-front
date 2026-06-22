import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { GeneralFields } from './GeneralFields';
import { type VagaFormData } from '../../validations/validations';

const FormWrapper = ({ children, defaultValues = {} }: { children: React.ReactNode, defaultValues?: any }) => {
    const methods = useForm<VagaFormData>({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('GeneralFields Component', () => {
    const mockDependencies = {
        projects: [{ id: 'p1', name: 'Projeto Alpha' }],
        filteredSquads: [{ id: 's1', projectId: 'p1', name: 'Squad A' }],
        loadingProjects: false,
        loadingSquads: false,
    };

    it('deve renderizar todos os campos gerais', () => {
        render(
            <FormWrapper>
                <GeneralFields canEdit={true} dependencies={mockDependencies} />
            </FormWrapper>
        );


        expect(screen.getByText(/Código da Vaga \*/i)).toBeInTheDocument();
        expect(screen.getByText(/Título da Vaga \*/i)).toBeInTheDocument();
        expect(screen.getByText(/Projeto \*/i)).toBeInTheDocument();
        expect(screen.getByText(/Squad Responsável \*/i)).toBeInTheDocument();
        expect(screen.getByText(/Modalidade \*/i)).toBeInTheDocument();
        expect(screen.getByText(/Recrutador \*/i)).toBeInTheDocument();

        expect(screen.getByPlaceholderText(/Ex: VAG-001/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Nome do recrutador/i)).toBeInTheDocument();
    });

    it('deve preencher as comboboxes com os dados das dependencies', () => {
        render(
            <FormWrapper>
                <GeneralFields canEdit={true} dependencies={mockDependencies} />
            </FormWrapper>
        );

        expect(screen.getByRole('option', { name: 'Projeto Alpha' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Squad A' })).toBeInTheDocument();
    });

    it('deve bloquear a fieldset quando canEdit for false', () => {
        render(
            <FormWrapper>
                <GeneralFields canEdit={false} dependencies={mockDependencies} />
            </FormWrapper>
        );

        const fieldset = screen.getByRole('group');
        expect(fieldset).toBeDisabled();
    });
});