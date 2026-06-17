import { z } from "zod";

export const squadSchema = z.object({
    name: z.string({ required_error: "O nome da squad é obrigatório" }).min(1, "O nome da squad é obrigatório"),
    description: z.string({ required_error: "A descrição é obrigatória" }).min(1, "A descrição é obrigatória"),
    portoCoordinator: z.string({ required_error: "Coordenador Porto é obrigatório" }).min(1, "Coordenador Porto é obrigatório"),
    projectManager: z.string({ required_error: "Project Manager é obrigatório" }).min(1, "Project Manager é obrigatório"),
    projectId: z.string({ required_error: "O projeto é obrigatório" }).min(1, "O projeto é obrigatório"),
});

export type SquadFormData = z.infer<typeof squadSchema>;