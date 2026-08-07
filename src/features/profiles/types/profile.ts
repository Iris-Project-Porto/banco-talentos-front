export interface ProfileSkill {
    name?: string;
    level?: string | number;
    type?: "HARD" | "SOFT";
    proficiencyLevel?: string | number;
    skill?: {
        name: string;
        type?: "HARD" | "SOFT";
    };
}

export interface UserProfile {
    id: string;
    status: "PENDING" | "ACTIVE" | string;
    nivel?: string;
    level?: string;
    levelOverride?: string;
    levelScore?: number;
    levelJustification?: string;
    photoUrl?: string;
    cpf?: string;
    area?: string;
    about?: string;
    allocationStatus?: string;
    careerPath?: string;
    experienceYears?: string | number;
    linkedinUrl?: string;
    githubUrl?: string;
    registrationNumber?: string;
    registrationStatus?: string;
    contact?: string;
    contactEmail?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    cityState?: string;
    skills?: ProfileSkill[];
    createdAt?: string;
    name?: string;
    email?: string;
    groupName?: string;
    jobTitle?: string;
}

export interface ProfileFormState {
    area: string;
    about: string;
    allocationStatus: string;
    careerPath: string;
    experienceYears: string | number;
    linkedinUrl: string;
    githubUrl: string;
    levelOverride: string;
    registrationNumber: string;
    registrationStatus: string;
    contact: string;
    contactEmail: string;
    phone: string;
    address: string;
    postalCode: string;
    cityState: string;
    softSkills: { name: string; level: number }[];
}