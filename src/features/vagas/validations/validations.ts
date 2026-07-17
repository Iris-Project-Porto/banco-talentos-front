import { z } from "zod";

export const jobSkillSchema = z.object({
    name: z.string().min(1, "O nome da skill é obrigatório"),
    type: z.enum(["MANDATORY", "DESIRABLE"]),
    minLevel: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED", "SPECIALIST"]),
    importanceWeight: z.coerce.number().int('O peso da skill deve ser um número inteiro').min(1, 'O peso da skill deve ser maior que 0').max(100, 'O peso da skill deve ser menor que 100'),
    description: z.string().max(225, "A descrição da skill deve ter no máximo 225 caracteres").optional(),
});

export const vagaSchema = z.object({
    vacancyCode: z.string({ required_error: "Código da vaga é obrigatório" }).min(1, "Código da vaga é obrigatório"),
    title: z.string({ required_error: "Título da vaga é obrigatório" }).min(1, "Título da vaga é obrigatório"),
    projectId: z.string({ required_error: "Selecione o projeto" }).min(1, "Selecione o projeto"),
    squadId: z.string({ required_error: "Selecione a squad" }).min(1, "Selecione a squad"),
    experienceLevel: z.enum(["JUNIOR", "PLENO", "SENIOR", "ESPECIALISTA"], {
        required_error: "O nível de experiência é obrigatório",
        invalid_type_error: "Selecione um nível válido",
    }),
    modality: z.string({ required_error: "A modalidade é obrigatória" }).min(1, "A modalidade é obrigatória"),
    description: z.string().optional(),
    requirements: z.string().optional(),
    recruiter: z.string({ required_error: "Informe o recrutador responsável" }).min(1, "Informe o recrutador responsável"),
    estimatedAllocationWeeks: z.coerce.number({
        required_error: "A alocação estimada é obrigatória",
        invalid_type_error: "Insira um número válido para as semanas",
    }).min(0, "Deve ser zero ou maior"),
    status: z.enum(["OPEN", "SCREENING", "ALLOCATING", "FILLED", "CLOSED", "CANCELLED"], {
        required_error: "O status da vaga é obrigatório",
    }),
    notes: z.string().optional(),
    openingDate: z.string({ required_error: "A data de abertura é obrigatória" }).min(1, "A data de abertura é obrigatória"),
    closingDate: z.string().optional(),
    isUrgent: z.boolean().default(false),
    skills: z.array(jobSkillSchema).min(1, "O campo skills é obrigatório"),
}).refine((data) => {
    if (!data.skills?.length) return true;
    const names = data.skills.map((s) => s.name).filter(Boolean);
    return new Set(names).size === names.length;
}, {
    message: "As skills não podem ter nomes duplicados.",
    path: ["skills"],
});

export type VagaFormData = z.infer<typeof vagaSchema>;