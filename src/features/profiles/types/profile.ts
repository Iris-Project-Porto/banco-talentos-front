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

export interface ResourceEquipment {
    id: string;
    tag?: string;
    hostname?: string;
    assetNumber?: string;
    brandOs?: string;
    processor?: string;
    status: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
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
    resourceStatus?: "AVAILABLE" | "WAITING" | "ALLOCATED" | string;
    registrationRequestedAt?: string;
    registrationNotes?: string;
    hasClientMachine?: boolean;
    contractingArea?: string;
    costCenter?: string;
    projectEntryDate?: string;
    billable?: boolean | null;
    portoOnboarding?: boolean | null;
    projectManagerName?: string;
    allocationProjectId?: string;
    allocationProjectName?: string;
    allocationSquadId?: string;
    allocationSquadName?: string;
    technicalProposalStatus?: string;
    technicalProposalNumber?: string;
    technicalProposalSentAt?: string;
    technicalProposalNotes?: string;
    equipments?: ResourceEquipment[];
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
    registrationRequestedAt: string;
    registrationNotes: string;
    hasClientMachine: boolean;
    contractingArea: string;
    costCenter: string;
    projectEntryDate: string;
    billable: boolean | null;
    portoOnboarding: boolean | null;
    projectManagerName: string;
    allocationProjectId: string;
    allocationSquadId: string;
    technicalProposalStatus: string;
    technicalProposalNumber: string;
    technicalProposalSentAt: string;
    technicalProposalNotes: string;
    contact: string;
    contactEmail: string;
    phone: string;
    address: string;
    postalCode: string;
    cityState: string;
    softSkills: { name: string; level: number }[];
}