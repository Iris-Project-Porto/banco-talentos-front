import { z } from "zod";

export const vagaSchema = z.object({
    projectId: z.string().min(1, "O ID do projeto é obrigatório"),
    squadId: z.string().min(1, "O ID da squad é obrigatório"),
    experienceLevel: z.enum(["JUNIOR", "PLENO", "SENIOR", "ESPECIALISTA"]),
    description: z.string().optional(),
    requirements: z.string().optional(),
    recruiter: z.string().min(1, "O recrutador é obrigatório"),
    estimatedAllocationWeeks: z.coerce.number().min(0, "Deve ser zero ou maior"),
    status: z.string().min(1, "O status é obrigatório"),
    notes: z.string().optional(),
    openingDate: z.string().min(1, "A data de abertura é obrigatória"),
    isUrgent: z.boolean().default(false),
});

export type VagaFormData = z.infer<typeof vagaSchema>;