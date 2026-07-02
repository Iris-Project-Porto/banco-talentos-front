import { projectsApi } from "../api/projects.api";
import type { Project, ProjectsListParams, ProjectsPaginatedResponse } from "../types/types";

export const PROJECTS_PAGE_SIZE = 10;
export const PROJECTS_CATALOG_PAGE_SIZE = 100;

function emptyProjectsPage(params?: ProjectsListParams): ProjectsPaginatedResponse {
    const size = params?.size ?? 20;
    const page = params?.page ?? 0;

    return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        first: true,
        last: true,
        size,
        number: page,
        empty: true,
    };
}

export async function listProjectsSafe(
    status: "ACTIVE" | "INACTIVE",
    params?: ProjectsListParams,
): Promise<ProjectsPaginatedResponse> {
    try {
        return status === "ACTIVE"
            ? await projectsApi.getActive(params)
            : await projectsApi.getInactive(params);
    } catch {
        return emptyProjectsPage(params);
    }
}

async function fetchAllProjects(status: "ACTIVE" | "INACTIVE"): Promise<Project[]> {
    const items: Project[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
        const response = await listProjectsSafe(status, { page, size: PROJECTS_CATALOG_PAGE_SIZE });
        const batch = response.content ?? [];
        items.push(...batch);
        hasMore = !response.last && batch.length > 0;
        page += 1;
    }

    return items;
}

export async function getProjectsCounts() {
    const [active, inactive] = await Promise.all([
        listProjectsSafe("ACTIVE", { page: 0, size: 1 }),
        listProjectsSafe("INACTIVE", { page: 0, size: 1 }),
    ]);

    const activeCount = active.totalElements ?? 0;
    const inactiveCount = inactive.totalElements ?? 0;

    return {
        active: activeCount,
        inactive: inactiveCount,
        total: activeCount + inactiveCount,
    };
}

export async function getProjectsCatalog() {
    const [active, inactive] = await Promise.all([
        fetchAllProjects("ACTIVE"),
        fetchAllProjects("INACTIVE"),
    ]);

    return [...active, ...inactive];
}

export function filterProjects(
    projects: Project[],
    filters: { statusType: "ACTIVE" | "INACTIVE"; search: string },
) {
    const term = filters.search.trim().toLowerCase();

    return projects.filter((project) => {
        const matchesStatus = filters.statusType === "ACTIVE" ? project.active : !project.active;
        const matchesSearch = !term || project.name.toLowerCase().includes(term);
        return matchesStatus && matchesSearch;
    });
}

export function paginateLocally<T>(items: T[], page: number, size: number) {
    const start = page * size;

    return {
        content: items.slice(start, start + size),
        totalPages: Math.max(1, Math.ceil(items.length / size)),
        totalElements: items.length,
    };
}
