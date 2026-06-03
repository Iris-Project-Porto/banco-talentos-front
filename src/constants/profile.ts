export const NIVEL_OPTIONS = [
    { value: "", label: "Manter avaliação IA" },
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

// Utilitário para transformar array de strings em array de objetos para o Select
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
    { value: "NOT_REQUESTED", label: "NÃO SOLICITADO" },
    { value: "REQUESTED", label: "SOLICITADO" },
    { value: "AWAITING_APPROVAL", label: "AGUARDANDO APROVAÇÃO" },
    { value: "APPROVED", label: "APROVADO" },
    { value: "REJECTED", label: "RECUSADO" },
];