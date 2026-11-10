import type { AuditOperation, AuditSummary } from "../types/historico";

export const auditCategories = ["Projetos", "Squads", "Recursos"] as const;
export type AuditCategory = (typeof auditCategories)[number];

const resourceEntityTypes = new Set([
    "PROFILE",
    "PROFILE_SKILL",
    "RESOURCE_EQUIPMENT",
    "JOB_POSTING",
]);

export function getAuditCategory(
    record: Pick<AuditSummary, "entityType">,
): AuditCategory | null {
    switch (record.entityType) {
        case "PROJECT":
            return "Projetos";
        case "SQUAD":
            return "Squads";
        default: {
            return resourceEntityTypes.has(record.entityType) ? "Recursos" : null;
        }
    }
}

function normalizeSearchText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase();
}

export function filterAudits(
    records: AuditSummary[],
    search: string,
): AuditSummary[] {
    const query = normalizeSearchText(search.trim());
    if (!query) return records;
    const queryTerms = query.split(/\s+/);

    return records.filter((record) => {
        const searchableValues = [
            record.userName,
            record.userAffectedName,
            record.entityName,
            record.description,
            record.entityType,
            entityLabels[record.entityType],
            record.operation,
            operationLabels[record.operation],
        ];
        const searchableText = searchableValues
            .filter((value): value is string => Boolean(value))
            .map(normalizeSearchText)
            .join(" ");

        return queryTerms.every((term) => searchableText.includes(term));
    });
}

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

export function getAuditUserLabel(name: string | null) {
    return name?.trim() || "Não identificado";
}
