import { REGISTRATION_STATUS_OPTIONS } from "@/features/profiles";
import { STATUS_RECURSO_LABELS, type StatusRecurso } from "../types/recurso";

export const FILTER_LABEL_CLS = "block text-xs font-medium text-slate-600 mb-1.5";

export const RECURSOS_PAGE_SIZE = 20;

export const STATUS_RECURSO_FILTER_OPTIONS = [
    { value: "", label: "Selecione" },
    ...(Object.entries(STATUS_RECURSO_LABELS) as [StatusRecurso, string][]).map(([value, label]) => ({
        value,
        label,
    })),
];

export const REGISTRATION_STATUS_FILTER_OPTIONS = [
    { value: "", label: "Selecione" },
    ...REGISTRATION_STATUS_OPTIONS,
];

export const YES_NO_FILTER_OPTIONS = [
    { value: "", label: "Selecione" },
    { value: "true", label: "Sim" },
    { value: "false", label: "Não" },
];
