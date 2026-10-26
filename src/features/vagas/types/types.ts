export type ExperienceLevel = "JUNIOR" | "PLENO" | "SENIOR" | "ESPECIALISTA";

export type JobStatus = "OPEN" | "SCREENING" | "ALLOCATING" | "FILLED" | "CLOSED" | "CANCELLED";

export type SkillRequirementType = "MANDATORY" | "DESIRABLE";

export type SkillLevel = "BASIC" | "INTERMEDIATE" | "ADVANCED" | "SPECIALIST";

export interface JobSkill {
  name: string;
  type: SkillRequirementType;
  minLevel: SkillLevel;
  importanceWeight: number;
  description?: string;
}

export interface JobPosting {
  id: string;
  vacancyCode: string;
  title: string;
  projectName?: string;
  projectId: string;
  squadName?: string;
  squadId: string;
  experienceLevel: ExperienceLevel;
  experienceLevelDescription?: string;
  description: string;
  requirements: string;
  recruiter: string;
  estimatedAllocationWeeks: number;
  status: JobStatus;
  modality: string;
  notes: string;
  openingDate: string;
  closingDate?: string;
  isUrgent: boolean;
  active: boolean;
  skills: JobSkill[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export type MatchAvailability = "available" | "allocated" | "waiting";

export type MatchSquadFilter = "all" | string;

export type MatchAvailabilityFilter = "all" | MatchAvailability | string;

export interface MatchSkillContribution {
  name: string;
  contributionPercent: number;
}

export interface CandidateMatchSummary {
  requiredSkillsMatched: number;
  requiredSkillsTotal: number;
  desirableSkillsMatched: number;
  desirableSkillsTotal: number;
}

export interface Match {
  id: string;
  name: string;
  photoUrl?: string;
  description: string;
  squadName?: string;
  availability?: string;
  matchScore: number;
  mainSkills: MatchSkillContribution[];
  rankingScore: number;
  summary?: CandidateMatchSummary;
}

export interface MatchCandidatesResponse {
  content: Match[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CandidateFiltersParams {
  page?: number;
  size?: number;
  search?: string;
  availability?: string;
  minScore?: number;
}

export type JobPostingPayload = Omit<JobPosting, "id" | "projectName" | "squadName" | "active" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "experienceLevelDescription">;