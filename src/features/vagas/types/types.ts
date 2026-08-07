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

export type MatchAvailability = "available" | "in_project";

export type MatchSquadFilter = "all" | string;

export type MatchAvailabilityFilter = "all" | MatchAvailability;

export interface MatchSkillContribution {
  name: string;
  contributionPercent: number;
}

export interface Match {
  id: string;
  name: string;
  photoUrl?: string;
  description: string;
  squadName: string;
  avaiability: MatchAvailability;
  matchScore: number;
  mainSkills: MatchSkillContribution[];
  rankingScore: number;
}

export type JobPostingPayload = Omit<JobPosting, "id" | "projectName" | "squadName" | "active" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "experienceLevelDescription">;