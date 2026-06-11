import { z } from "zod";
import { UserRole } from "../types/roles";

export const loginSchema = z.object({
    email: z.string({ required_error: "O e-mail é obrigatório" })
        .min(1, "O e-mail é obrigatório")
        .email("E-mail inválido"),
    password: z.string({ required_error: "A senha é obrigatória" })
        .min(1, "A senha é obrigatória"),
});

export const registerSchema = z.object({
    name: z.string({ required_error: "O nome é obrigatório" })
        .min(1, "O nome é obrigatório")
        .min(3, "O nome deve ter no mínimo 3 caracteres"),
    email: z.string({ required_error: "O e-mail é obrigatório" })
        .min(1, "O e-mail é obrigatório")
        .email("Formato de e-mail inválido")
        .endsWith("@vilt-group.com", "Use seu e-mail corporativo"),
    password: z.string({ required_error: "A senha é obrigatória" })
        .min(1, "A senha é obrigatória")
        .min(6, "A senha deve ter no mínimo 6 caracteres"),
    role: z.nativeEnum(UserRole, {
        required_error: "O nível de acesso é obrigatório",
        invalid_type_error: "Selecione um nível válido"
    }),
    groupId: z.string({ required_error: "O grupo é obrigatório" })
        .min(1, "Selecione um grupo"),
});

export const resetPasswordSchema = z.object({
    email: z.string({ required_error: "O e-mail é obrigatório" })
        .min(1, "O e-mail é obrigatório")
        .email("Formato de e-mail inválido"),
    token: z.string({ required_error: "O token é obrigatório" })
        .min(1, "O token é obrigatório"),
    password: z.string({ required_error: "A senha é obrigatória" })
        .min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirm: z.string({ required_error: "A confirmação de senha é obrigatória" })
        .min(1, "Confirme sua senha"),
}).refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
});

export const forgotPasswordSchema = z.object({
    email: z.string({ required_error: "O e-mail é obrigatório" })
        .min(1, "O e-mail é obrigatório")
        .email("E-mail inválido ou usuário não cadastrado"),
});

export const verifyEmailSchema = z.object({
    email: z.string({ required_error: "O e-mail é obrigatório" })
        .min(1, "O e-mail é obrigatório")
        .email("Formato de e-mail inválido"),
    code: z.string({ required_error: "O código é obrigatório" })
        .length(6, "O código deve ter exatamente 6 dígitos"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;