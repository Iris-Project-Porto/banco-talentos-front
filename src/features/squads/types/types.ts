import type { Recurso } from "@/features/recursos/types/recurso";

export interface SquadMetrics {
    totalResources: number;
    allocatedResources: number;
    availableResources: number;
    activeProjects: number;
    openRoles: number;
    occupationRate: number;
    avgMatchRate: number;
}

export interface Squad {
    id: string;
    name: string;
    description: string;
    portoCoordinator: string;
    projectManager: string;
    projectName?: string;
    projectId: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
    metrics?: SquadMetrics;
    members?: number;
    recursos?: Recurso[];
}

export interface SquadPayload {
    name: string;
    description: string;
    portoCoordinator: string;
    projectManager: string;
    recursoIds?: string[];
}

export interface PageableResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}