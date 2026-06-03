export interface ProfileSkill {
    name?: string;
    level?: string | number;
    type?: string;
    proficiencyLevel?: string | number;
    skill?: {
        name: string;
        type?: string;
    };
}

export interface UserProfile {
    id: string;
    status: "PENDENTE" | "ATIVO" | string;
    nivel?: string;
    nivelOverride?: string;
    photoUrl?: string;
    area?: string;
    sobre?: string;
    alocacaoStatus?: string;
    trilhaCarreira?: string;
    experienceYears?: string | number;
    linkedinUrl?: string;
    githubUrl?: string;
    registrationNumber?: string;
    registrationStatus?: string;
    skills?: ProfileSkill[];
    user?: {
        name: string;
        email: string;
    };
}

export interface ProfileFormState {
    area: string;
    sobre: string;
    alocacaoStatus: string;
    trilhaCarreira: string;
    experienceYears: string | number;
    linkedinUrl: string;
    githubUrl: string;
    nivelOverride: string;
    registrationNumber: string;
    registrationStatus: string;
    softSkills: { name: string; level: number }[];
}