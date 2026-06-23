import { http } from "@/lib/axios";
import type { JobPosting, JobPostingPayload } from "../types/types";

export const vagasApi = {
    getActive: (page = 0, size = 20) => http.get(`/v1/admin/job-postings/active?page=${page}&size=${size}`).then((r) => r.data),
    getInactive: (page = 0, size = 20) => http.get(`/v1/admin/job-postings/inactive?page=${page}&size=${size}`).then((r) => r.data),

    getProjects: (page = 0, size = 100) => http.get(`/v1/admin/projects/active?page=${page}&size=${size}`).then((r) => r.data),
    getSquads: (page = 0, size = 100) => http.get(`/v1/admin/squads/active?page=${page}&size=${size}`).then((r) => r.data),

    getSquadById: (id: string) => http.get(`/v1/admin/squads/${id}`).then((r) => r.data),
    getById: (id: string) => http.get<JobPosting>(`/v1/admin/job-postings/${id}`).then((r) => r.data),
    create: (data: JobPostingPayload) => http.post<JobPosting>("/v1/admin/job-postings", data).then((r) => r.data),
    update: (id: string, data: JobPostingPayload) => http.put<JobPosting>(`/v1/admin/job-postings/${id}`, data).then((r) => r.data),
    activate: (id: string) => http.patch(`/v1/admin/job-postings/${id}/activate`).then((r) => r.data),
    deactivate: (id: string) => http.patch(`/v1/admin/job-postings/${id}/deactivate`).then((r) => r.data),
};