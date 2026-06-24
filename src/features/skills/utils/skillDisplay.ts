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
};

export function getCategoryBadgeStyle(category: SkillCategory) {
    return SKILL_CATEGORY_BADGE_STYLES[category];
}
