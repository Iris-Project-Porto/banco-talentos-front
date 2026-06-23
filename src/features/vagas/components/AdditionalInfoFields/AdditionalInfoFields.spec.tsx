import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { AdditionalInfoFields } from './AdditionalInfoFields';
import { type VagaFormData } from '../../validations/validations';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<VagaFormData>();
    return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('AdditionalInfoFields Component', () => {
    it('deve renderizar os campos de texto adicionais', () => {
        render(
            <FormWrapper>
                <AdditionalInfoFields canEdit={true} />
            </FormWrapper>
        );

        expect(screen.getByPlaceholderText('Conteúdo principal...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Notas de alinhamento...')).toBeInTheDocument();
    });

    it('deve desativar os campos quando canEdit for false', () => {
        render(
            <FormWrapper>
                <AdditionalInfoFields canEdit={false} />
            </FormWrapper>
        );

        expect(screen.getByRole('group')).toBeDisabled();
    });
});