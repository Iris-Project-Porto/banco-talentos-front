export interface ProfileListFilters {
    nome: string;
    area: string;
    groupName: string;
    status: string;
    allocationStatus: string;
    registrationStatus: string;
    nivel: string;
}

export const EMPTY_PROFILE_FILTERS: ProfileListFilters = {
    nome: "",
    area: "",
    groupName: "",
    status: "",
    allocationStatus: "",
    registrationStatus: "",
    nivel: "",
};
