import { z } from "zod";

export const skillSchema = z.object({
    name: z
        .string({ required_error: "Nome da skill é obrigatório" })
        .trim()
        .min(1, "Nome da skill é obrigatório"),
    type: z
        .string({ required_error: "Tipo é obrigatório" })
        .min(1, "Tipo é obrigatório")
        .pipe(z.enum(["HARD", "SOFT"])),
    importanceWeight: z.coerce
        .number({
            required_error: "A importância é obrigatória",
            invalid_type_error: "Insira um número válido para a importância",
        })
        .min(0, "Deve ser entre 0 e 10")
        .max(10, "Deve ser entre 0 e 10")
        .default(5),
});

export type SkillFormData = z.infer<typeof skillSchema>;
export type SkillFormInput = z.input<typeof skillSchema>;
