import { z } from "zod";

function normalizeSquadName(name: string) {
    return name.trim().toLowerCase();
}

const squadBaseSchema = z.object({
    name: z
        .string({ required_error: "O nome da squad é obrigatório" })
        .trim()
        .min(1, "O nome da squad é obrigatório"),
    description: z
        .string({ required_error: "A descrição é obrigatória" })
        .trim()
        .min(1, "A descrição é obrigatória"),
    portoCoordinator: z
        .string({ required_error: "Coordenador Porto é obrigatório" })
        .trim()
        .min(1, "Coordenador Porto é obrigatório"),
    projectManager: z
        .string({ required_error: "Gerente de Projeto é obrigatório" })
        .trim()
        .min(1, "Gerente de Projeto é obrigatório"),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    recursos: z
        .array(
            z.object({
                id: z.string(),
                name: z.string(),
                jobTitle: z.string().optional(),
            }),
        )
        .optional(),
});

export const squadSchema = squadBaseSchema;

export function createSquadSchema(
    existingSquads: { id: string; name: string }[],
    editingId?: string,
) {
    return squadBaseSchema.superRefine((data, ctx) => {
        const normalized = normalizeSquadName(data.name);
        const hasDuplicate = existingSquads.some(
            (squad) => squad.id !== editingId && normalizeSquadName(squad.name) === normalized,
        );

        if (hasDuplicate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Já existe uma squad cadastrada com este nome.",
                path: ["name"],
            });
        }
    });
}

export type SquadFormData = z.infer<typeof squadSchema>;
export type SquadFormInput = z.input<typeof squadSchema>;
