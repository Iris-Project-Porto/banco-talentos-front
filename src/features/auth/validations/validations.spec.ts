import { describe, it, expect } from 'vitest';
import {
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    forgotPasswordSchema,
    verifyEmailSchema
} from './validations';
import { UserRole } from '../types/roles';

describe('Auth Validations', () => {

    describe('loginSchema', () => {
        it('deve aprovar dados válidos', () => {
            const result = loginSchema.safeParse({ email: "teste@vilt-group.com", password: "123" });
            expect(result.success).toBe(true);
        });

        it('deve rejeitar e-mail inválido', () => {
            const result = loginSchema.safeParse({ email: "email-invalido", password: "123" });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("E-mail inválido");
            }
        });
    });

    describe('registerSchema', () => {
        it('deve rejeitar e-mail que não seja corporativo', () => {
            const result = registerSchema.safeParse({
                name: "João",
                email: "joao@gmail.com",
                password: "Senha@123",
                confirm: "Senha@123",
                role: UserRole.RESOURCE,
                groupId: "1"
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("Use seu e-mail corporativo");
            }
        });

        it('deve rejeitar senha que não tenha caracteres especiais ou letra maiúscula', () => {
            const result = registerSchema.safeParse({
                name: "João",
                email: "joao@vilt-group.com",
                password: "password123",
                confirm: "password123",
                role: UserRole.RESOURCE,
                groupId: "1"
            });
            expect(result.success).toBe(false);
        });
    });

    describe('resetPasswordSchema', () => {
        it('deve rejeitar se as passwords não coincidirem', () => {
            const result = resetPasswordSchema.safeParse({
                email: "teste@vilt-group.com",
                token: "token-valido",
                password: "Senha@123",
                confirm: "Senha@321"
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("As senhas não coincidem");
            }
        });

        it('deve aprovar se as passwords coincidirem e forem fortes', () => {
            const result = resetPasswordSchema.safeParse({
                email: "teste@vilt-group.com",
                token: "token-valido",
                password: "Senha@123",
                confirm: "Senha@123"
            });
            expect(result.success).toBe(true);
        });

        it('deve rejeitar senha com menos de 8 caracteres', () => {
            const result = resetPasswordSchema.safeParse({
                email: "teste@vilt-group.com",
                token: "token-valido",
                password: "Senha@1",
                confirm: "Senha@1"
            });
            expect(result.success).toBe(false);
        });

        it('deve rejeitar senha sem número', () => {
            const result = resetPasswordSchema.safeParse({
                email: "teste@vilt-group.com",
                token: "token-valido",
                password: "Senha@abc",
                confirm: "Senha@abc"
            });
            expect(result.success).toBe(false);
        });
    });

    describe('forgotPasswordSchema', () => {
        it('deve rejeitar email vazio ou inválido', () => {
            expect(forgotPasswordSchema.safeParse({ email: "" }).success).toBe(false);
            expect(forgotPasswordSchema.safeParse({ email: "invalido" }).success).toBe(false);
        });
    });

    describe('verifyEmailSchema', () => {
        it('deve rejeitar código com menos ou mais de 6 dígitos', () => {
            expect(verifyEmailSchema.safeParse({ email: "teste@vilt-group.com", code: "12345" }).success).toBe(false);
            expect(verifyEmailSchema.safeParse({ email: "teste@vilt-group.com", code: "1234567" }).success).toBe(false);
        });

        it('deve aprovar código com exatamente 6 dígitos', () => {
            expect(verifyEmailSchema.safeParse({ email: "teste@vilt-group.com", code: "123456" }).success).toBe(true);
        });
    });
});