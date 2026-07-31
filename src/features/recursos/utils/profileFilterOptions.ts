import {
    ALOCACAO_OPTIONS,
    AREA_OPTIONS,
    NIVEL_OPTIONS,
    REGISTRATION_STATUS_OPTIONS,
} from "@/features/profiles";

export const FILTER_LABEL_CLS = "block text-[11px] font-semibold tracking-wide text-slate-500 mb-1.5";

export const RECURSOS_PAGE_SIZE = 20;

export const PROFILE_STATUS_FILTER_OPTIONS = [
    { value: "", label: "Todos" },
    { value: "ACTIVE", label: "Ativo" },
    { value: "PENDING", label: "Pendente" },
];

export const AREA_FILTER_OPTIONS = [{ value: "", label: "Todas" }, ...AREA_OPTIONS];

export const ALOCACAO_FILTER_OPTIONS = [{ value: "", label: "Todas" }, ...ALOCACAO_OPTIONS];

export const REGISTRATION_STATUS_FILTER_OPTIONS = [
    { value: "", label: "Todas" },
    ...REGISTRATION_STATUS_OPTIONS,
];

export const NIVEL_FILTER_OPTIONS = [{ value: "", label: "Todos" }, ...NIVEL_OPTIONS];
