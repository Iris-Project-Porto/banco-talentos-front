export interface ProfileListFilters {
    nome: string;
    statusRecurso: string;
    registrationStatus: string;
    projectManagerName: string;
    allocationProjectId: string;
    billable: string;
    portoOnboarding: string;
    projectEntryDateFrom: string;
    projectEntryDateTo: string;
}

export const EMPTY_PROFILE_FILTERS: ProfileListFilters = {
    nome: "",
    statusRecurso: "",
    registrationStatus: "",
    projectManagerName: "",
    allocationProjectId: "",
    billable: "",
    portoOnboarding: "",
    projectEntryDateFrom: "",
    projectEntryDateTo: "",
};
