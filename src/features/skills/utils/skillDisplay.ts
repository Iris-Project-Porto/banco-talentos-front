import type { SkillCategory } from "../types/types";

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
    FRONTEND: "Frontend",
    BACKEND: "Backend",
    MOBILE: "Mobile",
    DEVOPS: "DevOps",
    DATA_SCIENCE: "Ciência de Dados",
    QA: "Qualidade",
    DESIGN: "Design",
    MANAGEMENT: "Gestão",
    COMMUNICATION: "Comunicação",
    TEAMWORK: "Trabalho em Equipe",
    LEADERSHIP: "Liderança",
    EMOTIONAL_INTELLIGENCE: "Inteligência Emocional",
    PROBLEM_SOLVING: "Resolução de Problemas",
    CRITICAL_THINKING: "Pensamento Crítico",
    ADAPTABILITY: "Adaptabilidade",
    TIME_MANAGEMENT: "Gestão de Tempo",
    ORGANIZATION: "Organização",
    CREATIVITY: "Criatividade",
    PROACTIVITY: "Proatividade",
    NEGOTIATION: "Negociação",
    DECISION_MAKING: "Tomada de Decisão",
    EMPATHY: "Empatia",
    COLLABORATION: "Colaboração",
    CONTINUOUS_LEARNING: "Aprendizado Contínuo",
    RESULTS_ORIENTATION: "Orientação para Resultados",
    CONFLICT_MANAGEMENT: "Gestão de Conflitos",
    CUSTOMER_SERVICE: "Atendimento ao Cliente",
    INFLUENCE_AND_PERSUASION: "Influência e Persuasão",
};

export function getSkillCategoryLabel(category: SkillCategory) {
    return SKILL_CATEGORY_LABELS[category] ?? category;
  }

export const SKILL_CATEGORY_BADGE_STYLES: Record<SkillCategory, string> = {
    FRONTEND: "bg-blue-50 text-blue-700 border border-blue-100",
    BACKEND: "bg-violet-50 text-violet-700 border border-violet-100",
    MOBILE: "bg-cyan-50 text-cyan-700 border border-cyan-100",
    DEVOPS: "bg-orange-50 text-orange-700 border border-orange-100",
    DATA_SCIENCE: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    QA: "bg-amber-50 text-amber-700 border border-amber-100",
    DESIGN: "bg-green-50 text-green-700 border border-green-100",
    MANAGEMENT: "bg-slate-100 text-slate-600 border border-slate-200",
    COMMUNICATION: "bg-pink-50 text-pink-700 border border-pink-100",
    TEAMWORK: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    LEADERSHIP: "bg-purple-50 text-purple-700 border border-purple-100",
    EMOTIONAL_INTELLIGENCE: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    PROBLEM_SOLVING: "bg-red-50 text-red-700 border border-red-100",
    CRITICAL_THINKING: "bg-teal-50 text-teal-700 border border-teal-100",
    ADAPTABILITY: "bg-gray-50 text-gray-700 border border-gray-100",
    TIME_MANAGEMENT: "bg-blue-50 text-blue-700 border border-blue-100",
    ORGANIZATION: "bg-green-50 text-green-700 border border-green-100",
    CREATIVITY: "bg-purple-50 text-purple-700 border border-purple-100",
    PROACTIVITY: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    NEGOTIATION: "bg-red-50 text-red-700 border border-red-100",
    DECISION_MAKING: "bg-blue-50 text-blue-700 border border-blue-100",
    EMPATHY: "bg-green-50 text-green-700 border border-green-100",
    COLLABORATION: "bg-purple-50 text-purple-700 border border-purple-100",
    CONTINUOUS_LEARNING: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    RESULTS_ORIENTATION: "bg-red-50 text-red-700 border border-red-100",
    CONFLICT_MANAGEMENT: "bg-blue-50 text-blue-700 border border-blue-100",
    CUSTOMER_SERVICE: "bg-green-50 text-green-700 border border-green-100",
    INFLUENCE_AND_PERSUASION: "bg-purple-50 text-purple-700 border border-purple-100",
};

export function getCategoryBadgeStyle(category: SkillCategory) {
    return SKILL_CATEGORY_BADGE_STYLES[category];
}
