import type {
  HardSkillCategory,
  SoftSkillCategory,
  SkillCategory,
  SkillType,
} from "../types/types";
import { getSkillCategoryLabel } from "./skillDisplay";

export const HARD_SKILL_CATEGORIES: HardSkillCategory[] = [
  "FRONTEND",
  "BACKEND",
  "MOBILE",
  "DEVOPS",
  "DATA_SCIENCE",
  "QA",
  "DESIGN",
  "MANAGEMENT",
];

export const SOFT_SKILL_CATEGORIES: SoftSkillCategory[] = [
  "COMMUNICATION",
  "TEAMWORK",
  "LEADERSHIP",
  "EMOTIONAL_INTELLIGENCE",
  "PROBLEM_SOLVING",
  "CRITICAL_THINKING",
  "ADAPTABILITY",
  "TIME_MANAGEMENT",
  "ORGANIZATION",
  "CREATIVITY",
  "PROACTIVITY",
  "NEGOTIATION",
  "DECISION_MAKING",
  "EMPATHY",
  "COLLABORATION",
  "CONTINUOUS_LEARNING",
  "RESULTS_ORIENTATION",
  "CONFLICT_MANAGEMENT",
  "CUSTOMER_SERVICE",
  "INFLUENCE_AND_PERSUASION",
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  ...HARD_SKILL_CATEGORIES,
  ...SOFT_SKILL_CATEGORIES,
];

export function getSkillCategoriesByType(type: SkillType) : SkillCategory[] {
  return type === "HARD"
    ? [...HARD_SKILL_CATEGORIES]
    : [...SOFT_SKILL_CATEGORIES];
}

export function isCategoryCompatibleWithType(
    type: string,
    category: string,
  ): boolean {
    if (type !== "HARD" && type !== "SOFT") return false;
    if (!category) return false;
    return getSkillCategoriesByType(type).includes(category as SkillCategory);
  }

export function buildCategorySelectOptions(categories: SkillCategory[]) {
    return [{ value: '', label: 'Selecione a categoria'},
        ...categories.map(c=>({
            value: c,
            label: getSkillCategoryLabel(c)
        }))
    ]
}
