export type ExperienceLevel = "JUNIOR" | "PLENO" | "SENIOR" | "ESPECIALISTA";

export interface JobPosting {
  id: string;
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
  status: string;
  notes: string;
  openingDate: string;
  isUrgent: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export type JobPostingPayload = Omit<JobPosting, "id" | "projectName" | "squadName" | "active" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "experienceLevelDescription">;