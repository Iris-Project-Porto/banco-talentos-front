import { z } from "zod";
import { onlyCpfDigits } from "@/utils/masks";

export const resourceCreateSchema = z.object({
    name: z.string({ required_error: "Nome é obrigatório" }).trim().min(1, "Nome é obrigatório"),
    email: z
        .string({ required_error: "E-mail é obrigatório" })
        .trim()
        .min(1, "E-mail é obrigatório")
        .email("E-mail inválido"),
    cpf: z
        .string({ required_error: "CPF é obrigatório" })
        .trim()
        .transform(onlyCpfDigits)
        .refine((value) => value.length === 11, "CPF inválido"),
    groupId: z.string({ required_error: "Grupo é obrigatório" }).min(1, "Selecione o grupo"),
});

export type ResourceCreateFormData = z.input<typeof resourceCreateSchema>;
export type ResourceCreatePayload = z.output<typeof resourceCreateSchema>;
