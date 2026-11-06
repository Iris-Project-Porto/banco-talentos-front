import type { AuditOperation } from "../types/historico";

export const operationLabels: Record<AuditOperation, string> = {
    CREATE: "Criação",
    UPDATE: "Atualização",
    DELETE: "Remoção",
};

export const operationVariants = {
    CREATE: "success",
    UPDATE: "info",
    DELETE: "danger",
} as const;

export const entityLabels: Record<string, string> = {
    PROFILE: "Perfil",
    PROFILE_SKILL: "Skill do perfil",
    RESOURCE_EQUIPMENT: "Equipamento",
    PROJECT: "Projeto",
    SQUAD: "Squad",
    JOB_POSTING: "Vaga",
};

export function formatAuditDate(date: string) {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    });
}

export function getAuditUserLabel(userId: string | null) {
    if (!userId) return "—";
    return userId.length > 12 ? `${userId.slice(0, 8)}...` : userId;
}
