import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { skillsApi, normalizeSkills, type SkillPayload } from "@/features/skills";

export function useSkillsCatalog() {
    const queryClient = useQueryClient();

    const { data: skills = [], isLoading } = useQuery({
        queryKey: ["skills", "catalog"],
        queryFn: async () => {
            const response = await skillsApi.getActiveSkills(0, 500);
            return normalizeSkills(response.content ?? []);
        },
    });

    const createMutation = useMutation({
        mutationFn: (payload: SkillPayload) => skillsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
            toast.success("Skill cadastrada com sucesso!");
        },
        onError: (error) => {
            console.error("Erro ao cadastrar skill:", error);
            toast.error("Ocorreu um erro ao cadastrar a skill. Por favor, tente novamente.");
        },
    });

    return { skills, isLoading, createMutation };
}
