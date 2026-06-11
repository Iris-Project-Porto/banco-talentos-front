import { http } from "@/lib/axios";
import type { JobPosting, JobPostingPayload } from "../types";

export const vagasApi = {
    getActive: () => http.get<JobPosting[]>("/admin/job-postings/active")
        .then((r) => Array.isArray(r.data) ? r.data : [])
        .catch((err) => {
            if (err.response?.status === 404) return [];
            throw err;
        }),

    getInactive: () => http.get<JobPosting[]>("/admin/job-postings/inactive")
        .then((r) => Array.isArray(r.data) ? r.data : [])
        .catch((err) => {
            if (err.response?.status === 404) return [];
            throw err;
        }),
    getProjects: () =>
        http.get("/admin/projects/active").then((r) => Array.isArray(r.data) ? r.data : []).catch((err) => {
            if (err.response?.status === 404) return [];
            throw err;
        }),

    getSquads: () =>
        http.get("/admin/squads/active").then((r) => Array.isArray(r.data) ? r.data : []).catch((err) => {
            if (err.response?.status === 404) return [];
            throw err;
        }),
    getSquadById: (id: string) =>
        http.get(`/admin/squads/${id}`).then((r) => r.data),

    getById: (id: string) => http.get<JobPosting>(`/admin/job-postings/${id}`).then((r) => r.data),
    create: (data: JobPostingPayload) => http.post<JobPosting>("/admin/job-postings", data).then((r) => r.data),
    update: (id: string, data: JobPostingPayload) => http.put<JobPosting>(`/admin/job-postings/${id}`, data).then((r) => r.data),
    activate: (id: string) => http.patch(`/admin/job-postings/${id}/activate`).then((r) => r.data),
    deactivate: (id: string) => http.patch(`/admin/job-postings/${id}/deactivate`).then((r) => r.data),
};