import type { AuditOperation, AuditSummary } from "../types/historico";

export const auditCategories = ["Projetos", "Squads", "Recursos", "Vagas", "Skills"] as const;
export type AuditCategory = (typeof auditCategories)[number];

const resourceEntityTypes = new Set([
    "PROFILE",
    "PROFILE_SKILL",
    "RESOURCE_EQUIPMENT",
]);

export function getAuditCategory(
    record: Pick<AuditSummary, "entityType">,
): AuditCategory | null {
    const type = record.entityType?.toUpperCase();
    switch (type) {
        case "PROJECT":
            return "Projetos";
        case "SQUAD":
            return "Squads";
        case "JOB_POSTING":
            return "Vagas";
        case "SKILL":
            return "Skills";
        default: {
            return type && resourceEntityTypes.has(type) ? "Recursos" : null;
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
    SKILL: "Skill",
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
export const ENUM_TRANSLATIONS: Record<string, string> = {
    "EMPTY": "Vazio",
    "REQUEST_IN_PROGRESS": "Em processo de solicitação",
    "REQUESTED": "Solicitado",
    "WITHDRAWN": "Retirado",
    "SENT_TO_RESOURCE": "Envio para o recurso",
    "IN_USE": "Em Uso",
    "RETURNED": "Devolvido",
    "INACTIVE": "Inativo",

    "JUNIOR": "Júnior",
    "PLENO": "Pleno",
    "SENIOR": "Sênior",
    "ESPECIALISTA": "Especialista",

    "OPEN": "Aberta",
    "SCREENING": "Triagem",
    "ALLOCATING": "Em Alocação",
    "FILLED": "Preenchida",
    "CLOSED": "Fechada",
    "CANCELLED": "Cancelada",

    "MANDATORY": "Obrigatório",
    "DESIRABLE": "Desejável",

    "AVAILABLE": "Disponível",
    "WAITING": "Aguardando",
    "ALLOCATED": "Alocado",

    "FRONTEND": "Frontend",
    "BACKEND": "Backend",
    "DESIGN": "Design",
    "QA": "Qualidade",
    "MOBILE": "Mobile",
    "DATA_SCIENCE": "Ciência de Dados",
    "DEVOPS": "DevOps",
    "MANAGEMENT": "Gestão",
    "COMMUNICATION": "Comunicação",
    "TEAMWORK": "Trabalho em Equipe",
    "LEADERSHIP": "Liderança",
    "EMOTIONAL_INTELLIGENCE": "Inteligência Emocional",
    "PROBLEM_SOLVING": "Resolução de Problemas",
    "CRITICAL_THINKING": "Pensamento Crítico",
    "ADAPTABILITY": "Adaptabilidade",
    "TIME_MANAGEMENT": "Gestão de Tempo",
    "ORGANIZATION": "Organização",
    "CREATIVITY": "Criatividade",
    "PROACTIVITY": "Proatividade",
    "NEGOTIATION": "Negociação",
    "DECISION_MAKING": "Tomada de Decisão",
    "EMPATHY": "Empatia",
    "COLLABORATION": "Colaboração",
    "CONTINUOUS_LEARNING": "Aprendizado Contínuo",
    "RESULTS_ORIENTATION": "Orientação para Resultados",
    "CONFLICT_MANAGEMENT": "Gestão de Conflitos",
    "CUSTOMER_SERVICE": "Atendimento ao Cliente",
    "INFLUENCE_AND_PERSUASION": "Influência e Persuasão",

    "BASIC": "Básico",
    "INTERMEDIATE": "Intermediário",
    "ADVANCED": "Avançado",
    "SPECIALIST": "Especialista",
};