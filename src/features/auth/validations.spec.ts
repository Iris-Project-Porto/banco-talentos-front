import { describe, it, expect } from 'vitest';
import {
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    forgotPasswordSchema,
    verifyEmailSchema
} from './validations';
import { UserRole } from './types/roles';

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
                expect(result.error.issues[0].message).toBe("Formato de e-mail inválido");
            }
        });
    });

    describe('registerSchema', () => {
        it('deve rejeitar e-mail que não seja corporativo', () => {
            const result = registerSchema.safeParse({
                name: "João",
                email: "joao@gmail.com",
                password: "password123",
                role: UserRole.RECURSO,
                groupId: "1"
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("Use seu e-mail corporativo");
            }
        });
    });

    describe('resetPasswordSchema', () => {
        it('deve rejeitar se as passwords não coincidirem', () => {
            const result = resetPasswordSchema.safeParse({
                email: "teste@vilt-group.com",
                token: "token-valido",
                password: "password123",
                confirm: "passwordDiferente"
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("As senhas não coincidem");
            }
        });

        it('deve aprovar se as passwords coincidirem', () => {
            const result = resetPasswordSchema.safeParse({
                email: "teste@vilt-group.com",
                token: "token-valido",
                password: "password123",
                confirm: "password123"
            });
            expect(result.success).toBe(true);
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