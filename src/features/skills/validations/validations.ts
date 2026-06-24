import { z } from "zod";

export function normalizeSkillName(name: string) {
    return name.trim().toLowerCase();
}

export const skillSchema = z.object({
    name: z
        .string({ required_error: "Nome da skill é obrigatório" })
        .trim()
        .min(1, "Nome da skill é obrigatório"),
    type: z
        .string({ required_error: "Tipo é obrigatório" })
        .min(1, "Tipo é obrigatório")
        .pipe(z.enum(["HARD", "SOFT"])),
    description: z
        .string()
        .trim()
        .max(500, "Descrição deve ter no máximo 500 caracteres")
        .optional()
        .or(z.literal("")),
    category: z
        .string({ required_error: "Categoria é obrigatória" })
        .min(1, "Categoria é obrigatória")
        .pipe(z.enum(["FRONTEND", "BACKEND", "MOBILE", "DEVOPS", "DATA_SCIENCE", "QA", "DESIGN", "MANAGEMENT"])),
});

export function createSkillSchema(
    existingSkills: { id: string; name: string }[],
    editingId?: string,
) {
    return skillSchema.superRefine((data, ctx) => {
        const normalized = normalizeSkillName(data.name);
        const hasDuplicate = existingSkills.some(
            (skill) => skill.id !== editingId && normalizeSkillName(skill.name) === normalized,
        );

        if (hasDuplicate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Já existe uma skill com este nome",
                path: ["name"],
            });
        }
    });
}

export type SkillFormData = z.infer<typeof skillSchema>;
export type SkillFormInput = z.input<typeof skillSchema>;
