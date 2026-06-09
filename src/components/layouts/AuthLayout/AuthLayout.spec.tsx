import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthLayout from './AuthLayout';

describe('AuthLayout Component', () => {
    it('deve renderizar o conteúdo (children)', () => {
        render(
            <AuthLayout>
                <form data-testid="login-form">Formulário de Login</form>
            </AuthLayout>
        );
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('deve renderizar o footer se for fornecido', () => {
        render(
            <AuthLayout footer={<span>Rodapé Personalizado</span>}>
                <div>Conteúdo</div>
            </AuthLayout>
        );
        expect(screen.getByText('Rodapé Personalizado')).toBeInTheDocument();
    });
});