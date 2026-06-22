export type SkillType = "HARD" | "SOFT";

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  active: boolean;
  importanceWeight: number;
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

export interface SkillsTableProps {
  data: Skill[];
  loading?: boolean;
  onEdit?: (skill: Skill) => void;
  onDelete?: (skill: Skill) => void;
}


export interface CreateSkillPayload {
  name: string;
  type: SkillType;
  importanceWeight: number;
}