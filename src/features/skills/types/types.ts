export type SkillType = "HARD" | "SOFT";

export type HardSkillCategory =
  | "FRONTEND"
  | "BACKEND"
  | "MOBILE"
  | "DEVOPS"
  | "DATA_SCIENCE"
  | "QA"
  | "DESIGN"
  | "MANAGEMENT";

export type SoftSkillCategory =
  | "COMMUNICATION"
  | "TEAMWORK"
  | "LEADERSHIP"
  | "EMOTIONAL_INTELLIGENCE"
  | "PROBLEM_SOLVING"
  | "CRITICAL_THINKING"
  | "ADAPTABILITY"
  | "TIME_MANAGEMENT"
  | "ORGANIZATION"
  | "CREATIVITY"
  | "PROACTIVITY"
  | "NEGOTIATION"
  | "DECISION_MAKING"
  | "EMPATHY"
  | "COLLABORATION"
  | "CONTINUOUS_LEARNING"
  | "RESULTS_ORIENTATION"
  | "CONFLICT_MANAGEMENT"
  | "CUSTOMER_SERVICE"
  | "INFLUENCE_AND_PERSUASION";

export type SkillCategory = HardSkillCategory | SoftSkillCategory;

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
