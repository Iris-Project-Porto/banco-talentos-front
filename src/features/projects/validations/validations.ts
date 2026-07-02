import { z } from "zod";

export function normalizeProjectName(name: string) {
    return name.trim().toLowerCase();
}

export const projectSchema = z.object({
    name: z
        .string({ required_error: "Nome do projeto é obrigatório" })
        .trim()
        .min(1, "Nome do projeto é obrigatório")
        .max(255, "Nome deve ter no máximo 255 caracteres"),
    description: z
        .string({ required_error: "Descrição é obrigatória" })
        .trim()
        .min(1, "Descrição é obrigatória")
        .max(500, "Descrição deve ter no máximo 500 caracteres"),
});

export function createProjectSchema(
    existingProjects: { id: string; name: string }[],
    editingId?: string,
) {
    return projectSchema.superRefine((data, ctx) => {
        const normalized = normalizeProjectName(data.name);
        const hasDuplicate = existingProjects.some(
            (project) => project.id !== editingId && normalizeProjectName(project.name) === normalized,
        );

        if (hasDuplicate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Já existe um projeto cadastrado com este nome.",
                path: ["name"],
            });
        }
    });
}

export const projectEditSchema = projectSchema.extend({
    status: z.enum(["ACTIVE", "INACTIVE"]),
});

export function createProjectEditSchema(
    existingProjects: { id: string; name: string }[],
    editingId?: string,
) {
    return projectEditSchema.superRefine((data, ctx) => {
        const normalized = normalizeProjectName(data.name);
        const hasDuplicate = existingProjects.some(
            (project) => project.id !== editingId && normalizeProjectName(project.name) === normalized,
        );

        if (hasDuplicate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Já existe um projeto cadastrado com este nome.",
                path: ["name"],
            });
        }
    });
}

export type ProjectFormData = z.infer<typeof projectSchema>;
export type ProjectFormInput = z.input<typeof projectSchema>;
export type ProjectEditFormData = z.infer<typeof projectEditSchema>;
export type ProjectEditFormInput = z.input<typeof projectEditSchema>;
