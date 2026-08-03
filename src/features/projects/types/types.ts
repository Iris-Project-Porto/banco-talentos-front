import { Squad, SquadPayload } from "@/features/squads/types/types";

export interface Project {
    id: string;
    name: string;
    description?: string;
    active: boolean;
    createdAt: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    squads?: Squad[];
}

export interface ProjectPayload {
    name: string;
    description: string;
    squadIds?: string[];
    squad?: SquadPayload;
}

export interface ProjectsPaginatedResponse {
    content: Project[];
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    size: number;
    number: number;
    empty: boolean;
}

export interface ProjectsListParams {
    page?: number;
    size?: number;
    sort?: string;
}
