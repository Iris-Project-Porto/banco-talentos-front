import { http } from "@/lib/axios";
import type { Project, ProjectPayload, ProjectsListParams, ProjectsPaginatedResponse } from "../types/types";

export const projectsApi = {
    create: (data: ProjectPayload) =>
        http.post<Project>("/v1/admin/projects", data).then((r) => r.data),

    getById: (id: string) =>
        http.get<Project>(`/v1/admin/projects/${id}`).then((r) => r.data),

    update: (id: string, data: ProjectPayload) =>
        http.put<Project>(`/v1/admin/projects/${id}`, data).then((r) => r.data),

    activate: (id: string) =>
        http.patch(`/v1/admin/projects/${id}/activate`).then((r) => r.data),

    inactivate: (id: string) =>
        http.patch(`/v1/admin/projects/${id}/inactivate`).then((r) => r.data),

    getActive: (params?: ProjectsListParams) =>
        http.get<ProjectsPaginatedResponse>("/v1/admin/projects/active", { params }).then((r) => r.data),

    getInactive: (params?: ProjectsListParams) =>
        http.get<ProjectsPaginatedResponse>("/v1/admin/projects/inactive", { params }).then((r) => r.data),
};
