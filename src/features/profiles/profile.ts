import type { EquipmentStatus } from "./types/profile";

export const NIVEL_OPTIONS = [
    { value: "Jr", label: "Jr" },
    { value: "Pleno", label: "Pleno" },
    { value: "Sr", label: "Sr" },
];

export const NIVEL_STYLE: Record<string, { color: string; bg: string }> = {
    Sr: { color: "#92400e", bg: "#fef3c7" },
    Pleno: { color: "#065f46", bg: "#d1fae5" },
    Jr: { color: "#1e40af", bg: "#dbeafe" },
};

export const SOFTSKILLS_LIST = [
    "Comprometimento e engajamento", "Proatividade", "Comunicação técnica para negócio",
    "Comunicação assertiva", "Organização e prioridades", "Trabalho em equipe e colaboração",
    "Gestão do tempo e prazos", "Resolução de problemas", "Pensamento crítico e cenários",
    "Aderência a processos e padrões", "Transparência (impedimentos)", "Foco em resultados",
    "Senso de dono (ownership)", "Adaptabilidade e flexibilidade", "Disponibilidade no chat",
];

const toSelectOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export const AREA_OPTIONS = toSelectOptions([
    "Frontend", "Backend", "Fullstack", "Mobile", "QA", "DevOps", "Infra", "Outros"
]);

export const ALOCACAO_OPTIONS = toSelectOptions([
    "Alocado Integral (100%)", "Alocado Parcial", "Disponível (Bench)", "Em Transição (saindo de projeto)"
]);

export const TRILHA_OPTIONS = toSelectOptions([
    "Especialista Técnico (Carreira em Y)", "Liderança de Pessoas (Gestão)",
    "Produto / Negócio (Product Engineer)", "Generalista"
]);

export const EXPERIENCE_OPTIONS = [
    { value: "0", label: "Menos de 1 ano" },
    { value: "1", label: "1 a 2 anos" },
    { value: "3", label: "3 a 5 anos" },
    { value: "6", label: "6 anos ou mais" },
];

export const REGISTRATION_STATUS_OPTIONS = [
    { value: "NOT_REQUIRED", label: "Não Necessário" },
    { value: "REQUESTED_VIA_TICKET", label: "Solicitado via chamado" },
    { value: "TICKET_AWAITING_APPROVAL", label: "Chamado aguardando aprovação" },
    { value: "TICKET_AWAITING_SERVICE", label: "Chamado aguardando atendimento" },
    { value: "RELEASED", label: "Liberada" },
];

export const RESOURCE_STATUS_LABELS: Record<string, string> = {
    AVAILABLE: "Disponível",
    WAITING: "Aguardando",
    ALLOCATED: "Alocado",
};

export const TECHNICAL_PROPOSAL_STATUS_OPTIONS = [
    { value: "PENDING_SEND", label: "Pendente de envio" },
    { value: "SENT_TO_COORDINATOR", label: "Enviado ao coordenador Porto" },
    { value: "FOLLOW_UP_REQUIRED", label: "Cobrar retorno" },
    { value: "SIGNED", label: "Assinado" },
    { value: "SIGNATURE_ERROR", label: "Erro de assinatura" },
];

export const EQUIPMENT_STATUS_OPTIONS: { value: EquipmentStatus; label: string }[] = [
    { value: "EMPTY", label: "Vazio" },
    { value: "REQUEST_IN_PROGRESS", label: "Em processo de solicitação" },
    { value: "REQUESTED", label: "Solicitado" },
    { value: "WITHDRAWN", label: "Retirado" },
    { value: "SENT_TO_RESOURCE", label: "Envio para o recurso" },
    { value: "IN_USE", label: "Em Uso" },
    { value: "RETURNED", label: "Devolvido" },
    { value: "INACTIVE", label: "Inativo" },
];

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = Object.fromEntries(
    EQUIPMENT_STATUS_OPTIONS.map((o) => [o.value, o.label])
) as Record<EquipmentStatus, string>;
