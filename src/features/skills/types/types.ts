export type SkillType = "HARD" | "SOFT";

export type SkillCategory =
    | "FRONTEND"
    | "BACKEND"
    | "MOBILE"
    | "DEVOPS"
    | "DATA_SCIENCE"
    | "QA"
    | "DESIGN"
    | "MANAGEMENT";

export const SKILL_CATEGORIES: SkillCategory[] = [
    "FRONTEND",
    "BACKEND",
    "MOBILE",
    "DEVOPS",
    "DATA_SCIENCE",
    "QA",
    "DESIGN",
    "MANAGEMENT",
];

export interface Skill {
    id: string;
    name: string;
    type: SkillType;
    active: boolean;
    description?: string;
    category: SkillCategory;
    resourcesCount: number;
    averageProficiency: number;
    avatarUrls?: string[];
}

export interface SkillsPaginatedResponse {
    content: Skill[];
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    size: number;
    number: number;
    empty: boolean;
}

export interface SkillPayload {
    name: string;
    type: SkillType;
    description?: string;
    category: SkillCategory;
}

export interface SkillsListParams {
    page?: number;
    size?: number;
    name?: string;
    category?: SkillCategory;
}
