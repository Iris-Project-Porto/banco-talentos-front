import { http } from "@/lib/axios";
import type { Skill, SkillPayload, SkillsListParams, SkillsPaginatedResponse } from "../types/types";

function buildListQuery(params: SkillsListParams) {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(params.page ?? 0));
    searchParams.set("size", String(params.size ?? 20));

    const name = params.name?.trim();
    if (name) searchParams.set("name", name);
    if (params.category) searchParams.set("category", params.category);

    return searchParams.toString();
}

export const skillsApi = {
    create: (data: SkillPayload) =>
        http.post<Skill>("/v1/admin/skills", data).then((r) => r.data),

    update: (id: string, data: SkillPayload) =>
        http.put<Skill>(`/v1/admin/skills/${id}`, data).then((r) => r.data),

    inactivateSkill: (id: string) =>
        http.patch<void>(`/v1/admin/skills/${id}/inactivate`).then(() => undefined),

    listForManagement: (params: SkillsListParams = {}) =>
        http
            .get<SkillsPaginatedResponse>(`/v1/admin/skills?${buildListQuery(params)}`)
            .then((r) => r.data),

    getActiveSkills: (page = 0, size = 20) =>
        http.get<SkillsPaginatedResponse>(`/v1/admin/skills/active?page=${page}&size=${size}`).then((r) => r.data),

    getInactiveSkills: (page = 0, size = 20) =>
        http.get<SkillsPaginatedResponse>(`/v1/admin/skills/inactive?page=${page}&size=${size}`).then((r) => r.data),
};
