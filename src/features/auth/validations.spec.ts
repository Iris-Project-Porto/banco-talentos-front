import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from './validations';
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
});