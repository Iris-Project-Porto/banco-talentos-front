import { http } from "@/lib/axios";
import type { CreateSkillPayload, Skill, SkillsPaginatedResponse } from "../types/skills";

export const skillsApi = {
    getSkillById: (id: string) => http.get<Skill>(`/v1/admin/skills/${id}`).then((r) => r.data),
    create: (data: CreateSkillPayload) =>
        http.post<Skill>("/v1/admin/skills", data).then((r) => r.data),
    update: (id: string, data: CreateSkillPayload) =>
        http.put<Skill>(`/v1/admin/skills/${id}`, data).then((r) => r.data),
    getAllSkills: () => http.get<SkillsPaginatedResponse>("/v1/admin/skills").then((r) => r.data),
    activateSkill: (id: string) => http.patch<Skill>(`/v1/admin/skills/${id}/activate`).then((r) => r.data),
    inactivateSkill: (id: string) => http.patch<Skill>(`/v1/admin/skills/${id}/inactivate`).then((r) => r.data),
    getActiveSkills: () => http.get<SkillsPaginatedResponse>("/v1/admin/skills/active").then((r) => r.data),
    getInactiveSkills: () => http.get<SkillsPaginatedResponse>("/v1/admin/skills/inactive").then((r) => r.data),
};
