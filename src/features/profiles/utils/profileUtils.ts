import type { UserProfile } from "../types/profile";

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

export function getRegistrationStatusLabel(status?: string): string {
    switch (status) {
        case "REQUESTED":
        case "AWAITING_APPROVAL":
            return "Em andamento";
        case "APPROVED":
        case "REJECTED":
            return "Concluído";
        case "NOT_REQUESTED":
        default:
            return "Não solicitado";
    }
}