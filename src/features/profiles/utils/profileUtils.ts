import type { UserProfile } from "../types/profile";
import { REGISTRATION_STATUS_OPTIONS, RESOURCE_STATUS_LABELS } from "../profile";

export function needsFirstProfileSubmit(profile?: UserProfile | null): boolean {
    return !profile?.area?.trim();
}

export function getLevelLabel(level: number): string {
    if (level <= 3) return "Em desenvolvimento";
    if (level <= 6) return "Pratica com regularidade";
    if (level <= 8) return "Domínio consistente";
    return "Referência no time";
}

export function getLevelStyle(level: number): { color: string; bg: string } {
    if (level <= 3) return { color: "#9333ea", bg: "#f3e8ff" };
    if (level <= 6) return { color: "#2563eb", bg: "#dbeafe" };
    if (level <= 8) return { color: "#059669", bg: "#d1fae5" };
    return { color: "#b45309", bg: "#fef3c7" };
}

export function getResourceStatusLabel(status?: string): string {
    if (!status) return RESOURCE_STATUS_LABELS.AVAILABLE;
    return RESOURCE_STATUS_LABELS[status] ?? status;
}

export function getRegistrationStatusLabel(status?: string): string {
    const option = REGISTRATION_STATUS_OPTIONS.find((item) => item.value === status);
    if (option) return option.label;

    switch (status) {
        case "REQUESTED":
        case "REQUESTED_VIA_TICKET":
        case "AWAITING_APPROVAL":
        case "TICKET_AWAITING_APPROVAL":
        case "TICKET_AWAITING_SERVICE":
            return "Em andamento";
        case "APPROVED":
        case "RELEASED":
            return "Concluído";
        case "NOT_REQUESTED":
        case "NOT_REQUIRED":
        default:
            return "Não solicitado";
    }
}
