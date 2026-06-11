import { z } from "zod";

export const vagaSchema = z.object({
    projectId: z.string({ required_error: "Selecione o projeto" }).min(1, "Selecione o projeto"),
    squadId: z.string({ required_error: "Selecione a squad" }).min(1, "Selecione a squad"),
    experienceLevel: z.enum(["JUNIOR", "PLENO", "SENIOR", "ESPECIALISTA"], {
        required_error: "O nível de experiência é obrigatório",
        invalid_type_error: "Selecione um nível válido",
    }),
    description: z.string().optional(),
    requirements: z.string().optional(),
    recruiter: z.string({ required_error: "Informe o recrutador responsável" }).min(1, "Informe o recrutador responsável"),
    estimatedAllocationWeeks: z.coerce.number({ 
        required_error: "A alocação estimada é obrigatória",
        invalid_type_error: "Insira um número válido para as semanas",
    }).min(0, "Deve ser zero ou maior"),
    status: z.string({ required_error: "O status da vaga é obrigatório" }).min(1, "O status da vaga é obrigatório"),
    notes: z.string().optional(),
    openingDate: z.string({ required_error: "A data de abertura é obrigatória" }).min(1, "A data de abertura é obrigatória"),
    isUrgent: z.boolean().default(false),
});

export type VagaFormData = z.infer<typeof vagaSchema>;