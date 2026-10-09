import { z } from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "./passwordRules";

const strongPasswordSchema = z
    .string({ required_error: "A senha é obrigatória" })
    .min(1, "A senha é obrigatória")
    .min(PASSWORD_MIN_LENGTH, "A senha deve ter no mínimo 8 caracteres")
    .regex(PASSWORD_REGEX.uppercase, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(PASSWORD_REGEX.number, "A senha deve conter pelo menos um número")
    .regex(PASSWORD_REGEX.special, "A senha deve conter pelo menos um caractere especial");

export const loginSchema = z.object({
    email: z.string({ required_error: "O e-mail é obrigatório" })
        .min(1, "O e-mail é obrigatório")
        .email("E-mail inválido"),
    password: z.string({ required_error: "A senha é obrigatória" })
        .min(1, "A senha é obrigatória")
});

export const resetPasswordSchema = z.object({
    email: z.string({ required_error: "O e-mail é obrigatório" })
        .min(1, "O e-mail é obrigatório")
        .email("Formato de e-mail inválido"),
    token: z.string({ required_error: "O token é obrigatório" })
        .min(1, "O token é obrigatório"),
    password: strongPasswordSchema,
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
    code: z.string({ required_error: "Digite o código de verificação" })
        .length(6, "Digite o código de verificação"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;